# Sesión 01 · Documentalista (NotebookLM + Gemini)

**Modelo sugerido:** Gemini 2.5 Flash (OpenRouter) o DeepSeek barato.
**Objetivo:** ficha verificada de cada estación, con citas, antes de escribir.

## Paso 1 — NotebookLM

1. Crear notebook `ISA — {{ESTACION}}`.
2. Subir fuentes: `Acero/estaciones_acero.md`, `Acero/preguntas_acero.csv`,
   documentos de `Visita Virtual Submarino/`, y los links de YouTube de la playlist
   (Abtao 360 `D4-JeWuErfw`, Museo Abtao `Q74oD1WwbWg`).
3. Pegar este prompt:

> Actuá como documentalista de ISA. Con las fuentes cargadas, prepará una ficha de
> **{{ESTACION}}** con:
> 1. Función del espacio en lenguaje civil.
> 2. Artefactos y sistemas visibles (5–8).
> 3. Tres hallazgos narrables (hecho + por qué importa).
> 4. Datos duros (medidas, materiales, época).
> 5. Dudas abiertas y lo que falta verificar.
> 6. Cita numerada [1], [2]… por cada dato, indicando fuente y, si es video, minuto
>    aproximado.
> Reglas: nada de armas, explosivos, guerra ni intención bélica; sin nombres reales de
> submarinos ni museos; separá hecho de interpretación; marcá “revisar” lo no verificado.
> Formato: tabla + lista de dudas al final.

4. Exportar a Docs y guardar en `ISA Produccion/01_Acero/{{ESTACION}}/01_ficha/`.

## Paso 2 — Gemini (control de calidad)

> Revisá esta ficha como editor escéptico. Marcá: (a) datos sin cita, (b) afirmaciones
> que parecen inventadas, (c) lenguaje bélico o nombres reales, (d) contradicciones con
> las fuentes. Devolvé solo la lista de correcciones y la ficha corregida.

## Salida esperada

- `{{ESTACION}}_ficha.md` o Docs con citas.
- Lista de dudas para que ISA decida.

## Aceptación

- Cada hallazgo tiene cita.
- No hay contenido bélico ni nombres reales.
- Las dudas están explícitas.
- Sirve para escribir el guion sin volver a investigar.

## Handoff

Al **Guionista** con la ficha y las preguntas de la estación.
