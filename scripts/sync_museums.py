#!/usr/bin/env python3
"""
Sincroniza el dataset de museos de ISA con la Sheet publicada de submarinos_museo.

Fuente: hojas publicadas de Google Sheets (misma fuente que usa
https://github.com/elsnorkelcom/submarinos_museo).

Uso:
    python scripts/sync_museums.py --check     # compara sin escribir
    python scripts/sync_museums.py             # escribe el dataset

El sitio publicado no consulta la Sheet en runtime: el dataset se regenera y se
versiona, igual que en el proyecto de museos.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "lib" / "data" / "datasets" / "museums-snk-2025.json"

POINTS_URL = (
    "https://docs.google.com/spreadsheets/d/e/"
    "2PACX-1vQTuLWdJ1ZNR9dQ9sHcDOWe1-HPnIMsAKtCRzVEG_WZG4Za_3Mp-X3vkWCFlSwuNQSfEZ_mmNmTcIgb"
    "/pub?gid=164271551&single=true&output=csv"
)

# Nombre canónico en inglés. La Sheet mantiene los nombres en español.
COUNTRIES = {
    "Alemania": "Germany", "Australia": "Australia", "Brasil": "Brazil", "Bulgaria": "Bulgaria",
    "Canada": "Canada", "Chile": "Chile", "China": "China", "Croacia": "Croatia",
    "Dinamarca": "Denmark", "España": "Spain", "Estonia": "Estonia", "Finlandia": "Finland",
    "Francia": "France", "GRECE": "Greece", "India": "India", "Indonesia": "Indonesia",
    "Israel": "Israel", "Italia": "Italy", "Japon": "Japan", "Malasia": "Malaysia",
    "Norcorea": "North Korea", "Noruega": "Norway", "Paises Bajos": "Netherlands",
    "Pakistan": "Pakistan", "Peru": "Peru", "Polonia": "Poland", "Portugal": "Portugal",
    "Reino Unido": "United Kingdom", "Rusia": "Russia", "Slovenia": "Slovenia",
    "Sudafrica": "South Africa", "Suecia": "Sweden", "Surcorea": "South Korea",
    "Turkiye": "Türkiye", "Turquía": "Türkiye", "USA": "United States",
}


SITUATIONS = (
    ("flote", ("a flote", "flote", "afloat", "boyante", "superficie")),
    ("agua", ("en el agua", "en agua", "agua", "water", "sumergid")),
    ("tierra", ("en tierra", "tierra", "en seco", "seco", "on land", "land", "dry")),
    ("cerrado", ("bajo techo", "en cerrado", "cerrado", "cubierto", "under cover", "indoor")),
    ("monumento", ("monumento", "monument", "memorial")),
)

SITUATION_COLUMNS = ("Situacion", "Situation", "Icon URL", "Icon", "Marker Icon")


def pick_situation(row: dict[str, str]) -> str:
    for column in SITUATION_COLUMNS:
        raw = pick(row, column)
        if not raw:
            continue
        token = normalize(raw)
        if token.endswith(".svg") or "/" in token:
            token = token.rsplit("/", 1)[-1].replace(".svg", "")
        for key, synonyms in SITUATIONS:
            if any(synonym in token for synonym in synonyms):
                return key
    return ""


def normalize(value: str) -> str:
    import unicodedata

    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(char for char in text if not unicodedata.combining(char))
    return re.sub(r"\s+", " ", text.lower()).strip()


def pick(row: dict[str, str], *names: str) -> str:
    wanted = {normalize(name) for name in names}
    for key, value in row.items():
        if key and normalize(key) in wanted:
            return (value or "").strip()
    return ""


def clean_html(text: str) -> str:
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_description(html: str) -> dict[str, str]:
    def block(label: str) -> str:
        match = re.search(rf"<b>{label}:</b>\s*(.*?)(?:<br|$)", html, re.I | re.S)
        return clean_html(match.group(1)) if match else ""

    museum = re.search(r"<b>(.*?)</b>", html, re.I | re.S)
    return {
        "museum": clean_html(museum.group(1)) if museum else "",
        "type": block("Tipo"),
        "origin": block("Origen"),
        "launch": block("Lanzamiento"),
    }


def to_number(value: str, cast=float):
    try:
        return cast(value)
    except (TypeError, ValueError):
        return None


def build_record(row: dict[str, str], index: int, fallback_id: str, existing_ids: dict[str, str]) -> dict:
    info = parse_description(pick(row, "Description", "Descripcion"))
    name = pick(row, "Name", "Nombre")
    launch = pick(row, "Launch year", "Lanzamiento")
    origin = info["origin"] or pick(row, "Nationality", "Nacionalidad")
    museum_name = info["museum"] or pick(row, "Location", "Museo", "Museum")
    address = pick(row, "Address found", "Address", "Direccion")
    vessel_type = pick(row, "Clase", "Class") or info["type"] or pick(row, "Tipo", "Type")
    year = to_number(info["launch"] or launch, int)

    dossier = pick(row, "Dossier", "Ficha") or f"SNK-{index:03d}"

    record = {
        "id": existing_ids.get(normalize(name), fallback_id),
        "name": name,
        "museumName": museum_name,
        "country": COUNTRIES.get(pick(row, "Country", "Pais"), pick(row, "Country", "Pais")),
        "city": pick(row, "City / Town", "City", "Ciudad"),
        "vesselType": vessel_type,
        "propulsion": pick(row, "Group", "Propulsion", "Propulsion "),
        "origin": COUNTRIES.get(origin, origin),
        "launchYear": year,
        "latitude": to_number(pick(row, "Latitude", "Lat")),
        "longitude": to_number(pick(row, "Longitude", "Lng", "Lon")),
        "address": address,
        "website": pick(row, "URL", "Website"),
        "mediaUrl": pick(row, "Video", "Video URL"),
        "validation": "validated" if normalize(pick(row, "Estado", "Status")) == "validado" else "pending",
        "source": "Submarinos Museos (published Sheet)",
        "notes": pick(row, "Estado", "Status"),
        "dossier": dossier,
        "situation": pick_situation(row),
        "featured": normalize(pick(row, "Featured", "Destacado")) in {"true", "si", "sí", "1", "x"},
    }

    parts_en, parts_es = [], []
    if museum_name:
        parts_en.append(f"Museum: {museum_name}.")
        parts_es.append(f"Museo: {museum_name}.")
    if vessel_type:
        parts_en.append(f"Vessel type: {vessel_type}.")
        parts_es.append(f"Tipo de buque: {vessel_type}.")
    if origin:
        parts_en.append(f"Origin: {origin}.")
        parts_es.append(f"Origen: {origin}.")
    if year:
        parts_en.append(f"Launched: {year}.")
        parts_es.append(f"Botado: {year}.")
    if address:
        parts_en.append(f"Address: {address}.")
        parts_es.append(f"Dirección: {address}.")

    record["description"] = {
        "en": " ".join(parts_en) or "Information to be validated.",
        "es": " ".join(parts_es) or "Información a validar.",
    }

    return record


def load_existing() -> tuple[list[dict], dict[str, str]]:
    if not DATASET.exists():
        return [], {}

    data = json.loads(DATASET.read_text(encoding="utf-8"))
    index = {normalize(item.get("name", "")): item["id"] for item in data if item.get("id")}
    return data, index


def fetch_rows() -> list[dict[str, str]]:
    request = urllib.request.Request(POINTS_URL, headers={"User-Agent": "ISA-sync/1.0"})

    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read().decode("utf-8-sig")

    return list(csv.DictReader(io.StringIO(payload)))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="compare without writing")
    args = parser.parse_args()

    existing, known_ids = load_existing()

    try:
        rows = fetch_rows()
    except Exception as error:  # noqa: BLE001
        print(f"No se pudo leer la Sheet publicada: {error}")
        return 1

    records = [
        build_record(row, index, f"MUS-ROW-{index:03d}", known_ids)
        for index, row in enumerate(rows, start=1)
    ]

    # Keep readable, stable identifiers for new rows.
    used = {record["id"] for record in records}
    for record in records:
        if record["id"].startswith("MUS-ROW-"):
            slug = re.sub(r"[^A-Z0-9]+", "-", record["name"].upper()).strip("-")[:24]
            candidate = f"MUS-{slug or 'UNKNOWN'}"
            while candidate in used:
                candidate += "-X"
            record["id"] = candidate
            used.add(candidate)

    if "U-995" in {record["name"] for record in records}:
        for record in records:
            if record["name"] == "U-995":
                record["id"] = "MUS-U995"

    names = {record["name"] for record in records}
    previous = {item["name"] for item in existing}

    print(f"Sheet rows: {len(rows)}")
    print(f"Dataset actual: {len(existing)} museos")
    print(f"Nuevos: {len(names - previous)} · Faltantes: {len(previous - names)}")
    print(f"Sin coordenadas: {sum(1 for r in records if r['latitude'] is None or r['longitude'] is None)}")
    print(f"Validados: {sum(1 for r in records if r['validation'] == 'validated')}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    DATASET.parent.mkdir(parents=True, exist_ok=True)
    DATASET.write_text(json.dumps(records, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Escrito: {DATASET.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
