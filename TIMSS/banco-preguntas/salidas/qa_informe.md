# QA del banco de preguntas de Cobre

**Proyecto:** International Submarine Academy (ISA) · **Temporada:** Cobre (Nivel 1)
**Fecha:** 9 de noviembre de 2026
**Alcance:** banco de 75 preguntas (60 STEM + 15 FH), guías de temas, matriz de celdas y uso de referencias.
**Estado:** informe de cierre. Los 7 entregables de la sesión quedan en `TIMSS/banco-preguntas/salidas/`.

---

## 1. Resumen ejecutivo

| Control | Resultado |
|---|---|
| Filas del banco | **75** (60 STEM + 15 FH) |
| Celdas STEM | **20**; 3 variantes por celda; 1 experiencia = 1 celda |
| Temas FH | **15** (3 por especialidad sugerida), sin variantes y sin ancla TIMSS |
| Referencias TIMSS | **67** en el pool; **59** usadas distintas, **1 repetida** justificada, **8 sin uso** documentadas |
| Dominio cognitivo | **Knowing** en las 60 STEM |
| Distribución de claves | **A 19 · B 19 · C 19 · D 18** (25,3 / 25,3 / 25,3 / 24,0 %) |
| ES/EN | 75/75 en enunciado, 4 opciones y feedback |
| Términos bélicos en el contenido educativo | **0** |
| Campo `level` / "nivel" / "apto 8.º" | **0** usos |
| Duplicados de enunciado | **0** |
| Errores bloqueantes | **0** |

---

## 2. Método y artefactos de validación

Los controles se ejecutan con scripts versionados en `TIMSS/banco-preguntas/herramientas/`:

| Script | Qué comprueba |
|---|---|
| `normalizar_pool_timss.py` | Copia fiel del pool de 67 referencias a `insumos/01_pool_timss_67.csv`, sin espacios invisibles, con dominio/subdominio en/es separados. |
| `generar_asignaciones.py` | Fija la asignación de referencias, sistemas y claves por celda y variante. |
| `merge_banco.py` | Mergea los JSON de staging, exige cobertura exacta, claves asignadas, campos bilingües y ausencia de duplicados. |
| `validar_banco.py` | Columnas, conteos, cobertura de celdas, referencias, distribución de claves, términos excluidos, longitudes de opciones, FH sin TIMSS. |
| `qc_stem.py` | Compara cada pregunta con el título del ítem TIMSS para detectar reproducciones literales; revisa longitudes y pistas de forma. |
| `generar_matriz_y_uso.py` | Genera `matriz_celdas.md` y `uso_referencias.md` desde el CSV. |
| `generar_xlsx.py` | Genera el XLSX de revisión con hojas `LEEME`, `Banco`, `STEM`, `FH`, `Claves` y `Columnas`. |

Comandos de reproducción:

```bash
python TIMSS/banco-preguntas/herramientas/merge_banco.py
python TIMSS/banco-preguntas/herramientas/validar_banco.py
python TIMSS/banco-preguntas/herramientas/qc_stem.py
python TIMSS/banco-preguntas/herramientas/generar_matriz_y_uso.py
python TIMSS/banco-preguntas/herramientas/generar_xlsx.py
```

Resultado del validador al cierre: **0 errores**, 1 aviso esperado (la referencia `S042272` se usa dos veces, justificado en `uso_referencias.md`).

---

## 3. Conteos y cobertura

- **Pool TIMSS:** 67 filas, 67 IDs únicos, 100 % dominio Knowing. 8 IDs con sufijo de parte (`M042169A/B`, `S052165A/B`, `S042238A`, `S032530Z`, `M032681A`, `M042198A`); solo `M042169A/B` y `S052165A/B` son multiparte reales.
- **Celdas:** 20 (`CU-<DISC>-<ESP>`), en el orden 1–20 de `matriz_celdas.md`.
- **Variantes:** 3 por celda, `variant_index` 1–3, claves distintas dentro de cada celda.
- **FH:** 15 temas (`FH-01`…`FH-15`), 3 por especialidad sugerida, sin variantes y sin ancla TIMSS.
- **Sistemas:** 39 sistemas usables del CSV (44 numerados menos los 5 de la rama 1.2) + 3 transversales; el CSV original no se editó y sus descripciones belicistas no se copiaron.
- **Experiencia:** una celda = una experiencia (episodio + 1 variante sorteada por día). El banco no asigna días.

---

## 4. Criterios de calidad (§7 del encargo)

