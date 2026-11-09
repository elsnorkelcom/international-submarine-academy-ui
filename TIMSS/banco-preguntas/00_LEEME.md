# Banco de preguntas de Cobre · v1.0 (propuesta)

Carpeta de trabajo del banco de la temporada Cobre de ISA. **No modifica la app**: los
datos quedan acá hasta la importación aprobada.

## Índice

| Ruta | Qué es |
|---|---|
| `salidas/banco_cobre.csv` | Banco completo: 75 filas (60 STEM + 15 FH), 34 columnas |
| `salidas/banco_cobre.xlsx` | Planilla de revisión: hojas `LEEME`, `Banco`, `STEM`, `FH`, `Claves`, `Columnas` |
| `salidas/qa_informe.md` | QA: conteos, cobertura, correcciones aplicadas |
| `salidas/matriz_celdas.md` | 20 celdas STEM con sus 3 variantes y referencia TIMSS |
| `salidas/uso_referencias.md` | Las 67 referencias: celdas, repeticiones y sin uso |
| `salidas/guias_temas.md` | 35 guías de temas (20 celdas + 15 temas FH) |
| `salidas/04_factor_humano_temas.md` | Normalización del informe de vida a bordo y 15 temas FH |
| `salidas/decisiones_abiertas.md` | Decisiones cerradas y pendientes |
| `insumos/01_pool_timss_67.csv` | Pool TIMSS 2011 (67 referencias, Knowing), fuente de verdad |
| `insumos/02_sistemas_compartimentos.csv` | 44 sistemas en 16 grupos; la rama "1.2 Armamento" no se usa |
| `insumos/03_especialidades_sistemas.md` | Mapa neutralizado especialidad → sistemas → conceptos STEM |
| `insumos/04_vida_submarina_fuente.txt` | Informe crudo del blog (insumo de los temas FH) |
| `herramientas/` | Scripts reproducibles de generación, validación y QA |

## Estado

- Banco **v1.0, `status = propuesta`**. Las preguntas son editables; la revisión de
  contenido la harán betatesters submarinistas y colaboradores.
- 20 celdas STEM × 3 variantes = 60; 15 temas FH sin variantes. Total 75.
- Todas las referencias TIMSS son de TIMSS 2011, dominio Knowing, y salen del pool de 67.
- Sin campo `nivel`: se declara conocimiento previo requerido (8.º grado STEM), no edad.
- Sin contenido de armas, explosivos, guerra ni combate; la columna FH también.

## Regenerar

```bash
python herramientas/merge_banco.py
python herramientas/validar_banco.py
python herramientas/qc_stem.py
python herramientas/generar_matriz_y_uso.py
python herramientas/generar_xlsx.py
```

## Fuentes externas

- Pool TIMSS 2011 tomado del banco original del proyecto
  (`TIMSS/02.1.1_Banco_Reactivos_TIMSS_Conocimiento - Conocimiento.csv`).
- Los PDF de ítems liberados de TIMSS 2011 **no se versionan** en este repo por derechos
  de IEA; quedan en `TIMSS/Insumos/` como referencia local.
- Colores de la grilla: `lib/data/datasets/palette.json` y `docs/32_GRILLA_COBRE_COLORES.md`.
- Política vigente: `docs/31_POLITICA_VIGENTE.md`.
