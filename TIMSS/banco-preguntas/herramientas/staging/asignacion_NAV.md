# Asignación Fase B — NAV

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/NAV.json`.

Especialidad **NAV**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).


## CU-SCI-NAV · cell_index 13 · disciplina SCI · tema: presión, estanqueidad y compartimentación
- Compartimento: `CMP-TRANSVERSAL` · Sistemas: SYS-S.1 Mamparos Estancos; SYS-5.3.2 Sello del Eje; SYS-S.2 Escotillas de Rescate
- variante 1 · ref `S032158` · concepto a adaptar: calor y presión de un gas en recinto cerrado · **clave correcta: A**
- variante 2 · ref `S052165A` · concepto a adaptar: energía potencial de una columna de agua · **clave correcta: B**
- variante 3 · ref `S052165B` · concepto a adaptar: energía cinética de un chorro a presión · **clave correcta: C**

## CU-TEC-NAV · cell_index 14 · disciplina TEC · tema: flotar, sumergir y trimar
- Compartimento: `CMP-CONTROL` · Sistemas: SYS-1.3 Tanques de Inundación; SYS-5.3.1 Tanques de Trimado; SYS-2.4.2 Panel de Inmersión
- variante 1 · ref `M042235` · concepto a adaptar: sistema 2x2 para repartir lastre entre proa y popa · **clave correcta: D**
- variante 2 · ref `M032419` · concepto a adaptar: suma de volúmenes representada por áreas · **clave correcta: A**
- variante 3 · ref `M042077` · concepto a adaptar: propiedad distributiva al repartir en tanques iguales · **clave correcta: B**

## CU-ING-NAV · cell_index 15 · disciplina ING · tema: forma, ruido y movimiento
- Compartimento: `CMP-POPA` · Sistemas: SYS-5.1.3 Hélice de Bajo Ruido; SYS-5.2.1 Timón de Dirección; SYS-5.3.3 Recubrimiento Anecoico
- variante 1 · ref `M032734` · concepto a adaptar: vista en planta de una forma · **clave correcta: C**
- variante 2 · ref `M042152` · concepto a adaptar: giro de media vuelta: cambio de rumbo · **clave correcta: D**
- variante 3 · ref `M042236` · concepto a adaptar: no sumar magnitudes de distinta potencia · **clave correcta: A**

## CU-MAT-NAV · cell_index 16 · disciplina MAT · tema: profundidad, carta y geometría del fondo
- Compartimento: `CMP-CONTROL` · Sistemas: SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda
- variante 1 · ref `S032151` · concepto a adaptar: mareas y nivel de referencia de la carta · **clave correcta: B**
- variante 2 · ref `S042141` · concepto a adaptar: relieve volcánico del fondo representado en la carta · **clave correcta: C**
- variante 3 · ref `M042169B` · concepto a adaptar: mediana de sondajes para descartar un valor atípico · **clave correcta: D**

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
