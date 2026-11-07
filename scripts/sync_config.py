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
import hashlib
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
    "episodes": {
        "required": ["id", "title_en", "season_id"],
        "columns": [
            "id", "title_en", "title_es", "season_id", "museum_id", "compartment_id",
            "equipment_id", "media_url", "duration_seconds", "description_en",
            "description_es", "narrative_en", "narrative_es", "order", "status",
        ],
    },
    "questions": {
        "required": ["id", "text_en", "mission_id", "correct_option_id"],
        "columns": [
            "id", "text_en", "text_es", "mission_id", "episode_id", "museum_id",
            "compartment_id", "equipment_id", "area", "timss_domain", "gsa_competency",
            "topic", "level", "option_a_en", "option_a_es", "option_b_en", "option_b_es",
            "option_c_en", "option_c_es", "option_d_en", "option_d_es",
            "correct_option_id", "feedback_en", "feedback_es", "civil_en", "civil_es",
            "source", "status", "notes",
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
    "institutions": {
        "required": ["id", "name_en"],
        "columns": ["id", "name_en", "name_es", "type", "country", "city", "website",
                    "contact_name", "contact_email", "status", "notes"],
    },
    "roles": {
        "required": ["id", "name_en"],
        "columns": ["id", "name_en", "name_es", "description_en", "description_es",
                    "equipment_ids", "status"],
    },
    "disciplines": {
        "required": ["id", "name_en"],
        "columns": ["id", "name_en", "name_es", "description_en", "description_es", "color", "status"],
    },
    "compartments": {
        "required": ["id", "name_en"],
        "columns": ["id", "museum_id", "name_en", "name_es", "description_en",
                    "description_es", "system_ids", "status"],
    },
    "systems": {
        "required": ["id", "name_en"],
        "columns": ["id", "name_en", "name_es", "category", "description_en",
                    "description_es", "compartment_id", "museum_id", "topics", "status"],
    },
    "gridCells": {
        "required": ["id"],
        "columns": ["id", "especialidad_id", "disciplina_id", "mission_id", "order", "notes", "status"],
    },
}

# Nombre de pestaña del workbook base -> sección del JSON.
XLSX_TABS = {
    "Config": "settings",
    "Instituciones": "institutions",
    "Compartimentos": "compartments",
    "Sistemas": "systems",
    "Temporadas": "seasons",
    "Episodios": "episodes",
    "Misiones": "missions",
    "Reactivos": "questions",
    "Insignias": "awards",
    "Roles": "roles",
    "Disciplinas": "disciplines",
    "Grilla_5x5": "gridCells",
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


def parse_episodes(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "draft").lower()

        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue

        try:
            duration = int(row.get("duration_seconds") or 0) or None
        except ValueError:
            problems.append(f"L{index}: duration_seconds no es un número entero.")
            continue

        out.append(
            {
                "id": row["id"],
                "titleEn": row.get("title_en", ""),
                "titleEs": row.get("title_es") or row.get("title_en", ""),
                "seasonId": row.get("season_id", ""),
                "museumId": row.get("museum_id", ""),
                "compartmentId": row.get("compartment_id", ""),
                "equipmentId": row.get("equipment_id", ""),
                "mediaUrl": row.get("media_url", ""),
                "durationSeconds": duration,
                "descriptionEn": row.get("description_en", ""),
                "descriptionEs": row.get("description_es") or row.get("description_en", ""),
                "narrativeEn": row.get("narrative_en", ""),
                "narrativeEs": row.get("narrative_es") or row.get("narrative_en", ""),
                "order": int(row.get("order") or 0),
                "status": status,
            }
        )

    return out, problems


def parse_questions(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        domain = (row.get("timss_domain") or "knowing").lower()
        status = (row.get("status") or "proposal").lower()
        correct = (row.get("correct_option_id") or "").upper()

        if domain not in KNOWN_DOMAIN:
            problems.append(f"L{index}: timss_domain '{domain}' no es válido.")
            continue
        if correct not in {"A", "B", "C", "D"}:
            problems.append(f"L{index}: correct_option_id '{correct}' debe ser A, B, C o D.")
            continue

        options = {}
        for letter in "abcd":
            text_en = row.get(f"option_{letter}_en", "")
            if not text_en:
                problems.append(f"L{index}: falta option_{letter}_en.")
                break
            options[letter.upper()] = {
                "en": text_en,
                "es": row.get(f"option_{letter}_es") or text_en,
            }
        else:
            out.append(
                {
                    "id": row["id"],
                    "textEn": row.get("text_en", ""),
                    "textEs": row.get("text_es") or row.get("text_en", ""),
                    "missionId": row.get("mission_id", ""),
                    "episodeId": row.get("episode_id", ""),
                    "museumId": row.get("museum_id", ""),
                    "compartmentId": row.get("compartment_id", ""),
                    "equipmentId": row.get("equipment_id", ""),
                    "area": row.get("area", ""),
                    "timssDomain": domain,
                    "gsaCompetency": row.get("gsa_competency", ""),
                    "topic": row.get("topic", ""),
                    "level": row.get("level", ""),
                    "options": options,
                    "correctOptionId": correct,
                    "feedbackEn": row.get("feedback_en", ""),
                    "feedbackEs": row.get("feedback_es") or row.get("feedback_en", ""),
                    "civilEn": row.get("civil_en", ""),
                    "civilEs": row.get("civil_es") or row.get("civil_en", ""),
                    "source": row.get("source", ""),
                    "status": status,
                    "notes": row.get("notes", ""),
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


def parse_institutions(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "active").lower()
        if status not in {"active", "inactive"}:
            problems.append(f"L{index}: status '{status}' no es válido (active, inactive).")
            continue
        out.append({
            "id": row["id"],
            "nameEn": row.get("name_en", ""),
            "nameEs": row.get("name_es") or row.get("name_en", ""),
            "type": (row.get("type") or "other").lower(),
            "country": row.get("country", ""),
            "city": row.get("city", ""),
            "website": row.get("website", ""),
            "contactName": row.get("contact_name", ""),
            "contactEmail": row.get("contact_email", ""),
            "status": status,
            "notes": row.get("notes", ""),
        })

    return out, problems


def parse_roles(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "published").lower()
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue
        out.append({
            "id": row["id"],
            "nameEn": row.get("name_en", ""),
            "nameEs": row.get("name_es") or row.get("name_en", ""),
            "descriptionEn": row.get("description_en", ""),
            "descriptionEs": row.get("description_es") or row.get("description_en", ""),
            "status": status,
        })

    return out, problems


def parse_disciplines(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "published").lower()
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue
        out.append({
            "id": row["id"],
            "nameEn": row.get("name_en", ""),
            "nameEs": row.get("name_es") or row.get("name_en", ""),
            "descriptionEn": row.get("description_en", ""),
            "descriptionEs": row.get("description_es") or row.get("description_en", ""),
            "color": row.get("color", ""),
            "status": status,
        })

    return out, problems


def split_list(value: str) -> list[str]:
    return [item.strip() for item in re.split(r"[|,]", value or "") if item.strip()]


def parse_compartments(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "published").lower()
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue
        out.append({
            "id": row["id"],
            "nameEn": row.get("name_en", ""),
            "nameEs": row.get("name_es") or row.get("name_en", ""),
            "museumId": row.get("museum_id", ""),
            "descriptionEn": row.get("description_en", ""),
            "descriptionEs": row.get("description_es") or row.get("description_en", ""),
            "systemIds": split_list(row.get("system_ids", "")),
            "status": status,
        })

    return out, problems


def parse_systems(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "published").lower()
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue
        out.append({
            "id": row["id"],
            "nameEn": row.get("name_en", ""),
            "nameEs": row.get("name_es") or row.get("name_en", ""),
            "category": row.get("category", ""),
            "descriptionEn": row.get("description_en", ""),
            "descriptionEs": row.get("description_es") or row.get("description_en", ""),
            "compartmentId": row.get("compartment_id", ""),
            "museumId": row.get("museum_id", ""),
            "topics": split_list(row.get("topics", "")),
            "status": status,
        })

    return out, problems


def parse_grid_cells(rows: list[dict[str, str]]) -> tuple[list[dict], list[str]]:
    out, problems = [], []

    for index, row in enumerate(rows, start=2):
        if not row.get("id"):
            continue
        status = (row.get("status") or "published").lower()
        if status not in KNOWN_STATUS:
            problems.append(f"L{index}: status '{status}' no es válido.")
            continue
        specialty = row.get("especialidad_id") or row.get("specialty_id", "")
        discipline = row.get("disciplina_id") or row.get("discipline_id", "")
        if not specialty or not discipline:
            problems.append(f"L{index}: especialidad_id y disciplina_id son obligatorios.")
            continue
        out.append({
            "id": row["id"],
            "specialtyId": specialty,
            "disciplineId": discipline,
            "missionId": row.get("mission_id", ""),
            "order": int(row.get("order") or 0),
            "notes": row.get("notes", ""),
            "status": status,
        })

    return out, problems


PARSERS = {
    "seasons": parse_seasons,
    "episodes": parse_episodes,
    "missions": parse_missions,
    "questions": parse_questions,
    "awards": parse_awards,
    "settings": parse_settings,
    "institutions": parse_institutions,
    "roles": parse_roles,
    "disciplines": parse_disciplines,
    "compartments": parse_compartments,
    "systems": parse_systems,
    "gridCells": parse_grid_cells,
}


def read_workbook(path: str) -> dict[str, list[dict[str, str]]]:
    """Lee el workbook base y devuelve {sección: filas} usando XLSX_TABS."""
    try:
        from openpyxl import load_workbook
    except ImportError:
        raise SystemExit("openpyxl no está disponible: instalá la dependencia o usá CSV.")

    workbook = load_workbook(path, read_only=True, data_only=True)
    sections: dict[str, list[dict[str, str]]] = {}

    for tab, section in XLSX_TABS.items():
        if tab not in workbook.sheetnames:
            continue

        sheet = workbook[tab]
        rows = sheet.iter_rows(values_only=True)
        header = next(rows, None)

        if not header:
            continue

        columns = [normalize(str(value)) for value in header if value]

        # La pestaña `Insignias` usa encabezados genéricos; la tabla de
        # acreditaciones los nombra con prefijo propio.
        if section == "awards":
            aliases = {
                "id": "badge_id",
                "name_en": "badge_name_en",
                "name_es": "badge_name_es",
            }
            columns = [aliases.get(column, column) for column in columns]
        data: list[dict[str, str]] = []

        for values in rows:
            record = {}
            for index, column in enumerate(columns):
                raw = values[index] if index < len(values) else ""
                record[column] = "" if raw is None else str(raw).strip()
            if any(record.values()):
                data.append(record)

        sections[section] = data

    return sections


def known_ids(section: str, payload: dict) -> set[str]:
    return {entry["id"] for entry in payload.get(section, []) if entry.get("id")}


def validate_references(payload: dict) -> list[str]:
    """Comprueba claves foráneas entre secciones y contra el dataset de museos."""
    problems: list[str] = []

    museums: set[str] = set()
    dataset = ROOT / "lib" / "data" / "datasets" / "museums-snk-2025.json"

    if dataset.exists():
        try:
            museums = {item["id"] for item in json.loads(dataset.read_text(encoding="utf-8"))}
        except (json.JSONDecodeError, KeyError):
            museums = set()

    seasons = known_ids("seasons", payload)
    episodes = known_ids("episodes", payload)
    missions = known_ids("missions", payload)
    compartments = known_ids("compartments", payload)
    systems = known_ids("systems", payload)
    roles = known_ids("roles", payload)
    disciplines = known_ids("disciplines", payload)

    def check(section: str, field: str, value: str, allowed: set[str], label: str) -> None:
        if not value or not allowed:
            return
        if value not in allowed:
            problems.append(f"{section}: {field} '{value}' no existe en {label}.")

    for entry in payload.get("compartments", []):
        check("compartments", "museum_id", entry.get("museumId", ""), museums, "Museos")

    for entry in payload.get("systems", []):
        check("systems", "compartment_id", entry.get("compartmentId", ""), compartments, "Compartimentos")
        check("systems", "museum_id", entry.get("museumId", ""), museums, "Museos")

    for entry in payload.get("episodes", []):
        check("episodes", "season_id", entry.get("seasonId", ""), seasons, "Temporadas")
        check("episodes", "museum_id", entry.get("museumId", ""), museums, "Museos")
        check("episodes", "compartment_id", entry.get("compartmentId", ""), compartments, "Compartimentos")
        check("episodes", "equipment_id", entry.get("equipmentId", ""), systems, "Sistemas")

    for entry in payload.get("missions", []):
        check("missions", "season_id", entry.get("seasonId", ""), seasons, "Temporadas")
        check("missions", "episode_id", entry.get("episodeId", ""), episodes, "Episodios")
        check("missions", "museum_id", entry.get("museumId", ""), museums, "Museos")
        check("missions", "compartment_id", entry.get("compartmentId", ""), compartments, "Compartimentos")
        check("missions", "equipment_id", entry.get("equipmentId", ""), systems, "Sistemas")

    for entry in payload.get("questions", []):
        check("questions", "mission_id", entry.get("missionId", ""), missions, "Misiones")
        check("questions", "episode_id", entry.get("episodeId", ""), episodes, "Episodios")

    for entry in payload.get("gridCells", []):
        check("gridCells", "especialidad_id", entry.get("specialtyId", ""), roles, "Roles")
        check("gridCells", "disciplina_id", entry.get("disciplineId", ""), disciplines, "Disciplinas")
        check("gridCells", "mission_id", entry.get("missionId", ""), missions, "Misiones")

    for entry in payload.get("awards", []):
        check("awards", "season_id", entry.get("seasonId", ""), seasons, "Temporadas")
        if entry.get("ruleType") == "mission":
            check("awards", "mission_id", entry.get("missionId", ""), missions, "Misiones")

    return problems


def write_manifest(output: Path) -> Path:
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    payload = json.loads(output.read_text(encoding="utf-8"))
    counts = {key: len(value) for key, value in payload.items() if isinstance(value, list)}

    manifest = output.with_suffix(".manifest.json")
    manifest.write_text(
        json.dumps(
            {
                "generatedAt": payload.get("generatedAt"),
                "sha256": digest,
                "counts": counts,
            },
            ensure_ascii=False,
            indent=1,
        )
        + "\n",
        encoding="utf-8",
    )
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser()
    for section in SECTIONS:
        parser.add_argument(f"--{section}", help=f"CSV path or published URL for {section}")
    parser.add_argument("--xlsx", help="workbook base con las pestañas del modelo")
    parser.add_argument("--check", action="store_true", help="validate without writing")
    args = parser.parse_args()

    provided = {section: getattr(args, section) for section in SECTIONS}

    if args.xlsx:
        workbook_sections = read_workbook(args.xlsx)
        for section, rows in workbook_sections.items():
            if rows:
                provided[section] = rows

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
            rows = rows_of(source) if isinstance(source, str) else list(source)
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

    reference_problems = validate_references(result)

    if reference_problems:
        print("Referencias inválidas:")
        for problem in reference_problems:
            print(f"  - {problem}")
        return 1

    result["version"] = 2
    result["generatedAt"] = date.today().isoformat()

    print(f"Secciones: {', '.join(s for s in SECTIONS if s in result)}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    manifest = write_manifest(OUTPUT)
    print(f"Escrito: {OUTPUT.relative_to(ROOT)}")
    print(f"Manifiesto: {manifest.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
