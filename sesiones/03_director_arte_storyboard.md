# Sesión 03 · Director de arte / Storyboard (Gemini + Imagen + Flow)

**Modelo sugerido:** Gemini 2.5 Flash (texto) + Imagen/ImageFX (imagen).
**Objetivo:** biblia visual, storyboard de 8–12 planos y prompts listos para Imagen y Flow.

## Paso 1 — Biblia visual (Gemini)

> Actuá como director de arte de ISA. A partir de este guion ({{GUION}}), definí:
> 1. Estilo: ilustración editorial semirrealista, documental cinematográfico, metal
>    gastado, polvo, alto contraste.
> 2. Paleta en hex: fondo `#0B0F12`, acero `#8FA3B0`, cobre `#B87333`, luz `#D9942F`.
> 3. Personaje guía **ficticio**: hombre ~60, barba gris, campera de trabajo, sin
>    insignias militares, sin rasgos de persona real.
> 4. Escenario y continuidad entre planos.
> 5. Reglas: sin armas, explosivos, guerra ni intención bélica; sin nombres reales.

## Paso 2 — Storyboard (Gemini)

> Desglosá el guion en 8–12 planos. Para cada uno: número, tiempo, encuadre, cámara,
> acción, subtítulo y fuente. Los planos deben durar 5–10 s para que Flow genere clips
> de 8 s.

## Paso 3 — Imágenes (Imagen / ImageFX)

Prompt base para todos los planos:

> Semi-realistic editorial illustration, cinematic documentary, dark steel submarine
> interior, worn metal, fine dust, warm copper light against cold steel, high contrast,
> palette #0B0F12 #8FA3B0 #B87333 #D9942F, 16:9, shallow depth of field. No text, no
> logos, no weapons, no military insignia, no identifiable real faces.

Luego un prompt por plano (ver `Acero/pilotos/AC-03_prompts_imagen.md` como ejemplo).
Guardar en `03_imagenes/` con `ISA-AC-03-P01-v1.png`.

## Paso 4 — Flow (imagen→video)

> Animate this still: slow push-in, subtle camera breathing, dust particles in the
> copper light, no people moving, documentary tone, 8 seconds, 16:9. Keep the same
> lighting and palette. No text, no weapons, no insignia.

- Un clip por plano; los que tienen personaje, movimiento mínimo.
- Versión 9:16 para Shorts: reencuadrar con sujeto en el tercio superior.

## Aceptación

- Biblia y storyboard completos.
- Cada plano con prompt de imagen y de video.
- Continuidad de personaje y paleta.
- Sin objetos bélicos.

## Handoff

Al **Productor multimedia** con storyboard, imágenes y clips.
