# Grilla Cobre · sistema de color por temporada

**Estado:** propuesta v1.0, 9/11/2026.
**Fuente de verdad:** `lib/data/datasets/palette.json` (todos los hex salen de ahí).
**Visual:** `artifacts/grilla-cobre/grilla-cobre.png` y `paleta-temporadas.png`.

## 1. Principio: el color informa cuatro cosas

| Canal | Qué comunica | Cómo |
|---|---|---|
| **Nivel / temporada** | El metal del nivel | Familia metálica: acero, cobre, bronce, plata, oro |
| **Disciplina STEM** | La dimensión | Tono STEM mezclado con el metal de la temporada |
| **Especialidad** | La fila | Paso metálico de la temporada (5 pasos, del oscuro al claro) |
| **Variante** | Cuál de las 3 preguntas | Matiz del color de la disciplina (100 %, 78 %, 56 %) |

El color no va solo: siempre está acompañado por código y etiqueta (`SCI`, `MAQ`,
`V1 V2 V3`). Así el sistema funciona también para daltonismo y en impresión.

## 2. Regla de composición (parametrizable)

```
colorDisciplina = mezclar(tonoSTEM, metalTemporada, 0.28)
                → subir saturación ×1.22
                → garantizar contraste ≥ 4.5:1 sobre #0A0A0A
especialidad    = rampa de 5 pasos del metal (±16 % hacia negro/blanco)
variante        = colorDisciplina mezclado hacia el fondo (0 %, 22 %, 44 %)
```

Todo está en `palette.json`: si cambian los colores STEM del logo, se edita **una sola
tabla** y se regeneran la grilla y las planillas. **Nada está hardcodeado** en componentes.

## 3. Metales de temporada

| Temporada | Metal | Hex |
|---|---|---|
| Acero | Acero | `#8FA3B0` |
| Cobre | Cobre | `#B87333` |
| Bronce | Bronce | `#CD7F32` |
| Plata | Plata | `#C0C7CE` |
| Oro | Oro | `#D4AF37` |

**Acero no lleva dimensiones STEM**: se representa con su metal, sin codificación de
disciplina (no tiene preguntas TIMSS). Cobre en adelante usa la mezcla.

## 4. Cobre · colores de dimensión

| Dimensión | Hex | Contraste sobre fondo |
|---|---|---|
| Ciencia | `#D8A423` (amarillo cobreado) | 8,72:1 |
| Tecnología | `#5E83A1` (azul cobreado) | 4,94:1 |
| Ingeniería | `#D0621B` (cobre encendido) | 5,13:1 |
| Matemática | `#A26E9E` (violeta cobreado) | 4,96:1 |
| Factor Humano | `#C97575` (cobre rosado) | 5,93:1 |

Rampa de especialidad en Cobre: `#855930` · `#9B612B` · `#B87333` · `#C38954` · `#CFA074`
(MAQ → LOG). Los dos primeros pasos son estructurales (barras), no texto; siempre van con
la etiqueta de la fila.

## 5. Colores STEM: provisionales hasta el logo

Los tonos base actuales son una aproximación (amarillo, azul, naranja, violeta, rosa).
Cuando el equipo de arte entregue los colores del logo, se reemplazan en `palette.json`
bajo `stem` y se regeneran las imágenes con `render_palette.py`. Ningún componente ni
documento necesita cambios.

## 6. Uso en la app

1. `palette.json` es la única fuente; el componente de grilla lee los tokens.
2. En CSS se exponen como variables (`--grid-sci`, `--grid-tec`, …) generadas desde el
   JSON; no se escriben hex en los componentes.
3. Estados: disponible (borde + barra de dimensión), completada (color + ícono, nunca solo
   color), bloqueada (gris al 40 % con etiqueta), en revisión (`R` cobre).
4. Las Challenge Coins y badges usan la misma familia: metal del nivel + tono de la
   disciplina; los PNG actuales son provisorios hasta la sesión de Arte.

## 7. Accesibilidad

- Contraste AA/AAA en todo el texto; los cinco colores de Cobre superan 4,5:1 sobre fondo.
- La información nunca depende solo del color: códigos, etiquetas, `V1 V2 V3`, `R`.
- No se usa el verde neón de CTA (`#00FF88`) para texto de grilla.
- Las barras metálicas de especialidad son elementos estructurales (≥ 3:1), no texto.

## 8. Pendientes

1. Reemplazar los tonos STEM por los del logo oficial (equipo de arte).
2. Definir arte final de badges con esta lógica de metal + disciplina.
3. Construir el componente real de grilla y verificar contraste en navegador.
