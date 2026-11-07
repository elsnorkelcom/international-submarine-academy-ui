# Mapeo de reactivos TIMSS a la grilla 5×5 de Cobre

Tarea de datos/curación. Entregables: `TIMSS/curated/grid_mapping.csv` (100 filas) y este informe. No se modificaron los CSV originales ni otros archivos del repositorio.

## 1. Resumen de entrada y deduplicación

| Concepto | Valor |
|---|---|
| Archivos fuente leídos | 5 CSV (`reactivos_timss_isa_knowing_25.csv`, `_50.csv`, `_tanda3_25.csv`, `_tanda3_75.csv`, `_tanda4_25.csv`) |
| Filas totales en los 5 CSV | 225 |
| `ID propuesto` únicos (`ISA-KNOW-001`…`ISA-KNOW-100`) | 100 |
| Filas duplicadas (225 − 100) | 125 |
| IDs con 3 apariciones | 25 (ISA-KNOW-001…025) |
| IDs con 2 apariciones | 75 (ISA-KNOW-026…100) |
| Filas canónicas consolidadas | 100 (una por ID, todas con `canonical_source = reactivos_timss_isa_knowing_tanda3_75.csv`) |
| `reactivos_timss_isa_knowing_curated.csv` | 100 filas, 100 IDs únicos, 100 × `Knowing (Conocimiento)` |
| Nivel | 50 × «Nivel Cobre (8º Grado / Secundario)» y 50 × «Nivel Cobre (8.º Grado)» |
| `Estado sugerido` | 100 × «Propuesta» |
| Manifiesto | 225 filas; 100 canónicas; 25 filas con `payload_matches_canonical = false` (todas de `reactivos_timss_isa_knowing_25.csv`, que trae `Área` resumida) |

Criterio de consolidación: se usó la fila de `reactivos_timss_isa_knowing_curated.csv` como base; para la evidencia se revisaron **todas** las variantes del ID en los 5 CSV. `source_files` lista los archivos donde aparece el ID, separados por `|`, en orden alfabético. Cuando un duplicado aportó evidencia más completa que la fila canónica, se usó esa evidencia y se anotó en `notes` (caso ISA-KNOW-010).

## 2. Matriz 5×5 (cantidad de ítems + IDs)

Filas = especialidad, columnas = disciplina. Todas las celdas tienen al menos 1 ítem.

| Especialidad | SCI / Ciencias | TEC / Tecnología | ING / Ingeniería | MAT / Matemática | HUM / Humanidades y Artes |
|---|---|---|---|---|---|
| **MAQ / Maquinista** | 6 — 011, 026, 051, 063, 075, 086 | 3 — 003, 027, 060 | 7 — 012, 028, 084, 085, 087, 088, 100 | 2 — 013, 072 | 3 — 014, 030, 035 |
| **ELE / Electricista** | 4 — 007, 031, 064, 073 | 3 — 015, 061, 082 | 3 — 016, 033, 058 | 3 — 017, 034, 065 | 1 — 018 |
| **ELN / Electrónico** | 8 — 002, 019, 036, 052, 057, 066, 076, 093 | 9 — 001, 032, 037, 053, 054, 056, 077, 079, 096 | 4 — 020, 038, 059, 062 | 2 — 021, 039 | 2 — 022, 040 |
| **NAV / Naval** | 6 — 008, 041, 071, 089, 090, 097 | 3 — 009, 042, 092 | 8 — 004, 043, 055, 078, 080, 091, 094, 095 | 4 — 005, 029, 044, 068 | 3 — 023, 045, 069 |
| **LOG / Logístico** | 7 — 024, 046, 067, 070, 081, 083, 098 | 3 — 006, 047, 099 | 2 — 010, 048 | 1 — 049 | 3 — 025, 050, 074 |
| **Total por disciplina** | **31** | **21** | **24** | **12** | **12** |

