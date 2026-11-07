#!/usr/bin/env python3
"""
Genera la spreadsheet base de ISA a partir de docs/22_MODELO_DATOS_SHEET.md.

Salida: templates/ISA_Base.xlsx — una pestaña por componente, con encabezados en
snake_case, comentarios de cabecera (tipo, requerido, default, notas) y listas
desplegables para los campos enum.

Uso:
    python scripts/build_sheet_base.py
    python scripts/build_sheet_base.py --check
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs" / "22_MODELO_DATOS_SHEET.md"
OUTPUT = ROOT / "templates" / "ISA_Base.xlsx"

SECTION_RE = re.compile(r"^### 5\.(\d+) `([^`]+)`", re.M)
ROW_RE = re.compile(r"^\| `([^`]+)` \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ?([^|]*)\|?")

HEADER_FILL = PatternFill("solid", fgColor="0B1622")
HEADER_FONT = Font(color="E6EDF3", bold=True)


def parse_model() -> list[dict]:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    sections: list[dict] = []
    current: dict | None = None

    for line in lines:
        match = SECTION_RE.match(line)

        if match:
            current = {"order": int(match.group(1)), "tab": match.group(2).strip(), "fields": []}
            sections.append(current)
            continue

        if line.startswith("### 5.18"):
            current = None
            continue

        if current is None:
            continue

        row = ROW_RE.match(line.strip())

        if row:
            current["fields"].append(
                {
                    "name": row.group(1).strip(),
                    "type": row.group(2).strip(),
                    "required": row.group(3).strip(),
                    "default": row.group(4).strip(),
                    "bilingual": row.group(5).strip(),
                    "notes": row.group(6).strip(),
                }
            )

    return [section for section in sections if section["fields"]]


def enum_values(field: dict) -> list[str]:
    if "enum" not in field["type"]:
        return []

    found: list[str] = []
    text = f"{field['notes']} {field['default']}"

    for value in re.findall(r"`([^`]+)`", text):
        value = value.strip()
        if value and value.lower() not in {"null", "—", "-"} and value not in found:
            found.append(value)

    return found


def build(sections: list[dict]) -> Workbook:
    workbook = Workbook()
    cover = workbook.active
    cover.title = "LEEME"

    cover["A1"] = "ISA — Base de datos del proyecto"
    cover["A1"].font = Font(size=16, bold=True)
    cover["A2"] = (
        "Generado desde docs/22_MODELO_DATOS_SHEET.md. Una pestaña por componente. "
        "Los encabezados son técnicos (snake_case); cada celda de cabecera tiene una nota "
        "con tipo, obligatoriedad, valor por defecto y observaciones."
    )
    cover["A2"].alignment = Alignment(wrap_text=True)
    cover.merge_cells("A2:F2")
    cover.row_dimensions[2].height = 60

    cover["A4"] = "Pestaña"
    cover["B4"] = "Columnas"
    cover["C4"] = "Propósito"
    for cell in ("A4", "B4", "C4"):
        cover[cell].font = Font(bold=True)

    row_index = 5

    for section in sections:
        cover[f"A{row_index}"] = section["tab"]
        cover[f"B{row_index}"] = len(section["fields"])
        cover[f"C{row_index}"] = "Editable" if section["order"] < 15 else "Append-only / futuro"
        row_index += 1

    cover[f"A{row_index + 1}"] = "Reglas"
    cover[f"A{row_index + 1}"].font = Font(bold=True)
    rules = [
        "Una fila por registro; el ID nunca cambia una vez publicado.",
        "Los campos _en y _es deben existir juntos cuando el campo es bilingüe.",
        "No escribir fórmulas ni datos personales en hojas publicadas.",
        "Los estados con lista desplegable se validan también en el script de sync.",
    ]
    for offset, rule in enumerate(rules, start=2):
        cover[f"A{row_index + offset}"] = f"• {rule}"

    for column, width in (("A", 26), ("B", 12), ("C", 46)):
        cover.column_dimensions[column].width = width

    for section in sections:
        sheet = workbook.create_sheet(section["tab"][:31])

        for position, field in enumerate(section["fields"], start=1):
            cell = sheet.cell(row=1, column=position, value=field["name"])
            cell.fill = HEADER_FILL
            cell.font = HEADER_FONT
            cell.comment = Comment(
                f"tipo: {field['type']}\n"
                f"requerido: {field['required']}\n"
                f"default: {field['default']}\n"
                f"bilingüe: {field['bilingual']}\n"
                f"{field['notes']}".strip(),
                "ISA",
            )
            sheet.column_dimensions[cell.column_letter].width = max(14, min(38, len(field["name"]) + 6))

            values = enum_values(field)

            if values:
                validation = DataValidation(
                    type="list",
                    formula1='"' + ",".join(value.replace('"', "") for value in values[:60]) + '"',
                    allow_blank=True,
                )
                validation.error = "Valor fuera de la lista permitida."
                validation.errorTitle = "Valor inválido"
                validation.prompt = "Valores permitidos: " + ", ".join(values)
                validation.promptTitle = field["name"]
                sheet.add_data_validation(validation)
                validation.add(f"{cell.column_letter}2:{cell.column_letter}2000")

        sheet.freeze_panes = "A2"

    return workbook


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if not SOURCE.exists():
        print(f"No existe {SOURCE}")
        return 1

    sections = parse_model()

    if not sections:
        print("No se pudo extraer ninguna tabla del modelo.")
        return 1

    print(f"Componentes: {len(sections)}")
    for section in sections:
        print(f"  - {section['tab']}: {len(section['fields'])} columnas")

    total = sum(len(section["fields"]) for section in sections)
    print(f"Columnas totales: {total}")

    if args.check:
        print("Modo --check: no se escribió nada.")
        return 0

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    build(sections).save(OUTPUT)
    print(f"Escrito: {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
