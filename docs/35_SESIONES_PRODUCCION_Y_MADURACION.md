# ISA — Sesiones de producción, skills y maduración multimedia

> **Actualización 10/11/2026:** las sesiones se implementan como **fábrica de prompts
> para Google** (Gemini, NotebookLM, Imagen, Flow, YouTube). Ver `sesiones/00_LEEME.md`
> y los archivos `sesiones/01…08`. Este documento conserva los roles y la hoja de
> maduración.

Documento de trabajo. Fecha: 10/11/2026. **No implementado.**

## 1. Criterio: separar roles

Una sola sesión de Arte no alcanza: guion, investigación, dirección visual,
producción de media y QA son oficios distintos y fallan distinto. Conviene separar
sesiones con contexto propio y handoffs claros.

| Sesión | Oficio | Entrega principal |
|---|---|---|
| **Documentalista** | Investigación y verificación | Ficha de datos con fuentes |
| **Guionista** | Guion y narrativa | Guion ES/EN de 90 s |
| **Director de arte / Storyboard** | Personajes, escenarios, estilo | Biblia visual + storyboard + prompts |
| **Productor multimedia** | Ejecución | Video, voz, subtítulos, Shorts |
| **Voz y personajes** | Casting y dirección de voz | Persona bible + audio |
| **QA editorial y accesibilidad** | Control de calidad | Checklist firmado |
| **Coordinador de producción** | Tracker y versiones | Estado y calendario |

Para el MVP alcanza con **4 sesiones** (Documentalista, Guionista, Director de
arte/Storyboard, Productor). Las otras se suman cuando crece el volumen.

## 2. Skills por sesión

### 2.1 Documentalista

**Rol:** investiga y verifica antes de escribir.
**Recibe:** playlist, videos con minuto, documentos de `Visita Virtual Submarino/`,
fichas de museos, banco de preguntas.
**Entrega:** ficha por estación con hechos, datos duros, artefactos, sistemas,
términos correctos, dudas abiertas y fuente por dato.
**Reglas:** no inventa; separa hecho de interpretación; marca “a revisar”; nada de
armas, explosivos ni intención bélica; sin nombres reales hasta acuerdo firmado.
**Criterios de aceptación:** cada dato tiene fuente; los dudas están explícitas.
**Handoff:** al Guionista.
**Prompt:** “Sos documentalista de ISA. Extraé de estas fuentes una ficha por
estación: función, artefactos, sistemas, 3 hallazgos y datos duros. Cada dato con
fuente y minuto. Marcá lo no verificado como ‘a revisar’. No escribas guion.”

### 2.2 Guionista

**Rol:** convierte la ficha en un guion de 90 s.
**Recibe:** ficha del Documentalista + pregunta de la app que debe quedar abierta.
**Entrega:** guion en plantilla de 8 bloques (hook, contexto, 3 hallazgos, cierre,
CTA), ES/EN, con subtítulos y notas de fuente.
**Reglas:** no resuelve la pregunta; sin adjetivación bélica; frases cortas; tono de
guía veterano; no nombres reales; cada hallazgo rima con un hotspot.
**Criterios:** 90 s leídos en voz alta; hook en 5 s; 3 hallazgos; fuente por bloque.
**Handoff:** al Director de arte/Storyboard y al Productor.
**Prompt:** “Sos guionista de ISA. Escribí el guion de 90 s de esta estación con la
plantilla adjunta, ES/EN. Tres hallazgos, hook de 5 s, cierre que deja abierta la
pregunta X. Sin armas ni guerra. Cada dato con su fuente.”

### 2.3 Director de arte / Storyboard

**Rol:** define el mundo visual y el desglose por planos.
**Recibe:** guion + ficha + paleta ISA + material real de referencia.
**Entrega:** biblia visual (personaje guía, vestuario, escenario, paleta, luz,
textura), storyboard plano a plano, shot list, prompts de imagen por plano y specs
de miniaturas/Shorts.
**Reglas:** continuidad entre estaciones; nada de armamento; el espacio real manda
sobre la fantasía; etiqueta de recreación IA; sin rostros reales sin consentimiento.
**Criterios:** cada plano tiene prompt, duración y función narrativa; el personaje se
reconoce entre estaciones.
**Handoff:** al Productor multimedia.
**Prompt:** “Sos director de arte de ISA. A partir de este guion, armá biblia visual
y storyboard plano a plano (8–12 planos) con prompts de imagen y specs de Shorts.
Mantené continuidad de personaje y paleta. Sin armas ni guerra.”