Total de la matriz: **100** ítems. Regla explícita de conteo: la matriz incluye todo ítem con celda sugerida, es decir `status = asignado` **más** `status = revisar` (los `revisar` son asignaciones tentativas que necesitan revisión humana). `status = sin_asignar` no suma; no hay ninguno. Por lo tanto: 92 `asignado` + 8 `revisar` = 100 = suma de las 25 celdas.

## 3. Distribución por disciplina y por especialidad

| Disciplina | Ítems | | Especialidad | Ítems |
|---|---:|---|---|---:|
| SCI — Ciencias | 31 | | MAQ — Maquinista | 21 |
| ING — Ingeniería | 24 | | ELE — Electricista | 14 |
| TEC — Tecnología | 21 | | ELN — Electrónico | 25 |
| MAT — Matemática | 12 | | NAV — Naval | 24 |
| HUM — Humanidades y Artes | 12 | | LOG — Logístico | 16 |
| **Total** | **100** | | **Total** | **100** |

## 4. Conteo por `confidence` y por `status`

| `confidence` | Ítems | | `status` | Ítems |
|---|---:|---|---|---:|
| `explicita` | 22 | | `asignado` | 92 |
| `alta` | 39 | | `revisar` | 8 |
| `media` | 39 | | `sin_asignar` | 0 |
| `baja` | 0 | | | |
| `ninguna` | 0 | | | |
| **Total** | **100** | | **Total** | **100** |

Campos de evidencia usados: `Fuente utilizada` (22), `Fuente utilizada + Área` (4: par explícito de especialidad sin par completo, ISA-KNOW-002/009/065/069) y `Área + Equipo o sistema` (74). No se usó `Compartimento` ni `Tema` como campo principal, aunque ambos se consultaron para inferir la especialidad.

## 5. Cobertura y celdas de baja densidad

- **Celdas vacías: 0 de 25.** Es un hallazgo del banco: el conjunto actual cubre las 25 combinaciones, aunque con densidades muy dispares.
- **Celdas con un solo ítem: 2**
  - MAT × LOG: ISA-KNOW-049 (fracciones/porcentajes en depósito de víveres).
  - HUM × ELE: ISA-KNOW-018 (pioneras de la ciencia, contexto electricista).
- **Distribución de densidad de celdas:** 1 ítem → 2 celdas; 2 → 4; 3 → 9; 4 → 3; 6 → 2; 7 → 2; 8 → 2; 9 → 1.
- **Celdas más cargadas:** TEC × ELN (9), SCI × ELN (8), ING × NAV (8), ING × MAQ (7), SCI × LOG (7), SCI × MAQ (6), SCI × NAV (6).
- **Disciplinas con menos ítems:** MAT (12) y HUM (12), concentradas en 3–4 especialidades cada una.

## 6. Conflictos y discrepancias detectadas

1. **Pares explícitos contradictorios entre duplicados: ninguno.** Donde hay par `Especialidad - Disciplina` en `Fuente utilizada`, el par es el mismo en todas las variantes del ID (22 IDs, ISA-KNOW-001/003/005/006/007/008/010/011…025).
2. **Área variable entre archivos que, aplicando solo la regla 2, habría dado disciplinas distintas** (prevaleció la regla 1 o la evidencia de equipo):
   - **ISA-KNOW-003**: `Área` = «Tecnología» en `_25.csv` vs «Ciencias / Tecnología» en `_50.csv` y `_tanda3_75.csv` → fallback SCI o TEC; el par explícito `(Maquinista - Tech)` fija **TEC**.
   - **ISA-KNOW-006**: `Área` = «Tecnología» en `_25.csv` vs «Ciencias (Química…)» en canónica → fallback TEC o SCI; el par `(Logístico - Tech)` fija **TEC**, aunque la fila canónica declara Ciencias.
   - **ISA-KNOW-010**: `Área` = «Ingeniería» en `_25.csv` vs «Ciencias (Química…)» en canónica → fallback ING o SCI; el par `(Logístico - Eng/Science)` fija **ING** (primer token del par dual).
