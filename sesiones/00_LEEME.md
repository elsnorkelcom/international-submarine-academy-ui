# Sesiones ISA — fábrica de prompts para Google

Fecha: 10/11/2026. **Este archivo reemplaza el paquete anterior.** Las sesiones ya no
producen videos: producen **prompts y guiones** que vos ejecutás en Google. El trabajo
pesado (imagen, video, voz, investigación) lo hace Google.

## 1. Stack disponible

| Herramienta | Uso en ISA | Plan | Nota |
|---|---|---|---|
| **Google Drive** | Assets, respaldos, entregas | Workspace Business Basic | Carpetas por temporada/estación |
| **Google Docs** | Guiones, fichas, QA | Workspace | Exportar a Markdown si hace falta |
| **Google Sheets** | Tracker de producción | Workspace | `Acero/produccion_tracker.csv` como base |
| **Gemini** | Guion, storyboard, prompts, QA | Free o Pro | Verificar si tu Workspace Basic incluye Gemini; si no, `gemini.google.com` |
| **NotebookLM** | Investigación con fuentes y citas | Free o Plus | Subir videos, PDFs y docs; exportar briefing |
| **Imagen / ImageFX** | Imágenes por plano | Gemini/Flow | 16:9 y recortes 9:16 |
| **Flow + Veo** | Clips imagen→video, cámara | Requiere Google AI Pro/Ultra | Verificar acceso y cuotas |
| **YouTube** | Publicación y Shorts | Canal propio | Monetización y contenido original |
| **TTS** | Voz del guía | Google Cloud TTS / AI Studio / ElevenLabs | Empezar con prueba gratuita |

> Si tu Workspace Business Basic no incluye Gemini/Flow, los prompts funcionan igual en
> la versión gratuita de Gemini. Flow es el único que puede requerir suscripción
> aparte (Google AI Pro/Ultra).

## 2. Modelo para las sesiones (OpenRouter)

Las sesiones son “fábrica de prompts”: alcanza un modelo barato y bueno siguiendo
instrucciones. Sugerencia para OpenRouter:

| Tarea | Modelo recomendado | Alternativa |
|---|---|---|
| Prompts y fichas | **Gemini 2.5 Flash** | Gemini 2.5 Flash-Lite, DeepSeek V3 |
| Guiones con matiz | **Claude Haiku 4.5** o Gemini 2.5 Flash | GPT-5 mini |
| Revisión/QA | Gemini 2.5 Flash | DeepSeek V3 |
| Nada | No uses modelos caros (Opus/GPT-5 full) para prompts | — |

Dentro de DSH, el proveedor registrado hoy es **DeepSeek** (y tenés el bundle de
ChatGPT). Para no gastar, creá las sesiones con el modelo DeepSeek más barato y dejá
este chat de dirección como excepción.

## 3. Reglas de presupuesto

- Cada sesión debe cerrar en **3–5 turnos**: pegar prompt, recibir salida, copiar y listo.
- Las sesiones no llaman APIs ni leen archivos gigantes; solo texto.
- Los prompts usan placeholders (`{{ESTACION}}`, `{{IDIOMA}}`) para reutilizar en 27 estaciones.
- Assets en Drive/YouTube, no en el repo.
- Sin claves de API dentro de DSH.

## 4. Estructura en Drive

```
ISA Produccion/
  00_Tracker/ISA_tracker.xlsx
  01_Acero/
    AC-03/
      01_ficha/
      02_guion/
      03_imagenes/
      04_video/
      05_audio/
      06_subs/
      07_shorts/
      08_publicado/
  02_Cobre/
  03_FactorHumano/
```

## 5. Flujo

1. **Documentalista** → NotebookLM: ficha con citas.
2. **Guionista** → Gemini: guion 90 s ES/EN.
3. **Director de arte/Storyboard** → Gemini + Imagen + Flow: biblia, planos, prompts.
4. **Productor** → Flow/TTS/edición + YouTube: clips, voz, subtítulos, Shorts.
5. **QA** → Gemini: checklist y política de YouTube.
6. **Coordinador** → Sheets: estados, fechas y versiones.

## 6. Aprobaciones

- ISA aprueba guion y QA.
- El museo valida solo cuando haya acuerdo y material propio.
- Sin QA no se publica.
- Etiqueta de IA visible en video y descripción de YouTube.

## 7. Índice de sesiones

| Archivo | Sesión | Herramienta |
|---|---|---|
| `01_documentalista.md` | Documentalista | NotebookLM + Gemini |
| `02_guionista.md` | Guionista | Gemini |
| `03_director_arte_storyboard.md` | Director de arte / Storyboard | Gemini + Imagen + Flow |
| `04_productor_multimedia.md` | Productor | Flow / TTS / edición |
| `05_voz_personajes.md` | Voz y personajes | TTS / Gemini |
| `06_qa_accesibilidad.md` | QA | Gemini |
| `07_coordinador_produccion.md` | Coordinador | Sheets + Drive |
| `08_youtube_monetizacion.md` | Publicación | YouTube |
| `09_presets_dsh.md` | Las ocho sesiones como presets de DSH | DSH |

Las ocho sesiones existen además como presets de agente de DSH
(`sesiones/dsh-presets/`), así que se abren desde el selector de sesión nueva sin pegar
el prompt de arranque. Ver `09_presets_dsh.md`.
