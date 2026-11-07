# ISA · Universo SNK

Mapa de productos, contratos de datos y cómo se gestiona el ecosistema elSnorkel desde agentes.

---

## 1. Inventario real

| Producto | URL | Estado | Tecnología | Rol |
|---|---|---|---|---|
| **ISA** (plataforma educativa) | academy.elsnorkel.com | En desarrollo | Next.js, export estático | Serie, misiones, acreditaciones |
| **Submarinos Museo del Mundo** | submarinos-museo-del-mundo.elsnorkel.com | Publicado | HTML/CSS/JS + Leaflet + markercluster | **Puerta de entrada** al archivo |
| **Blog elSnorkel** | www.elsnorkel.com | Publicado | Blog | Datos, historias e historial del mapa |
| **Canal de YouTube** | @elSnorkelcom | Activo | — | Insumo audiovisual de episodios |
| **LinkedIn / Facebook** | company/elsnorkel-com · elSnorkelcom | Activos | — | Distribución |

Hoy cada producto tiene **su propia copia de los datos**: ISA tiene `museums-snk-2025.json`, el mapa tiene `data/submarines.json`, y ambos derivan de la misma Sheet publicada.

## 2. Problema central

Cuatro consumidores, una sola realidad. Si cada uno mantiene su copia:

- una corrección de museo hay que aplicarla cuatro veces;
- los IDs se desincronizan;
- los enlaces cruzados se rompen;
- nadie sabe cuál es la versión vigente.

El pedido es explícito: **una sola base de referencia actualizada**. Eso es un contrato de datos, no una app.

## 3. Decisión recomendada: tres capas

```text
┌─────────────────────────────────────────────────────────────┐
│ CAPA 1 · FUENTE ÚNICA                                        │
│  Un workbook privado (Google Sheets)                         │
│  - Museos (núcleo compartido, una fila por casco)            │
│  - Contenido ISA (temporadas, misiones, reactivos, sellos)   │
│  - Config del mapa (iconos, colores, featured)               │
│  Editan: 1–3 personas. Nunca se publica directo.             │
└──────────────────────────┬──────────────────────────────────┘
                           │ scripts de sync + validación
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ CAPA 2 · ARTEFACTO PUBLICADO                                  │
│  Repositorio `snk-data` (o releases de ISA)                  │
│  - museums.json (núcleo, con provenance por campo)            │
│  - isa-content.json                                          │
│  - manifest.json (versión + sha256 + fecha)                  │
│  Servido por CDN (jsDelivr/raw) con URL versionada            │
└──────────┬──────────────────┬───────────────────┬────────────┘
           ▼                  ▼                   ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ CAPA 3       │   │ ISA              │   │ Blog             │
│ Mapa Leaflet │   │ academy.         │   │ www.elsnorkel.com│
│ (entrada)    │   │ elsnorkel.com    │   │ (historia)       │
└──────────────┘   └──────────────────┘   └──────────────────┘
           YouTube + redes: distribución de la capa 3
```

**Regla:** la capa 2 es de solo lectura y está versionada. Ninguna app lee la Sheet en runtime.

## 4. ¿Sección dentro de ISA o proyectos separados?

**Proyectos separados, con un contrato común.** Motivos:

| Criterio | Monorepo con apps | Repos separados + datos compartidos |
|---|---|---|
| Cambio coordinado de datos | Atómico | Requiere publicar artefacto |
| Complejidad de build | Alta (3 builds, 3 despliegues) | Baja por repo |
| Riesgo de romper el mapa al tocar ISA | Alto | Nulo |
| Onboarding de agentes | Peor (contexto enorme) | Mejor (contexto acotado) |
| Autonomía de cada producto | Baja | Alta |

Excepción razonable: si en el futuro el blog y el mapa se rehacen en el mismo stack, evaluar monorepo. Hoy no conviene.

**Dentro de ISA** sí conviene una sección de ecosistema (página `/universo` o un bloque en Home) que **enlace** a mapa, blog, YouTube y redes — como escaparate, no como copia.

## 5. Contrato de datos v1

### Núcleo compartido: `museums.json`

Una fila por casco. Columnas que ya existen en la Sheet, agrupadas:

