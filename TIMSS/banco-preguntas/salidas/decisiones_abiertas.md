# Decisiones abiertas y registro de decisiones

**Proyecto:** International Submarine Academy (ISA) · **Temporada:** Cobre (Nivel 1)
**Fecha:** 9 de noviembre de 2026
**Alcance:** registro de lo decidido durante el cierre del banco de Cobre y de lo que queda pendiente de decisión humana.
**Relación:** `docs/31_POLITICA_VIGENTE.md`, `04_factor_humano_temas.md`, `qa_informe.md`.

---

## 1. Decisiones cerradas

| # | Tema | Decisión | Origen |
|---:|---|---|---|
| 1 | Alcance de escritura | Escribir solo en `TIMSS/banco-preguntas/` (se crearon `salidas/`, `insumos/` y `herramientas/`). No se toca la app, `lib/`, `componentes`, `public/` ni `isa-config.json`. Sin commits ni dependencias. | Checkpoint 0 |
| 2 | Pool TIMSS | Se normalizó el original `TIMSS/02.1.1_Banco_Reactivos_TIMSS_Conocimiento - Conocimiento.csv` en `insumos/01_pool_timss_67.csv` (67 filas, encabezados, sin caracteres invisibles). El original no se editó. | Checkpoint 0 |
| 3 | 15 temas FH | Se aprueban los 15 temas propuestos por la normalización (3 por especialidad sugerida), con sus preguntas de banco. | Checkpoint 1 |
| 4 | FH-09 (emblema del domo) | Se publica como **relato recogido en la comunidad**, marcado **por verificar**; nunca como hecho. No hay fuente externa del dibujo. | Checkpoint 1 |
| 5 | FH-06 (cribbage) | Queda con especialidad sugerida **ELE**, marcada **revisar**; el tema es transversal. | Checkpoint 1 |
| 6 | Formato del banco | **CSV + XLSX** de revisión. El CSV es el contrato de datos; el XLSX tiene hojas `LEEME`, `Banco`, `STEM`, `FH`, `Claves` y `Columnas`. | Checkpoint 0 |
| 7 | Experiencia Cobre | **Una celda = una experiencia** (episodio + 1 variante sorteada por día). El banco no asigna días. | Checkpoint 0 |
| 8 | IDs de sistemas y compartimentos | Se crean IDs neutrales `SYS-<código CSV>` y `CMP-…`; el mapeo al CSV queda documentado y el CSV original no se edita. | Checkpoint 0 |
| 9 | `artifact_es` / `artifact_en` | **Resuelto (9/11/2026):** se eliminan del banco. `system_ids` y `compartment_id` cubren el anclaje técnico; si más adelante hace falta alt-text, se agrega como campo nuevo. | Checkpoint 0 + revisión posterior |
| 10 | Referencia repetida | Se acepta `S042272` en dos celdas (compresión y climatización), con justificación en `uso_referencias.md`. | Checkpoint 2 |
| 11 | Referencias sin uso | Las 8 referencias sin uso quedan documentadas; el usuario pidió **buscar ampliar Cobre** más adelante. | Checkpoint 2 |
| 12 | Cámara hiperbárica | Se **reemplaza** como tema (no se reencuadra); el lugar lo ocupa FH-06. | Fase A |
| 13 | Apodo del aseo ("Tubo Siete") | Se elimina el apodo por ser una referencia encubierta a un componente excluido; el tema del aseo y el agua se conserva como FH-15. | Fase A |
| 14 | "Blechkoller" | Se descarta el término: la verificación no encontró respaldo histórico; aparece como recurso de ficción. | Fase A |
| 15 | Bandera pirata | Se descarta el tema completo; no se reemplaza por un eufemismo. | Fase A |
| 16 | Intervención en el USS Seadragon | Se descarta como tema por la regla de exclusión, **y se corrige** su clasificación: es un hecho documentado (11/09/1942, Wheeler B. Lipes), no ficción. | Fase A |
| 17 | FH-12 (Krawczyk) | Se usa el hito verificado (egreso en diciembre de 2012) y **se excluyen** el siniestro de 2017 y los datos personales. | Fase A |
| 18 | Estado del banco | Todas las filas quedan en `status = propuesta`, `confidence` alta/media/revisar. La validación es humana. | Todo el proceso |

---

## 2. Decisiones abiertas

### 2.1 `artifact_es` / `artifact_en` — resuelto

- **Decisión (9/11/2026):** se eliminan del contrato del banco. El banco v1.0 quedó con 34 columnas.
- **Motivo:** `system_ids` y `compartment_id` ya identifican el sistema y el compartimento; la descripción de objeto para alt-text puede agregarse después como campo propio si producción la necesita.
- **Impacto:** scripts `merge_banco.py`, `validar_banco.py` y `generar_xlsx.py` actualizados; CSV, XLSX y matrices regenerados.

### 2.2 Aprobación final del banco

- **Situación:** el banco está completo y validado, en estado propuesta.
- **Propuesta:** aprobación humana explícita antes de importarlo a `Reactivos`.
- **Decide:** usuario.

### 2.3 Importación a la hoja `Reactivos`

