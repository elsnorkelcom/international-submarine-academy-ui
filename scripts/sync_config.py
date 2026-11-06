#!/usr/bin/env python3
"""
Sincroniza la configuración de ISA desde tablas CSV (Google Sheets / AppSheet).

Tablas soportadas (todas opcionales, se combinan en un solo archivo):
    --seasons   temporadas y colores
    --missions  misiones de cada temporada
    --awards    reglas de acreditación (badges)
    --settings  variables simples de la app (clave/valor)

Uso:
    python scripts/sync_config.py --seasons s.csv --missions m.csv --awards a.csv --check
    python scripts/sync_config.py --awards "https://.../pub?gid=...&output=csv"

Salida: lib/data/datasets/isa-config.json
El sitio no consulta las tablas en runtime.
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

KNOWN_RULES = {"mission", "season-count"}
KNOWN_TYPES = {"credential", "coin", "badge"}
KNOWN_DOMAIN = {"knowing", "applying", "reasoning", "integrated"}
KNOWN_SEASON = {"steel", "copper", "bronze", "silver", "gold"}
KNOWN_STATUS = {"draft", "review", "published", "archived", "active", "inactive"}

SECTIONS = {
    "seasons": {
        "required": ["id", "name"],
        "columns": [
            "id", "name", "title_en", "title_es", "description_en", "description_es",
            "order", "color_theme", "timss_domain", "gsa_en", "gsa_es", "status",
        ],
    },
    "missions": {
        "required": ["id", "title_en", "season_id"],
        "columns": [
            "id", "title_en", "title_es", "episode_id", "season_id", "museum_id",
            "compartment_id", "equipment_id", "description_en", "description_es",
            "objective_en", "objective_es", "timss_domain", "gsa_competency",
            "civil_en", "civil_es", "order", "status",
        ],
    },
    "awards": {
        "required": ["badge_id", "badge_name_en", "type", "rule_type"],
        "columns": [
            "badge_id", "badge_name_en", "badge_name_es", "type", "season_id",
            "mission_id", "criteria_en", "criteria_es", "rule_type", "rule_count",
            "color", "status",
        ],
    },
    "settings": {
        "required": ["key"],
        "columns": ["key", "value", "value_es"],
    },
}


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


def rows_of(source: str) -> list[dict[str, str]]:
    reader = csv.DictReader(io.StringIO(read_source(source)))
    return [
        {normalize(key): (value or "").strip() for key, value in row.items() if key}
        for row in reader
    ]


def parse_seasons(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        name = row.get("name", "").lower()
        domain = (row.get("timss_domain") or "knowing").lower()
        status = (row.get("status") or "published").lower()

        if name and name not in KNOWN_SEASON:
            problems.append(f"L{index}: name '{name}' no es válido ({', '.join(sorted(KNOWN_SEASON))}).")
            continue
        if domain not in KNOWN_DOMAIN:
            problems.append(f"L{index}: timss_domain '{domain}' no es válido.")
            continue
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue

        out.append(
            {
                "id": row["id"],
                "name": name,
                "titleEn": row.get("title_en", ""),
                "titleEs": row.get("title_es") or row.get("title_en", ""),
                "descriptionEn": row.get("description_en", ""),
                "descriptionEs": row.get("description_es") or row.get("description_en", ""),
                "order": int(row.get("order") or 0),
                "colorTheme": row.get("color_theme", ""),
                "timssDomain": domain,
                "gsaEn": row.get("gsa_en", ""),
                "gsaEs": row.get("gsa_es") or row.get("gsa_en", ""),
                "status": status,
            }
        )

    return out, problems


def parse_missions(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        domain = (row.get("timss_domain") or "knowing").lower()
        status = (row.get("status") or "draft").lower()

        if domain not in KNOWN_DOMAIN:
            problems.append(f"L{index}: timss_domain '{domain}' no es válido.")
            continue
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue

        out.append(
            {
                "id": row["id"],
                "titleEn": row.get("title_en", ""),
                "titleEs": row.get("title_es") or row.get("title_en", ""),
                "episodeId": row.get("episode_id", ""),
                "seasonId": row.get("season_id", ""),
                "museumId": row.get("museum_id", ""),
                "compartmentId": row.get("compartment_id", ""),
                "equipmentId": row.get("equipment_id", ""),
                "descriptionEn": row.get("description_en", ""),
                "descriptionEs": row.get("description_es") or row.get("description_en", ""),
                "objectiveEn": row.get("objective_en", ""),
                "objectiveEs": row.get("objective_es") or row.get("objective_en", ""),
                "timssDomain": domain,
                "gsaCompetency": row.get("gsa_competency", ""),
                "civilEn": row.get("civil_en", ""),
                "civilEs": row.get("civil_es") or row.get("civil_en", ""),
                "order": int(row.get("order") or 0),
                "status": status,
            }
        )

    return out, problems


def parse_awards(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("badge_id"):
            continue
        rule_type = (row.get("rule_type") or "").lower()
        badge_type = (row.get("type") or "badge").lower()

        if rule_type not in KNOWN_RULES:
            problems.append(f"L{index}: rule_type '{rule_type}' no es válido ({', '.join(sorted(KNOWN_RULES))}).")
            continue
        if badge_type not in KNOWN_TYPES:
            problems.append(f"L{index}: type '{badge_type}' no es válido ({', '.join(sorted(KNOWN_TYPES))}).")
            continue

        try:
            rule_count = int(row.get("rule_count") or 1)
        except ValueError:
            problems.append(f"L{index}: rule_count no es un número entero.")
            continue

        out.append(
            {
                "badgeId": row["badge_id"],
                "nameEn": row.get("badge_name_en", ""),
                "nameEs": row.get("badge_name_es") or row.get("badge_name_en", ""),
                "type": badge_type,
                "seasonId": row.get("season_id", ""),
                "missionId": row.get("mission_id", ""),
                "criteriaEn": row.get("criteria_en", ""),
                "criteriaEs": row.get("criteria_es") or row.get("criteria_en", ""),
                "ruleType": rule_type,
                "ruleCount": rule_count,
                "color": row.get("color", ""),
                "status": (row.get("status") or "published").lower(),
            }
        )

    return out, problems


def parse_settings(rows: list[dict[str, str]]) -> tuple[dict[str, str], list[str]]:
    out, problems = {}, []

    for index, row in enumerate(rows, start=2):
        key = row.get("key")
        if not key:
            continue
        if key in out:
            problems.append(f"L{index}: la clave '{key}' está repetida.")
            continue
        out[key] = row.get("value", "")

    return out, problems


PARSERS = {
    "seasons": parse_seasons,
    "missions": parse_missions,
    "awards": parse_awards,
    "settings": parse_settings,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    for section in SECTIONS:
        parser.add_argument(f"--{section}", help=f"CSV path or published URL for {section}")
    parser.add_argument("--check", action="store_true", help="validate without writing")
    args = parser.parse_args()

    provided = {section: getattr(args, section) for section in SECTIONS}

    if not any(provided.values()):
        print("Indicá al menos una tabla: " + ", ".join(f"--{s}" for s in SECTIONS))
        return 1

    current = {}
    if OUTPUT.exists():
        try:
            current = json.loads(OUTPUT.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            current = {}

    result = dict(current)
    failed = False

    for section, source in provided.items():
        if not source:
            continue

        try:
            rows = rows_of(source)
        except Exception as error:  # noqa: BLE001
            print(f"[{section}] no se pudo leer: {error}")
            failed = True
            continue

        headers = set(rows[0].keys()) if rows else set()
        missing = [column for column in SECTIONS[section]["required"] if column not in headers]

        if missing:
            print(f"[{section}] faltan columnas: {', '.join(missing)}")
            failed = True
            continue

        data, problems = PARSERS[section](rows)

        if problems:
            print(f"[{section}] errores:")
            for problem in problems:
                print(f"  - {problem}")
            failed = True
            continue

        count = len(data) if isinstance(data, list) else len(data.keys())
        print(f"[{section}] {count} fila(s)")
        result[section] = data

    if failed:
        return 1

    result["version"] = 2
    result["generatedAt"] = date.today().isoformat()

    print(f"Secciones: {', '.join(s for s in SECTIONS if s in result)}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Escrito: {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
