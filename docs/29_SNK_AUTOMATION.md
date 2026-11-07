# ISA · Automatización del universo SNK

Qué se puede conectar de verdad, qué no, y cómo orquestarlo desde DeepSeek.

---

## 1. Inventario técnico real

| Pieza | Dónde vive | ¿API oficial? | Autenticación | Límite práctico |
|---|---|---|---|---|
| Blog | Blogger (www.elsnorkel.com) | **Sí**, Blogger API v3 | OAuth 2.0 de usuario (cuenta de Workspace) | No admite cuentas de servicio; requiere refresh token del usuario |
| Canal YouTube | YouTube | **Sí**, Data API v3 | OAuth 2.0 de usuario | Cuota diaria; subir video consume mucho más que leer |
| Sheet del mapa | Google Sheets | **Sí**, Sheets API v4 | OAuth o cuenta de servicio | Sin problema para el volumen actual |
| Timeline (Knight Lab) | Google Sheet publicado | Lectura por URL publicada | Ninguna | Estática, sin escritura por API |
| Alertas de Google | Correo (Gmail) | **No hay API de Google Alerts** | — | Se resuelve leyendo Gmail con Apps Script |
| Sheet de alertas | Google Sheets + Apps Script | **Sí** (Apps Script propio) | Ejecución con la cuenta del script | Cuotas de triggers y de correo |
| LinkedIn (empresa) | LinkedIn | Restringida | Marketing Developer Platform, aprobación de LinkedIn | Publicar requiere permisos aprobados; sin aprobación, solo manual |
| Facebook (página) | Meta Graph API | Restringida | App Review + `pages_manage_posts` | Sin revisión aprobada, solo manual |
| NotebookLM | Google | **No hay API pública** | — | PDF → HTML sigue siendo manual |

Fuentes consultadas: [Blogger API v3](https://github.com/googleapis/google-api-ruby-client/blob/91f9d2a103d4a98074e6e465d0b63188f4fde89b/generated/google-apis-blogger_v3/OVERVIEW.md), [LinkedIn](https://verbb.io/craft-plugins/social-poster/docs/v2/providers/linkedin#step-1-create-a-new-app), [Meta App Review](https://developers.facebook.com/community/threads/1383407700373948/), [NotebookLM (sin API oficial; solo envoltorios no oficiales)](https://www.npmjs.com/package/@roomi-fields/notebooklm-mcp).

## 2. Conclusión honesta

**Sí se puede centralizar, pero no todo al mismo nivel.**

| Nivel | Qué incluye | Automatización |
|---|---|---|
| **A · Lectura agregada** | Sheets, Blogger (leer), YouTube (leer), alertas | Total |
| **B · Borradores** | Redacción de posts, artículos, fichas, HTML | Total, con revisión humana |
| **C · Publicación** | Blogger, YouTube | Alta, con aprobación explícita |
| **C′ · Redes** | LinkedIn, Facebook | Nula por API sin aprobación; **semi-manual**: el sistema genera el texto y la imagen, vos publicás con un clic |
| **D · NotebookLM** | PDF → HTML | Manual; el sistema puede recibir el HTML y encolarlo |

Lo que **no** conviene prometer: publicar automáticamente en LinkedIn y Facebook. Hoy depende de aprobaciones de esas plataformas, no de nosotros.

## 3. Arquitectura propuesta: SNK Hub

```text
                    ┌──────────────────────────────┐
   DSH agentes ───▶ │  SNK HUB (MCP local)          │
                    │  tools:                       │
                    │   · sheets.read/write         │
                    │   · blogger.list/draft/publish│
                    │   · youtube.list/stats        │
                    │   · alerts.collect            │
                    │   · social.compose            │
                    │   · queue.*                   │
                    └───────┬──────────────┬────────┘
                            │              │
             Google APIs ───┘              └─── Apps Script Web App
          (Sheets, Blogger, YouTube)          (Gmail → alertas → Sheet)
                            │
                            ▼
              ┌─────────────────────────────┐
              │ COLA DE CONTENIDOS (Sheet)  │
              │ estado: idea → draft →      │
              │ review → approved →         │
              │ published → archived        │
              └─────────────────────────────┘
```

Dos decisiones clave:

1. **Apps Script** para lo que vive en Google y necesita la cuenta (`webmaster@`): leer alertas de Gmail, escribir en Sheets, generar el JSON de Timeline. No requiere servidor.
2. **Hub MCP local (Node)** para lo que DSH necesita orquestar: expone herramientas tipadas y guarda los tokens OAuth de Blogger y YouTube. Los agentes nunca ven credenciales.

## 4. Flujo editorial propuesto

```text
idea (Sheet) → borrador (agente) → review (humano) → approved
    → publicar en Blogger (API) / YouTube (API)
    → generar texto e imagen para LinkedIn y Facebook
    → publicar en redes (manual o scheduler) → registrar URL
    → enlazar artículo ↔ museo ↔ episodio ISA (por id)
```

Regla dura: **nada se publica sin pasar por `approved`**. Cada publicación registra fecha, URL y actor.

## 5. Qué haría falta para construirlo

| Requisito | Detalle |
|---|---|
| Proyecto en Google Cloud | OAuth client (tipo escritorio) en la cuenta `webmaster@` |
| Scopes | `blogger`, `youtube`, `spreadsheets`, `gmail.readonly`, `drive.file` |
| Token store | Archivo local cifrado o `.env` fuera del repo (nunca en git) |
| Apps Script | Un proyecto con triggers de Gmail y endpoints de lectura |
| MCP | Servidor local registrado en DSH; requiere autorización explícita para instalarlo |
| Cuotas | YouTube: reservar la subida de video; Blogger y Sheets no son problema a este volumen |

## 6. Fases

| Fase | Entrega | Riesgo |
|---|---|---|
| 1 | Hub de solo lectura: Sheets, Blogger, YouTube, alertas | Nulo (no escribe nada) |
| 2 | Cola de contenidos en Sheet + generación de borradores | Bajo (no publica) |
| 3 | Publicación en Blogger con aprobación | Medio (contenido público) |
| 4 | Subida a YouTube con metadata y miniatura | Medio |
| 5 | Paquete social: texto + imagen + enlace UTM | Bajo (manual) |
| 6 | Timeline regenerada por script desde su Sheet | Bajo |
| 7 | Métricas cruzadas blog ↔ mapa ↔ ISA | Bajo |

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| Token OAuth comprometido | Guardar fuera del repo, rotar, scope mínimo |
| Publicar contenido no aprobado | Estado `approved` obligatorio + registro |
| Cuota de YouTube agotada | Reservar unidad de subida; programar |
| Cambios de API de Meta/LinkedIn | Tratarlos como canales manuales hasta tener aprobación |
| Contenido sin fuente | Misma política que museos: sin fuente no se publica |
| Dependencia de NotebookLM | El HTML entra como insumo; no se automatiza la conversión |

## 8. Decisiones abiertas

| # | Decisión |
|---|---|
| A1 | ¿Se construye el hub MCP local o se empieza solo con Apps Script? |
| A2 | ¿Quién aprueba publicaciones: una persona o dos? |
| A3 | ¿LinkedIn/Facebook se automatizan (con aprobación de plataforma) o quedan manuales? |
| A4 | ¿La cola de contenidos vive en el mismo workbook o en uno aparte? |
| A5 | ¿Blogger se mantiene o se migra a Next para unificar? |
| A6 | ¿Qué pasa con los PDF de origen: quedan en Drive con permisos definidos? |
