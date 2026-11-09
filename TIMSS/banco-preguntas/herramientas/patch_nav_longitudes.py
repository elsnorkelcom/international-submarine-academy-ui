# -*- coding: utf-8 -*-
"""Ajuste final de longitudes en dos preguntas NAV."""

from __future__ import annotations

import json
from pathlib import Path

STAGING = Path(__file__).resolve().parents[1] / "herramientas" / "staging"

PATCHES = {
    "NAV": {
        "COB-STEM-CU-MAT-NAV-1": {
            "option_a_es": "Porque las corrientes frías modifican poco a poco el fondo marino.",
            "option_a_en": "Because cold currents slowly change the sea floor.",
            "option_b_es": "Porque el nivel del agua cambia con la marea y hay que fijar una referencia.",
            "option_b_en": "Because the water level changes with the tide, so a reference must be fixed.",
            "option_c_es": "Porque el deshielo estacional cambia la profundidad del fondo marino.",
            "option_c_en": "Because seasonal ice melt changes the depth of the sea floor.",
            "option_d_es": "Porque la presión del aire modifica la lectura de la sonda de a bordo.",
            "option_d_en": "Because air pressure changes the reading of the on-board sounder.",
        },
        "COB-STEM-CU-MAT-NAV-2": {
            "option_a_es": "Que una corriente fría depositó sedimentos en línea recta.",
            "option_a_en": "A cold current deposited sediment in a straight line.",
            "option_b_es": "Que la marea forma montes cada día en el mismo lugar.",
            "option_b_en": "The tide builds mountains every day in the same place.",
            "option_c_es": "Que se formaron en un borde donde se encuentran placas tectónicas.",
            "option_c_en": "They formed at an edge where tectonic plates meet.",
            "option_d_es": "Que el deshielo polar levantó el fondo del mar en esa zona.",
            "option_d_en": "Polar ice melt raised the sea floor in that area.",
        },
        "COB-STEM-CU-ING-NAV-2": {
            "option_a_es": "060°",
            "option_a_en": "060°",
            "option_b_es": "120°",
            "option_b_en": "120°",
            "option_c_es": "150°",
            "option_c_en": "150°",
            "option_d_es": "210°",
            "option_d_en": "210°",
        },
    }
}

for esp, items in PATCHES.items():
    path = STAGING / f"{esp}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    for item_id, fields in items.items():
        by_id[item_id].update(fields)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{esp}: {len(items)} ajuste(s)")
