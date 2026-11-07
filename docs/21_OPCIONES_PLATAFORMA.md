# ISA · Opciones de plataforma para la capa de datos

**Documento:** comparación de plataformas con plan gratuito para sostener el modelo de datos de ISA.
**Sesión:** S · Infraestructura de datos (entregable 2 de 4).
**Estado:** documento de análisis. **No decide**: la decisión y las alternativas descartadas pertenecen al ADR (`docs/23_ADR_INFRAESTRUCTURA.md`).
**Fecha de consulta de todas las fuentes:** 6 de noviembre de 2026 (America/Argentina/Buenos_Aires).
**Documentos relacionados:** `docs/00_DOCUMENTO_BASE.md`, `docs/07_ENDPOINT_APPS_SCRIPT.md`, `docs/08_DATA_LAYER.md`, `docs/13_SHEET_SYNC.md`, `docs/15_CONFIG_SHEET.md`, `docs/19_DATA_INFRA_SESSION.md`.

---

## 0. Propósito, alcance y metodología

### 0.1 Propósito

Comparar, con límites reales y fuentes primarias, las plataformas candidatas para alojar el modelo de datos de ISA y para publicarlo en un sitio Next.js con `output: 'export'` desplegado en GitHub Pages, donde **el navegador no puede guardar secretos ni escribir en el backend**.

El documento responde a una pregunta concreta: **¿con qué plataforma pueden 1–3 editores no programadores hacer ABM de contenido bilingüe, con historial y export, y publicarlo en un sitio estático sin pagar, sin servidor propio y sin exponer secretos?**

### 0.2 Alcance

- 14 opciones comparadas: las líneas del brief (que incluyen NocoDB y Baserow en cloud y en autoalojado, Grist, SeaTable, GitHub como backend pasivo y "solo repo"), más la opción de Drive/Sheets con API key, que se trata como complemento en §3.13 y no entra en la matriz.
- No incluye: elección de la herramienta (ADR), diseño del esquema físico (`docs/22_MODELO_DATOS_SHEET.md`), inventario de componentes (`docs/20_INVENTARIO_COMPONENTES.md`) ni implementación.
- No se instaló nada, no se modificó código y no se hizo commit.

### 0.3 Metodología

1. Se leyó el contexto del proyecto y los criterios de comparación de `docs/19_DATA_INFRA_SESSION.md` §5.
2. Se consultaron páginas oficiales de **pricing / limits / quotas** de cada proveedor el 6/11/2026.
3. Cada cifra se registra con su **URL exacta** y la fecha de consulta. Cuando la página oficial no pudo leerse completa en esta sesión, se indica el método alternativo usado (proxy de lectura, copia archivada oficial) y el dato queda marcado **(a verificar)**.
4. Los valores **no verificados** se marcan explícitamente y **no se usan como afirmación** en la recomendación.
5. Las estimaciones derivadas (por ejemplo, lecturas por día a partir de una cuota de tiempo) se identifican como **estimación**, nunca como límite documentado.

### 0.4 Convenciones

| Marca | Significado |
|---|---|
| **Verificado** | Dato leído en documento oficial el 6/11/2026, con URL. |
| **(a verificar)** | No se pudo confirmar en fuente oficial en esta sesión. No se afirma. |
| **Inferencia / estimación** | Cálculo propio a partir de datos verificados. No es un límite del proveedor. |
| **Veredicto** | Opinión técnica del análisis, no decisión del proyecto. |

### 0.5 Limitación de verificación de esta sesión

Las páginas de `developers.google.com` incluyen un árbol de navegación muy extenso que agotó el límite de lectura de la herramienta de extracción. Consecuencias:

- **Google Sheets (límites de archivo y cuota de Drive):** verificados en `support.google.com` (páginas ligeras). ✅
- **Cuotas de Apps Script:** la página oficial vigente **no pudo extraerse completa**. Los valores de la tabla de §3.1 provienen de la **copia oficial archivada** del 20/12/2019 (`web.archive.org`) y quedan marcados **(a verificar)** contra la página vigente antes del ADR. No se afirma que sigan siendo idénticos.
- **Autorización de la Sheets API:** la guía de autorización vigente deriva a OAuth 2.0; no se localizó en esta sesión una página que documente "API key para hojas privadas" (ver §3.13).

---

## 1. Resumen ejecutivo

Ninguna plataforma "todo en uno" cumple sola las cuatro restricciones duras a la vez (plan free sostenible, ABM sin programar, lectura pública desde un sitio estático sin secretos, e historial/reversión). El análisis separa dos funciones que el brief trata juntas:

1. **Capa de edición (ABM):** dónde 1–3 personas no programadoras cargan y corrigen contenido bilingüe.
2. **Capa de publicación:** cómo el contenido llega al navegador sin secretos y con versión reversible.

**Hallazgo principal:** la mejor puntuación la obtiene **GitHub como capa de publicación** (JSON versionado + Actions + Pages), no porque sea una buena herramienta de ABM, sino porque gana en lectura pública, historial, reversión, export y costo. La mejor edición sin código aparece en **Sheets/AppSheet, Airtable, Baserow, NocoDB, Grist y SeaTable**. La combinación "editor no-code → export/sync → JSON en el repo" es la arquitectura que mejor cubre todos los requisitos; lo que cambia entre candidatas es **qué plataforma hace de editor**.

### Tabla resumen (detalle en §3 y §4)

| # | Opción | Modelo | ABM sin código | Lectura pública desde sitio estático | Límite free crítico | Veredicto |
|---|---|---|---|---|---|---|
| 1 | Google Sheets + Apps Script | Hojas | Sí (grilla) | Endpoint read-only con token, o JSON generado (patrón actual) | 15 GB de cuenta; 20 M celdas/100 MB por hoja; cuotas de Apps Script (a verificar) | **Finalista** |
| 2 | Google Sheets + AppSheet free | Relacional (AppSheet DB) u hojas | Excelente (formularios) | No apto para lectura pública genérica | Free solo prototipo/personal (≤10 usuarios de prueba, uso no comercial) | Descartable como gratis |
| 3 | Airtable Free | Relacional ligero | Excelente | API con token/cuota; export programado | 1.000 registros/base; 1.000 llamadas API/mes | Candidata media |
| 4 | NocoDB Cloud Free | Relacional | Excelente | REST con token; export programado | 1.000 registros totales; 1.000 API/mes | Descartable para este volumen |
| 5 | NocoDB self-hosted | Relacional | Excelente | REST propio | Software $0, costo de hosting | Viable, pero requiere servidor |
| 6 | Baserow Cloud Free | Relacional | Excelente | Vistas públicas + REST; export programado | 3.000 filas/workspace; 2 GB | **Finalista** |
| 7 | Baserow self-hosted | Relacional | Excelente | REST propio | Software $0, costo de hosting | Viable, pero requiere servidor |
| 8 | Supabase Free | SQL (Postgres) | No (editor técnico) | PostgREST con anon key + RLS | 500 MB; 2 proyectos; pausa tras 1 semana sin actividad | Viable solo con UI propia |
| 9 | Cloudflare D1 + Workers Free | SQL (SQLite) | No | Worker como API | 5 M filas leídas/día; 100 k escritas/día; 500 MB por base | Viable solo con UI propia |
| 10 | PocketBase self-hosted | SQLite | Media (panel técnico) | REST propio con reglas | Sin plan: software libre + hosting | Viable, requiere servidor |
| 11 | Grist Free | Relacional (Python) | Buena (formularios) | Link público de UI; API muy acotada | 5.000 registros/documento; 3.000 llamadas API/mes/equipo | Candidata media |
| 12 | SeaTable Free | Relacional (hojas) | Buena | Vistas y apps públicas | 10.000 filas; 3.000 llamadas API/mes | Candidata media |
| 13 | GitHub JSON + Actions + Pages | JSON versionado | No (PR/editor web) | JSON estático servido por Pages | 1 GB publicado; 100 GB/mes banda (soft); Actions gratis en repo público | **Finalista (publicación)** |
| 14 | "Solo repo" (sin Actions/Pages) | JSON versionado | No | Publicación manual del export | Sin cuota de plataforma; publicación manual | Baseline de publicación |

**Lectura del resumen:** la decisión del ADR no es "elegir una plataforma", sino **elegir la capa de edición** y mantener la capa de publicación en JSON+Git. Los finalistas propuestos (§9) combinan ambas.

---

## 2. Requisitos que la plataforma debe cumplir

Requisitos del brief, de `docs/19` §3 y del estado verificado del repo (`AGENTS.md`).

| # | Requisito | Implicancia para la plataforma | Peso (`docs/19` §5) |
|---|---|---|---|
| R1 | ABM simple tipo formulario, 1–3 editores sin programar | UI de formulario/tabla editable; permisos por usuario; sin escribir código | Alto |
| R2 | Plan free sostenible para 1–3 editores | Sin tarjeta, sin vencer, sin límite de usuarios incompatible | Alto |
| R3 | Lectura pública desde sitio estático sin secretos | Datos servibles como JSON/REST público o exportados al repo; el navegador no guarda credenciales | Alto |
| R4 | Modelo relacional con IDs estables y enums | Claves, relaciones, validación, unicidad; no solo texto libre | Alto |
| R5 | Campos bilingües en/es | Columnas/campos `_en`/`_es` o equivalente desde el modelo | Medio |
| R6 | Historial y auditoría | Quién cambió qué y cuándo; versiones recuperables | Medio |
| R7 | Export/backup completo | Export total sin depender del proveedor (CSV/JSON/SQL) | Medio |
| R8 | Costo de salida (migrar después) | Formato abierto, export completo, esquema documentado | Medio |
| R9 | Requiere servidor propio | Si lo requiere, sumar costo y operación | Bajo |
| R10 | Credenciales append-only | Registro que no se edite ni borre desde la UI; solo altas | Requisito de `docs/19` §2 |
| R11 | Versionado y reversión del contenido publicado | Volver a una versión anterior publicada | Requisito de `docs/19` §3 |
| R12 | Volumen: 160 museos hoy; cientos después; ~100 reactivos; 5 temporadas | Holgura de al menos 10× el volumen actual en el plan free | Requisito de `docs/19` §2 |

