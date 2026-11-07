#!/usr/bin/env python3
"""
Consolida los resultados de investigación de museos.

Lee todos los JSON de research/results/, valida y produce:
    research/review.csv      revisión humana (actual vs propuesto + fuente + confianza)
    research/proposals.json  propuestas normalizadas

Con --apply actualiza lib/data/datasets/museums-snk-2025.json solo con campos de
confianza high/medium, nunca degrada un museo ya validado (salvo --force) y deja
la fuente registrada en museum["research"].

Uso:
    python scripts/merge_museum_research.py
    python scripts/merge_museum_research.py --apply
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "lib" / "data" / "datasets" / "museums-snk-2025.json"
RESULTS = ROOT / "research" / "results"
REVIEW = ROOT / "research" / "review.csv"
PROPOSALS = ROOT / "research" / "proposals.json"

FIELDS = ["launchYear", "website", "city", "situation"]
SITUATIONS = {"flote", "agua", "tierra", "cerrado", "monumento"}
ACCEPTED = {"high", "medium"}
HEADER = ["id", "name", "field", "current", "proposed", "confidence", "source", "status", "notes"]


def load_results() -> list[dict]:
    if not RESULTS.exists():
        return []

    items: list[dict] = []

    for path in sorted(RESULTS.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))

        if isinstance(data, dict) and "results" in data:
            items.extend(data["results"])
        elif isinstance(data, list):
            items.extend(data)

    return items


def normalize_field(field: str, value: str) -> object:
    value = (value or "").strip()

    if not value or value == "not-found":
        return None

    if field == "launchYear":
        digits = "".join(character for character in value if character.isdigit())
        return int(digits[:4]) if len(digits) >= 4 else None

    if field == "website":
        return value if value.startswith("http") else None

    if field == "situation":
        return value.lower() if value.lower() in SITUATIONS else None

    return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="actualizar el dataset")
    parser.add_argument("--force", action="store_true", help="permitir cambios en museos validados")
    args = parser.parse_args()

    if not DATASET.exists():
        print(f"No existe {DATASET}")
        return 1

    dataset = json.loads(DATASET.read_text(encoding="utf-8"))
    by_id = {museum["id"]: museum for museum in dataset}
    results = load_results()

    if not results:
        print("No hay resultados en research/results/.")
        return 1

    rows: list[dict] = []
    proposals: list[dict] = []
    applied = 0

    for result in results:
        museum_id = result.get("id", "")
        museum = by_id.get(museum_id)

        if not museum:
            print(f"Aviso: {museum_id} no existe en el dataset.")
            continue

        for field in FIELDS:
            proposed = normalize_field(field, str(result.get(field, "")))
            confidence = str(result.get(f"{field}Confidence", "") or "").lower()
            source = str(result.get(f"{field}Source", "") or "")

            current = museum.get(field)
            current_text = "" if current is None else str(current)

            if proposed is None:
                status = "not-found"
            elif current_text and str(proposed) == current_text:
                status = "same"
            elif confidence not in ACCEPTED:
                status = "low-confidence"
            elif not source.startswith("http"):
                status = "no-source"
            elif museum.get("validation") == "validated" and not args.force:
                status = "protected"
            else:
                status = "proposed"

            rows.append(
                {
                    "id": museum_id,
                    "name": museum.get("name", ""),
                    "field": field,
                    "current": current_text,
                    "proposed": "" if proposed is None else str(proposed),
                    "confidence": confidence,
                    "source": source,
                    "status": status,
                    "notes": result.get("notes", ""),
                }
            )

            if status == "proposed":
                proposals.append({"id": museum_id, "field": field, "value": proposed, "source": source, "confidence": confidence})

                if args.apply:
                    museum[field] = proposed
                    research = museum.setdefault("research", {})
                    research[field] = {"source": source, "confidence": confidence, "accessed": date.today().isoformat()}
                    museum["validation"] = "pending"
                    applied += 1

    REVIEW.parent.mkdir(parents=True, exist_ok=True)

    with REVIEW.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADER)
        writer.writeheader()
        writer.writerows(rows)

    PROPOSALS.write_text(json.dumps(proposals, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    if args.apply and applied:
        DATASET.write_text(json.dumps(dataset, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    summary: dict[str, int] = {}
    for row in rows:
        summary[row["status"]] = summary.get(row["status"], 0) + 1

    print(f"Museos procesados: {len({row['id'] for row in rows})}")
    print(f"Filas: {len(rows)} · estados: {summary}")
    print(f"Revisión: {REVIEW.relative_to(ROOT)}")
    print(f"Propuestas: {PROPOSALS.relative_to(ROOT)}")

    if args.apply:
        print(f"Aplicados al dataset: {applied}")
    else:
        print("Modo revisión: no se modificó el dataset. Usá --apply para aplicarlo.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
