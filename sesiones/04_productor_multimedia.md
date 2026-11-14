# Sesión 04 · Productor multimedia (Flow + TTS + edición)

**Modelo sugerido:** Gemini 2.5 Flash para prompts; edición manual.
**Objetivo:** ensamblar el video de 90 s y los 3 Shorts, con voz y subtítulos.

## Paso 1 — Clips (Flow / Veo)

Para cada plano del storyboard:

> Image-to-video, 8 s, 16:9, slow camera move ({{MOVIMIENTO}}), documentary tone,
> consistent copper light, no text, no weapons, no insignia. Seed/referencia: {{IMAGEN}}.

Reglas: movimientos lentos, sin giros bruscos, sin caras reales, sin objetos bélicos.
Para Shorts: mismo prompt en 9:16.

## Paso 2 — Voz (TTS)

> Voz masculina, ~60 años, cálida, pausada, sin épica. Español neutro latinoamericano,
> 140 palabras/min. Leer con pausas de 0,5 s después de cada hallazgo. Sin exclamaciones.

Inglés: misma persona, inglés neutro, 145 palabras/min.
Herramientas: Google Cloud TTS, AI Studio o ElevenLabs (probar 2–3 voces y elegir una).
Guardar muestras en `05_audio/`.

## Paso 3 — Subtítulos

> Generá un archivo .vtt con estos textos, máximo 2 líneas por entrada, sincronizado a
> los tiempos del guion. Español e inglés por separado.

Alternativa: subtítulos automáticos de YouTube y corregir a mano.

## Paso 4 — Edición

Google Vids, CapCut o similar:
- 16:9 máster 1920×1080, 90 s.
- 9:16 Shorts 1080×1920, 30–45 s.
- Música/ambiente suave, sin protagonismo.
- Etiqueta “Imagen y voz generadas con IA · recreación” en esquina.
- Miniatura 16:9 sin texto quemado.

## Paso 5 — Entrega

```
ISA-AC-03-ES-master-v0.1.mp4
ISA-AC-03-ES-short-01-v0.1.mp4 … 03
ISA-AC-03-ES-subtitles.vtt
ISA-AC-03-poster-16x9.webp
ISA-AC-03-credits.md
```

Especificaciones completas en `Acero/pilotos/AC-03_produccion.md`.

## Aceptación

- Reproduce en móvil y escritorio.
- Subtítulos sincronizados, 2 líneas máximo.
- Shorts con zona segura (220 px arriba, 320 px abajo).
- Créditos y etiqueta IA.
- Máster < 60 MB.

## Handoff

A **QA** antes de publicar.
