# -*- coding: utf-8 -*-
"""Últimos ajustes de longitud de opciones detectados por qc_stem."""

from __future__ import annotations

import json
from pathlib import Path

STAGING = Path(__file__).resolve().parents[1] / "herramientas" / "staging"

PATCHES = {
    "ELN": {
        "COB-STEM-CU-SCI-ELN-2": {
            "option_b_es": "Porque el agua es menos compresible y transmite mejor la vibración.",
            "option_b_en": "Because water is far less compressible and passes the vibration faster.",
        },
    },
    "LOG": {
        "COB-STEM-CU-SCI-LOG-2": {
            "option_a_es": "Oxígeno y agua sobrantes.",
            "option_a_en": "Oxygen and leftover water.",
            "option_b_es": "Dióxido de carbono y agua.",
            "option_b_en": "Carbon dioxide and water.",
            "option_c_es": "Nitrógeno y vapor de agua.",
            "option_c_en": "Nitrogen and water vapour.",
            "option_d_es": "Sales minerales y agua.",
            "option_d_en": "Mineral salts and water.",
        },
        "COB-STEM-CU-TEC-LOG-2": {
            "option_a_en": "High humidity and corrosion of the electronics.",
            "option_b_en": "The cooling coil freezing up completely.",
            "option_c_en": "The compartment's carbon dioxide rising.",
            "option_d_en": "The refrigerant circuit pressure dropping.",
        },
    },
    "NAV": {
        "COB-STEM-CU-SCI-NAV-1": {
            "option_a_es": "Sube, porque los choques moleculares son más frecuentes y fuertes.",
            "option_a_en": "It rises, because molecular collisions are more frequent and stronger.",
            "option_b_es": "Baja, porque el aire se expande al calentarse y ocupa más.",
            "option_b_en": "It falls, because the air expands as it warms and takes more space.",
            "option_c_es": "No cambia, porque el volumen del compartimento es constante.",
            "option_c_en": "It stays the same, because the compartment volume is constant.",
            "option_d_es": "Sube, porque las moléculas se agrandan al calentarse.",
            "option_d_en": "It rises, because the molecules grow larger as they warm up.",
        },
    },
}

for esp, items in PATCHES.items():
    path = STAGING / f"{esp}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    for item_id, fields in items.items():
        by_id[item_id].update(fields)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{esp}: {len(items)} ajuste(s)")
