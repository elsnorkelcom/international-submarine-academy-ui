# Asignación Fase B — MAQ

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/MAQ.json`.

Especialidad **MAQ**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).


## CU-SCI-MAQ · cell_index 1 · disciplina SCI · tema: calor y combustión en la sala de máquinas
- Compartimento: `CMP-MAQUINAS` · Sistemas: SYS-4.1.1 Motores Diésel; SYS-4.1.2 Esmórquel; SYS-4.1.3 Escape de Gases
- variante 1 · ref `S052046` · concepto a adaptar: condiciones de la combustión (comburente y calor) · **clave correcta: A**
- variante 2 · ref `S042100` · concepto a adaptar: evidencias observables de un cambio químico · **clave correcta: B**
- variante 3 · ref `S042073` · concepto a adaptar: composición química de un gas de escape y su fórmula · **clave correcta: C**

## CU-TEC-MAQ · cell_index 2 · disciplina TEC · tema: presión y energía acumulada en el circuito hidráulico
- Compartimento: `CMP-MAQUINAS` · Sistemas: SYS-4.2.1 Bombas Principales; SYS-4.2.2 Acumuladores
- variante 1 · ref `M032538` · concepto a adaptar: sustituir valores en una fórmula de presión · **clave correcta: D**
- variante 2 · ref `M042103` · concepto a adaptar: desigualdad como umbral operativo del acumulador · **clave correcta: A**
- variante 3 · ref `M042226` · concepto a adaptar: sistema de ecuaciones para repartir presión entre dos ramas · **clave correcta: B**

## CU-ING-MAQ · cell_index 3 · disciplina ING · tema: caudal, achique y compresión
- Compartimento: `CMP-MAQUINAS` · Sistemas: SYS-4.3.1 Bombas de Achique; SYS-4.3.2 Compresores de Aire
- variante 1 · ref `M052302` · concepto a adaptar: caudal como cociente volumen/tiempo · **clave correcta: C**
- variante 2 · ref `S042272` · concepto a adaptar: al comprimir y enfriar, el vapor condensa · **clave correcta: D**
- variante 3 · ref `M032166` · concepto a adaptar: estimación de orden de magnitud del caudal · **clave correcta: A**

## CU-MAT-MAQ · cell_index 4 · disciplina MAT · tema: medición, mezclas y mantenimiento
- Compartimento: `CMP-MAQUINAS` · Sistemas: SYS-4.3.3 Separadores de Aceite; SYS-4.3.1 Bombas de Achique
- variante 1 · ref `M042169A` · concepto a adaptar: media de varias mediciones de contaminación · **clave correcta: B**
- variante 2 · ref `M032094` · concepto a adaptar: valor posicional en una lectura decimal · **clave correcta: C**
- variante 3 · ref `M052231` · concepto a adaptar: acumulación de lecturas decimales en un registro · **clave correcta: D**

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
