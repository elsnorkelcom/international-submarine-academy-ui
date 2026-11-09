# -*- coding: utf-8 -*-
"""Valida el banco de preguntas de Cobre (STEM + FH) contra los criterios de la sesión.

Uso:
  python TIMSS/banco-preguntas/herramientas/validar_banco.py
  python TIMSS/banco-preguntas/herramientas/validar_banco.py --csv ruta/al/banco.csv

No modifica nada: solo informa. Devuelve exit code 1 si hay errores bloqueantes.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_CSV = ROOT / "TIMSS" / "banco-preguntas" / "salidas" / "banco_cobre.csv"

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

SPECIALTIES = ["MAQ", "ELE", "ELN", "NAV", "LOG"]
DISCIPLINES = ["SCI", "TEC", "ING", "MAT"]
BANNED = [
    # español
    r"\barmas?\b", r"\barmamento\b", r"\bexplosiv[oa]s?\b", r"\bmunicion(es)?\b",
    r"\btorpedos?\b", r"\blanzatorpedos\b", r"\bcombate(s|mos|r)?\b", r"\bbatallas?\b",
    r"\benemig[oa]s?\b", r"\bguerra(s)?\b", r"\bmilitar(es)?\b", r"\bpatrullas?\b",
    r"\bproyectil(es)?\b", r"\bdisparos?\b", r"\bataques?\b", r"\bofensiv[oa]s?\b",
    r"\bsigilo\b", r"\bconflictos?\b", r"\bbelic[oa]s?\b", r"\bjolly roger\b",
    r"\bfuerzas? armadas?\b",
    # inglés
    r"\bweapons?\b", r"\bweaponry\b", r"\bexplosives?\b", r"\bammunition\b",
    r"\btorpedoes?\b", r"\btorpedo tubes?\b", r"\bcombat\b", r"\bbattles?\b",
    r"\benem(y|ies)\b", r"\bwars?\b", r"\bmilitary\b", r"\bpatrols?\b",
    r"\bmissiles?\b", r"\bprojectiles?\b", r"\bshots?\b", r"\battacks?\b",
    r"\boffensive\b", r"\bstealth\b", r"\bconflicts?\b", r"\barmed forces\b",
]
BANNED_RE = re.compile("|".join(BANNED), re.IGNORECASE)


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKD", (text or "").lower())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", text)).strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", default=str(DEFAULT_CSV))
    args = parser.parse_args()
    path = Path(args.csv)

    errors: list[str] = []
    warnings: list[str] = []

    if not path.exists():
        print(f"No existe el CSV: {path}")
        return 1

    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        header = reader.fieldnames or []
        rows = list(reader)

    missing = [c for c in COLUMNS if c not in header]
    extra = [c for c in header if c not in COLUMNS]
    if missing:
        errors.append(f"Faltan columnas: {', '.join(missing)}")
    if extra:
        warnings.append(f"Columnas extra: {', '.join(extra)}")

    if len(rows) != 75:
        errors.append(f"Se esperaban 75 filas y hay {len(rows)}")

    ids = [r.get("id", "") for r in rows]
    if len(set(ids)) != len(ids):
        errors.append("IDs duplicados")
    if any(not i.strip() for i in ids):
        errors.append("Hay IDs vacíos")

    kinds = Counter(r.get("kind", "") for r in rows)
    if kinds.get("STEM") != 60:
        errors.append(f"STEM: se esperaban 60 y hay {kinds.get('STEM', 0)}")
    if kinds.get("FH") != 15:
        errors.append(f"FH: se esperaban 15 y hay {kinds.get('FH', 0)}")

    cells: dict[str, list[str]] = defaultdict(list)
    for r in rows:
        if r.get("kind") == "STEM":
            cells[r.get("cell_code", "")].append(r.get("variant_index", ""))
    if len(cells) != 20:
        errors.append(f"Celdas STEM: se esperaban 20 y hay {len(cells)}")
    for code, variants in sorted(cells.items()):
        if sorted(variants) != ["1", "2", "3"]:
            errors.append(f"Celda {code}: variantes {variants} (se esperan 1,2,3)")

    # Referencias TIMSS
    stem = [r for r in rows if r.get("kind") == "STEM"]
    refs = [r.get("timss_item_id", "") for r in stem]
    if any(not ref.strip() for ref in refs):
        errors.append("Hay preguntas STEM sin timss_item_id")
    if len(set(refs)) != len(refs):
        warnings.append("El mismo timss_item_id aparece más de una vez (permitido solo con justificación)")
    if any(r.get("timss_cognitive_domain") != "Knowing" for r in stem):
        errors.append("Hay preguntas STEM con dominio cognitivo distinto de Knowing")

    # Bilingüismo y opciones
    bilingual = [
        "question", "feedback", "option_a", "option_b", "option_c", "option_d",
    ]
    for r in rows:
        for field in bilingual:
            for lang in ("es", "en"):
                key = f"{field}_{lang}"
                if not (r.get(key) or "").strip():
                    errors.append(f"{r.get('id')}: {key} vacío")
        for letter in "abcd":
            opt_es = (r.get(f"option_{letter}_es") or "").strip()
            opt_en = (r.get(f"option_{letter}_en") or "").strip()
            letters = sum(ch.isalpha() for ch in opt_es)
            if opt_es.lower() == opt_en.lower() and len(opt_es) >= 18 and letters >= 12:
                warnings.append(f"{r.get('id')}: opción {letter} idéntica en ES y EN")
        if r.get("correct_option_id") not in {"A", "B", "C", "D"}:
            errors.append(f"{r.get('id')}: correct_option_id inválido")

    # Duplicados de enunciado por idioma
    for lang in ("es", "en"):
        seen: dict[str, str] = {}
        for r in rows:
            key = norm(r.get(f"question_{lang}", ""))
            if key in seen:
                errors.append(f"Enunciado duplicado ({lang}): {seen[key]} y {r.get('id')}")
            seen[key] = r.get("id", "")

    # Distribución de claves
    keys = Counter(r.get("correct_option_id") for r in rows)
    total = len(rows)
    print("Distribución de claves:")
    for letter in "ABCD":
        share = 100 * keys.get(letter, 0) / total if total else 0
        print(f"  {letter}: {keys.get(letter, 0)} ({share:.1f} %)")
        if total and not (14 <= keys.get(letter, 0) <= 24):
            warnings.append(f"Clave {letter} fuera del rango 14–24 en el total ({keys.get(letter, 0)})")
    for esp in SPECIALTIES:
        sub = [r for r in rows if r.get("specialty_id") == esp]
        sub_keys = Counter(r.get("correct_option_id") for r in sub)
        print(f"  {esp}: {dict(sub_keys)}")
        for letter in "ABCD":
            if sub_keys and not (1 <= sub_keys.get(letter, 0)):
                warnings.append(f"{esp}: no hay ninguna clave {letter}")

    # FH: sin TIMSS, sin variantes
    for r in rows:
        if r.get("kind") != "FH":
            continue
        if (r.get("timss_item_id") or "").strip():
            errors.append(f"{r.get('id')}: FH no debe tener timss_item_id")
        if r.get("discipline_id") != "HUM":
            warnings.append(f"{r.get('id')}: FH con discipline_id {r.get('discipline_id')} (se espera HUM)")
        if r.get("variant_index") != "1":
            warnings.append(f"{r.get('id')}: FH con variant_index {r.get('variant_index')}")

    # Términos excluidos
    hits = []
    for r in rows:
        for col in ("question_es", "question_en", "feedback_es", "feedback_en",
                    "option_a_es", "option_b_es", "option_c_es", "option_d_es",
                    "option_a_en", "option_b_en", "option_c_en", "option_d_en",
                    "justification_es", "reference_relation", "source_basis"):
            value = r.get(col) or ""
            for match in BANNED_RE.finditer(value):
                hits.append((r.get("id"), col, match.group(0)))
    if hits:
        errors.append(f"Términos excluidos encontrados: {len(hits)}")
        for item in hits:
            print(f"  TÉRMINO EXCLUIDO: {item}")

    # Longitud de opciones (aviso, no bloqueante)
    for r in rows:
        lengths = [
            len((r.get(f"option_{x}_es") or "").strip()) for x in "abcd"
        ]
        if max(lengths or [0]) > 0 and min(lengths) > 0:
            ratio = max(lengths) / min(lengths)
            if ratio > 2.5:
                warnings.append(f"{r.get('id')}: opciones ES con longitudes dispares {lengths}")

    # Integridad de sistemas
    for r in rows:
        if r.get("kind") != "STEM":
            continue
        if not (r.get("system_ids") or "").strip():
            errors.append(f"{r.get('id')}: sin system_ids")
        if not (r.get("compartment_id") or "").strip():
            errors.append(f"{r.get('id')}: sin compartment_id")
        if not (r.get("timss_item_title") or "").strip():
            errors.append(f"{r.get('id')}: sin timss_item_title")

    print()
    print(f"Filas: {len(rows)} · STEM: {kinds.get('STEM', 0)} · FH: {kinds.get('FH', 0)} · celdas: {len(cells)}")
    print(f"Referencias STEM únicas: {len(set(refs))}")
    print(f"Errores: {len(errors)} · Avisos: {len(warnings)}")
    for err in errors:
        print(f"  ERROR: {err}")
    for warn in warnings[:40]:
        print(f"  AVISO: {warn}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
