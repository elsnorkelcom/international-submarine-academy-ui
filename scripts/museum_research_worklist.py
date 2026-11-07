#!/usr/bin/env python3
"""
Genera la lista de trabajo de investigación de museos.

Salida: research/museums_worklist.csv — un registro por museo con los campos
faltantes y una prioridad, ordenada para investigar primero lo que más necesita.

Uso:
    python scripts/museum_research_worklist.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "lib" / "data" / "datasets" / "museums-snk-2025.json"
OUTPUT = ROOT / "research" / "museums_worklist.csv"

# Campos que se investigan y su peso (más alto = más importante para el sitio).
FIELDS = {
    "launchYear": 3,
    "website": 3,
    "city": 2,
    "situation": 2,
    "mediaUrl": 1,
    "origin": 1,
    "description": 2,
}

HEADER = [
    "id",
    "name",
    "museum_name",
    "country",
    "city",
    "missing_fields",
    "missing_count",
    "priority",
    "validation",
]


def plain(value) -> str:
    """El dataset guarda algunos campos como texto y otros como {en, es}."""
    if isinstance(value, dict):
        return (value.get("en") or "").strip()
    return "" if value is None else str(value).strip()


def is_empty(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == "" or value.strip().lower().startswith("information to be validated")
    if isinstance(value, dict):
        return not (value.get("en") or "").strip()
    return False


def main() -> int:
    if not DATASET.exists():
        print(f"No existe {DATASET}")
        return 1

    data = json.loads(DATASET.read_text(encoding="utf-8"))
    rows = []

    for museum in data:
        missing = [field for field in FIELDS if is_empty(museum.get(field))]
        weight = sum(FIELDS[field] for field in missing)
        # Los validados se investigan al final: primero lo dudoso.
        priority = weight * (1 if museum.get("validation") != "validated" else 0)

        rows.append(
            {
                "id": museum["id"],
                "name": museum["name"],
                "museum_name": plain(museum.get("museumName")),
                "country": museum.get("country", ""),
                "city": museum.get("city", ""),
                "missing_fields": "|".join(missing),
                "missing_count": len(missing),
                "priority": priority,
                "validation": museum.get("validation", ""),
            }
        )

    rows.sort(key=lambda row: (-row["priority"], -row["missing_count"], row["name"]))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    import csv

    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADER)
        writer.writeheader()
        writer.writerows(rows)

    total_missing = sum(row["missing_count"] for row in rows)
    pending = sum(1 for row in rows if row["priority"] > 0)

    print(f"Museos: {len(rows)}")
    print(f"Con campos faltantes: {pending}")
    print(f"Campos por investigar (total): {total_missing}")
    print(f"Escrito: {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
