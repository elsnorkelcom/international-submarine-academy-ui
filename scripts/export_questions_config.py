#!/usr/bin/env python3
"""
Exporta los reactivos curados a la sección `questions` de isa-config.json.

Fuente: TIMSS/curated/reactivos_timss_isa_knowing_curated.csv
Salida: lib/data/datasets/isa-config.json (sección questions)

Los reactivos están en español y su traducción al inglés está pendiente, así que
se copian a `en` y `es` con una nota explícita y estado `review`. No se aprueba
ninguno: la importación no cambia el estado editorial de la fuente.

Uso:
    python scripts/export_questions_config.py --check
    python scripts/export_questions_config.py
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "TIMSS" / "curated" / "reactivos_timss_isa_knowing_curated.csv"
CONFIG = ROOT / "lib" / "data" / "datasets" / "isa-config.json"

LETTERS = ["A", "B", "C", "D"]
NOTE = "Reactivo en español; traducción al inglés pendiente. Estado editorial sin cambios."


def clean(value: str) -> str:
    return (value or "").strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if not SOURCE.exists():
        print(f"No existe {SOURCE}")
        return 1

    rows = list(csv.DictReader(SOURCE.open(encoding="utf-8-sig", newline="")))
    questions = []
    problems = []

    for index, row in enumerate(rows, start=2):
        item_id = clean(row.get("ID propuesto"))
        text = clean(row.get("Pregunta"))
        correct = clean(row.get("Respuesta correcta")).upper()

        if not item_id or not text:
            problems.append(f"L{index}: falta id o pregunta")
            continue

        if correct not in LETTERS:
            problems.append(f"L{index}: respuesta '{correct}' inválida")
            continue

        options = {}
        for letter in LETTERS:
            value = clean(row.get(f"Opción {letter}"))
            if not value:
                problems.append(f"L{index}: opción {letter} vacía")
                break
            options[letter] = {"en": value, "es": value}
        else:
            questions.append(
                {
                    "id": item_id,
                    "textEn": text,
                    "textEs": text,
                    "missionId": "",
                    "episodeId": "",
                    "museumId": "",
                    "compartmentId": "",
                    "equipmentId": "",
                    "area": clean(row.get("Área")),
                    "timssDomain": "knowing",
                    "gsaCompetency": "",
                    "topic": clean(row.get("Tema")),
                    "level": clean(row.get("Nivel")),
                    "options": options,
                    "correctOptionId": correct,
                    "feedbackEn": clean(row.get("Retroalimentación")),
                    "feedbackEs": clean(row.get("Retroalimentación")),
                    "civilEn": "",
                    "civilEs": "",
                    "source": clean(row.get("Fuente utilizada")),
                    "status": "review",
                    "notes": NOTE,
                }
            )

    if problems:
        print("Errores:")
        for problem in problems[:20]:
            print(f"  - {problem}")
        return 1

    print(f"Reactivos preparados: {len(questions)}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    config = json.loads(CONFIG.read_text(encoding="utf-8")) if CONFIG.exists() else {"version": 2}
    existing = config.get("questions") or []
    by_id = {item["id"]: item for item in questions}

    # Conserva las preguntas del piloto (las que tienen misión) y suma las nuevas.
    merged = [q for q in existing if q.get("missionId")] + list(by_id.values())
    config["questions"] = merged
    config["version"] = 2

    CONFIG.write_text(json.dumps(config, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Escrito: {CONFIG.relative_to(ROOT)} · preguntas totales: {len(merged)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
