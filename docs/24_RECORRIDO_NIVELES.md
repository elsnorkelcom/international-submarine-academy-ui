# ISA · Recorrido de niveles, badges y video (versión 1.0)

**Sesión:** S · Infraestructura de datos (continuación).
**Estado:** diseño validado en conversación con el usuario. **No implementado.**
**Fecha:** 6 de noviembre de 2026.
**Alcance:** versión 1.0 (Niveles 0 y 1), mecánica de badges/ribbons/coins, modelo de video, catálogos parametrizables e imagen compartible. Niveles 2–4 quedan como futuro.
**Relación:** complementa `docs/00_DOCUMENTO_BASE.md`, `docs/14_OPEN_BADGES.md`, `docs/20_INVENTARIO_COMPONENTES.md`, `docs/22_MODELO_DATOS_SHEET.md` y `docs/23_ADR_INFRAESTRUCTURA.md`.

---

## 1. Decisión de producto

ISA **no se presenta como una escuela formal**. Es una **serie vertical** (mobile-first, formato reels) que por debajo tiene un **sistema educativo con rigor TIMSS**.

Dos capas que conviven:

| Capa | Qué es | Dónde vive |
|---|---|---|
| **Serie pública** | Episodios y cortos de difusión | YouTube (no listados), redes, plataformas |
| **Validación educativa** | Preguntas y equivalente TIMSS | Plataforma ISA (sitio estático) |

La serie se puede mirar sin entrar a la plataforma. **Para validar conocimientos hay que entrar a ISA**, responder y obtener el reconocimiento.

Principios cerrados:

1. **Versión 1.0**, no demo.
2. **Acero es Nivel 0** y no tiene rigor TIMSS; sus preguntas son sobre funciones y actividades del episodio.
3. **Cobre es Nivel 1**, asociado a TIMSS **Conocimiento** (`knowing`).
4. **Bronce = Nivel 2 / Aplicación** y **Plata = Nivel 3 / Razonamiento**; **Oro = Nivel 4 / integración**. Se abordan cuando haya indicadores de éxito y aceptación de la comunidad submarinista.
5. Al público se le dice **Temporada 1, 2, 3…**; internamente es **Nivel 1, 2, 3…** con el metal como nombre.
6. **Todo parametrizable**: niveles, disciplinas, especialidades, temas, idiomas, reconocimientos y nombres.
7. **Bilingüe en/es** para textos y definiciones; el video conserva su **idioma original** y suma traducción.
8. **Badges planos**, sin jerarquía; ribbons y coins son capa visual/derivada.
9. **Sin login ni PII en el MVP**; la salida principal es una imagen compartible.
10. **Episodios completos alojados en YouTube como no listados**; cortos de difusión en otras plataformas.

---

## 2. Temporadas y niveles

| Etiqueta pública | Nivel interno | Metal | TIMSS | Contenido |
|---|---|---|---|---|
| Temporada 0 / intro | Nivel 0 | Acero | **Sin rigor TIMSS** | 6 videos, uno por compartimento; preguntas sobre el episodio |
| Temporada 1 | Nivel 1 | Cobre | **Conocimiento** (`knowing`) | 25 videos: 5 disciplinas × 5 especialidades |
| Temporada 2 | Nivel 2 | Bronce | Aplicación (`applying`) | Futuro |
| Temporada 3 | Nivel 3 | Plata | Razonamiento (`reasoning`) | Futuro |
| Temporada 4 / final | Nivel 4 | Oro | Integración | Gran prueba de integración, futuro |

La numeración pública de Acero (“Temporada 0” o “Temporada especial”) queda **a definir**; internamente es Nivel 0.

En datos, temporada y nivel **no se duplican**: es la misma fila con etiqueta pública y `level_number`; `timss_domain` puede ser nulo para Acero.

---

## 3. Nivel 0 — Acero

- **6 episodios**: 5 compartimentos habituales + **reactor nuclear**.
- Un video por compartimento; si hay banco, se elige al azar uno por compartimento.
- **1 pregunta por video**, basada en funciones/actividades del episodio; **sin ítem TIMSS**.
- **6 ribbons**, uno por compartimento (`Ribbon Visitante · Sala de Control`, etc.).
- **6/6 → badge de temporada Acero con forma de diplomita**, compartible como imagen.
- La sexta fixture (`AC-06`) ya existe en `lib/missions.ts`; el reactor deja de ser bonus y pasa a ser obligatorio.

La aleatoriedad y el nick se guardan localmente; sin Moodle ni servidor.

---

## 4. Nivel 1 — Cobre

- **25 episodios/videos** = 5 disciplinas STEM × 5 especialidades.
- Un video por celda; **1 pregunta TIMSS (Knowing)** por video.
- **25 ribbons**, uno por intersección, con nombre compuesto:
  - `Ribbon Tecnología · Sonar` → disciplina Tecnología, tema Sonar, especialidad **Electrónico**.
  - `Ribbon Matemática · Electricidad` → disciplina Matemática, tema Electricidad, especialidad **Electricista**.
