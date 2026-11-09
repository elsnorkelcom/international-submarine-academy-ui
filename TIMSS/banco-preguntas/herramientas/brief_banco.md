# Brief interno — banco de preguntas de Cobre (STEM y FH)

**Uso:** documento de trabajo para los subagentes de la Fase B/C. No es entregable.
**Fuente de verdad:** `docs/31_POLITICA_VIGENTE.md` §3, §6, §7, §8; enunciado de la sesión §5, §7, §8, §9.1.
**Entradas:** `TIMSS/banco-preguntas/insumos/01_pool_timss_67.csv`, `TIMSS/banco-preguntas/insumos/03_especialidades_sistemas.md`, CSV de sistemas (39 usables), `TIMSS/banco-preguntas/salidas/04_factor_humano_temas.md`.

---

## 1. Estructura del banco

- **60 STEM** = 20 celdas × 3 variantes (`variant_index` 1–3). Una experiencia = una celda; la variante se sortea por día (bucket ALFA/BRAVO/CHARLY).
- **15 FH** = 15 temas normalizados, una pregunta por tema, sin variantes y sin ancla TIMSS.
- Las 3 variantes de una celda son **3 preguntas distintas** sobre la misma familia de sistemas; no son 3 redacciones de la misma pregunta.
- Una pregunta no se repite entre celdas. La referencia TIMSS puede repetirse con justificación: en esta asignación hay **59 referencias distintas** y **1 repetida** (S042272, en las celdas de MAQ y LOG por dos fenómenos distintos: compresión y condensación); quedan **8 sin uso** y se documentan en `uso_referencias.md`.

## 2. Códigos e IDs

| Campo | Valores |
|---|---|
| `season_id` | `SEA-COPPER` (Cobre = Nivel 1) |
| `specialty_id` | `MAQ`, `ELE`, `ELN`, `NAV`, `LOG` |
| `discipline_id` | `SCI`, `TEC`, `ING`, `MAT`; FH usa `HUM` |
| `cell_code` | `CU-<DISC>-<ESP>` para STEM; `FH-<ESP>-<n>` para FH |
| `cell_index` | 1–20 STEM, en el orden de `matriz_celdas.md`; FH: 1–15 |
| `variant_index` | 1–3 STEM; `1` en FH (pregunta única, no hay variantes) |
| `id` | `COB-STEM-CU-SCI-MAQ-1`, `COB-FH-01` |
| `kind` | `STEM` / `FH` |
| `compartment_id` | `CMP-PROA`, `CMP-CONTROL`, `CMP-BATERIAS-LOGISTICA`, `CMP-MAQUINAS`, `CMP-POPA`, `CMP-TRANSVERSAL` |
| `system_ids` | IDs `SYS-<código CSV>` separados por `;` (ej.: `SYS-4.1.1; SYS-4.1.3`) |

El mapeo `SYS-<código>` ↔ código del CSV (1.1.1 … 5.3.3, S.1 … S.3) se documenta en `uso_referencias.md` y no se edita el CSV original.

## 3. Columnas exactas del CSV final (75 filas)

`id, kind, season_id, specialty_id, discipline_id, cell_code, cell_index, variant_index, question_es, question_en, option_a_es, option_a_en, option_b_es, option_b_en, option_c_es, option_c_en, option_d_es, option_d_en, correct_option_id, feedback_es, feedback_en, artifact_es, artifact_en, compartment_id, system_ids, timss_cycle, timss_item_id, timss_item_title, timss_content_domain, timss_cognitive_domain, reference_relation, source_basis, reuse_group, justification_es, confidence, status`

Definiciones:

