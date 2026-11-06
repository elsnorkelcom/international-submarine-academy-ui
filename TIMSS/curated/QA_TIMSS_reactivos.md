# QA y curación de reactivos TIMSS ISA

## Alcance

Se revisaron los cinco CSV presentes en `TIMSS/`. Los originales se conservaron sin modificar. La curación crea un conjunto canónico deduplicado y un manifiesto de procedencia.

## Inventario

| Archivo | Filas de datos | Columnas |
|---|---:|---:|
| `reactivos_timss_isa_knowing_25.csv` | 25 | 18 |
| `reactivos_timss_isa_knowing_50.csv` | 50 | 18 |
| `reactivos_timss_isa_knowing_tanda3_25.csv` | 25 | 18 |
| `reactivos_timss_isa_knowing_tanda3_75.csv` | 100 | 18 |
| `reactivos_timss_isa_knowing_tanda4_25.csv` | 25 | 18 |

- Filas totales recibidas: **225**.
- IDs únicos: **100**.
- Rango canónico: **ISA-KNOW-001 a ISA-KNOW-100**, secuencial y sin huecos.
- Filas duplicadas que se consolidan: **125**.
- Todos los archivos comparten los mismos 18 encabezados.
- Todas las filas tienen 18 columnas, cuatro opciones no vacías y una respuesta entre A–D.
- En el conjunto canónico, la distribución de respuestas es: **A=51, B=47, C=2, D=0**. La ausencia de D requiere revisión de balance, aunque no es por sí sola un error.
- Estados fuente: `Propuesta` en las 100 filas; ningún reactivo se convirtió en `Aprobado`.
- Variantes de nivel detectadas: 2 (`Nivel Cobre (8.º Grado)`; `Nivel Cobre (8º Grado / Secundario)`). Se preservan en el canónico y quedan pendientes de normalización editorial.

## Regla de consolidación

Se eligió `reactivos_timss_isa_knowing_tanda3_75.csv` como fuente canónica porque contiene los 100 IDs secuenciales. Las otras tandas son subconjuntos o versiones repetidas. Para los IDs 001–025 existe una versión anterior en `reactivos_timss_isa_knowing_25.csv`; no se sobreescribió ninguna original. El manifiesto registra cada fila original y si su payload coincide con la versión canónica.

## Curación aplicada

- Se deduplicaron filas por `ID propuesto`.
- Se conservaron intactos los 18 campos educativos del registro canónico.
- Se agregaron cuatro campos de trazabilidad: `curation_status`, `canonical_source`, `duplicate_sources` y `qa_flags`.
- Todos los registros quedan como `curated_pending_human_review`.
- No se afirmó equivalencia oficial con TIMSS, aprobación pedagógica, autorización de museos ni veracidad institucional.
- No se corrigieron preguntas, respuestas, fuentes o afirmaciones históricas sin una fuente verificable; esas tareas quedan como revisión editorial.

## Alertas editoriales detectadas

- `EDITORIAL_ABSOLUTE_CLAIM_REVIEW`: 4 filas.
- `EDITORIAL_PLACEHOLDER_REVIEW`: 3 filas.
- `OPERATIONAL_CONTEXT_REVIEW`: 12 filas.

Además, las columnas `Fuente utilizada` citan materiales internos, matrices, manuales y museos que no forman parte completa de esta carpeta. Es necesario verificar cada referencia antes de publicar o marcar un reactivo como aprobado.

Los nombres de museos, buques y contextos sugeridos se conservan como propuestas; no constituyen autorización de asociación, partnership o aval institucional.

## Entregables

- `reactivos_timss_isa_knowing_curated.csv`: 100 IDs únicos, con trazabilidad y estado pendiente.
- `reactivos_timss_isa_knowing_manifest.csv`: 225 filas originales mapeadas al canónico.
- `editorial_review_queue.csv`: 17 filas con alertas específicas para revisión humana.
- Este informe QA.

## Próxima revisión humana recomendada

1. Confirmar fuentes y permisos de redistribución de los reactivos TIMSS.
2. Revisar balance de opciones y la ausencia de respuestas D.
3. Revisar variantes de nivel y taxonomía de áreas.
4. Verificar cada museo/buque/contexto con una fuente independiente.
5. Revisar los reactivos marcados por afirmaciones absolutas, contexto operativo o lenguaje editorial.
6. Solo después de esa revisión, decidir si alguno puede pasar de `Propuesta` a `Aprobado`.