- Las 5 especialidades son las actuales: **Maquinista, Electricista, Electrónico, Naval, Logístico**.
- **Temas** (Sonar, Electricidad, …) son catálogo, no texto libre.
- Agrupaciones visuales: 5 ribbons de una disciplina → Award Ribbon de disciplina; 5 de una especialidad → Award Ribbon de especialidad; al completar la grilla → **Coin Cobre**.
- La condición exacta de la Coin (25/25 vs. ambos recorridos vs. 10 coins) queda **a decidir**; recomendación: 25/25 + 2 reconocimientos de trayecto.

Los 31 fixtures actuales (6 Acero + 25 Cobre) coinciden con la estructura; el contenido sigue siendo placeholder.

---

## 5. Catálogos parametrizables

Nada de nombres hardcodeados. Cada catálogo es editable (Sheet privada → JSON) y no requiere código nuevo para agregar valores.

| Catálogo | Campos mínimos | Uso |
|---|---|---|
| `Niveles` | `id`, `level_number`, `metal`, `public_label_en/es`, `timss_domain` (nullable), `status` | Temporada/Nivel |
| `Disciplinas` | `id`, `code`, `name_en`, `name_es`, `color`, `order`, `status` | Columnas de la grilla |
| `Especialidades` | `id`, `code`, `name_en`, `name_es`, `order`, `status` | Filas de la grilla |
| `Temas` | `id`, `code`, `name_en`, `name_es`, `discipline_id` (opcional), `order`, `status` | Nombre del ribbon |
| `Idiomas` | `code` BCP-47, `name_en`, `name_es`, `role` (interfaz / video / subtítulo), `status` | Traducciones |
| `Reconocimientos` | `id`, `kind` (`ribbon`/`coin`/`diploma`), `name_en/es`, `criteria`, `season_id`, `discipline_id`, `specialty_id`, `topic_id`, `store_sku` (opcional), `status` | Badges y agregados |
| `Plataformas de video` | `id`, `name`, `url_pattern`, `embed_pattern`, `status` | YouTube, otras |

Reglas:

- `id` y `code` estables; los nombres en/es son obligatorios para publicar.
- Cambiar un nombre no cambia IDs ni rompe progreso.
- Agregar una disciplina, especialidad o tema no requiere deploy de código.
- Los nombres de ribbons se **componen** desde los catálogos, no se escriben uno por uno.

---

## 6. Video: YouTube no listado

**Decisión:** los episodios completos se alojan en **YouTube como no listados** y la plataforma los muestra embebidos. Los cortos de difusión van en otras plataformas.

Modelo:

| Entidad / campo | Detalle |
|---|---|
| `VideoAsset` | `id`, `episode_id`, `role` (`full`/`promo`), `platform` (`youtube`), `external_id`, `url`, `visibility` (`unlisted`), `original_language`, `duration`, `poster_url`, `rights`, `status` |
| `Subtítulos` | por idioma: `language`, `vtt_url` (archivo propio o captions de YouTube), `review_status` |
| `Transcripción` | por idioma (opcional), para accesibilidad y SEO interno |
| `Episodio` | metadatos editoriales y vínculo a uno o más `VideoAsset` |

Criterios técnicos:

- Embed con `youtube-nocookie.com` y **carga diferida** (click-to-load) para no cargar cookies de terceros hasta que el usuario reproduce.
- Sin autoplay con sonido; controles de subtítulos; `playsinline`.
- **No se usa la YouTube Data API en el navegador**: el ID se pega en la Sheet y un script valida el formato; si se quieren metadatos automáticos, se hace en GitHub Actions con una API key en secrets, nunca en el cliente.
- No se aloja video en el repo ni en el bundle.
- Los videos no listados **no son privados**: cualquiera con el enlace puede verlos. Es aceptable para una serie; no sirve como control de acceso.
- Guardar los **masters** fuera de YouTube: el canal no es backup.
- Riesgos: anuncios, restricciones por país, edad, reclamos de copyright, caída o baja del canal; **a verificar** caso por caso.
- Si más adelante se necesita acceso restringido, habrá que pasar a un CDN con URLs firmadas (costo aparte).

---

## 7. Badges, ribbons y coins

- **Badge plano**: una fila por premio, con `id`, nombre en/es, criterio, nivel, disciplina, especialidad, tema.
- **Sin jerarquía**: no hay `parent_badge_id`.
- **Ribbons y coins** son capa visual/derivada; si se exportan o venden, se promueven a badges hermanos con `kind` y metadatos de agrupación.
- **Nombre compuesto**: `Ribbon <Disciplina> · <Tema>` (ej. `Tecnología · Sonar`), localizado en/es.
- Open Badges 3.0 no tiene jerarquía nativa; si se exporta, es un `Achievement` plano.

---

## 8. Imagen compartible

