# -*- coding: utf-8 -*-
"""Mergea los JSON de staging de la Fase B y escribe el CSV del banco.

- Lee las asignaciones (`staging/asignacion_<ESP>.md`) como fuente de verdad.
- Lee `staging/<ESP>.json` y, si existe, `staging/FH.json`.
- Valida cobertura, claves y campos bilingües.
- Escribe `salidas/banco_cobre.csv` (o un provisional si falta FH).

Uso:
  python herramientas/merge_banco.py            # exige 75 filas
  python herramientas/merge_banco.py --stem-only # permite 60 (provisional)
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
STAGING = BASE / "herramientas" / "staging"
SALIDAS = BASE / "salidas"

COLUMNS = [
    "id", "kind", "season_id", "specialty_id", "discipline_id", "cell_code",
    "cell_index", "variant_index", "question_es", "question_en",
    "option_a_es", "option_a_en", "option_b_es", "option_b_en",
    "option_c_es", "option_c_en", "option_d_es", "option_d_en",
    "correct_option_id", "feedback_es", "feedback_en",
    "compartment_id", "system_ids", "timss_cycle", "timss_item_id",
    "timss_item_title", "timss_content_domain", "timss_cognitive_domain",
    "reference_relation", "source_basis", "reuse_group", "justification_es",
    "confidence", "status",
]

REQUIRED = [
    "question_es", "question_en", "option_a_es", "option_a_en", "option_b_es",
    "option_b_en", "option_c_es", "option_c_en", "option_d_es", "option_d_en",
    "correct_option_id", "feedback_es", "feedback_en", "compartment_id",
]

KEYS_BY_DISCIPLINE = {"SCI": ["A", "B", "C"], "TEC": ["D", "A", "B"], "ING": ["C", "D", "A"], "MAT": ["B", "C", "D"]}
SPECIALTIES = ["MAQ", "ELE", "ELN", "NAV", "LOG"]


def parse_assignments() -> dict[tuple[str, int], dict]:
    expected: dict[tuple[str, int], dict] = {}
    header_re = re.compile(r"^## (CU-[A-Z]{3}-[A-Z]{3}) · cell_index (\d+) · disciplina ([A-Z]{3}) · tema: (.+)$")
    row_re = re.compile(r"^- variante (\d) · ref `([A-Z0-9]+)` · concepto a adaptar: (.+) · \*\*clave correcta: ([ABCD])\*\*$")
    for path in sorted(STAGING.glob("asignacion_*.md")):
        lines = path.read_text(encoding="utf-8").splitlines()
        current = None
        for line in lines:
            m = header_re.match(line)
            if m:
                current = m.group(1)
                expected[(current, 0)] = {
                    "cell_code": current,
                    "cell_index": int(m.group(2)),
                    "discipline_id": m.group(3),
                    "topic": m.group(4),
                }
                continue
            m = row_re.match(line)
            if m and current:
                variant = int(m.group(1))
                expected[(current, variant)] = {
                    "cell_code": current,
                    "cell_index": expected[(current, 0)]["cell_index"],
                    "discipline_id": expected[(current, 0)]["discipline_id"],
                    "variant": variant,
                    "ref": m.group(2),
                    "concept": m.group(3),
                    "key": m.group(4),
                }
    return expected


def load_rows() -> list[dict]:
    rows: list[dict] = []
    for esp in SPECIALTIES:
        path = STAGING / f"{esp}.json"
        if not path.exists():
            print(f"FALTA {path.name}")
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for item in data:
            item["_source"] = esp
            rows.append(item)
    fh = STAGING / "FH.json"
    if fh.exists():
        for item in json.loads(fh.read_text(encoding="utf-8")):
            item["_source"] = "FH"
            rows.append(item)
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stem-only", action="store_true")
    parser.add_argument("--out", default="")
    args = parser.parse_args()

    expected = parse_assignments()
    rows = load_rows()
    errors: list[str] = []
    warnings: list[str] = []

    stem = [r for r in rows if r.get("kind") == "STEM"]
    fh = [r for r in rows if r.get("kind") == "FH"]

    # Cobertura STEM: 60 con (cell, variant) exactos
    seen = set()
    for r in stem:
        key = (r.get("cell_code"), int(r.get("variant_index", 0)))
        if key in seen:
            errors.append(f"STEM duplicado: {key}")
        seen.add(key)
        exp = expected.get(key)
        if not exp:
            errors.append(f"STEM con celda/variante no asignada: {key}")
            continue
        if r.get("timss_item_id") != exp["ref"]:
            errors.append(f"{r.get('id')}: ref {r.get('timss_item_id')} != asignada {exp['ref']}")
        if r.get("correct_option_id") != exp["key"]:
            errors.append(f"{r.get('id')}: clave {r.get('correct_option_id')} != asignada {exp['key']}")
        if int(r.get("cell_index", -1)) != exp["cell_index"]:
            errors.append(f"{r.get('id')}: cell_index {r.get('cell_index')} != {exp['cell_index']}")
        if r.get("discipline_id") != exp["discipline_id"]:
            errors.append(f"{r.get('id')}: disciplina {r.get('discipline_id')} != {exp['discipline_id']}")
        if r.get("specialty_id") != key[0].split("-")[2]:
            errors.append(f"{r.get('id')}: especialidad {r.get('specialty_id')} no coincide con {key[0]}")
    missing = [k for k in expected if k[1] > 0 and k not in seen]
    if missing:
        errors.append(f"Faltan {len(missing)} preguntas asignadas: {missing[:8]}")

    # Cobertura FH
    if fh:
        fh_codes = {r.get("cell_code") for r in fh}
        want = {f"FH-{n:02d}" for n in range(1, 16)}
        if fh_codes != want:
            errors.append(f"FH: faltan/sobran {sorted(want - fh_codes)} / {sorted(fh_codes - want)}")
        for r in fh:
            if (r.get("timss_item_id") or "").strip():
                errors.append(f"{r.get('id')}: FH con timss_item_id")
            if r.get("discipline_id") != "HUM":
                errors.append(f"{r.get('id')}: FH con disciplina {r.get('discipline_id')}")

    # Campos bilingües
    for r in rows:
        for field in REQUIRED:
            if not str(r.get(field) or "").strip():
                errors.append(f"{r.get('id')}: campo vacío {field}")
        if r.get("correct_option_id") not in {"A", "B", "C", "D"}:
            errors.append(f"{r.get('id')}: correct_option_id inválido")
        if r.get("kind") == "STEM":
            for field in ("timss_item_id", "timss_item_title", "timss_content_domain",
                          "reference_relation", "source_basis", "system_ids"):
                if not str(r.get(field) or "").strip():
                    errors.append(f"{r.get('id')}: campo STEM vacío {field}")

    # Duplicados de enunciado
    for lang in ("es", "en"):
        seen_q: dict[str, str] = {}
        for r in rows:
            q = re.sub(r"\s+", " ", str(r.get(f"question_{lang}", "")).strip().lower())
            if q in seen_q:
                errors.append(f"Enunciado duplicado ({lang}): {seen_q[q]} y {r.get('id')}")
            seen_q[q] = r.get("id", "")

    # Distribución de claves
    key_counts = Counter(r.get("correct_option_id") for r in rows)
    if stem:
        for letter in "ABCD":
            for esp in SPECIALTIES:
                sub = Counter(r.get("correct_option_id") for r in stem if r.get("specialty_id") == esp)
                if sub.get(letter, 0) != 3:
                    warnings.append(f"{esp}: {letter}={sub.get(letter, 0)} (se esperan 3)")

    total_expected = 75 if not args.stem_only else 60
    if len(rows) != total_expected:
        errors.append(f"Filas: {len(rows)} (se esperan {total_expected})")

    print(f"STEM: {len(stem)} · FH: {len(fh)} · total: {len(rows)}")
    print(f"Claves: {dict(key_counts)}")
    print(f"Errores: {len(errors)} · Avisos: {len(warnings)}")
    for e in errors:
        print("  ERROR:", e)
    for w in warnings:
        print("  AVISO:", w)

    if errors:
        print("\nNo se escribe el CSV: corregí los errores.")
        return 1

    rows.sort(key=lambda r: (0 if r.get("kind") == "STEM" else 1, int(r.get("cell_index", 99)), int(r.get("variant_index", 1))))
    out = Path(args.out) if args.out else SALIDAS / ("banco_cobre.csv" if total_expected == 75 else "banco_cobre_stem_provisional.csv")
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLUMNS, extrasaction="ignore")
        writer.writeheader()
        for r in rows:
            writer.writerow({c: r.get(c, "") for c in COLUMNS})
    print(f"\nEscrito: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
