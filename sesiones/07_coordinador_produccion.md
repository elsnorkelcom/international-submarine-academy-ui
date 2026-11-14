# Sesión 07 · Coordinador de producción (Sheets + Drive)

**Modelo sugerido:** Gemini 2.5 Flash.
**Objetivo:** tracker, carpetas, versiones y calendario.

## Planilla (Google Sheets)

Copiar `Acero/produccion_tracker.csv` y agregar columnas:

| Columna | Uso |
|---|---|
| `id` | AC-03, COB-… |
| `estado` | guion / aprobado / storyboard / media / QA / publicado / reemplazado |
| `responsable` | quién tiene la pelota |
| `fecha_objetivo` | fecha |
| `version_media` | v0.1, v0.2… |
| `url_drive` | carpeta de la estación |
| `url_youtube` | video publicado |
| `bloqueos` | qué falta |

## Prompt para generar la planilla

> Generá una tabla de producción para las 8 experiencias de Acero y las 20 de Cobre,
> con las columnas indicadas, estados iniciales “pendiente” y las URL vacías. Devolvé
> CSV listo para pegar en Google Sheets.

## Rutina semanal

1. Revisar estados y bloqueos.
2. Confirmar qué estación pasa a QA.
3. Publicar solo lo aprobado.
4. Actualizar `url_youtube` y `version_media`.
5. Registrar créditos y consentimientos.

## Reglas

- El sample IA no se borra.
- Cada reemplazo por video real se versiona.
- Sin QA no hay publicación.

## Salida

- Planilla viva en Drive.
- Resumen semanal de 5 líneas para ISA.
