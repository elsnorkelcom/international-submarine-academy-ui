# -*- coding: utf-8 -*-
"""Genera salidas/banco_cobre.xlsx a partir de salidas/banco_cobre.csv (o del provisional).

Usa openpyxl del entorno de dependencias del workspace. No modifica el CSV.
"""

from __future__ import annotations

import csv
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

BASE = Path(__file__).resolve().parents[1]
SALIDAS = BASE / "salidas"
CSV_CANDIDATES = [SALIDAS / "banco_cobre.csv", SALIDAS / "banco_cobre_stem_provisional.csv"]

HEADER_FILL = PatternFill("solid", fgColor="1F3864")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=10)
SUB_FILL = PatternFill("solid", fgColor="D9E2F3")
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

COLUMN_NOTES = {
    "id": "Identificador estable de la pregunta",
    "kind": "STEM o FH",
    "season_id": "SEA-COPPER (Cobre = Nivel 1)",
    "specialty_id": "MAQ, ELE, ELN, NAV, LOG; FH usa la especialidad sugerida",
    "discipline_id": "SCI, TEC, ING, MAT; FH usa HUM",
    "cell_code": "CU-<DISC>-<ESP> para STEM; FH-<ESP>-<nn> para FH",
    "cell_index": "1–20 para STEM; 1–15 para FH",
    "variant_index": "1–3 para STEM; 1 en FH (pregunta única)",
    "question_es": "Enunciado en español",
    "question_en": "Enunciado en inglés",
    "option_a_es": "Opción A en español",
    "option_a_en": "Opción A en inglés",
    "option_b_es": "Opción B en español",
    "option_b_en": "Opción B en inglés",
    "option_c_es": "Opción C en español",
    "option_c_en": "Opción C en inglés",
    "option_d_es": "Opción D en español",
    "option_d_en": "Opción D en inglés",
    "correct_option_id": "A, B, C o D",
    "feedback_es": "Feedback en español: concepto y error del distractor",
    "feedback_en": "Feedback en inglés",
    "compartment_id": "CMP-PROA, CMP-CONTROL, CMP-BATERIAS-LOGISTICA, CMP-MAQUINAS, CMP-POPA, CMP-TRANSVERSAL",
    "system_ids": "IDs SYS-<código del CSV>, separados por ;",
    "timss_cycle": "2011",
    "timss_item_id": "ID de la referencia TIMSS (STEM); vacío en FH",
    "timss_item_title": "Título original del pool TIMSS",
    "timss_content_domain": "Dominio · subdominio del pool",
    "timss_cognitive_domain": "Knowing",
    "reference_relation": "Cómo se adapta el concepto (no literal)",
    "source_basis": "Ciclo, ítem, concepto y sistema de anclaje",
    "reuse_group": "RG-<timss_item_id>",
    "justification_es": "Por qué la referencia y el sistema encajan en la celda",
    "confidence": "alta / media / revisar",
    "status": "propuesta (validación humana pendiente)",
}


def load_rows() -> tuple[Path, list[dict]]:
    for path in CSV_CANDIDATES:
        if path.exists():
            with path.open(encoding="utf-8-sig", newline="") as handle:
                return path, list(csv.DictReader(handle))
    raise SystemExit("No hay CSV del banco.")


def style_header(ws, row: int = 1) -> None:
    for cell in ws[row]:
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER


def write_table(ws, rows: list[dict], columns: list[str]) -> None:
    ws.append(columns)
    style_header(ws)
    for row in rows:
        values = []
        for col in columns:
            value = row.get(col, "")
            if col in {"cell_index", "variant_index", "timss_cycle"} and str(value).strip():
                try:
                    value = int(value)
                except ValueError:
                    pass
            values.append(value)
        ws.append(values)
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(columns))}{ws.max_row}"
    widths = {
        "id": 34, "question_es": 60, "question_en": 60,
        "feedback_es": 55, "feedback_en": 55, "justification_es": 45,
        "reference_relation": 45, "source_basis": 55, "system_ids": 28,
        "timss_item_title": 42, "timss_content_domain": 38,
    }
    for index, col in enumerate(columns, start=1):
        ws.column_dimensions[get_column_letter(index)].width = widths.get(col, 16)
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = BORDER


def main() -> None:
    path, rows = load_rows()
    columns = list(rows[0].keys())
    stem = [r for r in rows if r["kind"] == "STEM"]
    fh = [r for r in rows if r["kind"] == "FH"]

    wb = Workbook()
    readme = wb.active
    readme.title = "LEEME"
    readme["A1"] = "ISA · Banco de preguntas de Cobre"
    readme["A1"].font = Font(bold=True, size=16, color="1F3864")
    lines = [
        "",
        "Temporada Cobre (Nivel 1) · dominio cognitivo Knowing · TIMSS 2011 grado 8 como referencia de conocimiento previo.",
        "Público: todo público. No se declara nivel ni edad.",
        f"Fecha: 9 de noviembre de 2026 · Estado: propuesta para revisión humana.",
        "",
        f"Filas totales: {len(rows)} · STEM: {len(stem)} · FH: {len(fh)}",
        f"Archivo fuente: {path.name}",
        "",
        "Hojas:",
        "  · Banco: todas las filas, todas las columnas.",
        "  · STEM: 20 celdas × 3 variantes.",
        "  · FH: 15 temas de Factor Humano.",
        "  · Claves: distribución de respuestas correctas.",
        "  · Columnas: definición de cada columna.",
        "",
        "Criterios: una sola respuesta correcta; distractores plausibles; feedback que explica el error;",
        "ES/EN equivalentes; sin contenido bélico; sin campo 'nivel'.",
    ]
    for offset, text in enumerate(lines, start=2):
        readme[f"A{offset}"] = text
    readme.column_dimensions["A"].width = 130

    banco = wb.create_sheet("Banco")
    write_table(banco, rows, columns)

    stem_ws = wb.create_sheet("STEM")
    write_table(stem_ws, stem, columns)

    fh_ws = wb.create_sheet("FH")
    write_table(fh_ws, fh, columns)

    claves = wb.create_sheet("Claves")
    claves.append(["Especialidad", "A", "B", "C", "D", "Total"])
    style_header(claves)
    specialties = ["MAQ", "ELE", "ELN", "NAV", "LOG"]
    for esp in specialties:
        sub = [r for r in rows if r["specialty_id"] == esp]
        claves.append([esp] + [sum(1 for r in sub if r["correct_option_id"] == k) for k in "ABCD"] + [len(sub)])
    claves.append(["FH"] + [sum(1 for r in fh if r["correct_option_id"] == k) for k in "ABCD"] + [len(fh)])
    claves.append(["TOTAL"] + [sum(1 for r in rows if r["correct_option_id"] == k) for k in "ABCD"] + [len(rows)])
    for row in claves.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(horizontal="center")
            cell.border = BORDER
    for index, width in enumerate([16, 8, 8, 8, 8, 8], start=1):
        claves.column_dimensions[get_column_letter(index)].width = width

    cols = wb.create_sheet("Columnas")
    cols.append(["Columna", "Definición"])
    style_header(cols)
    for col in columns:
        cols.append([col, COLUMN_NOTES.get(col, "")])
    cols.column_dimensions["A"].width = 26
    cols.column_dimensions["B"].width = 90
    for row in cols.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = BORDER

    out = SALIDAS / "banco_cobre.xlsx"
    wb.save(out)
    print(f"Escrito: {out} · filas: {len(rows)} (STEM {len(stem)} / FH {len(fh)})")


if __name__ == "__main__":
    main()
