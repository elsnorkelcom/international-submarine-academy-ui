# Asignación Fase B — LOG

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/LOG.json`.

Especialidad **LOG**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).


## CU-SCI-LOG · cell_index 17 · disciplina SCI · tema: el aire que se respira
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.2.1 Generador de Oxígeno; SYS-3.2.2 Scrubber de CO2
- variante 1 · ref `S032611` · concepto a adaptar: respiración celular: obtener energía · **clave correcta: A**
- variante 2 · ref `S042024` · concepto a adaptar: ecuación de la respiración · **clave correcta: B**
- variante 3 · ref `S042261` · concepto a adaptar: funciones vitales que cubre el soporte vital · **clave correcta: C**

## CU-TEC-LOG · cell_index 18 · disciplina TEC · tema: temperatura y humedad a bordo
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.2.3 Climatización
- variante 1 · ref `S042238A` · concepto a adaptar: ubicación del sensor para una medida representativa · **clave correcta: D**
- variante 2 · ref `S042272` · concepto a adaptar: al enfriar, el vapor condensa · **clave correcta: A**
- variante 3 · ref `S032530Z` · concepto a adaptar: condiciones de humedad y temperatura para conservar víveres · **clave correcta: B**

## CU-ING-LOG · cell_index 19 · disciplina ING · tema: agua potable, residuos y cocina
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora; SYS-3.3.3 Eyector de Basura
- variante 1 · ref `S042095` · concepto a adaptar: neutralización: ajustar el pH del agua tratada · **clave correcta: C**
- variante 2 · ref `S032510` · concepto a adaptar: qué residuo se degrada más rápido · **clave correcta: D**
- variante 3 · ref `S032463` · concepto a adaptar: el agua disuelve y transporta sustancias · **clave correcta: A**

## CU-MAT-LOG · cell_index 20 · disciplina MAT · tema: víveres, proporciones y autonomía
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora
- variante 1 · ref `M032132` · concepto a adaptar: probabilidad sin reposición al muestrear un lote · **clave correcta: B**
- variante 2 · ref `M032626` · concepto a adaptar: factores y divisores para agrupar en partes iguales · **clave correcta: C**
- variante 3 · ref `S032645` · concepto a adaptar: la energía de los alimentos proviene del sol · **clave correcta: D**

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
    "artifact_es": "",
    "artifact_en": "",
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
- `artifact_es` y `artifact_en` van vacíos.
- `timss_item_title` y `timss_content_domain` se toman del pool (no inventar).
- `source_basis` = "TIMSS 2011 G8 Science/Math, ítem <ID> (liberado); concepto: <...>; sistema: <nombre> (<código>)".
- `reuse_group` = "RG-<ID>". `status` = "propuesta". `confidence`: alta / media / revisar.
- Devolvé además, en el mensaje final, un resumen breve de las 12 y de cualquier duda.