| # | Criterio | Resultado |
|---:|---|---|
| 1 | Una sola respuesta correcta | 75/75; revisión de contenido y de las 24 preguntas con cálculo. |
| 2 | Contexto real de un sistema del CSV | 60/60 STEM con `system_ids` y `compartment_id`; FH anclado a un compartimento de la visita. |
| 3 | Conocimiento de 8.º grado (Ciencias/Matemática) | 60/60 STEM ancladas a TIMSS 2011 G8; sin edad ni nivel. |
| 4 | Distractores plausibles, sin "todas/ninguna" | 75/75; control léxico automático. |
| 5 | Opciones de longitud y estructura parecidas | Corregidos los casos con diferencia > 1,3 en preguntas de prosa; no quedan pistas de forma. En fórmulas/unidades la diferencia es estructural. |
| 6 | Claves distribuidas (~25 %) | 19/19/19/18; dentro de cada celda STEM las tres claves son distintas. |
| 7 | Feedback que explica el concepto y el error | 75/75 en ES y EN. |
| 8 | No copiar ni traducir el ítem TIMSS | Se detectaron y corrigieron 7 reproducciones directas (ver §8). |
| 9 | Sin contenido bélico, sin datos personales, lenguaje inclusivo | 0 términos excluidos en el banco. |
| 10 | ES y EN equivalentes | 75/75 en los tres bloques; revisión de equivalencia y longitud. |
| 11 | FH con respuesta verificable (no opinión) | 15/15 con respuesta conceptual verificable; la reflexión queda en la pregunta guía. |

---

## 5. Distribución de claves

| Especialidad | A | B | C | D | Total |
|---|---:|---:|---:|---:|---:|
| MAQ | 4 | 4 | 4 | 3 | 15 |
| ELE | 4 | 4 | 3 | 4 | 15 |
| ELN | 4 | 3 | 4 | 4 | 15 |
| NAV | 3 | 4 | 4 | 4 | 15 |
| LOG | 4 | 4 | 4 | 3 | 15 |
| FH (columna libre) | 4 | 4 | 4 | 3 | 15 |
| **Total** | **19** | **19** | **19** | **18** | **75** |

---

## 6. Duplicados y repeticiones

- **Enunciados duplicados:** 0 (comparación normalizada por idioma).
- **Preguntas repetidas entre celdas:** 0.
- **Referencias repetidas:** 1. `S042272` se usa en `CU-ING-MAQ` (condensación en el aire comprimido) y en `CU-TEC-LOG` (gestión del condensado en la climatización). Son dos fenómenos y dos sistemas distintos; la repetición está justificada en `uso_referencias.md`.
- **Referencias sin uso:** 8 (`S032007`, `S052080`, `S032465`, `S032087`, `S032640`, `S042038`, `S032126`, `M042260`). Motivos en `uso_referencias.md`; el usuario pidió buscar ampliar Cobre más adelante.

---

## 7. Términos excluidos

**Control automático** sobre `question_*`, `option_*`, `feedback_*`, `reference_relation`, `source_basis` y `justification_es` con lista de términos de armamento, conflicto, instituciones de fuerza y eufemismos: **0 coincidencias** en el contenido educativo.

**Excepciones documentadas, fuera del contenido educativo:**

1. `timss_item_title` **reproduce literalmente el título del pool** (campo de trazabilidad). Algunos títulos contienen palabras neutras de otros contextos ("Fire put out by blanket", "porcentaje de tiros exitosos"); no describen contenido bélico y no se usan en la pregunta.
2. `04_factor_humano_temas.md` **nombra los temas que descarta** para justificar la exclusión y cita el vocabulario original en la tabla de correcciones. Esas menciones están en el registro editorial de exclusiones, no en el banco ni en las guías.
3. El CSV de sistemas original no se editó; sus descripciones belicistas **no se copian**.

---

## 8. Hallazgos del QA independiente y correcciones

Un QA independiente revisó las 60 preguntas STEM antes del cierre. Encontró 7 bloqueantes, 5 mayores y 10 menores; **todos se corrigieron**. Las claves asignadas no se cambiaron: se reescribió el contenido alrededor de cada clave.

