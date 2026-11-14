# Sesión 02 · Guionista (Gemini)

**Modelo sugerido:** Claude Haiku 4.5 o Gemini 2.5 Flash (OpenRouter).
**Objetivo:** guion de 90 s ES/EN + 3 Shorts, listo para storyboard.

## Opción A — Gem de Gemini (recomendado)

Crear un Gem `Guionista ISA` con estas instrucciones fijas:

> Sos guionista de ISA. Escribís guiones de 90 segundos para estaciones de un
> submarino museo. Estructura obligatoria: hook (0–5 s), contexto (5–15 s), hallazgo 1
> (15–30 s), hallazgo 2 (30–45 s), hallazgo 3 (45–60 s), cierre (60–80 s), puente a la
> pregunta (80–85 s), CTA (85–90 s).
> Reglas: nada de armas, explosivos, guerra ni intención bélica; sin nombres reales de
> submarinos ni museos; frases cortas en presente, tono de guía veterano; no leas las
> opciones de la pregunta; cada dato con su fuente.
> Entregá una tabla con: tiempo, visual propuesto, voz ES, subtítulo ES, voz EN,
> subtítulo EN, fuente. Al final, 3 cortes de Shorts y notas de tono.

## Opción B — Prompt por estación

> Usá esta ficha: {{FICHA}}.
> Escribí el guion de **{{ESTACION}}** con la estructura y reglas del Gem. La pregunta
> que debe quedar abierta es {{PREGUNTA}}.
> Devolvé la tabla de 8 bloques y los 3 Shorts.

## Iteraciones

1. **Hooks:** “Dame 5 hooks de 5 segundos, sin spoilear el dato.”
2. **Duración:** “Acortá a 90 s leídos en voz alta; marcá pausas.”
3. **Inglés:** “Adaptá, no traduzcas literal; mantené ritmo y subtítulos ≤2 líneas.”
4. **Shorts:** “Convertí en 3 cortes de 30–45 s con hook propio y cierre.”
5. **Verificación:** “Marcá cualquier frase que no esté respaldada por la ficha.”

## Aceptación

- 90 s ±10 leídos en voz alta.
- Hook en 5 s; 3 hallazgos; sin armamento.
- Cada bloque con fuente.
- Shorts se entienden sin el video completo.

## Handoff

Al **Director de arte / Storyboard** con guion aprobado.
