# ISA — Plataforma funcional, independiente de la historia

Fecha: 10/11/2026. Decisión: **la plataforma tiene que funcionar sin depender del spine
narrativo.** La ficción corre fuera del submarino; dentro del submarino hay visita
(Acero) y explicación de mecanismos (Cobre). El spine se elige después.

## 1. Dos carriles separados

| Carril | Qué incluye | Depende del spine |
|---|---|---|
| **Plataforma** | Entrada, series, estaciones, preguntas, progreso, recompensas, museos, perfil | **No** |
| **Historia** | La Señal, Pez Luna, antagonistas, fechas, arco de temporadas | Sí (se define después) |

La plataforma debe poder demostrarse con contenido neutro: un museo, un compartimento,
una explicación, una pregunta, una recompensa. El relato se agrega como capa.

## 2. Experiencia dentro del submarino

- **Acero:** visita normal. Poster, nombre del espacio, descripción, objetivo,
  explicación breve y pregunta de observación. Sin ficción.
- **Cobre:** explicación de un mecanismo con **tono cómplice del veterano**. Bloque
  “Mecanismo” + cita/nota del veterano + pregunta TIMSS.
- Ambos: reintento, variante alternativa, recompensa y siguiente paso.
- Fuera del submarino (app/serie): La Señal, el ping, el POV, el misterio.

## 3. Requisitos funcionales v1

1. **Entrada:** acceso con código, Home, navegación.
2. **Selección:** panel Acero (8), grilla Cobre (20), lista Factor Humano (15).
3. **Episodio:** portada/video, texto, mecanismo/visita, pregunta, feedback.
4. **Reintento:** si falla, explicación y opción de otra variante o reintentar; el error
   no bloquea.
5. **Recompensa:** ribbon/credencial/diploma; puntos; racha.
6. **Progreso:** misiones completadas, puntos, insignias, perfil.
7. **Descubrimiento:** botón “Ver siguiente” + feed vertical sugerido.
8. **Ranking:** local diario, top 20, reinicio 24 h.
9. **Museos:** mapa y ficha de museo.
10. **Calidad:** móvil, accesibilidad, sin errores de consola, carga rápida.

## 4. Estado actual

| Requisito | Estado |
|---|---|
| Entrada y navegación | ✅ |
| Panel Acero + grilla Cobre + FH | ✅ |
| Episodio con pregunta y recompensa | ✅ |
| Reintento con otra variante / sin bloqueo | ❌ (hoy el timer falla la misión) |
| Diplomas descargables | ❌ |
| Feed vertical “siguiente” | ❌ |
| Ranking local diario | ❌ |
| Mapa y museos | ✅ |
| Perfil e insignias | ✅ |
| Móvil y accesibilidad | ✅ parcial |
| PWA/offline | ❌ |

## 5. Campos de contenido que la plataforma necesita

Independientes del spine:

- `station` / `system`: nombre ES/EN, descripción, objetivo.
- `mechanism`: explicación breve del mecanismo (Cobre).
- `veteranNote`: cita o nota del veterano (ES/EN), con crédito y autorización.
- `media`: poster/video.
- `question`: banco actual.
- `reward`: ribbon/credencial/diploma.

Nada de estos campos menciona La Señal ni a la Academia: son reutilizables con cualquier
historia.

## 6. Etapas recomendadas

**Etapa 1 — loop de episodio (visible y sin dependencias):**
- Bloque “Mecanismo” y “Nota del veterano” en Cobre.
- Reintento con explicación y otra variante; timer que no falla.
- Botón “Ver siguiente” + feed vertical sugerido.
- Criterio de aceptación: una estación de Acero y una celda de Cobre se completan sin
  bloqueo y llevan a la siguiente.

**Etapa 2 — recompensas y ranking:**
- Diploma Acero descargable con nick de pez.
- Ranking local diario (top 20, reinicio 24 h) y tarjeta compartible.
- Criterio: el diploma se descarga; el ranking se reinicia y no pide datos.

**Etapa 3 — pulido:**
- PWA/offline, accesibilidad completa, analytics agregados.
- Contenido real de veteranos/museos cuando haya autorización.

## 7. Regla de oro

Ninguna etapa de la plataforma debe esperar la definición del spine. Si una función
necesita la historia para funcionar, está mal diseñada.