| Grupo | Campos | Consumidor |
|---|---|---|
| Identidad | `id`, `dossier`, `name`, `museum_name`, `country`, `city` | todos |
| Técnico | `vessel_type`, `propulsion`, `origin`, `launch_year` | todos |
| Ubicación | `lat`, `lng`, `address`, `situation` | mapa + ISA |
| Media | `image`, `video_url` | mapa + ISA |
| Archivo | `description_en/es`, `source`, `validation`, `research` | ISA + blog |
| Mapa | `marker_icon`, `marker_color`, `featured` | mapa |

Campos que **solo** usa el mapa (iconos, tamaños, colores) viven en la misma fila pero en grupo `map:*`, y el export puede filtrarlos para ISA.

### Contrato de publicación

- JSON con `version`, `generated_at`, `items`, `manifest.sha256`.
- URL versionada: `.../v1/museums.json` y `.../latest/museums.json`.
- Cambio de esquema → `v2`, nunca romper `v1` en caliente.

## 6. Enlaces cruzados (el “hipervínculo”)

| Desde | Hacia | Patrón |
|---|---|---|
| Mapa | ISA | `academy.elsnorkel.com/museums/{id}` |
| Mapa | Blog | `elsnorkel.com/{slug}` por casco |
| ISA ficha | Mapa | `...elsnorkel.com/#{id}` |
| ISA ficha | Blog | artículo relacionado |
| ISA episodio | YouTube | `youtube.com/watch?v={videoId}` del registro |
| Blog | ISA + mapa | deep links por `id` |
| Redes | Mapa / ISA | UTM `?utm_source=linkedin&utm_campaign=museo-{id}` |

Regla: **el `id` del casco es la clave de unión en todo el universo**.

## 7. Cómo se gestiona desde DeepSeek

Un **workspace por producto**, cada uno con su sesión y sus agentes (ver `docs/17_SESSION_MAP.md`):

| Sesión | Workspace | Dueño de |
|---|---|---|
| U · Universo | `snk-data` | Contrato, versiones, manifest, validación |
| A · Datos ISA | `international-submarine-academy-ui` | Consumo y modelo ISA |
| B/C/D/E | idem ISA | UI, admin, museos, badges |
| M · Mapa | `submarinos_museo` | Leaflet y su vista |
| G · Blog | repositorio del blog | Artículos e historial |

**U es la sesión que arbitra.** Ninguna otra cambia el contrato sin pasar por U.

Herramientas concretas:

- `git worktree` por producto para evitar colisiones de build y puertos.
- Un `AGENTS.md` por repo apuntando al contrato (`docs/CONTRATO_DATOS.md`).
- El tablero de tareas es por sesión: el contrato se versiona en el repo, no en el tablero.
- Publicación: solo la sesión U publica artefactos; solo la sesión A/F publica sitios.

## 8. Fases

| Fase | Entrega |
|---|---|
| 1 | Extraer el núcleo `museums.json` con provenance y publicarlo versionado |
| 2 | El mapa consume ese artefacto en lugar de su copia local |
| 3 | ISA consume el mismo artefacto (deja de regenerar su dataset) |
| 4 | Blog enlaza por `id` y publica historias por casco |
| 5 | Videos: registro `videoId` oficial por museo y episodio |
| 6 | Página `/universo` en ISA con enlaces y UTM |
| 7 | Métricas de tráfico cruzado (respetando privacidad) |

## 8.1 Workspace de coordinación

La estructura vive en `C:\Users\MDQdam\Proyectos\snk` (fuera de este repositorio):

- `AGENTS.md` — reglas comunes del universo
- `docs/01_ROLES.md` — coordinador, leads y funciones transversales
- `docs/02_CONTRATO_DATOS.md` — contrato de la base única
- `docs/03_DRIVE_ASSETS.md` — indexación del archivo de 26 años
- `sessions/PROMPTS.md` — prompt de cada sesión
- `templates/` — cola editorial y registro de activos

Los repositorios de producto **no se mueven**: el workspace los referencia.

## 9. Decisiones abiertas

| # | Decisión | Opciones |
|---|---|---|
| U1 | Dónde vive el artefacto | (a) repo `snk-data`; (b) releases del repo ISA; (c) CDN externo |
| U2 | Quién publica | (a) sesión U; (b) cada producto publica el suyo |
| U3 | Sheet única | (a) un workbook con todas las pestañas; (b) dos workbooks (núcleo + ISA) |
| U4 | Blog: mantener o migrar | (a) mantener; (b) migrar a Next y unificar stack |
| U5 | SEO del universo | hoy ISA tiene `noindex`; decidir si el ecosistema se indexa |
| U6 | Marca y dominios | confirmar subdominios definitivos por producto |