- `question_es/en`: enunciado, una sola pregunta, sin doble lectura.
- `option_a..d_es/en`: 4 opciones paralelas, misma longitud y estructura aproximada.
- `correct_option_id`: `A` / `B` / `C` / `D`.
- `feedback_es/en`: explica el concepto y por qué el distractor elegido es un error. 1–3 frases.
- `artifact_es/en`: **vacío en esta entrega** (columna pendiente de definición; va en `decisiones_abiertas.md`).
- `timss_cycle`: `2011`.
- `timss_item_id`: ID del pool (ej.: `S032158`).
- `timss_item_title`: título original del pool.
- `timss_content_domain`: dominio + subdominio del pool (ej.: `PHYSICS (Física) · Energy Transformations, Heat, and Temperature`).
- `timss_cognitive_domain`: `Knowing`.
- `reference_relation`: cómo se relaciona la pregunta con el ítem (ej.: `concepto adaptado: calor y movimiento de moléculas → calentamiento del motor`). **No copiar ni traducir el ítem.**
- `source_basis`: `TIMSS 2011 G8 Science/Math, ítem <ID> (liberado); concepto: <...>; sistema: <nombre y código CSV>`.
- `reuse_group`: `RG-<timss_item_id>` (en esta asignación, un grupo por referencia).
- `justification_es`: por qué la referencia y el sistema encajan en la celda y la disciplina.
- `confidence`: `alta` / `media` / `revisar`.
- `status`: `propuesta` (todos; la validación es humana).

## 4. Reglas de contenido

1. **Una sola respuesta correcta**, sin ambigüedad ni doble lectura.
2. Contexto real de un sistema del CSV (39 usables). No preguntas de escuela sueltas.
3. Se responde con conocimiento de Ciencias/Matemática de 8.º grado (referencia TIMSS 2011). No se declara "nivel" ni edad.
4. Distractores plausibles: errores frecuentes, no absurdos. Nada de "todas" ni "ninguna".
5. Opciones con longitud y estructura similares; sin pistas en la redacción.
6. Claves distribuidas A/B/C/D (~25 % cada una) **por especialidad** y en el total.
7. Feedback que explica el concepto y por qué el distractor es un error.
8. No copiar ni traducir literalmente el ítem TIMSS: adaptar el concepto.
9. **Cero contenido bélico.** Vocabulario permitido: sistema técnico, patrimonio, vida a bordo, exploración, seguridad, ambiente, mantenimiento. Prohibido: cualquier término de la regla dura de `docs/31` §2 (armamento, conflicto, instituciones de fuerza, etc.), incluso como ejemplo o metáfora.
10. ES y EN equivalentes en dificultad; la localización adapta, no traduce literal.
11. FH: pregunta de comprensión con respuesta verificable (no opinión); la reflexión va en la pregunta guía del episodio, no en las opciones.

## 5. Regla de neutralización del CSV de sistemas

El CSV original tiene registro belicista. Al citarlo:

- usar el nombre técnico neutralizado: `Periscopio de Ataque` → `periscopio de observación`; `Periscopio de Búsqueda` → `periscopio de búsqueda`; `Sonar` se mantiene como sensor (no usar "sigilo", "blancos", "detección de objetivos").
- no usar la rama `1.2 Armamento` ni `1.3 Tanques de Inundación` con su descripción original (la descripción habla de compensar peso al lanzar; se describe solo como tanque de lastre/compensación de flotabilidad).
- no usar `Sistema de Recarga`, `Central de Armas`, `Sensores de Torpedo`, `Puertas de Proa`, `Tubos Lanzatorpedos`.
- `Control de Daños` → `control de averías` (seguridad y mantenimiento).
- El compartimento 1 se nombra `CMP-PROA` (proa: sensores y observación), sin "ofensiva".

## 6. Entrega de los subagentes (staging)

Cada subagente escribe **solo** en `TIMSS/banco-preguntas/herramientas/staging/`:

- `<ESP>.json`: array de 12 objetos STEM con las claves de §3 (sin `artifact_*`, que van vacías) o 15 para FH.
- `<ESP>.md`: guías de 5–6 puntos por celda (Fase C) — no se escribe en la Fase B.
- No escribe en `salidas/` ni toca la app.

El Lead valida, corrige y mergea en `salidas/banco_cobre.csv`, `salidas/banco_cobre.xlsx`, `salidas/matriz_celdas.md`, `salidas/guias_temas.md`.

## 7. Checklist de aceptación de una pregunta

- [ ] 4 opciones no vacías y `correct_option_id` válido.
- [ ] ES y EN completos y equivalentes.
- [ ] Feedback en ES y EN, explica el error del distractor.
- [ ] Referencia TIMSS con `timss_item_id`, título, dominio y `relation` no literal.
- [ ] Sistema del CSV con código y compartimento.
- [ ] Sin términos excluidos ni datos personales.
- [ ] Clave dentro de la distribución asignada.
