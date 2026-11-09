# -*- coding: utf-8 -*-
"""Genera las asignaciones de la Fase B (60 STEM) para cada especialidad.

Lee la propuesta de curaduría (fijada en este script, revisada por el Lead) y escribe
un archivo de asignación por especialidad en herramientas/staging/.
"""

from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
STAGING = BASE / "herramientas" / "staging"
STAGING.mkdir(parents=True, exist_ok=True)

# cell_code: (cell_index, especialidad, disciplina, tema, compartimento, sistemas, [(variant, ref, concepto, clave)])
CELLS = {
    "CU-SCI-MAQ": (1, "MAQ", "SCI", "calor y combustión en la sala de máquinas", "CMP-MAQUINAS",
        "SYS-4.1.1 Motores Diésel; SYS-4.1.2 Esmórquel; SYS-4.1.3 Escape de Gases",
        [(1, "S052046", "condiciones de la combustión (comburente y calor)", "A"),
         (2, "S042100", "evidencias observables de un cambio químico", "B"),
         (3, "S042073", "composición química de un gas de escape y su fórmula", "C")]),
    "CU-TEC-MAQ": (2, "MAQ", "TEC", "presión y energía acumulada en el circuito hidráulico", "CMP-MAQUINAS",
        "SYS-4.2.1 Bombas Principales; SYS-4.2.2 Acumuladores",
        [(1, "M032538", "sustituir valores en una fórmula de presión", "D"),
         (2, "M042103", "desigualdad como umbral operativo del acumulador", "A"),
         (3, "M042226", "sistema de ecuaciones para repartir presión entre dos ramas", "B")]),
    "CU-ING-MAQ": (3, "MAQ", "ING", "caudal, achique y compresión", "CMP-MAQUINAS",
        "SYS-4.3.1 Bombas de Achique; SYS-4.3.2 Compresores de Aire",
        [(1, "M052302", "caudal como cociente volumen/tiempo", "C"),
         (2, "S042272", "al comprimir y enfriar, el vapor condensa", "D"),
         (3, "M032166", "estimación de orden de magnitud del caudal", "A")]),
    "CU-MAT-MAQ": (4, "MAQ", "MAT", "medición, mezclas y mantenimiento", "CMP-MAQUINAS",
        "SYS-4.3.3 Separadores de Aceite; SYS-4.3.1 Bombas de Achique",
        [(1, "M042169A", "media de varias mediciones de contaminación", "B"),
         (2, "M032094", "valor posicional en una lectura decimal", "C"),
         (3, "M052231", "acumulación de lecturas decimales en un registro", "D")]),

    "CU-SCI-ELE": (5, "ELE", "SCI", "la química que guarda energía: baterías", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.1.1 Bancos de Baterías",
        [(1, "S042076", "composición atómica de la molécula del electrolito", "A"),
         (2, "S042306", "compuesto: átomos de elementos distintos combinados", "B"),
         (3, "S042112", "proceso que absorbe energía durante la carga", "C")]),
    "CU-TEC-ELE": (6, "ELE", "TEC", "convertir y distribuir la energía", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.1.2 Conversores AC/DC; SYS-5.1.1 Motor Eléctrico (MEP)",
        [(1, "S032024", "cadena de conversiones de energía", "D"),
         (2, "M042032", "rendimiento expresado como fracción equivalente", "A"),
         (3, "M032681A", "lectura de un gráfico de carga y consumo en el tiempo", "B")]),
    "CU-ING-ELE": (7, "ELE", "ING", "seguridad de gases y ventilación", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.1.3 Ventilación de Gases",
        [(1, "M042059", "concentración de hidrógeno expresada como porcentaje", "C"),
         (2, "M032477", "relación lineal: caudal base más término proporcional", "D"),
         (3, "M052214", "igualdad numérica: el caudal que entra iguala al que sale", "A")]),
    "CU-MAT-ELE": (8, "ELE", "MAT", "autonomía, potencia y rendimiento", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.1.1 Bancos de Baterías; SYS-5.1.1 Motor Eléctrico (MEP)",
        [(1, "M032725", "fracción mixta a decimal: autonomía en horas", "B"),
         (2, "M032295", "expresión algebraica de un total: potencia por tiempo", "C"),
         (3, "M032738", "orden de operaciones al evaluar la fórmula de consumo", "D")]),

    "CU-SCI-ELN": (9, "ELN", "SCI", "ondas que exploran: sonar", "CMP-PROA",
        "SYS-1.1.1 Sonar Pasivo; SYS-1.1.2 Sonar Activo; SYS-1.1.3 Arreglo de Flanco",
        [(1, "S042274", "la velocidad de una onda depende del medio", "A"),
         (2, "S052207", "densidad del medio y propagación del sonido", "B"),
         (3, "S052297", "burbujas de gas como fuente de sonido", "C")]),
    "CU-TEC-ELN": (10, "ELN", "TEC", "ver sin ventanas: periscopio y mástil optrónico", "CMP-CONTROL",
        "SYS-2.1.1 Periscopio de observación; SYS-2.1.2 Periscopio de búsqueda; SYS-2.1.3 Mástil Optrónico",
        [(1, "M032397", "composición de transformaciones: reflexión y giro", "D"),
         (2, "M042150", "eje de simetría e imagen especular", "A"),
         (3, "M032679", "desarrollo plano de un cuerpo: el prisma", "B")]),
    "CU-ING-ELN": (11, "ELN", "ING", "comunicar bajo el agua y desde la superficie", "CMP-CONTROL",
        "SYS-2.3.1 Antena HF/VHF; SYS-2.3.2 Antena de Satélite; SYS-2.3.3 Teléfono Submarino",
        [(1, "S032160", "cuerpos que orbitan: satélites alrededor de la Tierra", "C"),
         (2, "M032673", "intervalo de valores admisibles: ventana de frecuencias", "D"),
         (3, "M042198A", "regularidad y patrón: periodicidad de los pulsos", "A")]),
    "CU-MAT-ELN": (12, "ELN", "MAT", "orientación y medida: giroscopio, carta y ecosonda", "CMP-CONTROL",
        "SYS-2.2.1 Giroscopio Láser; SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda",
        [(1, "M042024", "ubicar una medida en una escala graduada", "B"),
         (2, "M032683", "suma de fracciones con distinto denominador: tiempos de rumbo", "C"),
         (3, "M052216", "equivalencia entre fracción y decimal en unidades de medida", "D")]),

    "CU-SCI-NAV": (13, "NAV", "SCI", "presión, estanqueidad y compartimentación", "CMP-TRANSVERSAL",
        "SYS-S.1 Mamparos Estancos; SYS-5.3.2 Sello del Eje; SYS-S.2 Escotillas de Rescate",
        [(1, "S032158", "calor y presión de un gas en recinto cerrado", "A"),
         (2, "S052165A", "energía potencial de una columna de agua", "B"),
         (3, "S052165B", "energía cinética de un chorro a presión", "C")]),
    "CU-TEC-NAV": (14, "NAV", "TEC", "flotar, sumergir y trimar", "CMP-CONTROL",
        "SYS-1.3 Tanques de Inundación; SYS-5.3.1 Tanques de Trimado; SYS-2.4.2 Panel de Inmersión",
        [(1, "M042235", "sistema 2x2 para repartir lastre entre proa y popa", "D"),
         (2, "M032419", "suma de volúmenes representada por áreas", "A"),
         (3, "M042077", "propiedad distributiva al repartir en tanques iguales", "B")]),
    "CU-ING-NAV": (15, "NAV", "ING", "forma, ruido y movimiento", "CMP-POPA",
        "SYS-5.1.3 Hélice de Bajo Ruido; SYS-5.2.1 Timón de Dirección; SYS-5.3.3 Recubrimiento Anecoico",
        [(1, "M032734", "vista en planta de una forma", "C"),
         (2, "M042152", "giro de media vuelta: cambio de rumbo", "D"),
         (3, "M042236", "no sumar magnitudes de distinta potencia", "A")]),
    "CU-MAT-NAV": (16, "NAV", "MAT", "profundidad, carta y geometría del fondo", "CMP-CONTROL",
        "SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda",
        [(1, "S032151", "mareas y nivel de referencia de la carta", "B"),
         (2, "S042141", "relieve volcánico del fondo representado en la carta", "C"),
         (3, "M042169B", "mediana de sondajes para descartar un valor atípico", "D")]),

    "CU-SCI-LOG": (17, "LOG", "SCI", "el aire que se respira", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.2.1 Generador de Oxígeno; SYS-3.2.2 Scrubber de CO2",
        [(1, "S032611", "respiración celular: obtener energía", "A"),
         (2, "S042024", "ecuación de la respiración", "B"),
         (3, "S042261", "funciones vitales que cubre el soporte vital", "C")]),
    "CU-TEC-LOG": (18, "LOG", "TEC", "temperatura y humedad a bordo", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.2.3 Climatización",
        [(1, "S042238A", "ubicación del sensor para una medida representativa", "D"),
         (2, "S042272", "al enfriar, el vapor condensa", "A"),
         (3, "S032530Z", "condiciones de humedad y temperatura para conservar víveres", "B")]),
    "CU-ING-LOG": (19, "LOG", "ING", "agua potable, residuos y cocina", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora; SYS-3.3.3 Eyector de Basura",
        [(1, "S042095", "neutralización: ajustar el pH del agua tratada", "C"),
         (2, "S032510", "qué residuo se degrada más rápido", "D"),
         (3, "S032463", "el agua disuelve y transporta sustancias", "A")]),
    "CU-MAT-LOG": (20, "LOG", "MAT", "víveres, proporciones y autonomía", "CMP-BATERIAS-LOGISTICA",
        "SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora",
        [(1, "M032132", "probabilidad sin reposición al muestrear un lote", "B"),
         (2, "M032626", "factores y divisores para agrupar en partes iguales", "C"),
         (3, "S032645", "la energía de los alimentos proviene del sol", "D")]),
}