**Volumen de referencia para evaluar holgura** (`docs/19` §2): 160 museos, 100 reactivos, 5 temporadas, pocas misiones/episodios, 1 institución, 0 credenciales emitidas (crecerá), 5 roles, 5 disciplinas, 25 celdas de grilla derivadas.

---

## 3. Fichas por plataforma

Cada ficha responde los mismos 12 puntos. Las cifras sin marca son **verificadas**; las marcadas **(a verificar)** no se afirman.

---

### 3.1 Google Sheets + Apps Script (hojas privadas + endpoint read-only)

**Propósito.** Mantener la fuente de verdad en una hoja de cálculo privada editada a mano y exponerla a la web estática mediante un Web App de Apps Script read-only (camino B ya adoptado en `docs/00` §10 y `docs/07`). Es el patrón que el repo ya tiene como referencia (`apps-script/Code.gs`) y el que usan los scripts de sincronización (`scripts/sync_museums.py`, `scripts/sync_config.py`).

**Modelo de datos.** Hojas (tablas planas) con encabezados estables; relaciones por ID en columnas (`museo_id`, `temporada_id`); enums por validación de datos y por convención del script; bilingüe por columnas `*_en` / `*_es` (ya implementado en `docs/15_CONFIG_SHEET.md`). No hay claves foráneas ni integridad referencial nativa: la valida el script.

**ABM editable sin código.** Sí, es su fortaleza: edición directa en grilla, filtros, validación de datos, comentarios y protección de rangos. Con AppSheet encima mejora la experiencia de formulario (§3.2), pero deja de ser gratis para uso real.

