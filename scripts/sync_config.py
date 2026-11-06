#!/usr/bin/env python3
"""
Sincroniza la configuración de acreditaciones de ISA desde una tabla CSV.

La tabla puede vivir en una Google Sheet publicada (o editarse con AppSheet) y
esta secuencia de comandos la convierte en lib/data/datasets/isa-config.json.

Columnas esperadas (los nombres se reconocen sin importar mayúsculas/acentos):

    badge_id, badge_name_en, badge_name_es, type, season_id, mission_id,
    criteria_en, criteria_es, rule_type, rule_count, color, status

Uso:
    python scripts/sync_config.py --awards awards.csv --check
    python scripts/sync_config.py --awards awards.csv
    python scripts/sync_config.py --awards "https://.../pub?gid=...&output=csv"

El sitio no consulta la tabla en runtime: la configuración se versiona en el
repositorio y se aplica al inicializar la base local.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import unicodedata
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "lib" / "data" / "datasets" / "isa-config.json"

REQUIRED = ["badge_id", "badge_name_en", "type", "rule_type"]
KNOWN_RULES = {"mission", "season-count"}
KNOWN_TYPES = {"credential", "coin", "badge"}


def normalize(value: str) -> str:
    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(char for char in text if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def read_source(source: str) -> str:
    if source.startswith(("http://", "https://")):
        request = urllib.request.Request(source, headers={"User-Agent": "ISA-config/1.0"})
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.read().decode("utf-8-sig")

    return Path(source).read_text(encoding="utf-8-sig")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--awards", required=True, help="CSV path or published Sheet URL")
    parser.add_argument("--check", action="store_true", help="validate without writing")
    args = parser.parse_args()

    try:
        raw = read_source(args.awards)
    except Exception as error:  # noqa: BLE001
        print(f"No se pudo leer la tabla: {error}")
        return 1

    reader = csv.DictReader(io.StringIO(raw))
    headers = [normalize(header) for header in (reader.fieldnames or [])]
    missing = [column for column in REQUIRED if column not in headers]

    if missing:
        print(f"Faltan columnas obligatorias: {', '.join(missing)}")
        print(f"Columnas encontradas: {', '.join(headers)}")
        return 1

    awards = []
    problems = []

    for index, row in enumerate(reader, start=2):
        values = {normalize(key): (value or "").strip() for key, value in row.items() if key}

        if not values.get("badge_id"):
            continue

        rule_type = values.get("rule_type", "").lower()
        badge_type = values.get("type", "badge").lower()

        if rule_type not in KNOWN_RULES:
            problems.append(f"L{index}: rule_type '{rule_type}' no es válido ({', '.join(sorted(KNOWN_RULES))}).")
            continue

        if badge_type not in KNOWN_TYPES:
            problems.append(f"L{index}: type '{badge_type}' no es válido ({', '.join(sorted(KNOWN_TYPES))}).")
            continue

        try:
            rule_count = int(values.get("rule_count") or 1)
        except ValueError:
            problems.append(f"L{index}: rule_count no es un número entero.")
            continue

        if rule_type == "season-count" and rule_count < 1:
            problems.append(f"L{index}: rule_count debe ser >= 1.")
            continue

        awards.append(
            {
                "badgeId": values["badge_id"],
                "nameEn": values.get("badge_name_en", ""),
                "nameEs": values.get("badge_name_es") or values.get("badge_name_en", ""),
                "type": badge_type,
                "seasonId": values.get("season_id", ""),
                "missionId": values.get("mission_id", ""),
                "criteriaEn": values.get("criteria_en", ""),
                "criteriaEs": values.get("criteria_es") or values.get("criteria_en", ""),
                "ruleType": rule_type,
                "ruleCount": rule_count,
                "color": values.get("color", ""),
                "status": values.get("status", "published") or "published",
            }
        )

    if problems:
        print("Errores:")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    payload = {
        "version": 1,
        "generatedAt": date.today().isoformat(),
        "source": "awards table",
        "awards": awards,
    }

    by_rule: dict[str, int] = {}
    for award in awards:
        by_rule[award["ruleType"]] = by_rule.get(award["ruleType"], 0) + 1

    print(f"Acreditaciones: {len(awards)}")
    print(f"Por regla: {by_rule}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Escrito: {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
