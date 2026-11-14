# Assets generados con IA — carpeta de trabajo

**No es producción.** Todo lo de acá es **exploración de concepto** hasta que se
vectorice. Nada de esta carpeta se publica ni se copia a `public/` directamente
(decisión 6 de la sesión de arte: prompts para concepto, arte final vectorial).

## Estructura

```
artifacts/badges-gemini/
├── _ancla/          ← la imagen de referencia aprobada (fija el estilo)
├── _descartadas/    ← pruebas que no sirven (se guardan para no repetir errores)
└── cobre/
    └── <badge-id>/  ← una carpeta por badge
        ├── v01.png
        ├── v02.png
        └── prompt.txt   ← el prompt exacto que generó esas versiones
```

## Convención de nombres

| Campo | Formato | Ejemplo |
|---|---|---|
| Temporada | minúscula | `cobre`, `acero`, `bronce`, `plata`, `oro` |
| Badge ID | minúscula, guiones | `ribbon-sci-maq`, `coin-integral`, `coin-esp-maq` |
| Versión | `vNN` | `v01`, `v02` |

Ruta completa: `cobre/ribbon-sci-maq/v03.png`

**Regla:** siempre guardar el `prompt.txt` junto a las imágenes. Sin el prompt, la
versión no se puede reproducir.

## Flujo de aprobación

1. Generar en `cobre/<badge-id>/v01.png`.
2. Revisar con el checklist de abajo.
3. Si sirve como referencia de estilo → copiar a `_ancla/`.
4. Si falla → mover a `_descartadas/` y regenerar con `v02`.
5. Las aprobadas se vectorizan **fuera** de esta carpeta.

## Checklist por imagen (30 segundos)

| ✔ | Control | Si falla |
|---|---|---|
| ☐ | Sin texto, letras ni números | Descartar y regenerar |
| ☐ | Sin armas, insignias, banderas, condecoraciones | Descartar y regenerar |
| ☐ | Sin caras ni figuras humanas | Descartar y regenerar |
| ☐ | El símbolo se reconoce en blanco y negro | El símbolo está mal, no el prompt |
| ☐ | Anillo exterior vacío | Regenerar |
| ☐ | Fondo oscuro sin props | Regenerar |
| ☐ | Composición centrada y simétrica | Regenerar |
| ☐ | Sin marcas de agua ni firmas | Descartar |

## Recordatorios

- Gemini **no respeta los hex exactos**. El color sirve como dirección, no como valor final.
- El **ancla de estilo** es la imagen aprobada en `_ancla/`. Para que las demás se
  parezcan, se usa el mismo prompt estándar cambiando **solo el símbolo central**.
- Ver `docs/37_PROMPTS_BADGES.md` para el sistema completo y `docs/39_GUIA_USO_QA.md`
  para el QA de la familia.
