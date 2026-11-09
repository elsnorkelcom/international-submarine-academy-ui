# Asignación Fase B — ELN

**Leé antes:** `TIMSS/banco-preguntas/herramientas/brief_banco.md` (reglas, esquema, columnas).
**Leé también:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv` (títulos y dominios de las referencias) y `TIMSS/Insumos/Sistemas Submarinos por Copartimentos _ Desafios - Completar los 80+ sistemas del mapa conceptual.csv` (descripción del sistema).
**Escribí:** solo `TIMSS/banco-preguntas/herramientas/staging/ELN.json`.

Especialidad **ELN**. Producí **12 preguntas** (4 celdas × 3 variantes), ES y EN.
La clave correcta de cada fila es la indicada: **respetala** (no la cambies).


## CU-SCI-ELN · cell_index 9 · disciplina SCI · tema: ondas que exploran: sonar
- Compartimento: `CMP-PROA` · Sistemas: SYS-1.1.1 Sonar Pasivo; SYS-1.1.2 Sonar Activo; SYS-1.1.3 Arreglo de Flanco
- variante 1 · ref `S042274` · concepto a adaptar: la velocidad de una onda depende del medio · **clave correcta: A**
- variante 2 · ref `S052207` · concepto a adaptar: densidad del medio y propagación del sonido · **clave correcta: B**
- variante 3 · ref `S052297` · concepto a adaptar: burbujas de gas como fuente de sonido · **clave correcta: C**

## CU-TEC-ELN · cell_index 10 · disciplina TEC · tema: ver sin ventanas: periscopio y mástil optrónico
- Compartimento: `CMP-CONTROL` · Sistemas: SYS-2.1.1 Periscopio de observación; SYS-2.1.2 Periscopio de búsqueda; SYS-2.1.3 Mástil Optrónico
- variante 1 · ref `M032397` · concepto a adaptar: composición de transformaciones: reflexión y giro · **clave correcta: D**
- variante 2 · ref `M042150` · concepto a adaptar: eje de simetría e imagen especular · **clave correcta: A**
- variante 3 · ref `M032679` · concepto a adaptar: desarrollo plano de un cuerpo: el prisma · **clave correcta: B**

## CU-ING-ELN · cell_index 11 · disciplina ING · tema: comunicar bajo el agua y desde la superficie
- Compartimento: `CMP-CONTROL` · Sistemas: SYS-2.3.1 Antena HF/VHF; SYS-2.3.2 Antena de Satélite; SYS-2.3.3 Teléfono Submarino
- variante 1 · ref `S032160` · concepto a adaptar: cuerpos que orbitan: satélites alrededor de la Tierra · **clave correcta: C**
- variante 2 · ref `M032673` · concepto a adaptar: intervalo de valores admisibles: ventana de frecuencias · **clave correcta: D**
- variante 3 · ref `M042198A` · concepto a adaptar: regularidad y patrón: periodicidad de los pulsos · **clave correcta: A**

## CU-MAT-ELN · cell_index 12 · disciplina MAT · tema: orientación y medida: giroscopio, carta y ecosonda
- Compartimento: `CMP-CONTROL` · Sistemas: SYS-2.2.1 Giroscopio Láser; SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda
- variante 1 · ref `M042024` · concepto a adaptar: ubicar una medida en una escala graduada · **clave correcta: B**
- variante 2 · ref `M032683` · concepto a adaptar: suma de fracciones con distinto denominador: tiempos de rumbo · **clave correcta: C**
- variante 3 · ref `M052216` · concepto a adaptar: equivalencia entre fracción y decimal en unidades de medida · **clave correcta: D**

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