- Al completar un nivel, se genera una **imagen vertical** en el navegador (Canvas o SVG→PNG): 1080×1920 y 1080×1350.
- Contenido: nombre y apellido + **nick de pez** (o solo nick en versión pública), nivel/metal, progreso, fecha, URL/QR y disclaimer “logro de juego, no certifica competencias”.
- Botones: descargar y compartir (`navigator.share`); nunca publicación automática.
- Sin email, sin PII, sin backend; el botón aparece solo al completar el nivel.
- Código corto de diploma en la imagen (referencia visual, no verificación).
- PDF, email, Google Form/Apps Script, POK/mochila y tienda quedan para etapas futuras.

---

## 9. Idioma y traducción

| Elemento | Regla |
|---|---|
| Interfaz y textos | **en/es** mediante i18n del proyecto |
| Nombres de catálogos y ribbons | `name_en` + `name_es`, obligatorios para publicar |
| Video | **idioma original** (es, pl, ru, …) en el audio |
| Traducción de video | subtítulos en/es (recomendado) y transcripción; doblaje opcional futuro |
| Derechos | autorización del museo para el video y para la traducción/subtitulado |

El video puede estar en polaco o ruso: se muestra en su idioma con subtítulos en el idioma elegido. El `LanguageCode` del contenido (en/es) no debe confundirse con el idioma original del video.

---

## 10. Sistemas implicados

| Sistema | Rol | Estado |
|---|---|---|
| GitHub Pages + Next.js estático | App y assets | Funciona |
| YouTube (no listado) | Hosting de episodios completos | Decisión 1.0 |
| Otras plataformas | Cortos de difusión | A definir |
| IndexedDB | Caché de contenido y credenciales locales | Funciona |
| localStorage | Progreso, nick, elección de video | Funciona |
| JSON versionado + Sheet privada + scripts Python | Contenido publicado | Parcial |
| Canvas/SVG en el navegador | Imagen del diploma | No implementado |
| Apps Script read-only | Acceso institucional | Sin desplegar |
| Email, PDF server-side, POK, tienda | Etapas futuras | No implementados |

---

## 11. Impacto sobre la documentación existente

| Documento | Cambio |
|---|---|
| `docs/00` §8–9 | Acero deja de ser un episodio único y de ser “Knowing”; pasa a Nivel 0 sin TIMSS. Cobre = Nivel 1 Knowing. Se mantiene Bronce/Plata/Oro como futuro |
| `docs/00` §14 | El bilingüismo en/es se amplía: video con idioma original + subtítulos/transcripción |
| `docs/20` §2–5 | Volúmenes: 6 + 25; los 31 fixtures coinciden |
| `docs/22` §5.7 | `Season.timss_domain` debe admitir nulo (Acero) y `level_number` |
| `docs/22` §5.8 | `Episode` necesita `VideoAsset`, idioma, subtítulos, póster y rol completo/promo |
| `docs/22` §5.10 | `Question.topic` pasa a catálogo `Temas`; agrega `discipline_id` y `specialty_id` |
| `docs/22` §5.11 | Reglas agregadas (`discipline-complete`, `specialty-complete`, `season-complete`, `grid-complete`) y `kind` |
| `docs/22` §5.14 | Grilla 5×5 de Cobre; Acero no usa grilla |
| `docs/14` | No todos los badges tienen que ser credenciales OB3; decidir cuáles se firman |
| `docs/12` §7 | “No hay reproducción de video” deja de ser cierto en la 1.0 |
| `docs/23` | Se agrega YouTube como sistema de video; credenciales locales sin emisor se mantienen |

---

## 12. Pendientes

1. Catálogo inicial de **5 disciplinas, 5 especialidades y temas** por nivel.
2. Condición exacta de la **Coin Cobre**.
3. Numeración pública de **Acero** (Temporada 0 o especial).
4. **Traducción**: subtítulos en/es (recomendado) o también doblaje.
5. **Derechos** de los museos para video, subtítulos y traducción.
6. Estrategia de **cortos de difusión** y calendario de publicación.
7. **Implementación** de la imagen compartible y del reproductor embebido.
8. Etapa futura: PDF/email, POK/mochila, tienda.

---

## 13. Verificación y límites

**Comprobado en el repo (6/11/2026):**

- `lib/missions.ts`: 6 misiones Acero (`AC-01`…`AC-06`) + 25 Cobre (`CU-A1`…`CU-E5`) = 31 fixtures.
- `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv`: 100 ítems, todos dominio **Knowing**, etiquetados “Nivel Cobre (8.º Grado)”; 75 con ID TIMSS en la fuente. **No hay ítems de Acero ni de Applying/Reasoning/Integration.**
- `Badge` plano; `BadgeType = credential | coin | badge`; no existe `ribbon` ni `diploma`.
- Único compartimento sembrado: `CMP-U995-CONTROL`; no existe reactor nuclear en el modelo.
- No hay reproductor de video ni generación de imagen.

**No verificado / a verificar:**

- Límites y condiciones de YouTube para videos no listados (anuncios, países, edad, reclamos).
- Derechos y disponibilidad de los videos de museos.
- Capacidades de POK u otra mochila.
- Comportamiento real de los embeds y de la generación de imagen en móviles.

**Este documento no implementa nada:** no se crearon pantallas, scripts, videos, imágenes ni endpoints. No hubo commit.
