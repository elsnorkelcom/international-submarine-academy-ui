# ISA · Spreadsheet base

Archivo: [`templates/ISA_Base.xlsx`](../templates/ISA_Base.xlsx)
Generador: [`scripts/build_sheet_base.py`](../scripts/build_sheet_base.py)
Fuente del esquema: [`docs/22_MODELO_DATOS_SHEET.md`](22_MODELO_DATOS_SHEET.md)

---

## 1. Qué contiene

18 pestañas: una guía (`LEEME`) y 17 componentes del modelo aprobado.

| Pestaña | Columnas | Naturaleza |
|---|---|---|
| `Config` | 7 | Editable |
| `Instituciones` | 11 | Editable |
| `Claves` | 9 | Editable, nunca publicada |
| `Museos` | 28 | Editable |
| `Compartimentos` | 8 | Editable |
| `Sistemas` | 10 | Editable |
| `Temporadas` | 12 | Editable |
| `Episodios` | 15 | Editable |
| `Misiones` | 18 | Editable |
| `Reactivos` | 23 | Editable |
| `Insignias` | 15 | Editable |
| `Roles` | 7 | Editable |
| `Disciplinas` | 7 | Editable |
| `Grilla_5x5` | 7 | Editable |
| `Credenciales_Emitidas` | 15 | Append-only (etapa futura) |
| `Propuestas` | 12 | Futuro |
| `Metricas` | 9 | Futuro, calculada |

Total: **213 columnas**.

## 2. Cómo usarla

1. Subir `ISA_Base.xlsx` a Google Drive.
2. Abrirlo con Google Sheets (Drive lo convierte).
3. Mantenerla **privada**: solo la comparten los 1–3 editores.
4. Borrar el contenido de `LEEME` cuando ya esté claro, o dejarlo como documentación viva.
5. Empezar a cargar por `Roles`, `Disciplinas`, `Temporadas` y `Grilla_5x5`, que son las tablas de menor volumen y de las que dependen las demás.

Los encabezados son técnicos (`snake_case`). Cada celda de encabezado tiene una **nota** con:

- tipo de dato,
- si es obligatorio,
- valor por defecto,
- si es bilingüe,
- observaciones.

Las columnas de estado tienen **lista desplegable** con los valores permitidos.

## 3. Reglas de carga

| Regla | Motivo |
|---|---|
| No renombrar ni reordenar encabezados | Los scripts de sync mapean por nombre |
| No agregar columnas sin actualizar el modelo | El sync valida columnas desconocidas |
| Una fila por registro, `id` estable | Las URLs y relaciones dependen del ID |
| `_en` y `_es` juntos cuando el campo es bilingüe | El export publica ambos |
| Estados sólo desde la lista | Evita valores inválidos silenciosos |
| Nada de datos personales en hojas publicadas | `contactName`/`contactEmail` quedan fuera por decisión U5 |

## 4. Regenerar el archivo

Cuando cambie `docs/22`:

```bash
python3 scripts/build_sheet_base.py --check   # ver componentes y columnas
python3 scripts/build_sheet_base.py           # regenerar templates/ISA_Base.xlsx
```

El script falla si no encuentra tablas en el modelo, así que nunca genera un archivo vacío.

## 5. Verificación realizada

```text
Componentes: 17
Columnas totales: 213
Escrito: templates\ISA_Base.xlsx (53199 bytes)
```

Comprobado con `openpyxl`:

- 18 hojas presentes y en orden.
- `Museos` con 28 encabezados y 3 columnas con validación.
- `Reactivos` con 23 encabezados y 3 validaciones.
- `Grilla_5x5` con 7 columnas.
- Comentarios de cabecera presentes.

## 6. Qué sigue

1. Cargar las tablas base (roles, disciplinas, temporadas, grilla).
2. Escribir los scripts de sync por área tomando el mismo patrón que `sync_museums.py` y `sync_config.py`.
3. Importar los volúmenes reales: 160 museos y 100 reactivos curados.
4. Recién después, sesiones por incumbencia (B, C, D, E) consumiendo JSON versionado.
