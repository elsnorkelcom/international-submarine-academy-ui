# ISA — Kit de guiones y producción de video

> **Actualización 10/11/2026:** el flujo vigente es la **fábrica de prompts para
> Google** (Gemini, NotebookLM, Imagen, Flow, YouTube). Ver `sesiones/00_LEEME.md`.
> Este documento queda como especificación de formato, reglas y tracker.

Documento de trabajo para la sesión de Arte y para ISA. Fecha: 10/11/2026. **No implementado.**

## 1. Formato base (MVP Acero y Cobre)

Cada estación produce un **video principal** y sus **Shorts**:

| Pieza | Formato | Duración | Uso |
|---|---|---|---|
| Video de estación | 16:9 · 1920×1080 (y 1280×720) | 60–120 s | Experiencia en `/episodes` |
| Short | 9:16 · 1080×1920 | 30–60 s | Difusión y descubrimiento |
| Miniatura | 16:9 · 1280×720 | — | Card del episodio y catálogo |

Base visual del MVP: **una imagen** (still, ilustración o frame 360) con movimiento
suave de cámara (zoom/pan lento) + **voz IA** + **subtítulos ES/EN**. La imagen es
provisoria: se reemplaza cuando el museo o el voluntario entrega su material.

## 2. Estructura narrativa (90 s)

| Tramo | Tiempo | Qué pasa |
|---|---|---|
| Hook | 0–5 s | Pregunta o dato que detiene el scroll |
| Contexto | 5–15 s | Dónde estamos y por qué importa |
| Hallazgos | 15–70 s | 3 hallazgos concretos (uno por bloque) |
| Cierre | 70–85 s | Idea que queda + gancho a la pregunta de la app |
| CTA | 85–90 s | “Respondé en ISA” / “Visitá este museo” |

Reglas: frases cortas, presente, sin adjetivación bélica, sin explicar armas ni
explosivos. La distinción ficción/historia se mantiene: la voz puede ser un personaje,
pero el contenido histórico se cita.

## 3. Plantilla de guion (una estación)

| # | Tiempo | Visual | Voz ES | Subtítulo ES | Voz EN | Subtítulo EN | Fuente / minuto |
|---|---|---|---|---|---|---|---|
| 1 | 0:00–0:05 | … | … | … | … | … | … |
| 2 | 0:05–0:15 | … | … | … | … | … | … |

Campos obligatorios: ID de estación, título ES/EN, una pregunta de la app que engancha,
3 hallazgos, fuente por hallazgo, duración objetivo, tipo de asset (sample IA / voluntario
/ museo 360), créditos y estado.

## 4. Reglas editoriales

- Nada de armas, explosivos, guerra, combate ni intención bélica.
- Sin nombres de submarinos ni museos reales hasta que exista acuerdo firmado; el
  piloto usa nombres genéricos.
- Cada dato con fuente (video, minuto, documento, museo). Lo no verificado se marca
  “a revisar” y no se locuta.
- Toda recreación IA se declara: “Imagen y voz generadas con IA · recreación”.
- El guion no cierra la pregunta: la deja abierta para la app.

## 5. Producción: tres niveles

| Nivel | Asset | Quién | Cuándo |
|---|---|---|---|
| **A. Sample IA** | Imagen + voz IA + subtítulos | ISA / Arte | Siempre, como base y referencia |
| **B. Voluntario** | Video real enviado por un voluntario/museo | Voluntario + ISA valida | Reemplaza el sample de esa estación |
| **C. Museo 360** | Captura 360/8K del museo | Museo + producción ISA | Fase posterior |

El **sample IA nunca se borra**: queda como fallback y como referencia de estilo para
los voluntarios.

## 6. Flujo de reemplazo por video real

1. El voluntario elige una estación y descarga la **guía de envío** (formato, duración,
   audio, derechos).
2. Envía video + consentimiento de imagen/voz + créditos + fuente.
3. ISA revisa derechos y contenido (regla no bélica, exactitud).
4. El museo valida si corresponde.
5. Se publica el video real y queda registrada la versión; el sample queda como
   fallback.
6. El crédito aparece en la ficha: nombre/pseudónimo, museo, país, rol.

Campos previstos en el modelo (a implementar): `mediaUrl`, `mediaKind`
(`ai-sample` / `volunteer` / `museum`), `mediaCredit`, `mediaSourceUrl`,
`mediaStatus`, `posterUrl`, `shortsUrl`.

## 7. Shorts

- 3 cortes por estación: hook-dato, hallazgo visual y cierre-pregunta.
- Subtítulos grandes, quemados y también archivo `.srt` para accesibilidad.
- Zona segura: dejar 220 px arriba y 320 px abajo para UI de las plataformas.
- CTA: “La historia completa en ISA” + enlace.
- Mismo guion, distinto montaje: no escribir dos veces.

## 8. “Máxima”: todos los museos con videos ISA

Meta: **N museos × estaciones**, cada estación con su video ISA (primero sample IA,
luego real si el museo colabora). La cobertura se mide como porcentaje del catálogo:

- Museo con ficha: 159 (ya cargados).
- Museo con al menos un video ISA: métrica de cobertura.
- Estación con video propio: métrica por museo.
- Video reemplazado por el museo: métrica de participación.

### Plan por lotes

1. **Lote 0 — referencia:** Acero Puesto central (sample IA) + Cobre Periscopio.
2. **Lote 1 — Acero completo:** 7 estaciones + especial nuclear.
3. **Lote 2 — Cobre:** 20 sistemas (o los 20 de mayor valor).
4. **Lote 3 — voluntarios:** primeros 3 museos, 1 estación cada uno.
5. **Lote 4 — escala:** 7 estaciones por museo, en tandas de 3 museos.

### Roles y capacidad

| Rol | Qué hace |
|---|---|
| Guionista (Arte) | Escribe guiones ES/EN con la plantilla |
| Editor de contenido ISA | Verifica reglas, fuentes y preguntas asociadas |
| Verificador histórico | Contrasta datos con el museo o fuentes |
| Producción de media | Imagen/360, voz IA, edición, subtítulos |
| Localización | ES/EN, revisión de subtítulos |
| QA | Accesibilidad, peso, reproductor, exactitud |
| Enlace de museo | Derechos, validación, crédito |

Capacidad estimada: sample IA por estación en 1–2 días de producción; lote de 7
estaciones en 2–3 semanas; cada reemplazo voluntario suma revisión + publicación.

## 9. ¿La sesión de Arte está preparada?

Hoy la sesión de Arte está briefeada para **identidad visual, badges y piezas**. Para
que además escriba guiones y gestione producción necesita este kit, que define:

- formato, plantilla de guion y ejemplos;
- reglas editoriales y de IA;
- tracker de producción y estados;
- checklist de QA y de derechos;
- paquete de prompts de imagen/voz;
- specs de Shorts y miniaturas.

Con eso puede **escribir guiones y llevar el tracker**; la validación histórica, los
derechos y la aprobación final quedan en ISA y el museo.

## 10. Próximos pasos

1. Aprobar el formato base (90 s + 3 Shorts, ES/EN, voz IA + subtítulos).
2. Producir el **piloto de referencia** (Acero Puesto central) con imagen IA.
3. Pasar el kit a la sesión de Arte y abrir el tracker.
4. Implementar en la app el reemplazo de video por estación (campos y ficha con crédito).
5. Medir el piloto con betatesters antes de escalar.