**Acceso público desde sitio estático.** Dos caminos, ambos ya presentes en el proyecto:
- **Publicación por JSON (vigente):** el workflow semanal corre `sync_museums.py` / `sync_config.py`, regenera `lib/data/datasets/*.json`, commitea y el push despliega Pages (`docs/13` §3, `docs/15` §2.1). El navegador nunca ve la hoja.
- **Endpoint read-only (de referencia, sin desplegar):** POST `validate` con clave institucional → token HMAC; GET `data` devuelve solo hojas autorizadas (`docs/07`). El endpoint es público en su URL; la barrera es el hash de claves + el token.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Tamaño de una hoja de cálculo (creada o convertida a Sheets) | Hasta **20 millones de celdas o 100 MB** | [support.google.com/drive/answer/37603](https://support.google.com/drive/answer/37603) | Verificado 6/11/2026 |
| Almacenamiento total de la cuenta Google | **15 GB** compartidos entre Gmail, Drive y Photos | [support.google.com/drive/answer/9312312](https://support.google.com/drive/answer/9312312) | Verificado 6/11/2026 |
| Cuota diaria de ejecución total (cuenta consumer) | **90 min/día** | Página oficial de cuotas de Apps Script; valores de copia archivada 20/12/2019 | **(a verificar)** |
| Cuota diaria de ejecución de triggers (consumer) | **90 min/día** | Ídem | **(a verificar)** |
| Runtime máximo por ejecución (consumer) | **6 min** | Ídem | **(a verificar)** |
| Ejecuciones simultáneas | **30** | Ídem | **(a verificar)** |
| Triggers por usuario y por script | **20** | Ídem | **(a verificar)** |
| Llamadas UrlFetch (consumer) | **20.000/día** | Ídem | **(a verificar)** |
| Tamaño de respuesta UrlFetch | **50 MB por llamada** | Ídem | **(a verificar)** |
| Cuota de solicitudes por día de un Web App | **No documentada como cuota propia**; consume tiempo de ejecución y ejecuciones simultáneas | Ídem (la tabla no lista "web app requests") | **(a verificar)** |

Fuente oficial de cuotas: [developers.google.com/apps-script/guides/services/quotas](https://developers.google.com/apps-script/guides/services/quotas). Copia archivada usada para extraer la tabla: [web.archive.org · 20/12/2019](https://web.archive.org/web/20191220235549/https://developers.google.com/apps-script/guides/services/quotas).

**Estimación (no límite del proveedor).** Con 90 min/día = 5.400 s y una lectura de endpoint de 0,5–2 s, el techo teórico es ~2.700–10.800 lecturas/día **compartidas con todos los demás scripts de la cuenta**. Con el patrón vigente (JSON estático en Pages) las lecturas públicas **no consumen Apps Script**, porque las sirve GitHub Pages.

**Historial/auditoría.** Historial de versiones de la hoja (Google Drive) y celdas editadas por usuario; no es una auditoría de dataset ni distingue origen editorial. Para trazabilidad fina hay que llevarla en columnas (`actualizado_en`, `actualizado_por`, `origen`, `estado`) y en una hoja `Logs` de solo agregado por convención.

**Export/backup.** Nativo: descargar CSV/XLSX por hoja o la hoja completa; los scripts generan JSON versionado. Backup completo reproducible con una descarga programada.

**Credenciales append-only.** Se puede mantener una hoja `Logs`/`Credenciales` que el Web App nunca expone (lista de hojas excluidas en `docs/07` §2). La inmutabilidad es **por convención y protección de rangos**, no por constraint de base. Riesgo: una persona con permiso de edición puede alterar filas.

**Esfuerzo de administración.** Bajo para editar; medio para operar: dueño de la hoja, dueño del script, propiedades del script (`ISA_SHEET_ID`, `ISA_TOKEN_SECRET`), despliegue manual del Web App, rotación del secreto, y workflows semanales.

**Lock-in.** Bajo: el dato vive en CSV/XLSX/JSON y el script es portable; el Web App sí es específico de Apps Script.

**Costo al crecer.** El plan free aguanta el volumen actual con holgura (160 filas de museos dentro de 20 M celdas). Los costos aparecen por: (a) cuota de ejecución si el endpoint se usa como API de lectura masiva; (b) Google Workspace si se necesitan cuotas mayores o cuentas institucionales (precio de Workspace **a verificar**); (c) personas que administren el script.

**Veredicto.** **Finalista.** Es la única opción que ya está integrada al repo (sync + JSON + endpoint de referencia), no requiere servidor, no expone secretos y tiene holgura de volumen. Sus debilidades son integridad referencial, auditoría fina y el riesgo de cuota del Web App; las tres se mitigan publicando por JSON y dejando el endpoint como canal institucional.

---

### 3.2 Google Sheets + AppSheet (free/prototipo)

**Propósito.** Poner un ABM de formularios móviles sobre las hojas de Google, para que editores no técnicos carguen museos, misiones o reactivos sin tocar la grilla.

**Modelo de datos.** Si la fuente es la hoja, hereda el modelo plano de §3.1. Si se usa "AppSheet database", el modelo es relacional (tablas, referencias) con límite propio de filas.

**ABM sin código.** Excelente: formularios, validaciones, vistas, permisos por rol y app móvil, sin escribir código. Es la mejor experiencia de edición de la lista.

**Acceso público desde sitio estático.** No resuelve la lectura pública: la app AppSheet requiere sesión/usuarios y no está pensada como API pública para un sitio estático. La lectura seguiría siendo por JSON generado desde la hoja subyacente o por el endpoint de Apps Script.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Uso gratuito (prototipo) | Gratis para desarrollo/prueba de prototipos y uso personal | [support.google.com/appsheet/answer/10104499](https://support.google.com/appsheet/answer/10104499) | Verificado 6/11/2026 |
| Condiciones del free | Apps de uso personal (no comercial), **el creador es el único usuario**, **≤10 usuarios de prueba** (el creador cuenta), sin funciones premium (p. ej. envío de emails por automatización) | Ídem | Verificado 6/11/2026 |
| Uso personal (sin licencia) | Máximo **3 usuarios**; si se supera, el acceso se bloquea a los 3 días | Ídem | Verificado 6/11/2026 |
| AppSheet databases: cantidad | **5** (free/Starter), 10 (Core), 200 (Enterprise Plus) | [about.appsheet.com/pricing](https://about.appsheet.com/pricing/) | Verificado 6/11/2026 |
| AppSheet databases: filas por base | **2.500** (free/Starter), 200.000 (Enterprise Plus) | Ídem | Verificado 6/11/2026 |
| Precio para uso real (Starter) | **USD 5 / usuario / mes** | Ídem | Verificado 6/11/2026 |

**Historial/auditoría.** La versión free incluye "App version history"; los *audit logs* de equipo aparecen en planes Enterprise (según la grilla comparativa de la página de precios, marcados para Enterprise Plus). Auditoría de datos por registro **a verificar**.

**Export/backup.** Exportación de datos vía la hoja subyacente (CSV/XLSX) o export de AppSheet database **a verificar**.

**Credenciales append-only.** AppSheet permite configurar por tabla qué operaciones se permiten (agregar/editar/borrar); una tabla "solo altas" sería posible, pero la disponibilidad exacta de "adds only" en el plan free está **(a verificar)**.

**Esfuerzo de administración.** Medio: diseñar la app, mantener columnas y sincronizar con la hoja; el creador queda atado a la cuenta.

**Lock-in.** Medio-alto en la capa de app (definiciones AppSheet), bajo en los datos si siguen en la hoja.

**Costo al crecer.** Para uso institucional real (no prototipo personal) hay que licenciar: **USD 5/usuario/mes** (Starter) o USD 10/usuario/mes (Core). Con 3 editores son USD 15–30/mes, es decir **deja de ser gratis**. Publicar apps públicas requiere además Publisher Pro (USD 50/mes/app, según la página de precios).

**Veredicto.** **Descartable como opción gratuita.** La letra chica del plan free (uso personal, un solo usuario real, ≤10 usuarios de prueba) no encaja con un proyecto institucional y con 1–3 editores reales. Como capa de ABM *paga* es buena, pero el brief exige planes gratuitos sostenibles.

---

### 3.3 Airtable Free

**Propósito.** Base de datos no-code con interfaz tipo hoja, formularios, vistas e Interfaces; ABM muy amigable para no programadores.

**Modelo de datos.** Relacional ligero: tablas, campos con tipos, registros vinculados (linked records), single/multi select para enums, formularios. Sin SQL ni constraints relacionales completos.

**ABM sin código.** Excelente: grillas, formularios, Interfaces Designer, permisos por base.

**Acceso público desde sitio estático.** REST API con token (el token es un secreto: no puede ir en el bundle), cuota free de 1.000 llamadas/mes, y rate limit de 5 req/s por base. Para un sitio estático el patrón viable es **export programado a JSON en el repo** (GitHub Actions), no lectura por API en el navegador. Las "share links" son para personas, no para consumo machine-readable.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Bases | Ilimitadas | [airtable.com/pricing](https://airtable.com/pricing) | Verificado 6/11/2026 |
| Registros por base | **1.000** | Ídem | Verificado 6/11/2026 |
| Editores | Hasta **5** | Ídem | Verificado 6/11/2026 |
| Adjuntos | **1 GB por base** | Ídem | Verificado 6/11/2026 |
| Automatizaciones | **100 ejecuciones** | Ídem | Verificado 6/11/2026 |
| Llamadas Web API | **1.000/mes** | Ídem | Verificado 6/11/2026 |
| Historial de revisiones | **2 semanas** (Free) | Ídem (grilla comparativa) | Verificado 6/11/2026 |
| Rate limit de API | **5 req/s por base**; 50 req/s por usuario/service account; 429 → esperar 30 s | [airtable.com/developers/web/api/rate-limits](https://airtable.com/developers/web/api/rate-limits) | Verificado 6/11/2026 |

Comportamiento documentado al alcanzar el límite: no se borran datos; no se pueden agregar registros/adjuntos hasta subir de plan; automatizaciones y API se cortan en el tope ([airtable.com/pricing](https://airtable.com/pricing), FAQ).

**Historial/auditoría.** Revisiones de 2 semanas en Free (corta para auditoría de contenido publicado). Audit logs de organización solo en planes Enterprise.

**Export/backup.** CSV por tabla/vista; export completo por base. Bueno.

**Credenciales append-only.** Sin constraint nativo de solo-altas; se puede restringir con permisos/interfaces o validar en el script de export. **A verificar** si el plan free permite bloquear update/delete por API.

**Esfuerzo de administración.** Bajo. La cuota de 1.000 API/mes obliga a usar export programado (pocas llamadas por corrida) y no lectura directa.

**Lock-in.** Medio: export CSV/JSON es correcto, pero el modelo y las automatizaciones no son portables.

**Costo al crecer.** Team: **USD 20/asiento/mes anual** (USD 24 mensual) → 3 editores ≈ USD 60–72/mes. Con 160 museos y ~100 reactivos, el free de 1.000 registros por base se satura rápido si todo va a una base; se puede repartir en varias bases (ilimitadas), a costa de complejidad.

**Veredicto.** **Candidata media.** Excelente ABM, pero 1.000 registros/base y 1.000 API/mes aprietan justo cuando el proyecto crece; el costo de salida del free es bajo (export), el de quedarse es alto.

---

### 3.4 NocoDB (cloud free y self-hosted)

**Propósito.** Alternativa open source (fair-code) a Airtable: base de datos relacional sobre Postgres/MySQL/SQLite con UI tipo hoja, formularios, vistas, automatizaciones e interfaces.

**Modelo de datos.** Relacional real (usa una base SQL subyacente): tablas, campos tipados, relaciones, single select, fórmulas, permisos por tabla/campo.

**ABM sin código.** Excelente: grillas, formularios, kanban, galería, calendario, mapas; roles owner/creator/editor/commenter/viewer.

**Acceso público desde sitio estático (cloud).** REST API con token (cuota 1.000 llamadas/mes en free) → obliga a export programado. Self-hosted: REST propio sin cuota de proveedor.

**Límites free verificados — Cloud.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Precio | USD 0 (hasta 3 usuarios) | [nocodb.com/pricing](https://nocodb.com/pricing) | Verificado 6/11/2026 |
| Asientos de editor | **3** (editores) + 10 comentaristas | Ídem | Verificado 6/11/2026 |
| Registros | **1.000** | Ídem | Verificado 6/11/2026 |
| Almacenamiento | **1 GB** | Ídem | Verificado 6/11/2026 |
| Automatizaciones | **100 ejecuciones** | Ídem | Verificado 6/11/2026 |
| Llamadas API | **1.000/mes** | Ídem | Verificado 6/11/2026 |
| Extensiones / interfaces | 1 extensión; 1 interfaz (≤3 páginas) | Ídem | Verificado 6/11/2026 |
| Precio al crecer (Plus) | USD 12/asiento/mes anual; USD 108/mes por asientos ilimitados | Ídem | Verificado 6/11/2026 |

**Límites free — Self-hosted.**

| Aspecto | Valor | Fuente | Estado |
|---|---|---|---|
| Precio del software | **USD 0, autoalojado ("forever")** | [nocodb.com/pricing](https://nocodb.com/pricing) | Verificado 6/11/2026 |
| Registros / almacenamiento / asientos | **Ilimitados** (según la página) | Ídem | Verificado 6/11/2026 |
| Requisito | Servidor, contenedor y base de datos propios | Ídem | Verificado 6/11/2026 |
| Costo de hosting | Depende del proveedor | — | **(a verificar)** |

**Historial/auditoría.** Audit logs aparecen en planes Business/Enterprise (la grilla marca "Audit logs" en Business y "21 días" de retención); "Revision History" figura como "Soon" en la grilla de cloud. En free: **sin auditoría de cambios**. **(a verificar)** en self-hosted.

**Export/backup.** Export CSV; al ser self-hosted, backup completo con `pg_dump`/dump de la base. Bueno.

**Credenciales append-only.** Sin constraint nativo de solo-altas en la UI; se puede restringir por permisos de tabla/API. **A verificar** si el rol "editor" puede configurarse sin update/delete.

**Esfuerzo de administración.** Cloud: bajo. Self-hosted: medio-alto (contenedor, base, backups, actualizaciones).

**Lock-in.** Bajo: open source y base SQL estándar; export/restore probado.

**Costo al crecer.** Cloud free se agota con el volumen actual (1.000 registros < 160 museos + 100 reactivos + catálogos). Self-hosted es "gratis" en licencia pero cuesta hosting + operación.

**Veredicto.** **Cloud free descartable** para este volumen; **self-hosted viable** solo si el proyecto acepta operar un servidor (criterio R9 de peso bajo, pero costo real).

---

### 3.5 Baserow (cloud free y self-hosted)

**Propósito.** Base de datos no-code/open source con grillas, formularios, vistas y API REST; alternativa a Airtable con plan free más generoso en filas.

**Modelo de datos.** Relacional: tablas, campos tipados, "link row" (relaciones), single select, fórmulas, vistas. Permite PostgreSQL propio en self-hosted.

**ABM sin código.** Excelente: grilla, formulario, galería, kanban, calendario, timeline; roles y permisos (los avanzados son pagos).

**Acceso público desde sitio estático.** Vistas públicas ("Public view sharing" incluido en free) y REST API. Para el sitio estático: export programado a JSON (recomendado) o lectura de una vista pública (verificar CORS/token y rate limit). El rate limit de API en cloud está **(a verificar)** en documentación oficial.

**Límites free verificados — Cloud.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Precio | USD 0 | [baserow.io/pricing](https://baserow.io/pricing) | Verificado 6/11/2026 |
| Filas por workspace | **3.000** | Ídem | Verificado 6/11/2026 |
| Almacenamiento por workspace | **2 GB** | Ídem | Verificado 6/11/2026 |
| Créditos de automatización | **2.000/mes por workspace** | Ídem | Verificado 6/11/2026 |
| Usuarios de aplicaciones externas | 500 | Ídem | Verificado 6/11/2026 |
| Bases de datos | Ilimitadas | Ídem | Verificado 6/11/2026 |
| Historial de cambios por fila | **14 días** (Free) | Ídem | Verificado 6/11/2026 |
| Asientos de editor del workspace | No se publica un número en la página de precios | Ídem | **(a verificar)** |
| Rate limit de API | No verificado en esta sesión | — | **(a verificar)** |
| Precio al crecer (Premium) | USD 10/usuario/mes anual (USD 12 mensual) | Ídem | Verificado 6/11/2026 |

**Self-hosted.**

| Aspecto | Valor | Fuente | Estado |
|---|---|---|---|
| Precio del software | Autoalojamiento gratuito (open source) | [baserow.io/pricing](https://baserow.io/pricing) | Verificado 6/11/2026 |
| Límite de filas | Sin el tope del cloud (depende del servidor) | Ídem | Verificado 6/11/2026 (implícito en la comparativa Cloud/Self-host) |
| Costo de hosting | Depende del proveedor | — | **(a verificar)** |

**Historial/auditoría.** 14 días de historial de cambios por fila en free; *audit logs* solo en Advanced/Enterprise.

**Export/backup.** CSV, XML, JSON y Excel (según grilla comparativa); snapshots son función paga. Al ser open source, dump de base en self-hosted.

**Credenciales append-only.** Permisos por tabla/campo (algunos pagos) y API; no se verificó un modo "solo altas". **(a verificar)**.

**Esfuerzo de administración.** Cloud: bajo. Self-hosted: medio-alto.

**Lock-in.** Bajo-medio: open source, export múltiple; el modelo se recrea.

**Costo al crecer.** Premium USD 10/usuario/mes anual; Advanced USD 18/usuario/mes anual (250.000 filas, audit logs). Con 3 editores ≈ USD 30/mes.

**Veredicto.** **Finalista.** Es el mejor equilibrio no-code del lote: formularios reales, 3.000 filas (holgura ~5–15× sobre el volumen actual de las tablas de contenido más grandes, aunque 160 museos + 100 reactivos + temporadas entran), 14 días de historial, export completo y opción de autoalojamiento para no quedar atado. Su punto débil es que la lectura pública no es "directa y gratuita": exige export programado o una vista pública cuyo rate limit/seguridad hay que verificar.

---

### 3.6 Supabase Free

**Propósito.** Backend gestionado sobre PostgreSQL con API REST/Realtime autogenerada, Auth, Storage y Edge Functions.

**Modelo de datos.** SQL puro: tablas, claves foráneas, enums, constraints, vistas, RLS. El mejor ajuste técnico a "modelo relacional con IDs estables y enums".

**ABM sin código.** **No.** Supabase no ofrece un editor de formularios para editores no técnicos: el Table Editor es una herramienta técnica; cualquier ABM requiere construir una UI (Next.js, AppSheet-like, etc.). Con 1–3 editores no programadores esto incumple R1 salvo que se construya una interfaz propia.

**Acceso público desde sitio estático.** Sí, técnicamente: PostgREST expone tablas/vistas y el cliente usa la `anon key` (clave pública por diseño) con RLS. No es un secreto, pero requiere configurar políticas y exponer el proyecto a Internet. También admite export a JSON en CI.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Base de datos | **500 MB** | [supabase.com/pricing](https://supabase.com/pricing) | Verificado 6/11/2026 |
| Proyectos activos | **2** | Ídem | Verificado 6/11/2026 |
| Pausa por inactividad | **Tras 1 semana sin actividad** | Ídem | Verificado 6/11/2026 |
| API | **Ilimitada** (sujeta a fair use) | Ídem | Verificado 6/11/2026 |
| MAU | **50.000** | Ídem | Verificado 6/11/2026 |
| Egress | **5 GB** (+5 GB cacheado) | Ídem | Verificado 6/11/2026 |
| File storage | **1 GB** | Ídem | Verificado 6/11/2026 |
| Precio al crecer (Pro) | Desde **USD 25/mes** | Ídem | Verificado 6/11/2026 |

**Historial/auditoría.** Sin auditoría de cambios integrada en free; se implementa con triggers/tablas de auditoría propias. Log retention de 1 día en free (según la página de precios, el Pro ofrece 7 días; el free **a verificar**).

**Export/backup.** Excelente: `pg_dump`, SQL estándar, portabilidad total. Backups automáticos son de planes pagos (Pro: diarios, 7 días).

**Credenciales append-only.** Sí, con RLS: política `INSERT` sin `UPDATE`/`DELETE` sobre la tabla de credenciales y lectura restringida. Es la opción con la garantía más fuerte del lote.

**Esfuerzo de administración.** Medio-alto para el ABM (hay que construir UI) y bajo para la base. La pausa por inactividad es un riesgo operativo: si el sitio no consulta la base, el proyecto se pausa y hay que reactivarlo desde el panel (**procedimiento a verificar**).

**Lock-in.** **Bajo**: PostgreSQL estándar. Es la mejor salida del lote.

**Costo al crecer.** Pro USD 25/mes con 8 GB; el salto de free a pago es inevitable al superar 500 MB (lejano para el volumen actual) o al necesitar backups.

**Veredicto.** **Viable solo como motor**, no como solución completa: cumple el modelo relacional, el append-only, el export y la lectura REST, pero **falla R1** (ABM sin código) y agrega riesgo de pausa. Si el ADR elige Supabase, el ABM debe resolverse con otra capa (Sheets, Baserow o una UI propia), lo que anula su ventaja de simplicidad.

---

### 3.7 Cloudflare D1 + Workers Free

**Propósito.** Base SQLite serverless (D1) + funciones en el edge (Workers) para exponer una API propia.

**Modelo de datos.** SQLite: tablas, claves foráneas, CHECK, enums por CHECK/texto, índices. Relacional real, sin servidor.

**ABM sin código.** **No.** D1 no tiene UI de edición; habría que construirla o escribir SQL/Wrangler. Incumple R1.

**Acceso público desde sitio estático.** Sí: un Worker expone `GET /api/...` como JSON; el sitio estático lo consume sin secretos (el secreto queda en el Worker). Muy buen encaje técnico con Pages.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Filas leídas | **5 millones/día** | [developers.cloudflare.com/d1/platform/pricing](https://developers.cloudflare.com/d1/platform/pricing/) | Verificado 6/11/2026 |
| Filas escritas | **100.000/día** | Ídem | Verificado 6/11/2026 |
| Almacenamiento total | **5 GB** | Ídem | Verificado 6/11/2026 |
| Bases por cuenta | **10** | Ídem | Verificado 6/11/2026 |
| Tamaño máximo por base | **500 MB** (Free) | [developers.cloudflare.com/d1/platform/limits](https://developers.cloudflare.com/d1/platform/limits/) | Verificado 6/11/2026 |
| Time Travel (recuperación punto en el tiempo) | **7 días** (Free) | Ídem | Verificado 6/11/2026 |
| Consultas por invocación de Worker | **50** (Free) | Ídem | Verificado 6/11/2026 |
| Columnas por tabla | 100 | Ídem | Verificado 6/11/2026 |
| Filas por tabla | Ilimitadas (sujeto a storage) | Ídem | Verificado 6/11/2026 |
| Tamaño de fila/string/BLOB | 2 MB | Ídem | Verificado 6/11/2026 |
| Requests de Workers | **100.000/día** | [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Verificado 6/11/2026 |
| CPU por invocación | **10 ms** (Free) | Ídem | Verificado 6/11/2026 |
| Precio al crecer (Workers Paid) | **USD 5/mes** mínimo | Ídem | Verificado 6/11/2026 |

Comportamiento al alcanzar el límite: las consultas fallan con error hasta el reset diario (00:00 UTC); al llenar el storage no se pueden insertar/alterar tablas ni índices; el plan pago levanta el límite "en minutos" ([D1 pricing, FAQ](https://developers.cloudflare.com/d1/platform/pricing/)).

**Historial/auditoría.** Time Travel de 7 días permite recuperar la base a un punto en el tiempo; no es auditoría de "quién cambió qué". Para eso, tabla de auditoría propia.

**Export/backup.** `wrangler d1 export` / SQL dump; muy portable. Travel restore 10 restores/10 min por base.

**Credenciales append-only.** Garantizable en el Worker (endpoint que solo permite `INSERT`) y en el esquema; es una solución de código, no de UI.

**Esfuerzo de administración.** Alto para el ABM (UI propia) y medio para operar (Wrangler, migraciones, deploy).

**Lock-in.** Bajo: SQLite y export estándar.

**Costo al crecer.** Workers Paid USD 5/mes + consumo. El free es holgado para lecturas (5 M filas/día) pero el ABM no existe.

**Veredicto.** **Viable solo como API/motor**, no como plataforma completa: excelente para servir JSON barato y rápido, pero obliga a construir la capa de edición. Si el ADR ya decidiera una UI de administración propia, D1 sería un backend natural; hoy no cumple R1.

---

### 3.8 PocketBase (self-hosted)

**Propósito.** Backend open source en un solo binario: SQLite embebido, API REST, autenticación, panel de administración y reglas de API.

**Modelo de datos.** SQLite: colecciones (tablas), campos tipados, relaciones, reglas de API por operación. Relacional real.

**ABM sin código.** Media: el panel de administración permite editar colecciones y registros, pero está pensado para administradores técnicos; no hay formularios públicos listos para editores no técnicos (habría que construir la UI o usar el panel con cuidado). La usabilidad para 1–3 editores no programadores es inferior a Airtable/Baserow/Sheets.

**Acceso público desde sitio estático.** Sí: API REST pública con reglas (`list`/`view` permitidas, `create`/`update`/`delete` restringidas). Requiere un servidor con HTTPS accesible desde el navegador.

**Límites.** No hay plan: **el software es libre y no impone cuotas de plan** ([pocketbase.io/docs](https://pocketbase.io/docs/)). Los límites son los del servidor (CPU/RAM/disco) y los de la plataforma de hosting. Advertencia oficial: **no se recomienda para aplicaciones críticas de producción antes de v1.0.0** y la compatibilidad hacia atrás no está garantizada ([docs](https://pocketbase.io/docs/)).

| Aspecto | Valor | Fuente | Estado |
|---|---|---|---|
| Costo de licencia | USD 0 (open source) | [pocketbase.io/docs](https://pocketbase.io/docs/) | Verificado 6/11/2026 |
| Cuotas de plan | No existen | Ídem | Verificado 6/11/2026 |
| Requisito | Servidor propio + backups | Ídem | Verificado 6/11/2026 |
| Costo real de hosting | Depende del proveedor (VPS/PaaS); no se verificó un precio concreto | — | **(a verificar)** |
| Madurez | v0.41.1; pre-1.0, no recomendado para producción crítica | [pocketbase.io/docs](https://pocketbase.io/docs/) | Verificado 6/11/2026 |

**Historial/auditoría.** No hay auditoría integrada documentada en la introducción; se implementa con hooks/tablas. **A verificar**.

**Export/backup.** Copia del directorio `pb_data` (SQLite + archivos) o backup SQLite; simple y completo.

**Credenciales append-only.** Reglas de API por operación permiten `create` sin `update`/`delete` (documentado en la guía de reglas); habría que **verificar** la configuración exacta y probarla.

**Esfuerzo de administración.** Alto: servidor, TLS, actualizaciones (pre-1.0 con migraciones manuales), backups, monitoreo.

**Lock-in.** Bajo: open source + SQLite + REST estándar.

**Costo al crecer.** Costo de infraestructura; sin precio de lista. La gratuidad depende de un hosting gratuito que puede cambiar sus condiciones **(a verificar)**.

**Veredicto.** Técnicamente elegante y sin cuotas, pero **requiere servidor** y está pre-1.0. No cumple "sin servidor propio" y agrega riesgo operativo para un equipo de 1–3 personas.

---

### 3.9 Grist Free

**Propósito.** Hoja de cálculo relacional open source con fórmulas Python, formularios y reglas de acceso granulares; "spreadsheet-database".

**Modelo de datos.** Relacional real (tablas con referencias, tipos, fórmulas Python). El mejor modelo de datos dentro del grupo "hoja mejorada".

**ABM sin código.** Buena: formularios, vistas de tarjetas, edición tipo planilla; requiere algo de curva por las fórmulas.

**Acceso público desde sitio estático.** Compartir por link público (link sharing) permite ver/editar una vista en la UI de Grist, pero **no es una API para consumir desde el sitio**. La API REST free tiene **3.000 llamadas/mes/equipo**, insuficiente para lectura por visita; viable solo con export programado.

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Documentos | Ilimitados | [getgrist.com/pricing](https://www.getgrist.com/pricing/) | Verificado 6/11/2026 |
| Registros por documento | **5.000** (todas las tablas del documento) | Ídem | Verificado 6/11/2026 |
| Snapshots (historial) | **30 días** | Ídem | Verificado 6/11/2026 |
| Miembros | **10** | Ídem | Verificado 6/11/2026 |
| Invitados por documento | 2 | Ídem | Verificado 6/11/2026 |
| Llamadas API | **3.000/mes/equipo** | Ídem | Verificado 6/11/2026 |
| Adjuntos | **1 GB por documento** | Ídem | Verificado 6/11/2026 |
| Precio al crecer (Pro) | USD 10/usuario/mes (USD 8 anual) | Ídem | Verificado 6/11/2026 |

**Historial/auditoría.** Snapshots de 30 días con posibilidad de revertir y ver diferencias (muy bueno para "reversión del contenido publicado"). Auditoría por usuario **a verificar**.

**Export/backup.** CSV de tablas; documentos exportables; open source (Community edition) para autoalojar.

**Credenciales append-only.** Reglas de acceso granulares permiten restringir update/delete por tabla/columna; se puede configurar una tabla de solo altas. **A verificar** la combinación exacta de reglas.

**Esfuerzo de administración.** Bajo-medio.

**Lock-in.** Bajo: open source, export CSV, modelo documentado.

**Costo al crecer.** Pro USD 8–10/usuario/mes; el free de 5.000 registros por documento alcanza para el volumen actual (160+100+catálogos < 5.000) pero limita el crecimiento combinado si todo va en un documento.

**Veredicto.** **Candidata media.** Buen ABM, excelente historial/reversión y modelo relacional; el problema es la API de 3.000 llamadas/mes, que obliga a export programado y a no usar Grist como backend de lectura.

---

### 3.10 SeaTable Free

**Propósito.** Hoja de cálculo colaborativa tipo base de datos, con vistas, formularios, apps y automatizaciones; disponible como Cloud y como servidor autoalojable (SeaTable Server, con licencia).

**Modelo de datos.** Tablas con tipos (26 tipos de columna), relaciones por link, vistas, formularios web, app builder. Relacional medio.

**ABM sin código.** Buena: formularios web, apps, permisos por base/tabla/columna/fila; la UI es más "hoja" que "formulario", pero hay App Builder.

**Acceso público desde sitio estático.** Vistas públicas, apps públicas y links externos (sin login); la API free tiene **3.000 llamadas/mes por usuario**, insuficiente para lectura por visita. Viable con export programado o publicando una vista (consumo de API aparte, **a verificar**).

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Usuarios | Hasta **25** | [seatable.com/prices](https://seatable.com/prices/) | Verificado 6/11/2026 |
| Bases / tablas | Ilimitadas | Ídem | Verificado 6/11/2026 |
| Filas | **10.000** (máx. 10.000 por base) | Ídem | Verificado 6/11/2026 |
| Archivos | **2 GB** | Ídem | Verificado 6/11/2026 |
| Snapshots | **1 mes** | Ídem | Verificado 6/11/2026 |
| Scripts Python | 100 ejecuciones/mes | Ídem | Verificado 6/11/2026 |
| Llamadas API | **3.000/mes por usuario** | Ídem | Verificado 6/11/2026 |
| Automatizaciones | 100/mes | Ídem | Verificado 6/11/2026 |
| Precio al crecer (Plus) | **€7/usuario/mes** anual (€9 mensual) | Ídem | Verificado 6/11/2026 |

Comportamiento al llegar al límite: SeaTable avisa; se puede seguir accediendo a bases y tablas, pero **no se pueden crear filas ni subir archivos** hasta ampliar ([seatable.com/prices](https://seatable.com/prices/), FAQ).

**Historial/auditoría.** Snapshots de 1 mes (reversión); auditoría de cambios **a verificar** según plan.

**Export/backup.** CSV, XLSX y DTABLE (formato propio); export completo posible. El formato DTABLE agrega dependencia pero es convertible.

**Credenciales append-only.** Permisos por tabla/vista/columna y bloqueo de filas; se puede restringir, aunque "solo altas" no está verificado como opción nativa. **A verificar**.

**Esfuerzo de administración.** Bajo.

**Lock-in.** Medio: el formato DTABLE es propio y el servidor autoalojado requiere licencia; el export CSV/XLSX mitiga.

**Costo al crecer.** Plus €7/usuario/mes (3 editores ≈ €21/mes).

**Veredicto.** **Candidata media.** Muy buen free (10.000 filas, 25 usuarios) y snapshots de 1 mes; compite con Grist. La API de 3.000 llamadas/mes y el formato DTABLE son sus límites.

---

### 3.11 GitHub como backend pasivo: JSON versionado + GitHub Actions + GitHub Pages

**Propósito.** Usar el repositorio como fuente de verdad publicada: JSON versionado en `lib/data/datasets/` (ya es el patrón del proyecto), workflows que regeneran datasets y despliegan Pages, y git como historial y mecanismo de reversión.

**Modelo de datos.** JSON con esquema definido en el repo; relaciones por IDs; enums validados por script (`scripts/sync_*.py` ya valida y reporta errores por línea, ver `docs/15` §1.4 y §2.1). El modelo es tan bueno como el esquema que se escriba en `docs/22`.

**ABM sin código.** **No** para edición directa: editar JSON en la web de GitHub es técnico y propenso a errores. Se puede mejorar con plantillas de issue/PR o una UI mínima de formulario que genere el JSON, pero eso es trabajo de desarrollo. Para 1–3 editores no programadores, GitHub **no reemplaza** a un editor no-code; funciona como **capa de publicación**.

**Acceso público desde sitio estático.** Óptimo: el JSON vive en el repo y GitHub Pages lo sirve; el navegador hace `fetch` de un archivo público, sin tokens ni cuotas de API. Es exactamente el patrón vigente (`docs/13` §3).

**Límites free verificados.**

| Límite | Valor | Fuente | Estado |
|---|---|---|---|
| Tamaño del sitio publicado en Pages | **1 GB** | [docs.github.com · Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | Verificado 6/11/2026 |
| Repositorio fuente de Pages | Límite recomendado de **1 GB** | Ídem | Verificado 6/11/2026 |
| Banda ancha de Pages | **100 GB/mes** (límite *soft*) | Ídem | Verificado 6/11/2026 |
| Builds de Pages | **10/hora** (soft; no aplica con workflow propio de Actions) | Ídem | Verificado 6/11/2026 |
| Timeout de despliegue de Pages | **10 minutos** | Ídem | Verificado 6/11/2026 |
| Actions en repositorios públicos | Runners estándar **gratis e ilimitados** | [docs.github.com · Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | Verificado 6/11/2026 |
| Incluido en GitHub Free (repos privados) | **USD 12/mes** de cómputo (≈ 2.000 min Linux a USD 0,006/min) | Ídem | Verificado 6/11/2026 |
| Almacenamiento de artefactos (Free) | **500 MB** | Ídem | Verificado 6/11/2026 |
| API REST sin autenticar | **60 req/hora** por IP | [docs.github.com · REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) | Verificado 6/11/2026 |
| API REST autenticada | 5.000 req/hora | Ídem | Verificado 6/11/2026 |
| Límite de tráfico de `raw.githubusercontent.com` | No documentado como cuota en esta sesión | — | **(a verificar)** |

**Historial/auditoría.** Excelente: cada commit es un cambio con autor, fecha y mensaje; `git log`, `git blame`, diffs y pull requests. Es la auditoría más completa y barata del lote.

**Export/backup.** El repo **es** el backup; un clon o un ZIP de GitHub es el backup completo. La reversión es `git revert` / re-deploy de un tag.

**Credenciales append-only.** Sí, por diseño de proceso: cada credencial emitida puede ir a un archivo de log append-only (`credenciales.jsonl`) que solo se agrega; git garantiza que no se reescribe sin dejar rastro. Requiere disciplina de PR y protección de rama.

**Esfuerzo de administración.** Bajo en operación (Actions ya funciona), medio en flujo editorial: PRs, revisión, ejecución del workflow.

**Lock-in.** **Muy bajo**: git es estándar y el repo se migra a cualquier host.

**Costo al crecer.** Prácticamente nulo para este volumen: 160 museos en JSON son decenas de KB; el sitio está muy por debajo de 1 GB y de 100 GB/mes. Los límites de Pages son "soft" y avisados por email.

**Veredicto.** **Finalista como capa de publicación** (y probablemente la decisión correcta para versionado/reversión), **no como capa de edición**. Su puntaje alto en la matriz mide publicación, no ABM.

---

### 3.12 Opción "solo repo" (sin plataforma externa)

**Propósito.** Baseline: el repo contiene los JSON definitivos y la publicación se hace manualmente (sin Actions ni Pages como servicio de datos), eliminando toda dependencia de plataforma externa.

**Modelo / ABM / lectura / límites / auditoría / export / lock-in.** Idénticos a §3.11 en lo sustantivo, con dos diferencias:
- **ABM:** solo edición de archivos en el repo (o con un editor local); no hay formularios.
- **Publicación:** manual (build + deploy local o commit directo), sin workflow automático; no hay cuota de Actions/Pages que consumir, pero tampoco automatización ni despliegue reproducible desde el repo.

**Costo.** Cero de plataforma; costo en tiempo de operación.

**Veredicto.** **Baseline válido** y plan de contingencia si GitHub Pages/Actions cambiaran sus condiciones. No es una opción de ABM.

---

### 3.13 Opcional: Google Drive/Sheets como CMS con API key de solo lectura

**Propósito.** Servir los datos de la hoja directamente al navegador sin backend: `fetch` a una URL pública de exportación CSV (`pub?output=csv`, ya usado por los scripts, `docs/13` §1) o a la Sheets API con una API key.

**Posibilidad y límites.**
- **Export CSV publicado:** funciona sin autenticación y es el mecanismo que ya usa el repo para museos y configuración. La hoja o la pestaña debe estar publicada en la web; el dato queda público (no sirve para `Claves`, `Logs`, `Metricas`). Documentación de "publicar en la web": **a verificar** (no se leyó la página oficial en esta sesión); el uso actual está verificado en el repo (`docs/13`, `docs/15`).
- **Sheets API con API key:** la guía de autorización de la Sheets API deriva a **OAuth 2.0** y consent screen ([guía de autorización](https://developers.google.com/sheets/api/guides/authorizing), consultada 6/11/2026). En esta sesión **no se localizó** una página oficial que documente usar solo API key para leer una hoja **privada**; la expectativa razonable es que la API key sirva únicamente para datos públicos y que una hoja privada requiera OAuth o un intermediario (Apps Script). **(a verificar)** antes de adoptarlo.
- **Seguridad:** una API key embebida en el bundle es visible; no es un secreto. Solo sería aceptable con datos públicos.
- **Cuotas:** las de la Sheets API (por proyecto/por minuto) no se verificaron en esta sesión. **(a verificar)**.

**Veredicto.** **Complemento, no plataforma.** El export CSV publicado es la forma más simple de lectura pública directa desde el navegador, pero expone el contenido completo de la pestaña publicada y no permite auditar accesos ni separar hojas privadas. Sirve para contenido público; no para claves, credenciales ni métricas.

---

## 4. Tabla comparativa general

Escala cualitativa: ✔✔ = cumple bien; ✔ = cumple con trabajo o matices; ✖ = no cumple; ? = **a verificar**.

| Criterio | 1 Sheets+AS | 2 AppSheet | 3 Airtable | 4 NocoDB cloud | 5 NocoDB self | 6 Baserow cloud | 7 Baserow self | 8 Supabase | 9 D1+Workers | 10 PocketBase | 11 Grist | 12 SeaTable | 13 GitHub | 14 Solo repo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ABM formulario sin programar (Alto) | ✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✖ | ✖ | ✔ | ✔ | ✔ | ✖ | ✖ |
| Free sostenible 1–3 editores (Alto) | ✔ | ✖ (pago) | ✔ (justo) | ✖ (1.000 reg.) | ✔ | ✔ | ✔ | ✔ (pausa) | ✔ | ✔ (hosting) | ✔ | ✔ | ✔✔ | ✔✔ |
| Lectura pública estática sin secretos (Alto) | ✔ (vía JSON/endpoint) | ✖ | ✔ (vía export) | ✔ (vía export) | ✔ | ✔ (vía export/vista) | ✔ | ✔ (anon+RLS) | ✔✔ (Worker) | ✔ (REST) | ✔ (vía export) | ✔ (vía export/vista) | ✔✔ | ✔✔ |
| Modelo relacional + IDs + enums (Alto) | ✔ (débil) | ✔ | ✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔ | ✔ (vía esquema) | ✔ (vía esquema) |
| Bilingüe desde el modelo (Medio) | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ |
| Historial y auditoría (Medio) | ✔ | ✔ | ✔ (2 sem.) | ✖ | ? | ✔ (14 días) | ✔ (14 días) | ✔ (con triggers) | ✔ (Time Travel 7 d) | ? | ✔✔ (30 d) | ✔ (1 mes) | ✔✔ (git) | ✔✔ (git) |
| Export/backup completo (Medio) | ✔✔ | ✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔ | ✔✔ | ✔✔ |
| Costo de salida (Medio) | ✔✔ | ✔ | ✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✔ | ✔✔ | ✔✔ |
| Sin servidor propio (Bajo) | ✔✔ | ✔✔ | ✔✔ | ✔✔ | ✖ | ✔✔ | ✖ | ✔ (gestionado) | ✔✔ | ✖ | ✔✔ | ✔✔ | ✔✔ | ✔✔ |
| Credenciales append-only (requisito) | ✔ (por convención) | ? | ? | ? | ? | ? | ? | ✔✔ (RLS) | ✔ (Worker) | ? | ✔ (reglas) | ? | ✔✔ (git) | ✔✔ (git) |
| Reversión de contenido publicado (requisito) | ✖ (limitada) | ? | ✔ (2 sem.) | ✖ | ? | ✔ (14 d) | ✔ (14 d) | ✔ (con backups) | ✔ (7 d) | ? | ✔ (30 d) | ✔ (1 mes) | ✔✔ | ✔✔ |

---

## 5. Matriz de criterios ponderados

Se usan los criterios y pesos de `docs/19_DATA_INFRA_SESSION.md` §5. **Peso:** Alto = 3, Medio = 2, Bajo = 1 (suma 21). **Puntaje por plataforma:** 1 (malo) a 5 (excelente). Puntaje máximo posible = 5 × 21 = **105**.

En el criterio "Requiere servidor propio" (peso Bajo), 5 significa **no requiere servidor propio**; 1 significa que sí lo requiere.

| # | Plataforma | ABM (3) | Free 1–3 edit. (3) | Lectura pública (3) | Relacional (3) | Bilingüe (2) | Historial (2) | Export (2) | Salida (2) | Sin servidor (1) | **Total /105** | **%** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 | GitHub JSON + Actions + Pages | 2 | 5 | 5 | 2 | 5 | 5 | 5 | 5 | 5 | **87** | **82,9 %** |
| 6 | Baserow Cloud Free | 5 | 3 | 3 | 4 | 4 | 3 | 4 | 4 | 5 | **80** | **76,2 %** |
| 5 | NocoDB self-hosted | 5 | 4 | 3 | 4 | 4 | 3 | 4 | 4 | 1 | **79** | **75,2 %** |
| 7 | Baserow self-hosted | 5 | 4 | 3 | 4 | 4 | 3 | 4 | 4 | 1 | **79** | **75,2 %** |
| 14 | Solo repo (sin Actions/Pages) | 1 | 4 | 4 | 2 | 5 | 5 | 5 | 5 | 5 | **78** | **74,3 %** |
| 8 | Supabase Free | 1 | 3 | 4 | 5 | 5 | 2 | 5 | 5 | 4 | **77** | **73,3 %** |
| 9 | Cloudflare D1 + Workers Free | 1 | 4 | 5 | 4 | 5 | 2 | 4 | 4 | 5 | **77** | **73,3 %** |
| 12 | SeaTable Free | 4 | 3 | 3 | 4 | 4 | 3 | 4 | 3 | 5 | **75** | **71,4 %** |
| 10 | PocketBase self-hosted | 4 | 3 | 4 | 4 | 4 | 2 | 4 | 4 | 1 | **74** | **70,5 %** |
| 11 | Grist Free | 4 | 3 | 2 | 4 | 4 | 3 | 4 | 4 | 5 | **74** | **70,5 %** |
| 1 | Sheets + Apps Script | 4 | 4 | 3 | 2 | 4 | 2 | 4 | 4 | 5 | **72** | **68,6 %** |
| 3 | Airtable Free | 5 | 2 | 2 | 4 | 4 | 3 | 4 | 3 | 5 | **72** | **68,6 %** |
| 4 | NocoDB Cloud Free | 5 | 1 | 2 | 4 | 4 | 2 | 4 | 4 | 5 | **69** | **65,7 %** |
| 2 | Sheets + AppSheet free | 5 | 2 | 2 | 3 | 4 | 3 | 3 | 3 | 5 | **67** | **63,8 %** |

### 5.1 Justificación de los puntajes clave

- **GitHub (87):** gana por lectura pública (5), historial (5), export (5), salida (5) y gratuidad (5); pierde solo en ABM (2) y relacional (2, porque la integridad depende del esquema/validador, no de la plataforma).
- **Baserow cloud (80):** el mejor ABM real del lote; 3.000 filas y 14 días de historial lo ponen por debajo de GitHub en free e historial; la lectura pública requiere export o vista (3).
- **NocoDB/Baserow self-hosted (79):** ganan en ABM y free, pierden el criterio "sin servidor" (1) y agregan operación.
- **Supabase (77) y D1 (77):** excelentes en modelo, lectura y salida; **1 en ABM** porque no ofrecen edición no-code para 1–3 editores.
- **Sheets + Apps Script (72):** muy bueno en ABM, free, bilingüe y export; **2 en relacional** (hojas planas) y **2 en historial** (auditoría débil); la lectura pública puntúa 3 porque depende de un endpoint con cuota o de un JSON generado.
- **AppSheet free (67):** mejor ABM (5) pero **2 en free** por la letra chica (prototipo/personal) y **2 en lectura pública**.

### 5.2 Advertencia de interpretación

La matriz mide "plataforma para editar **y** publicar" con el supuesto de que **la publicación final es JSON en Git** (arquitectura vigente). Ese supuesto favorece a GitHub. Si se cambiara el supuesto a "publicación directa por API desde el navegador", Baserow, Supabase y D1 subirían y GitHub bajaría. El ADR debe declarar qué supuesto adopta.

### 5.3 Sensibilidad (sin ABM)

Si se excluyera el criterio ABM (peso 3) —porque el ABM se resuelve en otra capa— los puntajes se reordenan: GitHub seguiría primero, y Supabase/D1 subirían al segundo lugar. Esto refuerza la lectura de que **el ABM es la variable que decide**, no la base de datos.

---

## 6. Qué significa alcanzar el límite free y qué pasa después

Comportamiento **documentado** por proveedor cuando se alcanza el límite. "Plan de salida" es la acción concreta disponible para ISA.

| Plataforma | Qué pasa al alcanzar el límite free | ¿Se pierden datos? | Plan de salida |
|---|---|---|---|
| Google Sheets + Apps Script | Sheets: al superar 15 GB de cuenta no se pueden subir/crear archivos y, si persiste 2 años, el contenido puede eliminarse (con avisos ≥3 meses). Apps Script: excepción y fin de ejecución ("Service invoked too many times", "Service using too much computer time for one day"); el Web App puede quedar sin cuota. | No por cuota; sí por inactividad prolongada de la cuenta | Exportar CSV/JSON; mover la edición a otra plataforma y mantener JSON+Git; ampliar a Workspace (precio **a verificar**) |
| Sheets + AppSheet free | Al superar 10 usuarios de prueba o usar la app para uso no personal, hay que licenciar; el acceso de "uso personal" se bloquea a los 3 días si supera 3 usuarios. | No | Pagar Starter USD 5/usuario/mes o migrar el ABM |
| Airtable Free | No se pueden agregar registros ni adjuntos hasta subir de plan; automatizaciones y API se cortan en el tope; **no se borran datos** (FAQ de la página de precios). | No | Export CSV/JSON y migrar; o Team USD 20/asiento/mes anual |
| NocoDB Cloud Free | Al llegar a 1.000 registros o 1.000 llamadas API/mes, no se agregan registros ni se consume API (comportamiento exacto **a verificar** en la FAQ de la página). | Datos accesibles | Export CSV + migrar; self-hosted o Plus USD 12/asiento/mes |
| NocoDB self-hosted | Sin cuota de proveedor; límites del servidor (disco/RAM). | Responsabilidad propia | Escalar servidor; backups propios |
| Baserow Cloud Free | Al superar 3.000 filas/2 GB por workspace, se bloquean altas (comportamiento exacto **a verificar**). | No | Export CSV/JSON; self-hosted; Premium USD 10/usuario/mes |
| Baserow self-hosted | Sin cuota de proveedor; límites del servidor. | Responsabilidad propia | Escalar servidor |
| Supabase Free | El proyecto **se pausa tras 1 semana de inactividad**; al llenar 500 MB no se puede escribir. El plan Pro levanta los límites. | No; la pausa se revierte desde el panel (**procedimiento a verificar**) | `pg_dump` + migrar a otro Postgres; Pro USD 25/mes |
| Cloudflare D1 + Workers Free | Las consultas fallan con error hasta el reset diario (00:00 UTC); al llenar el storage no se pueden insertar/alterar tablas ni índices. El plan pago se activa "en minutos". | No | `wrangler d1 export` + migrar; Workers Paid USD 5/mes |
| PocketBase self-hosted | Sin cuotas de plan; si el servidor gratuito cambia de condiciones o se cae, el servicio se interrumpe. | Responsabilidad propia | Mover el binario + `pb_data` a otro host |
| Grist Free | Al superar 5.000 registros por documento hay que subir de plan para seguir cargando (FAQ "How can I get more rows?"). | No | Export CSV; Pro USD 8–10/usuario/mes; Community edition autoalojada |
| SeaTable Free | Avisa; se puede seguir accediendo, pero **no se crean filas ni se suben archivos**; al vencer un plan pago se degrada a Free (posible solo lectura). | No | Export CSV/XLSX/DTABLE; Plus €7/usuario/mes |
| GitHub (JSON + Actions + Pages) | Pages: límites *soft* (100 GB/mes de banda, 1 GB de sitio); si se excede, GitHub puede pedir CDN o sugerir otro host; **no se borra el repo**. Actions en repo público: gratis; en privado, se bloquea al consumir el incluido. API REST: 60 req/h sin token. | No | Clonar el repo y desplegar en cualquier host estático (Cloudflare Pages, Netlify, VPS) sin cambiar datos |

**Conclusión de la sección:** en todas las opciones el dato no se pierde al alcanzar el límite free; lo que se pierde es la **capacidad de editar/publicar**. El riesgo real no es la pérdida de datos sino la **interrupción del ABM** y la **pérdida de tiempo** en una migración de emergencia. Por eso el criterio "Export/backup completo" (R7/R8) es más importante que el tamaño del plan free.

---

## 7. Riesgos de cuota y plan de salida para ISA

### 7.1 Escenario de consumo estimado (con el volumen actual)

| Actividad | Frecuencia | Consumo estimado | Plataforma afectada |
|---|---|---|---|
| Sync de museos (160 filas) | Semanal (workflow) | Segundos de cómputo; 1 commit | GitHub Actions / Python |
| Sync de configuración (settings, temporadas, misiones, reactivos) | Semanal | Segundos | Ídem |
| Lecturas públicas del sitio | Cada visita | 0 si es JSON estático en Pages; N si es API | Pages vs. endpoint/BD |
| Edición de contenido | 1–3 personas, decenas de cambios/semana | Muy bajo | Plataforma de ABM |
| Export/backup | Semanal/mensual | 1 corrida | Plataforma de ABM |
| Credenciales emitidas | Crecimiento futuro | Altas, no lecturas masivas | BD/JSON |

### 7.2 Riesgos por finalista

**Sheets + Apps Script**
- **Cuota de ejecución compartida:** el Web App consume los 90 min/día (a verificar) de la cuenta dueña, junto con los triggers de sync. Si el endpoint se usa como API de lectura por visita, la cuota se agota y también se cae el sync.
  - Mitigación: publicar por JSON (las visitas no pasan por Apps Script); usar el endpoint solo para validación institucional de baja frecuencia; cachear respuestas (`CacheService`) y acotar `ISA_MAX_ROWS` (ya previsto en `docs/07`).
- **Seguridad del endpoint:** URL pública sin rate limiting propio (`docs/07` §5); la protección es entropía de claves + cuota.
  - Mitigación: claves largas, rotación de `ISA_TOKEN_SECRET`, token corto, monitoreo de errores.
- **Integridad:** sin FKs; un ID mal escrito rompe relaciones.
  - Mitigación: validación en el script de sync (ya existe para `timss_domain`, `correct_option_id`, `rule_type`) y en `docs/22`.

**Baserow Cloud Free**
- **3.000 filas por workspace:** el volumen actual entra, pero "cientos de museos + más temporadas + instituciones + credenciales" puede acercarse al tope si todo va al mismo workspace.
  - Mitigación: separar workspaces por dominio (contenido vs. credenciales), exportar y archivar histórico; plan Premium si se supera.
- **API:** rate limit no verificado y lectura pública no directa; el sitio no debe depender de la API en tiempo real.
  - Mitigación: export programado a JSON en el repo (mismo patrón que Sheets) y publicación por Pages.
- **Historial de 14 días:** corto para auditoría editorial.
  - Mitigación: historial completo en git (cada export commitea el JSON) y columnas `actualizado_*`.

**GitHub JSON + Actions**
- **Sin ABM:** el riesgo es operativo (editores no técnicos rompen el JSON).
  - Mitigación: capa de edición separada (Sheets/Baserow) que genere el JSON; validación en CI (`scripts/sync_*.py --check`) y PRs protegidos.
- **Límites soft de Pages:** muy lejanos para este volumen (JSON de decenas de KB).
- **API 60 req/h:** solo relevante si se leyera el repo por API en el navegador; el JSON estático no la usa.

### 7.3 Plan de salida general (aplicable a cualquier decisión)

1. **Mantener el JSON en Git como formato de publicación**, independientemente de la plataforma de edición. Es la póliza de seguro: si la plataforma cambia de precio o cierra, el sitio sigue publicando desde el repo.
2. **Export programado semanal** de la plataforma de edición hacia el repo (mismo patrón de `sync-museums.yml` y `sync-config.yml`), con validación y commit automático.
3. **Backup mensual completo** descargado fuera de la plataforma (CSV/JSON/SQL + copia del repo).
4. **Documentar el mapeo** plataforma → JSON en `docs/22` para que la migración sea mecánica.
5. **Criterio de disparo de migración:** si el ABM no permite cargar una tabla nueva, si el free cambia de condiciones con aviso < 30 días, o si el export deja de ser completo.

---

## 8. Gaps y "a verificar"

Lista cerrada de lo que **no** se pudo verificar en esta sesión. Nada de esto se usa como afirmación en §9.

| # | Tema | Qué falta | Cómo cerrarlo |
|---|---|---|---|
| G1 | Apps Script: cuotas vigentes | La página oficial vigente no pudo extraerse completa; los valores de §3.1 son de copia archivada 2019 | Leer la página oficial completa (navegador) y registrar fecha; actualizar §3.1 y el ADR |
| G2 | Apps Script: cuota de Web App | No se documentó una cuota de solicitudes/día para Web Apps | Confirmar en la página oficial de cuotas si existe una fila específica; si no, documentar que el límite es tiempo de ejecución + concurrencia |
| G3 | Google Sheets: límite de columnas | La página vigente indica 20 M celdas / 100 MB, sin límite de columnas explícito | Confirmar si existe un máximo de columnas vigente (el valor "18.278" que circula no se verificó) |
| G4 | Publicar hoja en la web | No se leyó la página oficial de "publicar en la web" en esta sesión | Verificar URL oficial y comportamiento (CSV publicado, sin auth) |
| G5 | Sheets API con API key | Si una API key puede leer hojas privadas (se espera que no) y cuáles son sus cuotas | Leer documentación de autorización/cuotas de Sheets API |
| G6 | AppSheet free: "adds only" | Si el plan free permite una tabla de solo altas y cuánto dura el modo prototipo | Probar en una cuenta demo; leer ayuda oficial de permisos por tabla |
| G7 | NocoDB cloud: qué pasa al llegar a 1.000 registros/API | Comportamiento exacto (bloqueo de altas, errores) | Leer FAQ "What happens when I hit my usage limits?" de la página de precios |
| G8 | NocoDB/Baserow: audit logs en free/self-hosted | Disponibilidad y retención; "Revision History" figura como "Soon" | Leer docs de auditoría y probar en instancia demo |
| G9 | Baserow: asientos de editor en free y rate limit de API | La página de precios no publica el número de asientos; el rate limit no se verificó | Leer docs de Baserow y FAQ de límites; probar API |
| G10 | Airtable: append-only y auditoría | Si el free permite bloquear update/delete; alcance de audit logs | Leer docs de permisos/audit y probar |
| G11 | Supabase: pausa y reactivación | Procedimiento exacto de reactivación y tiempo de retención tras la pausa | Leer docs de "pausing" y probar en un proyecto free |
| G12 | Supabase: retención de logs en free | La página de precios no lo detalla para Free | Leer docs de logs |
| G13 | PocketBase: hosting gratuito sostenible | No hay precio oficial; los free tiers de PaaS cambian | Comparar 2–3 proveedores con precio vigente y fecha |
| G14 | PocketBase: append-only y auditoría | Reglas exactas por operación y hooks de auditoría | Leer docs de API rules y probar |
| G15 | Grist/SeaTable: lectura pública sin API | Si una vista pública puede consumirse como JSON/CSV sin API y con qué cuota | Leer docs de "public sharing"/"external links" |
| G16 | GitHub: límites de `raw.githubusercontent.com` | No documentados como cuota en esta sesión | Verificar docs de GitHub; si no hay cuota, usar Pages en lugar de raw |
| G17 | Costo de Google Workspace | Precio actual de los planes que subirían las cuotas | Consultar workspace.google.com/pricing con fecha |
| G18 | Costo de self-hosting (NocoDB/Baserow/PocketBase) | No se verificó un proveedor concreto | Comparar VPS/PaaS con precio y fecha |
| G19 | Volumen real futuro de credenciales | No hay proyección aprobada | Pedirla al usuario; afecta la tabla de credenciales, no tanto la plataforma |
| G20 | Requisitos de privacidad/auditoría | No hay requisitos formales de datos personales | No aplica a datos de contenido; aplica a `Logs`/`Metricas` futuros (`docs/00` §17) |

---

## 9. Recomendación preliminar (para que decida el ADR)

No se cierra la decisión. Se proponen **tres finalistas** y el criterio con el que el ADR debería elegir entre ellos.

### 9.1 Finalista A — Google Sheets privada + JSON versionado + endpoint Apps Script read-only

**Qué es:** la fuente de verdad sigue en hojas privadas (editadas por 1–3 personas), el workflow semanal genera JSON en el repo y Pages lo publica; el Web App de Apps Script queda como canal institucional read-only para claves y datos autorizados.

**Por qué:** es la única opción ya integrada al proyecto (`docs/07`, `docs/13`, `docs/15`), sin servidor, con lectura pública sin secretos vía JSON, bilingüe por columnas, export CSV/XLSX total y salida trivial. Holgura de volumen amplia (20 M celdas por hoja, 160 filas de museos).

**Qué debe aceptar:** integridad referencial débil y auditoría limitada (mitigables con validación en scripts + git); cuota de Apps Script compartida (mitigable publicando por JSON); dependencia de una cuenta Google y de un responsable del script/hoja.

### 9.2 Finalista B — Baserow Cloud Free como capa de ABM + export programado a JSON

**Qué es:** Baserow aporta la mejor edición no-code del lote (formularios, vistas, permisos), con export programado (GitHub Actions) hacia JSON versionado en el repo; Pages publica. El proyecto no queda atado a Baserow para publicar.

**Por qué:** cumple R1 con la mejor experiencia para editores no técnicos, 3.000 filas/workspace, 14 días de historial, export CSV/JSON/XML, open source con opción de autoalojamiento y salida documentada. Si mañana Baserow cambia condiciones, el JSON+Git sigue publicando.

**Qué debe aceptar:** una plataforma externa más; lectura pública solo por export/vista pública (no API directa desde el navegador); verificar asientos y rate limit (G9); historial de 14 días insuficiente para auditoría larga (mitigable con git).

### 9.3 Finalista C — GitHub JSON + Actions + Pages como capa de publicación (con ABM mínimo)

**Qué es:** el repo como fuente de publicación y versionado; el ABM se resuelve con la capa A o B (o con un formulario mínimo que genere JSON en un PR). Es la opción "sin plataforma externa" y la más barata.

**Por qué:** mejor puntaje de la matriz en publicación, historial, reversión, export, salida y gratuidad; hoy ya sostiene el despliegue. Es, en realidad, **el denominador común de A y B**: en las tres, el JSON en Git es lo que se publica.

**Qué debe aceptar:** no es un ABM; requiere que la edición viva en otra capa o que los editores acepten un flujo técnico (PR/JSON). Es también el plan de contingencia si Pages/Actions cambiaran sus condiciones.

### 9.4 Cómo debería elegir el ADR

| Pregunta de decisión | Si la respuesta es… | Finalista sugerido |
|---|---|---|
| ¿Los editores son las mismas personas que ya usan la Sheet y aceptan grilla? | Sí | A (Sheets + JSON) |
| ¿Se necesita formulario real, permisos por rol y vistas para 1–3 no técnicos, y se acepta una plataforma externa? | Sí | B (Baserow + JSON) |
| ¿La prioridad es costo cero, auditabilidad total y reversión, y el ABM puede esperar o resolverse con un formulario mínimo? | Sí | C (GitHub + JSON) |
| ¿Se va a construir una UI de administración propia en el sitio? | Sí | Reabrir Supabase/D1 como motor |

**Combinación recomendada a evaluar por el ADR (no decidida aquí):** **A o B como capa de edición + C como capa de publicación**, con export programado y validación en CI. Esa combinación es la que mejor cubre R1–R12 en conjunto, y ninguna plataforma sola la cubre.

---

## 10. Fuentes consultadas (6 de noviembre de 2026)

Todas las URLs se consultaron el 6/11/2026. Se indica qué se verificó en cada una.

1. [Google Drive Help — Files you can store in Google Drive](https://support.google.com/drive/answer/37603) — hojas: hasta 20 millones de celdas o 100 MB; tamaños por tipo de archivo.
2. [Google Drive Help — How your Google storage works](https://support.google.com/drive/answer/9312312) — 15 GB de almacenamiento por cuenta, compartido con Gmail y Photos.
3. [Apps Script — Quotas for Google Services](https://developers.google.com/apps-script/guides/services/quotas) — página oficial de cuotas. **La tabla vigente no pudo extraerse completa en esta sesión.**
4. [Copia archivada oficial de la página de cuotas de Apps Script (20/12/2019)](https://web.archive.org/web/20191220235549/https://developers.google.com/apps-script/guides/services/quotas) — valores usados en §3.1, marcados (a verificar).
5. [Google AppSheet — Pricing](https://about.appsheet.com/pricing/) — plan free/prototipo, filas por AppSheet database (2.500), precios Starter/Core/Enterprise Plus.
6. [AppSheet Help — Use AppSheet for free](https://support.google.com/appsheet/answer/10104499) — condiciones del free: uso personal, ≤10 usuarios de prueba, ≤3 usuarios en uso personal.
7. [Airtable — Pricing](https://airtable.com/pricing) — 1.000 registros/base, 5 editores, 1 GB de adjuntos, 100 automatizaciones, 1.000 llamadas API/mes, historial 2 semanas.
8. [Airtable — Web API Rate Limits](https://airtable.com/developers/web/api/rate-limits) — 5 req/s por base; 50 req/s por usuario; 429 → 30 s.
9. [NocoDB — Pricing](https://nocodb.com/pricing) — cloud free (3 editores, 1.000 registros, 1 GB, 100 automatizaciones, 1.000 API/mes) y self-hosted gratuito.
10. [Baserow — Pricing](https://baserow.io/pricing) — free 3.000 filas/workspace, 2 GB, 2.000 créditos, 14 días de historial; planes Premium/Advanced.
11. [Supabase — Pricing](https://supabase.com/pricing) — free 500 MB, 2 proyectos, pausa tras 1 semana, 50.000 MAU, 5 GB egress, 1 GB storage; Pro USD 25/mes.
12. [Cloudflare D1 — Limits](https://developers.cloudflare.com/d1/platform/limits/) — free 500 MB/base, 10 bases, 5 GB, Time Travel 7 días, 50 consultas/invocación, 100 columnas, 2 MB por fila.
13. [Cloudflare D1 — Pricing](https://developers.cloudflare.com/d1/platform/pricing/) — 5 M filas leídas/día, 100 k escritas/día, 5 GB, 10 bases.
14. [Cloudflare Workers — Pricing](https://developers.cloudflare.com/workers/platform/pricing/) — free 100.000 requests/día, 10 ms de CPU por invocación; Paid desde USD 5/mes.
15. [PocketBase — Documentation](https://pocketbase.io/docs/) — open source, SQLite embebido, REST, panel; aviso de no usar en producción crítica antes de v1.0.0 (v0.41.1).
16. [Grist — Pricing](https://www.getgrist.com/pricing/) — free 5.000 registros/documento, snapshots 30 días, 10 miembros, API 3.000/mes/equipo, 1 GB adjuntos.
17. [SeaTable — Prices](https://seatable.com/prices/) — free hasta 25 usuarios, 10.000 filas, 2 GB, snapshots 1 mes, 3.000 API/mes, 100 automatizaciones.
18. [GitHub Docs — GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 1 GB publicado, 100 GB/mes banda (soft), 10 builds/hora (soft), timeout 10 min.
19. [GitHub Docs — GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) — repos públicos gratis; GitHub Free USD 12/mes de cómputo incluido; 500 MB de artefactos; tarifas por minuto.
20. [GitHub Docs — Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) — 60 req/h sin autenticar; 5.000 req/h autenticado.
21. [Google Sheets API — guía de autorización](https://developers.google.com/sheets/api/guides/authorizing) — deriva a OAuth 2.0 / consent screen; sin documentación de API key para hojas privadas localizada en esta sesión.

### Notas de fuentes

- **No se citaron blogs ni comparativas de terceros** para cifras. Los valores de Apps Script de §3.1 provienen de una copia archivada de la página oficial y se marcan (a verificar); no se usaron sitios secundarios como fuente de cifras.
- Los precios de autohosting (NocoDB/Baserow/PocketBase) **no** se tomaron de ninguna fuente: quedan (a verificar) en §8.
- Las páginas de Google que no pudieron extraerse completas se indican en §0.5 y §8 (G1–G5).
