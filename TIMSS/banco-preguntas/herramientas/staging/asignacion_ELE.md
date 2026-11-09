# Asignación Fase B — ELE

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/ELE.json`.

Especialidad **ELE**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).


## CU-SCI-ELE · cell_index 5 · disciplina SCI · tema: la química que guarda energía: baterías
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.1.1 Bancos de Baterías
- variante 1 · ref `S042076` · concepto a adaptar: composición atómica de la molécula del electrolito · **clave correcta: A**
- variante 2 · ref `S042306` · concepto a adaptar: compuesto: átomos de elementos distintos combinados · **clave correcta: B**
- variante 3 · ref `S042112` · concepto a adaptar: proceso que absorbe energía durante la carga · **clave correcta: C**

## CU-TEC-ELE · cell_index 6 · disciplina TEC · tema: convertir y distribuir la energía
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.1.2 Conversores AC/DC; SYS-5.1.1 Motor Eléctrico (MEP)
- variante 1 · ref `S032024` · concepto a adaptar: cadena de conversiones de energía · **clave correcta: D**
- variante 2 · ref `M042032` · concepto a adaptar: rendimiento expresado como fracción equivalente · **clave correcta: A**
- variante 3 · ref `M032681A` · concepto a adaptar: lectura de un gráfico de carga y consumo en el tiempo · **clave correcta: B**

## CU-ING-ELE · cell_index 7 · disciplina ING · tema: seguridad de gases y ventilación
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.1.3 Ventilación de Gases
- variante 1 · ref `M042059` · concepto a adaptar: concentración de hidrógeno expresada como porcentaje · **clave correcta: C**
- variante 2 · ref `M032477` · concepto a adaptar: relación lineal: caudal base más término proporcional · **clave correcta: D**
- variante 3 · ref `M052214` · concepto a adaptar: igualdad numérica: el caudal que entra iguala al que sale · **clave correcta: A**

## CU-MAT-ELE · cell_index 8 · disciplina MAT · tema: autonomía, potencia y rendimiento
- Compartimento: `CMP-BATERIAS-LOGISTICA` · Sistemas: SYS-3.1.1 Bancos de Baterías; SYS-5.1.1 Motor Eléctrico (MEP)
- variante 1 · ref `M032725` · concepto a adaptar: fracción mixta a decimal: autonomía en horas · **clave correcta: B**
- variante 2 · ref `M032295` · concepto a adaptar: expresión algebraica de un total: potencia por tiempo · **clave correcta: C**
- variante 3 · ref `M032738` · concepto a adaptar: orden de operaciones al evaluar la fórmula de consumo · **clave correcta: D**

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
