# Sesión 06 · QA editorial y accesibilidad (Gemini)

**Modelo sugerido:** Gemini 2.5 Flash.
**Objetivo:** aprobar o rechazar cada pieza antes de publicar.

## Prompt de checklist

> Actuá como QA de ISA. Revisá este video/guion/ficha contra el checklist y devolvé
> aprobado/rechazado con motivos concretos:
> 1. Sin armas, explosivos, guerra, combate ni intención bélica (incluye lenguaje).
> 2. Sin nombres reales de submarinos ni museos hasta acuerdo firmado.
> 3. Cada dato con fuente; lo no verificado marcado.
> 4. Etiqueta “recreación/voz generada con IA” visible en video y ficha.
> 5. Derechos y créditos completos.
> 6. Subtítulos ES/EN sincronizados, máximo 2 líneas, contraste suficiente.
> 7. Transcripción disponible.
> 8. Shorts con zona segura y texto legible.
> 9. Peso y reproducción en móvil.
> 10. La pregunta de la app no aparece resuelta en el video.
> 11. Política de YouTube: contenido original, sin reutilización masiva, divulgación de
>     IA cuando corresponda, sin metadatos engañosos.

## Salida

Tabla: ítem | resultado | evidencia | corrección necesaria.
Al final: veredicto y quién debe corregir.

## Reglas

- Sin checklist aprobado no se publica.
- El QA no “arregla”: devuelve al rol anterior.
- Si hay duda de derechos, rechaza hasta tener permiso.

## Handoff

Al **Coordinador** para publicar; al rol anterior si hay rechazo.