- **Situación:** el CSV tiene columnas propias del banco que no coinciden 1:1 con `docs/22` (§5.10): hay equivalencias (`question_es` → `text_es`, `option_a_es` → `option_a_es`, `feedback_*`, `compartment_id`, `system_ids`) y campos nuevos (`cell_code`, `variant_index`, `timss_item_id`, `reuse_group`, `reference_relation`, `confidence`).
- **Propuesta:** generar un script de importación que mapee a las columnas de `Reactivos` y **no use** `level`; `source` = `source_basis`; `status` = `proposal`.
- **Decide:** responsable de datos.

### 2.4 `season_id`

- **Situación:** el banco usa `SEA-COPPER`; los documentos hablan de "Cobre" y de `SEA-STEEL` para Acero.
- **Propuesta:** mantener `SEA-COPPER` y documentar que "Cobre = SEA-COPPER".
- **Decide:** responsable de datos.

### 2.5 `timss_content_domain`

- **Situación:** se empaquetó dominio + subdominio en un solo campo ("PHYSICS (Física) · Energy Transformations…").
- **Opciones:** mantener el campo empaquetado o separarlo en dos columnas al importar.
- **Propuesta:** separarlo en la importación si la hoja puede tener dos columnas; el CSV del banco queda como está.
- **Decide:** responsable de datos.

### 2.6 Celda MAT-NAV

- **Situación:** dos de sus tres referencias son de Ciencias de la Tierra (mareas y relieve volcánico), así que el contenido pesa más en Ciencias que en Matemática.
- **Opciones:** (a) aceptar la mezcla y dejar `confidence = revisar`; (b) reasignar referencias de Matemática y dejar dos refs de Ciencias sin uso.
- **Propuesta:** (a) en esta temporada; (b) al ampliar Cobre.
- **Decide:** curaduría TIMSS.

### 2.7 Referencias sin uso

- **Situación:** 8 referencias no se usaron (`S032007`, `S052080`, `S032465`, `S032087`, `S032640`, `S042038`, `S032126`, `M042260`).
- **Decisión del usuario:** buscar ampliar Cobre después.
- **Propuesta:** reservarlas para Bronce/Plata o para celdas nuevas, sin forzar su anclaje.
- **Decide:** curaduría TIMSS.

### 2.8 FH-09 y fuentes testimoniales

- **Situación:** el emblema del Tonina no tiene fuente externa; otros temas dependen del blog, cuyos archivos no están en el repositorio.
- **Propuesta:** mantener la marca "por verificar" y actualizar si aparece una fuente.
- **Decide:** historia y patrimonio.

### 2.9 Guías de temas

- **Situación:** `guias_temas.md` es una guía de temas, no un guion de respuestas.
- **Propuesta:** usarla como checklist de producción; el guía puede adaptar el orden, pero no debe convertir las preguntas de banco en un cuestionario previo.
- **Decide:** producción.

### 2.10 Nombres fantasía y documentos desactualizados

- **Situación:** `docs/24` y `docs/25` describen 25 celdas con "Humanidades y Artes" y 25 ribbons; `docs/31` y esta sesión fijan **20 celdas STEM + 15 FH**. Los documentos no se tocaron.
- **Propuesta:** actualizar `docs/24`/`docs/25` en una sesión de documentación aparte; no hacerlo en esta sesión de datos.
- **Decide:** usuario.

### 2.11 `timss_item_title` con palabras neutras

- **Situación:** el título se copia literal del pool y algunos contienen "fire" o "tiros exitosos" (contextos neutros, no bélicos).
- **Propuesta:** mantenerlos como trazabilidad, o normalizar el título solo si se importa a una vista pública.
- **Decide:** responsable de datos.

### 2.12 Sensibilidad de FH-12

- **Situación:** el tema se basa en una oficial fallecida en 2017.
- **Propuesta:** no mencionar el siniestro ni datos personales; foco en la incorporación profesional y la habitabilidad.
- **Decide:** historia y patrimonio + usuario.

---

## 3. Supuestos de trabajo

1. **8.º grado** es la referencia de conocimiento previo STEM (TIMSS 2011), no una edad ni un público destinatario. ISA es para todo público.
2. **Cobre = Nivel 1** (dominio Knowing). Acero no lleva preguntas TIMSS.
3. **Una celda = una experiencia**; la variante se sortea por día en la implementación.
4. **FH es una columna libre**, no una intersección especialidad × disciplina; la especialidad es una sugerencia de producción.
5. El **CSV de sistemas** conserva su registro original, pero en el material ISA solo se usan nombres y descripciones neutralizados; la rama 1.2 queda excluida.

---

## 4. Cómo cerrar una decisión

Para cada decisión abierta:

1. elegir una opción;
2. registrar la elección en este archivo con fecha;
3. si cambia datos, actualizar `banco_cobre.csv` y regenerar `banco_cobre.xlsx`, `matriz_celdas.md` y `uso_referencias.md` con los scripts de `herramientas/`;
4. volver a correr `validar_banco.py` (0 errores) y `qc_stem.py` (0 pistas de forma).