| Severidad | Pregunta | Hallazgo | Corrección aplicada |
|---|---|---|---|
| Bloqueante | CU-MAT-ELE-1 | Reproducía el número mixto 3 5/6 y su decimal | Se pasó a 5 7/8 → 5,88; distractores nuevos |
| Bloqueante | CU-ING-ELN-3 | Secuencia idéntica al ítem (1/2…4/5 → 5/6) | Secuencia nueva 2/5…5/8 → 6/9 |
| Bloqueante | CU-TEC-ELE-2 | Reproducía 0,125 = 1/8 | Se pasó a 37,5 % = 3/8 |
| Bloqueante | CU-TEC-NAV-3 | Misma expresión 4(3+x) y respuesta | Se pasó a 5(2+x) = 10+5x |
| Bloqueante | CU-SCI-LOG-2 | Ecuación de la respiración calcada | Ahora pregunta qué dos sustancias producen las células |
| Bloqueante | CU-SCI-NAV-3 | Reproducía "energía justo antes del impacto" | Ahora es un cálculo de energía cinética (½mv² = 240 J) |
| Bloqueante | CU-TEC-NAV-2 | Área sin ancho declarado; opciones en volumen | Se declaró ancho 1 y se pidió área (5 unidades cuadradas) |
| Mayor | CU-ING-ELE-1 | Feedback explicaba mal el distractor del 5 % | Feedback corregido (dividir 40 entre 8) |
| Mayor | CU-SCI-ELN-2 | La clave atribuía la velocidad del sonido solo a la densidad | Se reformuló con compresibilidad; `confidence` = revisar |
| Mayor | CU-TEC-ELE-3 | "El conversor repone energía" (imposible) | Ahora es un banco de reserva |
| Mayor | CU-TEC-LOG-2 | Duplicaba la condensación de CU-ING-MAQ-2 | Ahora es gestión del condensado y riesgo de humedad |
| Mayor | CU-SCI-NAV-1 | Reproducía "moléculas de gas al calentarse" | Ahora es presión en compartimento estanco a volumen fijo |
| Menor | CU-TEC-MAQ-2 | Distractor D incoherente con el feedback | D pasó a p < 10 bar |
| Menor | CU-ING-ELE-3 | Solo una opción era aritméticamente cierta | Opciones con unidades y resultados correctos |
| Menor | CU-MAT-ELE-3 | "consumo de una hora" con t = 3 h | Enunciado corregido |
| Menor | CU-TEC-ELN-1 | Espejos perpendiculares atribuidos al periscopio | Contexto: banco de calibración óptica |
| Menor | CU-MAT-ELN-3 | 0,875 era la única opción con tres decimales | Opciones homogéneas en tres decimales |
| Menor | CU-TEC-LOG-3 | Ancla invertida (germinación vs conservación) | `reference_relation` como concepto invertido |
| Menor | CU-ING-ELN-1 | Distractor absurdo | Distractor plausible (altura fija de 500 km) |
| Menor | CU-MAT-NAV-1/2 | Celda MAT con contenido de Ciencias de la Tierra | `confidence` = revisar y justificación explícita |
| Menor | CU-ING-ELN-2 / CU-MAT-ELN-1 | Feedback no explicaba todos los distractores | Feedback ampliado |
| Menor | CU-ING-MAQ-1/3 | Variantes con el mismo escenario y distractores | La variante 3 pasó a cálculo en dos pasos con fuga |
| Menor | CU-ING-MAQ-2 / CU-SCI-MAQ-1 | Concordancia EN y "esmórquel" vs "air-intake mast" | Corregidos ("snorkel (air-intake mast)", "take energy away") |

---

## 9. Trazabilidad TIMSS

- Cada pregunta STEM tiene `timss_cycle` 2011, `timss_item_id`, `timss_item_title`, `timss_content_domain` (dominio · subdominio) y `timss_cognitive_domain` = Knowing.
- El título y el dominio se copiaron del pool y se compararon campo por campo: **0 discrepancias** en las 60 filas.
- `reference_relation` empieza con "concepto adaptado:" y describe el puente entre el ítem y el sistema.
- `source_basis` indica ciclo, ítem, concepto y sistema.
- `reuse_group` = `RG-<timss_item_id>` en STEM; vacío en FH.

---

## 10. Factor Humano

- 15 temas normalizados, 3 por especialidad sugerida, todos sin contenido bélico.
- Fuentes: 9 hechos verificados con fuente abierta, 2 parciales, 1 NO ENCONTRADO (emblema del Tonina, se publica como testimonio); los temas que dependen solo del blog se marcan **por verificar**.
- Las 15 preguntas tienen clave única y distribución 4/4/4/3.
- FH-12 (Krawczyk) se basa en fuente verificada (egreso en diciembre de 2012) y excluye el siniestro de 2017 y todo dato personal.
- Ver `04_factor_humano_temas.md` §8 para el detalle de fuentes y §10 para las decisiones abiertas.

---

## 11. Guías y matriz

- `guias_temas.md`: 35 guías (20 celdas STEM + 15 temas FH), con 6 puntos por guía y versión ES/EN.
- `matriz_celdas.md`: 20 celdas con sus 3 variantes, referencia TIMSS, concepto adaptado y clave.
- `uso_referencias.md`: las 67 referencias, sus celdas, la repetida justificada y las 8 sin uso con motivo.

---

## 12. Límites

- **No** se verificó la calidad pedagógica con docentes ni la equivalencia curricular formal con TIMSS; ISA no declara equivalencia.
- **No** se validó la traducción con un traductor humano; se revisó equivalencia y terminología.
- **No** se probó la implementación H5P (el banco es el insumo; la actividad se implementa aparte).
- **No** se tocó la app, `lib/`, `app/`, `components/`, `public/` ni `isa-config.json`; no hay commits ni dependencias nuevas.
- El banco queda en estado **propuesta**; la validación humana es la del checkpoint final.

---

## 13. Criterios de aceptación

| Criterio | Estado |
|---|---|
| 20 celdas × 3 variantes = 60 STEM + 15 FH = 75, sin huecos ni repetidas entre celdas | Cumple |
| Cada STEM con cita TIMSS verificable; cada FH con fuente y estado de verificación | Cumple |
| 0 términos de armas/guerra/combate en todo el material | Cumple en el contenido educativo; las menciones del registro de exclusiones están documentadas (§7) |
| ES/EN completo en las 75 | Cumple |
| Distribución de respuestas correctas balanceada | 19/19/19/18 |
| QA sin errores bloqueantes y decisiones abiertas listadas | Cumple (`decisiones_abiertas.md`) |