3. **Evidencia más completa sólo en un duplicado**: ISA-KNOW-010 tiene el par explícito en `reactivos_timss_isa_knowing_25.csv`, pero la fila canónica (`_tanda3_75.csv`) trae sólo `02.1_Matriz_5x5_Syllabus (TIMSS S052046)`. Se usó la evidencia del duplicado y se anotó.
4. **Pares sin código TIMSS dentro del paréntesis**: ISA-KNOW-014, 018, 022 y 023 usan `(Maquinista - History)`, `(Electricista - History)`, `(Electrónico - History)`, `(Ing. Naval - History)`. Se trataron igual como par explícito (regla 1) y se anotó.
5. **IDs sin par explícito pero con especialidad etiquetada en la fuente**: ISA-KNOW-002 («3.3 El Electrónico»), ISA-KNOW-009 («3.4 Ing. Naval»), ISA-KNOW-065 («Rol Electricista»), ISA-KNOW-069 («Rol Ing. Naval»). No son pares 5×5 completos: se usó la especialidad explícita y la disciplina por `Área` (confianza `alta` o `media`, no `explicita`).
6. **25 filas con payload distinto al canónico** según el manifiesto: todas de `reactivos_timss_isa_knowing_25.csv`. La diferencia observada es la `Área` abreviada (p. ej. «Tecnología» en vez de «Tecnología / Ciencias (Física - Óptica)»). No cambió ninguna celda porque en esos 25 IDs (001–025) manda el par explícito o la evidencia de equipo.

## 7. Ítems `revisar` y `sin_asignar`

**`revisar` (8).** Tienen celda sugerida (suman en la matriz) pero la evidencia admitía dos especialidades razonables y no hay par explícito:

| ID | Celda sugerida | Motivo |
|---|---|---|
| ISA-KNOW-032 | TEC × ELN | Imán partido/magnetómetros (ELN, firma magnética) vs «técnico electricista» y circuitos (ELE). |
| ISA-KNOW-041 | SCI × NAV | Geología marina/cartografía (NAV) vs ecosonda/hidrófonos (ELN). |
| ISA-KNOW-053 | TEC × ELN | Deperming/magnetómetros (ELN, firma magnética) vs casco resistente (NAV). |
| ISA-KNOW-059 | ING × ELN | Señuelos acústicos/contramedidas (ELN) vs defensa antitorpedo/armas (NAV). |
| ISA-KNOW-067 | SCI × LOG | Sofocación de incendios: habitabilidad/soporte (LOG) vs control de daños (NAV). |
| ISA-KNOW-075 | SCI × MAQ | Compresores de alta presión (MAQ) vs soplo de lastre/flotabilidad (NAV). |
| ISA-KNOW-077 | TEC × ELN | Giroscopio láser (ELN) vs navegación inercial/rumbo (NAV). |
| ISA-KNOW-093 | SCI × ELN | Sensor de inundación (ELN) vs conductividad eléctrica/circuito (ELE). |

**`sin_asignar` (0).** Los 100 ítems tienen `Área` y al menos un campo contextual (`Equipo o sistema`, `Compartimento`, `Tema`) que permite una asignación defendible; no se marcó ninguno como sin asignar para no inventar evidencia faltante. No obstante, 8 requieren revisión humana (tabla anterior) y 39 quedaron en confianza `media`.

## 8. Observaciones de calidad del banco