TEMPLATE = """# Asignación Fase B — __ESP__

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/__ESP__.json`.

Especialidad **__ESP__**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).

__BODY__

## Formato del JSON (array de 12 objetos, exactamente estas claves)

```json
[
  {
    "id": "COB-STEM-CU-SCI-MAQ-1",
    "kind": "STEM",
    "season_id": "SEA-COPPER",
    "specialty_id": "MAQ",
    "discipline_id": "SCI",
    "cell_code": "CU-SCI-MAQ",
    "cell_index": 1,
    "variant_index": 1,
    "question_es": "…",
    "question_en": "…",
    "option_a_es": "…", "option_a_en": "…",
    "option_b_es": "…", "option_b_en": "…",
    "option_c_es": "…", "option_c_en": "…",
    "option_d_es": "…", "option_d_en": "…",
    "correct_option_id": "A",
    "feedback_es": "…",
    "feedback_en": "…",
    "compartment_id": "CMP-MAQUINAS",
    "system_ids": "SYS-4.1.1; SYS-4.1.2",
    "timss_cycle": 2011,
    "timss_item_id": "S052046",
    "timss_item_title": "(copiar del pool)",
    "timss_content_domain": "(copiar del pool: dominio · subdominio)",
    "timss_cognitive_domain": "Knowing",
    "reference_relation": "concepto adaptado: … → …",
    "source_basis": "TIMSS 2011 G8 Science, ítem S052046 (liberado); concepto: …; sistema: Motores Diésel (4.1.1)",
    "reuse_group": "RG-S052046",
    "justification_es": "…",
    "confidence": "alta",
    "status": "propuesta"
  }
]
```



- 4 opciones plausibles, una sola correcta, sin "todas/ninguna"; longitudes parecidas.
- Feedback ES y EN que explique el concepto y por qué el distractor es un error.
- Cero términos de armas, conflicto, instituciones de fuerza o eufemismos. Los nombres de sistemas van neutralizados (periscopio de observación, no "de ataque").
- No copiar ni traducir el ítem TIMSS: adaptar el concepto al sistema.
- `timss_item_title` y `timss_content_domain` se toman del pool (no inventar).
- `source_basis` = "TIMSS 2011 G8 Science/Math, ítem <ID> (liberado); concepto: <...>; sistema: <nombre> (<código>)".
- `reuse_group` = "RG-<ID>". `status` = "propuesta". `confidence`: alta / media / revisar.
- Devolvé además, en el mensaje final, un resumen breve de las 12 y de cualquier duda.
"""


def body_for(esp: str) -> str:
    out = []
    for code, (idx, cell_esp, disc, tema, comp, systems, rows) in CELLS.items():
        if cell_esp != esp:
            continue
        out.append(f"\n## {code} · cell_index {idx} · disciplina {disc} · tema: {tema}")
        out.append(f"- Compartimento: `{comp}` · Sistemas: {systems}")
        for variant, ref, concepto, key in rows:
            out.append(f"- variante {variant} · ref `{ref}` · concepto a adaptar: {concepto} · **clave correcta: {key}**")
    return "\n".join(out)


for esp in ["MAQ", "ELE", "ELN", "NAV", "LOG"]:
    path = STAGING / f"asignacion_{esp}.md"
    path.write_text(TEMPLATE.replace("__ESP__", esp).replace("__BODY__", body_for(esp)), encoding="utf-8")
    print("escrito:", path.name)

print("celdas:", len(CELLS), "preguntas:", sum(len(v[6]) for v in CELLS.values()))
