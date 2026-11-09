# -*- coding: utf-8 -*-
"""Normaliza el pool TIMSS 2011 G8 (dominio Knowing) a un CSV con encabezados.

Entrada (solo lectura):
  TIMSS/02.1.1_Banco_Reactivos_TIMSS_Conocimiento - Conocimiento.csv
  (67 filas, 7 columnas, sin encabezado formal)

Salida:
  TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv

Decisiones de normalización:
  - Se eliminan espacios de ancho cero (U+200B) y BOM residuales.
  - El dominio y subdominio vienen como "EN (ES)"; se separan en columnas en/es.
  - El dominio cognitivo viene como "Knowing (Conocimiento)"; se separa en/es.
  - Los IDs con sufijo (A/B/Z) se marcan como parte; multipart_group es el ID base.
  - percent_correct se guarda como número entero (porcentaje de acierto publicado por IEA).
  - No se corrige ni reinterpreta el contenido: es una copia fiel con encabezados.

Uso:
  python TIMSS/banco-preguntas/herramientas/normalizar_pool_timss.py
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "TIMSS" / "02.1.1_Banco_Reactivos_TIMSS_Conocimiento - Conocimiento.csv"
DST = ROOT / "TIMSS" / "banco-preguntas" / "insumos" / "01_pool_timss_67.csv"

ZERO_WIDTH = dict.fromkeys(map(ord, "\u200b\u200c\u200d\ufeff\u00a0"), None)
PAIR = re.compile(r"^(.*?)\s*\((.*)\)\s*$")


def clean(value: str) -> str:
    return (value or "").translate(ZERO_WIDTH).strip()


def split_pair(value: str) -> tuple[str, str]:
    """Devuelve (en, es) de una cadena tipo 'EN (ES)'."""
    value = clean(value)
    match = PAIR.match(value)
    if not match:
        return value, value
    return match.group(1).strip(), match.group(2).strip()


def main() -> None:
    with SRC.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.reader(handle))

    items = []
    for index, row in enumerate(rows, start=1):
        if not any(clean(cell) for cell in row):
            continue
        row = row + [""] * (7 - len(row))
        item_id = clean(row[0])
        title = clean(row[1]).replace("\u200b", "")
        domain_en, domain_es = split_pair(row[2])
        sub_en, sub_es = split_pair(row[3])
        cog_en, cog_es = split_pair(row[4])
        answer = clean(row[5])
        percent = clean(row[6]).replace("%", "")

        base = item_id[:7]
        suffix = item_id[7:] if len(item_id) > 7 else ""
        items.append(
            {
                "source_row": index,
                "timss_item_id": item_id,
                "timss_base_id": base,
                "part_letter": suffix,
                "timss_item_title_original": title,
                "content_domain_en": domain_en,
                "content_domain_es": domain_es,
                "content_subdomain_en": sub_en,
                "content_subdomain_es": sub_es,
                "cognitive_domain_en": cog_en,
                "cognitive_domain_es": cog_es,
                "answer_key_reference": answer,
                "percent_correct": percent,
            }
        )

    groups: dict[str, list[str]] = {}
    for item in items:
        groups.setdefault(item["timss_base_id"], []).append(item["timss_item_id"])
    for item in items:
        item["is_multipart"] = "si" if len(groups[item["timss_base_id"]]) > 1 else "no"
        item["multipart_group"] = (
            item["timss_base_id"] if item["part_letter"] else ""
        )

    columns = [
        "source_row",
        "timss_item_id",
        "timss_base_id",
        "part_letter",
        "is_multipart",
        "multipart_group",
        "timss_item_title_original",
        "content_domain_en",
        "content_domain_es",
        "content_subdomain_en",
        "content_subdomain_es",
        "cognitive_domain_en",
        "cognitive_domain_es",
        "answer_key_reference",
        "percent_correct",
    ]

    DST.parent.mkdir(parents=True, exist_ok=True)
    with DST.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(items)

    multipart = [i["timss_item_id"] for i in items if i["is_multipart"] == "si"]
    print(f"Escrito: {DST.relative_to(ROOT)}")
    print(f"Filas: {len(items)}")
    print(f"IDs unicos: {len({i['timss_item_id'] for i in items})}")
    print(f"Multiparte ({len(multipart)}): {', '.join(multipart)}")
    used_zwsp = sum(
        1
        for row in rows
        for cell in row
        if any(ch in cell for ch in "\u200b\u200c\u200d\ufeff\u00a0")
    )
    print(f"Celdas con caracteres invisibles limpiadas: {used_zwsp}")


if __name__ == "__main__":
    main()