- **Sólo 22 de 100 ítems traen par explícito** `Especialidad - Disciplina`; 4 más traen especialidad etiquetada sin par completo; los 74 restantes se clasificaron por inferencia. La trazabilidad de la grilla depende hoy de la interpretación de `Equipo o sistema` y del `Área`.
- **44 de 100 `Área` son duales** (contienen «/»), y en 3 casos la variante de `Área` entre archivos implica disciplinas distintas (ISA-KNOW-003/006/010). Conviene normalizar `Área` en una futura curación.
- **Temas repetidos o muy próximos** (detectados por lectura de `Tema`/`Pregunta`, no por comparación automática): 009 vs 071 (placas anecoicas), 010 vs 067 (sofocación de incendios), 016 vs 073 (corriente en serie), 022 vs 040 (máquina Enigma), 023 vs 045 vs 069 (casco de gota de agua/USS Albacore), 024 vs 070 (respiración/glóbulos rojos), 025 vs 074 (vacunación), 027 vs 084 (energía almacenada en resortes/acumuladores), 033 (termómetros de precisión en baterías), 035 (USS Nautilus). Son pares temáticos, no necesariamente duplicados exactos.
- **Especialidad no etiquetada**: los ítems de humanidades suelen combinar `Historia` con una disciplina técnica en el `Área`, y la especialidad se deduce del contexto (p. ej. Enigma → ELN; calderas → MAQ; Albacore → NAV).
- **Concentración temática**: el banco está muy cargado de electricidad/hidroacústica/estructuras (ELN, NAV, MAQ) y tiene baja densidad en MAT y HUM. La lectura pedagógica de esa distribución no se evalúa en este informe.
- **Etiquetas de nivel heterogéneas** en los CSV originales («Nivel 8 (Cobre / Secundario)», «Nivel Cobre (8º Grado / Secundario)», «Nivel Cobre (8.º Grado)»); la versión curada las redujo a dos variantes.

## 9. Cómo se verificó y límites

Proceso:
1. Lectura de los 5 CSV con `csv` (Python) en UTF-8 con BOM (`utf-8-sig`) y de la versión curada en UTF-8. Conteo: 225 filas, 100 IDs únicos, distribución de apariciones.
2. Extracción por ID de `Área`, `Tema`, `Compartimento`, `Equipo o sistema`, `Fuente utilizada`, `Pregunta` en todas las variantes; parseo por expresión regular de los pares `(Especialidad - Disciplina)` dentro de `Fuente utilizada` y de las etiquetas de rol (`3.3 El Electrónico`, `3.4 Ing. Naval`, `Rol Electricista`, `Rol Ing. Naval`).
3. Clasificación ítem por ítem con las reglas indicadas: par explícito → disciplina por `Área` → especialidad inferida; ambigüedad → `media` o `revisar`.
4. Generación del CSV con `csv.DictWriter` (comillas automáticas, UTF-8 sin BOM) y verificación con `Import-Csv` de PowerShell: 100 filas, 16 columnas con el encabezado exacto, 100 IDs únicos.
5. Verificación numérica: la suma de las 25 celdas (100) coincide con `asignado` + `revisar` (92 + 8) y con los IDs únicos (100); `sin_asignar` = 0.
6. Verificación de alcance: `git status --porcelain` no muestra modificaciones sobre archivos versionados; los únicos archivos nuevos de esta tarea son `TIMSS/curated/grid_mapping.csv` y este informe. Otros archivos sin seguimiento que aparecen en el árbol (`docs/20…24`, `next-env.d.ts`, `tsconfig.tsbuildinfo`) ya existían y no fueron tocados.

Límites:
- La asignación de especialidad cuando no hay par explícito es una **inferencia sobre evidencia textual**, no una decisión curricular. Los 8 `revisar` y los 39 `media` requieren confirmación humana.
- `evidence_excerpt` se generó automáticamente a partir de `Área` + `Equipo o sistema`; cuando el fragmento superaba 120 caracteres se truncó con «…».
- No se evaluó la corrección pedagógica, la respuesta correcta ni la calidad de los distractores de cada ítem: eso excede esta tarea.
- No se utilizó el `editorial_review_queue.csv` para reasignar celdas; sus `qa_flags` se conservan en el insumo pero no alteran este mapeo.

## 10. Alcance pedagógico

Este informe sólo describe el mapeo de datos y su trazabilidad. No emite conclusiones pedagógicas, curriculares ni equivalencias con TIMSS; cualquier decisión sobre contenidos, secuenciación o criterios de revisión queda fuera de este entregable y pendiente de revisión humana.