> Nota: el guionista **no** hace las imágenes; puede proponer intención visual, pero
> el diseño y el storyboard los cierra el Director de arte.

### 2.4 Productor multimedia

**Rol:** ejecuta y ensambla.
**Recibe:** guion + storyboard + assets.
**Entrega:** video 90 s 16:9, 3 Shorts 9:16, subtítulos quemados + VTT, miniatura,
transcripción, créditos y metadatos.
**Reglas:** specs técnicas (1080p, H.264, audio normalizado), nombres de archivo,
etiqueta IA, derechos y crédito, fallback del sample.
**Criterios:** reproducible en móvil y escritorio; subtítulos sincronizados; peso
razonable; créditos completos.
**Handoff:** a QA.
**Prompt:** “Sos productor multimedia de ISA. Ensamblá este guion/storyboard en video
1080p y 3 Shorts 9:16, voz IA, subtítulos ES/EN, miniatura y créditos. Seguí las
specs adjuntas y nombrá los archivos con esta convención.”

### 2.5 Voz y personajes

**Rol:** define la persona del guía y su voz.
**Entrega:** persona bible (nombre ficticio, tono, muletillas, límites), casting de
voz IA, dirección de locución, biblioteca de audios y consentimientos.
**Reglas:** guía ficticio compuesto; etiqueta IA; sin imitar la voz de un veterano
real sin consentimiento escrito.
**Handoff:** al Productor.

### 2.6 QA editorial y accesibilidad

**Rol:** control final.
**Entrega:** checklist firmado: regla no bélica, fuentes, nombres, etiqueta IA,
derechos, subtítulos, contraste, transcripción, peso, reproducción.
**Criterio:** sin checklist aprobado no se publica.

### 2.7 Coordinador de producción

**Rol:** tracker, versiones, calendario y handoffs.
**Entrega:** estado por estación (`guion → aprobado → media → QA → publicado →
reemplazado`), responsables y fechas.

## 3. Flujo entre sesiones

```
Documentalista → Guionista → Director de arte/Storyboard → Productor → QA → Publicación
                     ↑                ↑
                     └── Coordinador ─┘ (tracker y versiones)
```

- El **Documentalista** y el **Guionista** pueden trabajar en serie por estación.
- El **Director de arte** puede adelantar biblia visual una vez aprobado el primer guion.
- El **Productor** trabaja por lotes.
- **QA** no negocia: si falla, vuelve al rol anterior.

## 4. Maduración por iteraciones (simple → complejo)

| Nivel | Qué se suma | Personajes/audio | Cómo se mide | Rehacer |
|---|---|---|---|---|
| **v0.1** | 1 still + voz + subtítulos | Voz neutra, sin personaje | Carga, finalización | — |
| **v0.2** | 3–5 planos (pan/zoom) + música mínima | Guía ilustrado (retrato) | Finalización y clics | Solo media |
| **v0.3** | Storyboard completo + personaje consistente | Persona bible, voz propia, ambiente | Reconocimiento del personaje | Solo media |
| **v0.4** | 360 still + hotspots + audio espacial | Guía en escena | Interacción con hotspots | Media + visor |
| **v1.0** | 360 video / avatar opcional | Personaje animado | Métricas de inmersión | Remaster por lote |
| **v1.1+** | Remaster con estilo final | Biblioteca sonora unificada | Comparación de cohortes | Reemplazo versionado |

Reglas de la maduración:
- **Guion y datos no se rehacen** en cada nivel: solo cambia la media.
- Cada video guarda `mediaVersion` y `mediaKind`; el sample anterior queda como fallback.
- El aprendizaje (preguntas, feedback, dificultad) evoluciona por separado y no exige
  re-render del video.
- Al llegar a v1.0 se hace **remaster por lote** con la misma biblia visual y sonora.

## 5. Convenciones

- Nombres: `ISA-<temporada>-<estación>-<idioma>-<tipo>-v<versión>.<ext>`
  (ej. `ISA-AC-03-ES-master-v0.2.mp4`).
- Carpetas: `/assets/video/<temporada>/<estación>/<versión>/`.
- Créditos: museo, voluntario, voz IA, imagen IA, guionista.
- Etiqueta obligatoria en pantalla y en la ficha cuando la media sea IA.

## 6. Decisión

Crear primero **4 sesiones**: Documentalista, Guionista, Director de arte/Storyboard
y Productor multimedia. QA y Coordinador se suman cuando haya más de un lote en
producción. La primera tarea: guion + storyboard del piloto **Acero Puesto central**.
