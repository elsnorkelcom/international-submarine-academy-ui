# ISA · ADR-001 · Infraestructura de datos

**Formato:** Architecture Decision Record.
**Estado:** **Propuesta para aprobación.** No implementada.
**Fecha:** 6 de noviembre de 2026.
**Decisores:** usuario (responsable del proyecto), Lead de la sesión S · Infraestructura de datos.
**Autores:** session `arquitecto`.
**Alcance:** dónde vive el contenido, cómo se edita, cómo se publica, cómo se revierte y dónde se registran las credenciales emitidas.
**Documentos de entrada:** `docs/20_INVENTARIO_COMPONENTES.md` (inventario verificado), `docs/21_OPCIONES_PLATAFORMA.md` (comparación con fuentes), `docs/22_MODELO_DATOS_SHEET.md` (esquema físico).
**Documentos que este ADR debe respetar:** `docs/00_DOCUMENTO_BASE.md`, `docs/07_ENDPOINT_APPS_SCRIPT.md`, `docs/08_DATA_LAYER.md`, `docs/13_SHEET_SYNC.md`, `docs/14_OPEN_BADGES.md`, `docs/15_CONFIG_SHEET.md`, `docs/19_DATA_INFRA_SESSION.md`.
**Regla de evidencia:** toda cifra de cuota proviene de `docs/21` con su URL de fuente y fecha (6/11/2026); lo no verificable se marca **(a verificar)** y no se usa como afirmación.

---

## 0. Resumen de la decisión

| Elemento | Decisión propuesta |
|---|---|
| **Fuente de verdad del contenido** | Una **Google Sheet privada** del proyecto, editada por 1–3 personas del equipo. |
| **Capa de edición** | La propia Sheet (grilla + validación de datos + pestañas), con AppSheet **opcional y no adoptado** (su plan free es de prototipo personal). |
| **Capa de publicación** | **Export JSON versionado en el repo** (`lib/data/datasets/`), generado por scripts Python, commiteado por GitHub Actions y servido por GitHub Pages. El navegador público **nunca** lee la Sheet. |
| **Canal institucional** | Web App de **Apps Script read-only** (`apps-script/Code.gs`, `docs/07`), **sin desplegar todavía**, para validar claves por hash y servir datos autorizados. |
| **Caché local** | **IndexedDB** como espejo de trabajo del navegador; **no** es fuente de verdad ni se sincroniza multi-dispositivo. |
| **Registro de credenciales emitidas** | **Dos etapas.** (a) **MVP:** las credenciales quedan **locales en IndexedDB**; son prueba de avance, **no** certificación ni registro central. (b) **Futuro:** registro central append-only **solo** cuando exista un **servicio emisor que firme** (Worker/Node) y/o identidad del destinatario; el append a una hoja de Apps Script **no es confiable** porque el endpoint público no puede validar quién llama y `subject` es anónimo. No se adopta en el MVP. |
| **Versionado y reversión** | Git: commits de contenido + `version` en cada JSON + `manifest.json` con hash + tag por publicación. Reversión por `git revert` o re-deploy de un commit/tag anterior. |
| **Plataformas de pago** | Ninguna. Todo el diseño cabe en planes gratuitos con holgura para el volumen actual (160 museos, 100 reactivos). |
| **Estado de implementación** | **Ninguna parte de esta decisión está implementada por este ADR.** No se creó Sheet, script, endpoint, workflow ni JSON nuevo. |

**Consecuencia central:** la edición es **una hoja privada** y la publicación es **un artefacto JSON reproducible en Git**. Las dos capas se acoplan por scripts de sync validados y versionados, no por una API en tiempo de ejecución. Eso preserva la decisión del 5/11/2026 (`docs/00` §10 y §12) y **no agrega ninguna superficie de escritura nueva**: el endpoint sigue siendo read-only y las credenciales del MVP siguen siendo locales.

---

## 1. Contexto

### 1.1 Estado real verificado (commit `3e7f53f`, 6/11/2026)

Resumen de `docs/20`; el detalle con evidencia está allí.

- **14 colecciones** de dominio en `lib/domain/types.ts` (`institutions`, `accessKeys`, `museums`, `compartments`, `systems`, `seasons`, `episodes`, `missions`, `questions`, `badges`, `roles`, `disciplines`, `credentials`, `settings`), con **12** en el CRUD genérico del panel (`lib/admin/entities.ts`).
- **160 museos** versionados en `lib/data/datasets/museums-snk-2025.json` (8 validados, 152 pendientes), regenerados por `scripts/sync_museums.py` desde la Sheet publicada de Submarinos Museos.
- **`lib/data/datasets/isa-config.json`** con `version: 2` y **todas las secciones vacías**: el canal de configuración existe pero no se usa.
- **100 reactivos TIMSS curados** en `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv`, **no importados** a la app; la base local tiene 2 reactivos de seed.
- **IndexedDB** (`components/app/data-provider.tsx`) se usa en `/admin`, `/museums`, `/museums/[id]`, `/map`, `/series`, `/episodes` y `/profile` (estas tres vía `components/learn/learn-root.tsx`). La Home (`/`) y `/insignias` siguen usando **fixtures** (`lib/missions.ts`, `lib/seasons.ts`, `lib/progress.ts`).
- **Panel admin local**: edita la IndexedDB del navegador, sin backend, sin cuentas y sin publicación. Los cambios de un editor **no** llegan a otro dispositivo.
- **Credenciales Open Badges**: se emiten en el navegador (`lib/badges/registry.ts`), sin firma, con `subject: 'anonymous'`; el `registryNo` se calcula con `count + 1` por navegador y puede colisionar.
- **Apps Script de referencia** en `apps-script/Code.gs`: read-only, nunca expone `Claves`, `Logs`, `Metricas`, `Instituciones` ni `Propiedad_Intelectual`; **no desplegado** y **no consumido**.
- **Despliegue**: GitHub Pages vía `.github/workflows/next-pages.yml`, build estático (`output: 'export'`) y dominio `https://academy.elsnorkel.com`.

### 1.2 Restricciones duras

1. El sitio es estático: **el navegador no puede guardar secretos ni ser la fuente de escritura**.
2. Planes gratuitos razonables y administración simple (ABM) para **1–3 editores**.
3. **Bilingüe en/es** desde el modelo.
4. **IDs y URLs existentes no se rompen** (`MUS-U995`, `SEA-STEEL`, `EPI-STEEL-04`, `/museums/[id]`, `/series`, `/episodes`).
5. **Privacidad:** sin datos personales sin requisitos, base legal y revisión (`docs/00` §10–11, `AGENTS.md` regla 10).
6. **Reversión** del contenido publicado a una versión anterior.
7. **Esta sesión no implementa** nada: decide y planifica.

### 1.3 Coherencia con la decisión del 5/11/2026 (`docs/00`)

| Afirmación de `docs/00` | Este ADR | ¿Coherente? |
|---|---|---|
| La Google Sheet permanece privada | Sí: fuente de verdad privada | ✅ |
| El acceso web es solo por un Web App de Apps Script controlado | Sí: canal institucional; el público lee JSON estático | ✅ |
| El endpoint valida claves por hash y responde token | Sí, se mantiene (`docs/07` §4–5) | ✅ |
| El endpoint es **read-only** y no crea/modifica/borra filas | Se mantiene **sin cambios en el MVP**; el registro central de credenciales se posterga a la etapa con emisor firmante/identidad (§3.4) | ✅ |
| Las altas y cambios de contenido siguen siendo tarea humana en la Sheet | Sí: el endpoint no edita contenido | ✅ |
| El JSON versionado y los workflows ya son el patrón vigente (museos y config) | Sí: se generaliza a todo el contenido | ✅ |
| Fixtures locales siguen siendo la fuente efectiva de la demo | Sí hasta la fase de unificación (§6, fase 8) | ✅ |
| No exponer claves ni credenciales en el frontend | Sí: el JSON no incluye `Claves`; las credenciales emitidas no se publican | ✅ |

**Conclusión de coherencia:** el ADR confirma la dirección del 5/11 **sin extenderla**. El registro central append-only de credenciales no se adopta ahora: queda como etapa futura condicionada a un emisor que firme y/o identidad (§3.4, §9 U3).

---

## 2. Decisión recomendada

### 2.1 Combinación elegida

Se adopta el **Finalista A de `docs/21` §9.1** para edición y el **Finalista C de `docs/21` §9.3** para publicación. Las credenciales emitidas **no** se centralizan en el MVP:

```text
EDICIÓN          Google Sheet privada (1–3 editores)
                      │
                      │ scripts/sync_*.py (validan por fila, calculan hash)
                      ▼
PUBLICACIÓN      lib/data/datasets/*.json + manifest.json  ── commit ──▶ GitHub
                      │                                                    │
                      │                                     GitHub Actions (build)
                      ▼                                                    ▼
CONSUMO          fetch JSON estático en GitHub Pages        IndexedDB (caché local)
                      │
                      │ (solo instituciones con clave)
                      ▼
INSTITUCIONAL    Apps Script Web App read-only (token HMAC)
                      │
                      │ (MVP: sin escritura)
                      ▼
CREDENCIALES     MVP: IndexedDB local (prueba de avance, sin registro central)
                 FUTURO: registro central append-only SOLO con emisor que firme
                         y/o identidad del destinatario (no en esta etapa)
```

### 2.2 Por qué esta combinación

1. **Es la única que ya está integrada al repositorio.** `docs/13` y `docs/15` describen exactamente este patrón para museos y configuración; `apps-script/Code.gs` ya implementa el endpoint de referencia; `next-pages.yml` ya despliega el JSON. El costo de adopción es el más bajo de todas las alternativas.
2. **Cumple las cuatro restricciones duras a la vez:** edición no-code en grilla, free sostenible para 1–3 editores, lectura pública sin secretos y reversión por Git. Ninguna plataforma sola las cumple (`docs/21` §1).
3. **La matriz ponderada de `docs/21` §5 ubica a GitHub JSON como mejor capa de publicación (87/105, 82,9 %) y a Sheets + Apps Script como la mejor opción de edición ya integrada (72/105, 68,6 %).** La combinación suma las fortalezas y evita el ABM inexistente de GitHub.
4. **El volumen actual entra con holgura:** 160 museos + 100 reactivos + catálogos pequeños suman unos pocos cientos de filas, muy por debajo de las **20 millones de celdas o 100 MB por spreadsheet** verificadas en [support.google.com/drive/answer/37603](https://support.google.com/drive/answer/37603) (consulta 6/11/2026). El límite relevante no es filas, es la ausencia de integridad referencial nativa (se resuelve con validación en script, `docs/22` §7).
5. **La salida es barata:** si Sheets deja de servir, el contenido ya vive como JSON en Git y el sitio sigue publicando; el editor se migra a Baserow u otro sin tocar URLs ni IDs (`docs/21` §7.3).

### 2.3 Qué incluye la decisión

- Sheet privada como fuente de verdad de **contenido** (17 componentes de `docs/22`).
- Scripts Python de validación/export por área, ejecutados por GitHub Actions (mismo patrón que `sync-museums.yml` y `sync-config.yml`).
- JSON versionado + GitHub Pages para lectura pública.
- Apps Script read-only para el canal institucional (se mantiene la decisión del 5/11).
- **Credenciales en el MVP:** emisión y registro **local en IndexedDB**, sin hoja ni endpoint de escritura. Son avance/prueba, no certificación.
- **Etapa futura (no adoptada):** hoja `Credenciales_Emitidas` append-only **solo** con emisor que firme y/o identidad; requiere autorización explícita y contrato nuevo (§3.4, §9 U3).
- IndexedDB como caché de trabajo y fallback sin conexión.

### 2.4 Qué NO incluye

- No implementa hojas, scripts, endpoints, workflows ni JSON nuevos.
- No cambia el gate de evaluación cliente actual.
- No define firma de credenciales ni servicio emisor Open Badges 3.0 (sigue pendiente, `docs/14` §4).
- No habilita métricas institucionales ni propuestas (futuras, `docs/22` §5.16–5.17).
- No define autenticación de usuarios ni cuentas individuales.
- No decide el destino de los fixtures de la Home; solo planifica su unificación (§6, fase 8).
- No ejecuta ningún sync, commit ni despliegue.

---

## 3. Arquitectura objetivo

### 3.1 Diagrama general

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ EDICIÓN (privado, 1–3 personas)                                               │
│                                                                              │
│  Google Sheet privada                                                        │
│   ├─ Config            ├─ Compartimentos      ├─ Insignias                   │
│   ├─ Instituciones     ├─ Sistemas            ├─ Roles                       │
│   ├─ Claves (hash)     ├─ Temporadas          ├─ Disciplinas                 │
│   ├─ Museos            ├─ Episodios           ├─ Grilla_5x5                  │
│   └─ Reactivos         ├─ Misiones            ├─ Propuestas (futuro)         │
│                        └─ Contenidos          └─ Metricas (futuro, calculada)│
│  Hojas nunca publicadas: Claves, Logs, Metricas, Instituciones,              │
│  Propiedad_Intelectual, Credenciales_Emitidas                                │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │  scripts/sync_*.py  (validan fila, enums, FK,
                                │  bilingüe, IDs inmutables, hash de contenido)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ PUBLICACIÓN (artefacto reproducible, versionado)                              │
│                                                                              │
│  lib/data/datasets/museums-snk-2025.json   (existe)                          │
│  lib/data/datasets/isa-config.json         (existe, vacío)                   │
│  lib/data/datasets/content-*.json          (propuesto, a crear)              │
│  lib/data/datasets/grilla-5x5.json         (propuesto, a crear)              │
│  lib/data/datasets/manifest.json           (propuesto: version + hash)       │
│  docs/CONTENT_CHANGELOG.md                 (propuesto, no existe)            │
│                            │                                                 │
│                            │ commit automático si cambia el hash              │
│                            ▼                                                 │
│  GitHub Actions (.github/workflows/sync-*.yml) → commit → next-pages.yml     │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ build estático (output: 'export')
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ LECTURA PÚBLICA (GitHub Pages, sin secretos)                                  │
│                                                                              │
│  Usuario/learner ── fetch JSON ──▶ IndexedDB (caché local)                   │
│                    (sin token, sin cuota de API, sin escribir)                │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ (solo si hay clave institucional)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CANAL INSTITUCIONAL (Apps Script Web App, read-only)                          │
│                                                                              │
│  POST validate(key) ──▶ hash SHA-256 contra hoja Claves ──▶ token HMAC       │
│  GET  data(token)  ──▶ hojas autorizadas (nunca las privadas)                │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
                                │ (sin escritura en el MVP)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ CREDENCIALES                                                                  │
│                                                                              │
│  MVP:  mission-view.tsx ──▶ evaluateAwards ──▶ IndexedDB local                │
│        documento Open Badges 3.0 SIN firmar; registry_no local;              │
│        prueba de avance, NO certificación ni registro central                │
│                                                                              │
│  FUTURO (no adoptado): registro central append-only SOLO si existe           │
│        emisor que firme (Worker/Node) y/o identidad del destinatario;        │
│        el append a una hoja de Apps Script no es confiable (ver §3.4)        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Flujo de edición → publicación

1. Un editor modifica una fila en la Sheet privada (o en un formulario simple sobre la misma hoja).
2. GitHub Actions (cron semanal o `workflow_dispatch`) ejecuta el script de sync del área.
3. El script lee la hoja, **valida por fila** (enums, FK, bilingüe, IDs, unicidad, reglas de `docs/22` §7) y **rechaza el commit** si hay errores, reportando la línea.
4. Si todo es válido, regenera el JSON canónico y calcula su hash.
5. Si el hash cambió, el workflow commitea `chore: sync ISA content from private Sheet` (mensaje propuesto) y hace push.
6. El push dispara `.github/workflows/next-pages.yml`, que construye la exportación estática y despliega en GitHub Pages.
7. El navegador del visitante hace `fetch` del JSON publicado y lo escribe en IndexedDB; desde ese momento la app funciona con la caché local.

**Regla de oro:** el navegador público **nunca** consulta la Sheet ni usa credenciales de Google. El sync es el único puente.

### 3.3 Flujo de lectura institucional

1. La institución recibe su clave por un canal externo (no en la Sheet, no en el repo, no en el frontend).
2. El navegador hace `POST` a la URL `/exec` del Web App con `{ action: 'validate', key }` en `text/plain` (evita preflight CORS, `docs/07` §4.2).
3. Apps Script calcula SHA-256, compara contra `Claves.clave_hash`, verifica estado y vigencia, y responde un token HMAC de corta duración.
4. El navegador pide `GET ?action=data&token=...` (o `&sheet=Museos`) y el endpoint devuelve **solo** las hojas autorizadas.
5. Las hojas `Claves`, `Instituciones`, `Logs`, `Metricas`, `Propiedad_Intelectual` y `Credenciales_Emitidas` **nunca** se devuelven.

**Límite conocido:** el endpoint es read-only, público en su URL y sin rate limiting propio; su seguridad depende de la entropía de las claves, del hash, del token y de la cuota de Apps Script (`docs/07` §5).

### 3.4 Credenciales: dos etapas y por qué el append a la Sheet no es confiable

**Etapa (a) — MVP: registro local, sin escritura.**

1. El aprendiz completa una misión con respuesta correcta (`components/learn/mission-view.tsx`).
2. `lib/badges/rules.ts` evalúa insignias y `lib/badges/registry.ts` emite un `CredentialRecord` en la **IndexedDB del navegador**, con `subject: 'anonymous'`, documento OB 3.0 **sin firmar** y `registryNo` local (`ISA-<año>-<secuencia>`, calculado con `count + 1`).
3. El documento se puede exportar (`<badge-id>.openbadge.json`), pero **no es verificable** (sin `proof`) y **no se registra en ningún lado**. Es una prueba de avance de la experiencia, no una certificación (`docs/14` §3 y §6).
4. Limitaciones aceptadas del MVP: el registro se pierde al limpiar el navegador o cambiar de dispositivo; el `registryNo` puede colisionar entre navegadores; no hay consulta central ni revocación global.

**Etapa (b) — Futuro: registro central solo con emisor firmante y/o identidad. No adoptado.**

Un endpoint `appendCredential` en el Web App de Apps Script **no es confiable** como registro central porque:

1. **El endpoint es público en su URL** y no puede distinguir un cliente legítimo de cualquiera que lo llame (`docs/07` §5). No hay identidad del aprendiz: `subject` es `'anonymous'`.
2. **Cualquiera puede inflar el registro**: un bucle de llamadas agrega miles de filas sin que correspondan a una misión real. No hay rate limiting propio; la única barrera sería el token de una institución y la cuota de Apps Script.
3. **Un registro sin firma no es verificable**: aunque la fila exista, el documento OB 3.0 sigue sin `proof`; la hoja no convierte la credencial en verificable (`docs/14` §2 y §4).
4. **La atribución es débil**: sin identidad ni firma, el registro no prueba quién obtuvo qué, solo que "alguien" llamó al endpoint.
5. **La hoja es editable por humanos** con permiso: la inmutabilidad sería por convención y protección de rangos, no por constraint de base (`docs/21` §3.1).

**Qué se ganaría** con un append central: un contador/auditoría de emisiones y una numeración global (`registry_no`) bajo `LockService`. **Qué no se ganaría:** verificabilidad, identidad del destinatario, revocación confiable, ni valor de certificación. Por eso el ADR **no** lo adopta en el MVP.

**Condición para la etapa (b):** que exista (i) un **servicio emisor que firme** (Worker/Node, VC-JWT o Data Integrity, `docs/14` §4), (ii) una decisión de **identidad o pseudonimato** del destinatario, (iii) autenticación del canal de emisión, y (iv) autorización explícita del usuario para una superficie de escritura. Si esas condiciones no se cumplen, el registro sigue local.

**Qué decisión pide este ADR:** aprobar la etapa (a) como estado del MVP y **no** comprometerse con la etapa (b) hasta cumplir las condiciones. La hoja `Credenciales_Emitidas` del esquema `docs/22` §5.15 queda documentada como **destino futuro**, no como parte del MVP.

### 3.5 Piezas del repositorio y su rol

| Archivo actual | Rol hoy | Rol en el objetivo |
|---|---|---|
| `apps-script/Code.gs` | Endpoint read-only de referencia | Endpoint read-only, sin cambios en el MVP; eventual acción de append solo en la etapa futura con emisor firmante |
| `docs/07_ENDPOINT_APPS_SCRIPT.md` | Contrato read-only | Se mantiene read-only en el MVP; cualquier cambio de contrato es parte de la etapa futura |
| `scripts/sync_museums.py` | Sync de museos desde Sheet pública | Sync de museos desde la fuente que se decida (§9) |
| `scripts/sync_config.py` | Sync de configuración (secciones vacías) | Sync de Config + Temporadas/Episodios/Misiones/Reactivos/Insignias |
| `lib/data/datasets/museums-snk-2025.json` | Dataset de 160 museos | Igual, con envoltorio `version` (fase 10) |
| `lib/data/datasets/isa-config.json` | Configuración vacía | Configuración real o reemplazada por `content-*.json` |
| `lib/data/seed.ts` | Seed local | Seed alimentado por los JSON publicados |
| `lib/data/bootstrap.ts` | Primera carga | Primera carga + invalidación por versión (a definir) |
| `lib/data/config.ts` | Aplica secciones | Adaptador de las secciones nuevas |
| `lib/data/repository.ts` | Contrato local | Igual; el panel admin sigue leyendo/escribiendo la caché |
| `lib/data/sheets-repository.ts` | Contratos remotos sin implementar | Adaptador del endpoint institucional (fase posterior) |
| `lib/badges/registry.ts` | Registro local de credenciales | **Sin cambios en el MVP** (emisión local); el registro central es etapa futura |
| `.github/workflows/sync-museums.yml` | Sync semanal | Se mantiene |
| `.github/workflows/sync-config.yml` | Sync semanal | Se generaliza a `sync-content.yml` (propuesto) |
| `.github/workflows/next-pages.yml` | Despliegue | Se mantiene, sin cambios |

---

## 4. Alternativas descartadas

Todas las cifras provienen de `docs/21` (consulta 6/11/2026). Las que allí están **(a verificar)** se marcan igual aquí y **no** se usan para descartar una opción por sí solas.

| Alternativa | Motivo del descarte | Cifra/límite clave con fuente |
|---|---|---|
| **Airtable Free** | Buen ABM, pero **1.000 registros por base** se satura con 160 museos + 100 reactivos + catálogos, y la cuota de **1.000 llamadas API/mes** impide lectura directa; historial de 2 semanas, insuficiente para auditoría. | 1.000 registros/base, 5 editores, 1.000 API/mes, historial 2 semanas: [airtable.com/pricing](https://airtable.com/pricing) |
| **Supabase Free** | Excelente motor SQL y el mejor append-only (RLS), pero **no ofrece ABM sin código** para 1–3 editores no técnicos; habría que construir una UI propia, lo que anula su ventaja. Además el proyecto **se pausa tras 1 semana de inactividad**. | 500 MB, 2 proyectos, pausa tras 1 semana, Pro USD 25/mes: [supabase.com/pricing](https://supabase.com/pricing) |
| **Cloudflare D1 + Workers Free** | Excelente para servir JSON barato, pero **no tiene capa de edición**; exigiría construir una UI de administración propia y operar Workers/migraciones. | 5 M filas leídas/día, 100 k escritas/día, 500 MB/base, Workers Paid USD 5/mes: [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) |
| **Google Sheets + AppSheet free** | La experiencia de formulario es la mejor, pero el plan free es de **prototipo personal**: el creador es el único usuario real, ≤10 usuarios de prueba y uso no comercial; para uso institucional real cuesta **USD 5/usuario/mes**. Deja de ser gratis. | Free: [support.google.com/appsheet/answer/10104499](https://support.google.com/appsheet/answer/10104499); precios y 2.500 filas/base: [about.appsheet.com/pricing](https://about.appsheet.com/pricing/) |
| **NocoDB Cloud Free** | El cloud free se descarta por **1.000 registros** y **1.000 llamadas API/mes**: no cubre 160 museos + 100 reactivos + catálogos con holgura ni sirve para lectura pública directa. | 1.000 registros, 3 editores, 1 GB, 1.000 API/mes: [nocodb.com/pricing](https://nocodb.com/pricing) |
| **NocoDB self-hosted** | Software gratuito y modelo relacional bueno, pero **requiere servidor propio** (contenedor, base, backups, actualizaciones), operación que el equipo de 1–3 personas no tiene hoy. | Self-hosted gratuito (límites del servidor): [nocodb.com/pricing](https://nocodb.com/pricing); costo de hosting **(a verificar)** |
| **PocketBase self-hosted** | Elegante y sin cuotas de plan, pero **requiere servidor propio** y está **pre-1.0** (v0.41.1): la documentación oficial advierte no usarlo en producción crítica antes de v1.0.0 y no garantiza compatibilidad hacia atrás. Su panel es técnico, no de formulario para editores no técnicos. | Sin cuotas de plan; pre-1.0 no recomendado para producción crítica: [pocketbase.io/docs](https://pocketbase.io/docs/) |
| **Baserow self-hosted** | Igual que NocoDB: el software es gratis y el ABM es el mejor del lote, pero **requiere servidor propio** y operación. Se prefiere el cloud free solo como plan de contingencia si la grilla de Sheets no alcanza. | Cloud free 3.000 filas/workspace, 2 GB, 14 días de historial: [baserow.io/pricing](https://baserow.io/pricing); hosting **(a verificar)** |
| **Grist Free** | Muy buen modelo relacional e historial de **30 días**, pero la **API de 3.000 llamadas/mes/equipo** obliga a export programado (igual que Sheets) y su lectura pública no es una API para el sitio; no supera a Sheets en integración con el repo. | 5.000 registros/documento, snapshots 30 días, 3.000 API/mes/equipo: [getgrist.com/pricing](https://www.getgrist.com/pricing/) |
| **SeaTable Free** | Buen free (10.000 filas, 25 usuarios, snapshots 1 mes), pero **3.000 llamadas API/mes/usuario**, formato DTABLE propietario en el export completo y una plataforma externa más para el mismo resultado (export a JSON). | 10.000 filas, 25 usuarios, 3.000 API/mes, snapshots 1 mes: [seatable.com/prices](https://seatable.com/prices/) |
| **"Solo repo" (sin Actions/Pages)** | Es el **baseline de contingencia**, no una opción de edición: publicar manualmente elimina automatización y aumenta el error humano; sin ABM no-code, los editores no técnicos no pueden cargar contenido. Se conserva como plan de salida si GitHub cambiara condiciones. | Sin cuota de plataforma; publicación manual: `docs/21` §3.12 |
| **Baserow Cloud Free como capa de edición (Finalista B)** | **No se descarta del todo:** es el plan B si los editores rechazan la grilla de Sheets o si se necesita formulario real con permisos. Hoy no se elige porque agrega una plataforma externa, su lectura pública sigue siendo por export y su historial es de 14 días. | 3.000 filas/workspace, 2 GB, 14 días: [baserow.io/pricing](https://baserow.io/pricing) |
| **Drive/Sheets con API key pública** | Solo sirve para datos públicos y expone la hoja completa; la API key en el bundle no es un secreto. No sirve para `Claves`, credenciales ni métricas. El export CSV publicado ya se usa para museos y config, pero no reemplaza el patrón JSON+Git. | Guía de autorización deriva a OAuth 2.0: [developers.google.com/sheets/api/guides/authorizing](https://developers.google.com/sheets/api/guides/authorizing); API key para hoja privada **(a verificar)** |
| **GitHub como ABM (Finalista C solo)** | Es la mejor capa de publicación, pero **no es una capa de edición**: editar JSON a mano es técnico y propenso a errores. Se adopta como capa de publicación, no como ABM. | Pages 1 GB, 100 GB/mes (soft), 10 builds/hora, 10 min: [docs.github.com · Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |

### 4.1 Por qué no Baserow Cloud ahora

Baserow Cloud Free es el ABM no-code con mejor puntaje de `docs/21` (80/105) y no se descarta como plan de contingencia. No se elige hoy porque:

1. Duplica la capa de edición sin eliminar el export a JSON (la publicación seguiría siendo GitHub).
2. Su límite de **3.000 filas por workspace** es suficiente hoy pero más ajustado que las **20 M celdas por spreadsheet** de Sheets.
3. Agrega una cuenta, permisos y una dependencia externa más para 1–3 editores.
4. El historial de **14 días** es menor que la reversión por Git (que es total para el contenido publicado).

Si en la fase 0 los editores expresan que la grilla de Sheets no les sirve, este ADR debe **reabrirse** y elegir Baserow Cloud + export (Finalista B). Queda registrado como plan B, no como decisión.

---

## 5. Riesgos y mitigaciones

### 5.1 Cuota y límites

| Riesgo | Cifra y fuente | Impacto | Mitigación |
|---|---|---|---|
| Tamaño de la Sheet | **20 M celdas / 100 MB por spreadsheet**; **15 GB por cuenta Google** ([Drive Help](https://support.google.com/drive/answer/37603), [almacenamiento](https://support.google.com/drive/answer/9312312), 6/11/2026) | Muy bajo para el volumen actual (cientos de filas) | Sin acción; monitorear si el volumen crece a decenas de miles de filas |
| Cuota de Apps Script | 90 min/día de ejecución (consumer), 6 min por ejecución, 30 ejecuciones simultáneas, 20.000 UrlFetch/día, 20 triggers: valores de la **copia archivada 2019**; la página vigente no se pudo extraer completa → **(a verificar)** ([quotas](https://developers.google.com/apps-script/guides/services/quotas), [archivo 20/12/2019](https://web.archive.org/web/20191220235549/https://developers.google.com/apps-script/guides/services/quotas)) | Si el endpoint se usara por visita, agotaría la cuota y afectaría también los sync | **Publicar por JSON estático**: las visitas públicas no consumen Apps Script. El endpoint queda para validación institucional de baja frecuencia; caché (`CacheService`) y `ISA_MAX_ROWS` ya previstos |
| Cuota de Web App | No hay una cuota propia de solicitudes/día documentada; consume tiempo de ejecución y simultaneidad → **(a verificar)** (`docs/21` G2) | Medio si el endpoint se vuelve popular | Token corto, claves largas, monitoreo; nunca usarlo como API de lectura del sitio público |
| Cuota de GitHub Pages/Actions | Pages **1 GB** publicado y **100 GB/mes** de banda (soft); Actions gratis en repo público; API 60 req/h sin token ([Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)) | Muy bajo: el JSON pesa decenas de KB | Ninguna; el repo es el backup |
| Límite al alcanzar el tope | En Sheets no se pierden datos al superar la cuota; se bloquea la edición/creación (`docs/21` §6) | Interrupción del ABM | Export JSON ya versionado permite seguir publicando; plan de salida a Baserow o al repo |

### 5.1.1 Límite free por finalista y plan de salida

| Finalista | Límite free relevante | Qué pasa al alcanzarlo | Plan de salida de ISA |
|---|---|---|---|
| **A · Sheets (edición)** | **20 M celdas / 100 MB por spreadsheet** y **15 GB por cuenta** (verificado, [Drive Help](https://support.google.com/drive/answer/37603), [almacenamiento](https://support.google.com/drive/answer/9312312)) | No se pierden datos; se bloquean altas/ediciones hasta liberar espacio | El JSON en Git sigue publicando; migrar la edición a Baserow o al repo; no cambia IDs ni URLs |
| **A · Apps Script (endpoint)** | Cuotas de ejecución **(a verificar)**: 90 min/día, 6 min por ejecución, 30 simultáneas, 20.000 UrlFetch/día, 20 triggers (valores de la copia 2019, [quotas](https://developers.google.com/apps-script/guides/services/quotas)); **sin cuota propia documentada de requests de Web App (a verificar)** | El endpoint falla con excepción y se corta la ejecución; la cuota es de la cuenta y puede afectar a otros scripts de esa cuenta (los sync de ISA corren en GitHub Actions y **no** consumen Apps Script) | Las visitas públicas **no** usan Apps Script (leen JSON de Pages); el endpoint queda para validación institucional de baja frecuencia; si se agota, se limita el uso o se migra la validación a un Worker |
| **C · GitHub Pages (publicación)** | **1 GB** de sitio, **100 GB/mes** de banda (soft), **10 builds/hora**, **timeout 10 min** ([Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) | GitHub avisa y puede pedir CDN u otro host; **no se borra el repo** | Clonar el repo y desplegar en cualquier host estático (Cloudflare Pages, Netlify, VPS); los datos no cambian |
| **C · JSON + Git (póliza)** | Prácticamente sin límite para el volumen actual (JSON de decenas de KB) | — | El repo **es** el backup y el punto de reversión; el sitio puede reconstruirse desde cualquier clon |
| **B · Baserow Cloud (si se eligiera)** | **3.000 filas/workspace**, 2 GB, 14 días de historial ([baserow.io/pricing](https://baserow.io/pricing)) | Se bloquean altas hasta subir de plan; los datos no se borran | El JSON en Git sigue publicando; exportar y migrar a otro editor; el historial largo vive en Git |

**Conclusión:** en todos los finalistas el dato **no se pierde**; lo que se pierde es la **capacidad de editar o publicar** (`docs/21` §6). Por eso el JSON+Git es la póliza de seguro, independientemente del editor.

**Disparadores de migración (criterio objetivo):**

1. La Sheet no permite cargar una hoja nueva o el sync deja de ser confiable.
2. El proveedor cambia las condiciones del free con aviso menor a 30 días.
3. El export deja de ser completo o aparece un costo obligatorio.
4. El volumen supera el 50 % del límite free del editor (hoy lejano: cientos de filas contra 20 M celdas).
5. La cuota de Apps Script afecta los sync de forma recurrente.

Si se dispara cualquiera, se migra **solo la capa de edición**; la publicación por JSON+Git no se toca.

### 5.2 Seguridad

| Riesgo | Detalle | Mitigación |
|---|---|---|
| Endpoint público sin rate limiting | Cualquiera puede llamar `ping` o intentar `validate` (`docs/07` §5) | Claves con alta entropía, comparación por hash, mensajes genéricos, rotación de `ISA_TOKEN_SECRET`, token corto |
| Token en la URL de `data` | Puede quedar en historial/logs intermedios (limitación conocida de `docs/07`) | Mantener token de vida corta; si se requiere más rigor, migrar `data` a `POST` (fase posterior) |
| Clave en texto plano | Nunca debe guardarse | La hoja solo contiene `clave_hash`; la clave se entrega fuera; `generarHashDeClave()` para generarla |
| Registro central de credenciales (etapa futura) | Superficie de escritura pública, sin identidad del aprendiz y sin firma; el registro sería inflable y no verificable | **No se adopta en el MVP.** Solo con emisor que firme y/o identidad, autenticación del canal y autorización explícita (§3.4) |
| Secretos en repo | `ISA_SHEET_ID` y `ISA_TOKEN_SECRET` no se versionan | Script Properties; documentar rotación; no imprimir valores en logs |
| Error de configuración | Una hoja mal protegida podría publicarse | Lista fija de hojas publicadas; validación del script; revisión en cada fase |

### 5.3 Privacidad

| Riesgo | Detalle | Mitigación |
|---|---|---|
| Datos personales en `Instituciones` | El tipo actual tiene `contactName`/`contactEmail`; el seed los deja vacíos | No usarlos hasta que exista requisito, base legal y retención; considerar quitarlos del modelo público; nunca exponerlos por el endpoint |
| Propuestas de terceros | Un formulario de propuestas implica contacto | No crear la hoja ni el formulario hasta decidir privacidad; el esquema de `docs/22` §5.16 no incluye campos de contacto |
| Métricas | Riesgo de trazar personas si se mide por individuo | Solo agregados por institución/período, con umbral de k-anonimato a definir; nunca exponer `Metricas` |
| Credenciales | En el MVP quedan locales; un registro central futuro podría convertirse en traza de aprendices | MVP: sin registro central, `subject = anonymous`, sin email/IP/dispositivo. Futuro: solo con decisión de identidad o seudonimato y retención |
| Progreso local | Se pierde al limpiar el navegador | Aceptado en el MVP (`docs/00` §11); no se envía a ningún lado hasta que exista decisión |

### 5.4 Operación con 1–3 editores

| Riesgo | Detalle | Mitigación |
|---|---|---|
| Curva de la Sheet | La grilla no es un formulario; errores de tipeo en IDs/enums | Validación de datos en la hoja + validación por fila en el script + reporte de errores con línea; plantillas de columnas |
| Dependencia de una persona | Si el dueño de la cuenta Google/script se va, se pierde el acceso | Documentar responsables, transferir propiedad de la Sheet y del script, guardar `Claves`/secretos en un gestor autorizado (no en el repo) |
| Rotación de claves | Sin procedimiento, las claves viejas quedan activas | Procedimiento de alta/rotación/suspensión; `valid_from`/`valid_until`; estado `suspended` |
| Cuenta única | Un solo dueño de Apps Script/Sheet es un punto único | Definir al menos dos administradores; transferencia documentada |

### 5.5 Vendor lock-in

| Componente | Lock-in | Salida |
|---|---|---|
| Google Sheets | Bajo-medio: datos exportables a CSV/XLSX/JSON | JSON versionado en Git; migrar la edición a Baserow/repo sin cambiar IDs |
| Apps Script | Medio: el Web App es específico | Es código JS versionado en el repo; el contrato es portable a otro servicio |
| GitHub Pages/Actions | Bajo: sitio estático y JSON | Clonar el repo y desplegar en cualquier host estático (`docs/21` §6) |
| IndexedDB | Bajo: formato local estándar | La caché se regenera desde el JSON |

### 5.6 Corrupción de datos

| Riesgo | Mitigación |
|---|---|
| Fila inválida editada a mano | Validación por fila; el sync **no commitea** si hay errores; reporte con línea y columna |
| Borrado accidental de una fila | Soft delete (`deleted_at`) + el export excluye; la fila queda en la Sheet y en el historial de versiones |
| IDs duplicados o renombrados | Chequeo contra el export anterior; IDs inmutables; el script rechaza el cambio |
| Edición concurrente de la misma celda | Última escritura gana en Sheets; mitigación en §5.7 |
| Pérdida de la Sheet | Backups: export CSV/JSON periódico + copia del repo + historial de versiones de Google |

### 5.7 Concurrencia de edición

- Sheets no ofrece locking transaccional: si dos personas editan la misma fila, gana la última escritura.
- Mitigaciones: **una hoja por área**, `updated_at`/`updated_by` mantenidos por script, validación por hash al exportar, y una ventana de edición acordada para cambios masivos.
- El panel admin no escribe la Sheet: sus cambios quedan en IndexedDB local y **no** compiten con la edición compartida. Eso evita el conflicto pero crea el riesgo de "cambios locales que no se publican" (§9, decisión del rol del panel).
- Un futuro registro central de credenciales requeriría `LockService` para serializar `registry_no`; hoy no aplica porque el registro es local.

### 5.8 Riesgos específicos de esta decisión

| Riesgo | Mitigación |
|---|---|
| La separación Sheet → JSON → IndexedDB puede mostrar contenido viejo en navegadores ya sembrados | `ensureSeed` solo siembra si la base está vacía (`lib/data/bootstrap.ts`); la migración debe agregar chequeo de `version` (fase 10). Mientras tanto, **Apply config** en `/admin/accreditation` re-aplica secciones. Mecanismo definitivo **a definir** |
| Dos fuentes de contenido (fixtures de Home + IndexedDB) | Fase 8: unificar con doble lectura temporal; no romper la Home |
| El registro central de credenciales contradice "read-only" de `docs/00` | **No se adopta en el MVP**: las credenciales siguen locales. La etapa futura (§3.4) exige emisor que firme y/o identidad, y autorización explícita |
| El endpoint institucional requiere despliegue manual | Fase 1 de despliegue con checklist (`docs/07` §6); responsables definidos |
| Migrar museos a la Sheet privada puede romper el sync actual | Fase 1 conserva el script y los IDs; el cambio de fuente se hace con `--check` y diff cero antes de commitear |

---

## 6. Plan de migración por fases (no ejecutado)

**Reglas del plan:**

- Ninguna fase se ejecuta sin autorización explícita.
- Ninguna fase renombra IDs (`docs/22` §10) ni rompe rutas (`/museums/[id]`, `/series`, `/episodes`).
- Cada fase tiene **criterio de aceptación** verificable y **rollback** (revertir el commit de la fase).
- Los datos de demo/fixtures no se presentan como contenido real (`AGENTS.md` regla 6).
- Los scripts nuevos se marcan como **propuestos**; no existen todavía.

### Fase 0 — Preparación y líneas base

| Elemento | Detalle |
|---|---|
| Script | Ninguno (tarea manual) |
| Entrada | Repositorio en `main`, decisión aprobada, responsables designados |
| Salida | Sheet privada creada; propietarios y administradores del Web App definidos; tag `pre-data-migration` (propuesto) |
| Código/adaptador afectado | Ninguno |
| Criterio de aceptación | Sheet privada (no publicada), Script Properties definidas, backups iniciales descargados, IDs/URLs de referencia inventariados (`docs/22` §10) |
| Rollback | Eliminar la Sheet de trabajo; no hay cambios de código |

### Fase 1 — Museos (el único sync que ya funciona)

| Elemento | Detalle |
|---|---|
| Script | `scripts/sync_museums.py` (existe) |
| Entrada | Sheet publicada de Submarinos Museos (hoy `POINTS_URL` está **hardcodeada** en el script); decisión §9 sobre si se migra a la Sheet privada |
| Salida | `lib/data/datasets/museums-snk-2025.json` (existe, 160 registros) |
| Código/adaptador afectado | `lib/data/seed.ts` (`SEED_MUSEUMS`), `lib/data/bootstrap.ts`, `.github/workflows/sync-museums.yml` |
| Criterio de aceptación | `python3 scripts/sync_museums.py --check` con "Nuevos: 0 · Faltantes: 0"; 160 registros, 160 IDs únicos, `MUS-U995` intacto, 8 validados; `pnpm exec tsc --noEmit` y `pnpm build` limpios; diff del JSON solo si cambió la fuente |
| Rollback | `git revert` del commit de sync; el dataset anterior sigue publicado |

### Fase 2 — Configuración (secciones hoy vacías)

| Elemento | Detalle |
|---|---|
| Script | `scripts/sync_config.py` (existe) |
| Entrada | Tablas CSV publicadas o rangos de la Sheet privada; variables `ISA_CONFIG_SETTINGS_URL`, `ISA_CONFIG_SEASONS_URL`, `ISA_CONFIG_EPISODES_URL`, `ISA_CONFIG_MISSIONS_URL`, `ISA_CONFIG_QUESTIONS_URL`, `ISA_CONFIG_AWARDS_URL` (hoy sin configurar) |
| Salida | `lib/data/datasets/isa-config.json` (hoy `version: 2`, secciones vacías) |
| Código/adaptador afectado | `lib/data/config.ts` (`SETTINGS_MAP`, `applySeasons`, `applyEpisodes`, `applyMissions`, `applyQuestions`, `applyAwards`; corregir `value_es`), `lib/data/bootstrap.ts`, `.github/workflows/sync-config.yml` |
| Criterio de aceptación | Al menos `settings` + `seasons` con filas reales; `applyConfig` idempotente (dos corridas no duplican); un valor de enum inválido se rechaza con línea; el sitio no cambia de IDs; `tsc`/build limpios |
| Rollback | Revertir el commit; `isa-config.json` anterior queda en Git; **Apply config** re-aplica la versión anterior a los navegadores |

### Fase 3 — Hojas de catálogo nuevas

| Elemento | Detalle |
|---|---|
| Script | `scripts/sync_content.py` (**propuesto, no existe**) o extensión de `sync_config.py` |
| Entrada | Hojas `Instituciones`, `Compartimentos`, `Sistemas`, `Roles`, `Disciplinas` (según `docs/22`) |
| Salida | `lib/data/datasets/content-catalog.json` (**propuesto**) o JSON por entidad; **`Claves` no se exporta** (solo vive en la Sheet y en el endpoint) |
| Código/adaptador afectado | `lib/domain/types.ts` (agregar `Museum.institutionId`), `lib/data/seed.ts`, `lib/data/bootstrap.ts`, `lib/admin/entities.ts` (si se agregan campos), `lib/import/schemas.ts` |
| Criterio de aceptación | FK existentes validadas; `INS-LABOE`, `CMP-U995-CONTROL`, `SYS-U995-PERISCOPE`, `ROL-*`, `DIS-*` conservados; ningún hash ni clave en el JSON; conteos del export coinciden con la Sheet |
| Rollback | Revertir commit; el seed anterior se mantiene; la Sheet no se toca |

### Fase 4 — Temporadas, episodios, misiones y reactivos

| Elemento | Detalle |
|---|---|
| Script | `scripts/sync_content.py` (**propuesto**) + importación del banco TIMSS (extensión de `lib/import/` o script nuevo `scripts/sync_questions.py`, **propuesto**) |
| Entrada | Hojas `Temporadas`, `Episodios`, `Misiones`, `Reactivos`; `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv` (100 filas) |
| Salida | `lib/data/datasets/content-episodes.json`, `content-missions.json`, `content-questions.json` (**propuestos**); o secciones equivalentes en `isa-config.json` si se mantiene compatibilidad |
| Código/adaptador afectado | `lib/data/config.ts`, `lib/data/seed.ts`, `lib/import/schemas.ts`, `lib/import/mapping.ts`, `lib/import/run.ts` |
| Criterio de aceptación | `SEA-STEEL`…`SEA-GOLD`, `EPI-STEEL-04`, `MIS-STEEL-04`, `MIS-COPPER-01`, `QST-STEEL-04-01`, `QST-COPPER-01-01` conservados; regla de consistencia misión↔episodio (temporada/museo) validada; 100 reactivos con `ISA-KNOW-001`…`ISA-KNOW-100` importables y en estado `review`/`proposal`, sin publicarlos automáticamente |
| Rollback | Revertir commit; los reactivos TIMSS quedan en CSV, como hoy |

**Decisión editorial pendiente (no técnica):** `MIS-COPPER-01` tiene `seasonId: 'SEA-COPPER'` pero cuelga de `EPI-STEEL-04`, cuyo `seasonId` es `SEA-STEEL` (`docs/20` §3.9). La regla de consistencia del script **detecta** la inconsistencia, pero **no la corrige**: resolverla implica decidir si se crea o reasigna un episodio de Cobre, o si la misión cambia de temporada. Es una decisión de contenido del usuario, no del script; hasta que se resuelva, la fila queda bloqueada para publicación (no se borra ni se renombra).

### Fase 5 — Insignias y reglas de otorgamiento

| Elemento | Detalle |
|---|---|
| Script | `scripts/sync_content.py` o extensión de `sync_config.py` (sección `awards`) |
| Entrada | Hoja `Insignias` con `rule_type`/`rule_count` (esquema de `docs/22` §5.11) |
| Salida | `lib/data/datasets/content-badges.json` (**propuesto**) o `awards` de `isa-config.json` |
| Código/adaptador afectado | `lib/data/config.ts` (`applyAwards`), `lib/badges/rules.ts`, `lib/admin/entities.ts` |
| Criterio de aceptación | `BDG-EXPEDITION-CREDENTIAL` y `BDG-COPPER-COIN` conservados; `rule_type=mission` exige `mission_id`; `season-count` exige `rule_count >= 1` y `mission_id` vacío; el motor no cuenta misiones en borrador (corregir `lib/badges/rules.ts`) |
| Rollback | Revertir commit; `applyAwards` no borra insignias, así que las locales sobreviven |

### Fase 6 — Credenciales: MVP local y etapa futura (no ejecutar el registro central)

**Fase 6a — MVP: consolidar el registro local (sí forma parte de la migración).**

| Elemento | Detalle |
|---|---|
| Script | Ninguno nuevo |
| Entrada | Emisión desde `components/learn/mission-view.tsx` → `lib/badges/rules.ts` → `lib/badges/registry.ts` |
| Salida | `CredentialRecord` en IndexedDB (como hoy), documento OB 3.0 sin firmar |
| Código/adaptador afectado | `lib/badges/registry.ts` (documentar límites; **no** centralizar), `lib/badges/rules.ts`, `components/learn/mission-view.tsx`, `components/admin/accreditation-panel.tsx` |
| Criterio de aceptación | La app declara explícitamente que la credencial es **prueba de avance, no certificación**; el documento exportado sigue marcado como sin firmar; no se agrega hoja ni endpoint de escritura; el flujo local funciona sin backend |
| Rollback | No aplica (no cambia el comportamiento) |

**Fase 6b — Futuro: registro central (explícitamente fuera de este plan).**

| Elemento | Detalle |
|---|---|
| Script/endpoint | Servicio emisor que firme (Worker/Node) y/o identidad; **no** `appendCredential` en Apps Script como registro confiable (§3.4) |
| Entrada | Emisión firmada desde el servicio |
| Salida | `Credenciales_Emitidas` append-only (esquema `docs/22` §5.15) |
| Código/adaptador afectado | `apps-script/Code.gs` o el servicio que se decida, `docs/07`, `lib/badges/registry.ts`, `lib/badges/rules.ts`, `components/learn/mission-view.tsx` |
| Criterio de aceptación | Emisor que firma operativo; identidad/pseudonimato decidido; autenticación del canal; autorización explícita; `registry_no` único; sin PII; hoja nunca expuesta |
| Rollback | No aplica hasta que se apruebe; el registro local sigue siendo el fallback |

**Condición:** la fase 6b **no se ejecuta** con este ADR. Requiere las condiciones de §3.4 y la decisión U3 de §9.

### Fase 7 — Grilla 5×5

| Elemento | Detalle |
|---|---|
| Script | `scripts/build_grid.py` (**propuesto**) o sección de `scripts/sync_content.py` |
| Entrada | Hoja `Grilla_5x5` (25 filas: 5 roles × 5 disciplinas) + `Misiones` publicadas |
| Salida | `lib/data/datasets/grilla-5x5.json` (**propuesto**) |
| Código/adaptador afectado | `components/insignias/badge-matrix.tsx`, `lib/missions.ts` (retirar las 25 misiones fixture), `app/insignias/page.tsx` |
| Criterio de aceptación | 25 celdas únicas; toda celda con `mission_id` referencia una misión existente y publicada; ninguna misión duplicada; `ROL-*` y `DIS-*` reales en la grilla; la página `/insignias` no cambia de URL |
| Rollback | Revertir commit; la grilla vuelve a los fixtures actuales |

### Fase 8 — Unificación de la Home (la más riesgosa; separada)

| Elemento | Detalle |
|---|---|
| Script | Los sync anteriores, más una capa de lectura de los JSON publicados |
| Entrada | JSON publicados (`content-*.json`, `museums-snk-2025.json`, `grilla-5x5.json`) |
| Salida | La Home (`/`) y `/insignias` dejan de leer fixtures y pasan a la fuente versionada; `/series`, `/episodes` y `/profile` siguen leyendo IndexedDB, pero poblada desde el export versionado y no desde el seed fijo |
| Código/adaptador afectado | `lib/missions.ts`, `lib/seasons.ts`, `lib/progress.ts`, `components/series/*`, `components/insignias/badge-matrix.tsx`, `app/page.tsx`, `app/insignias/page.tsx`, `lib/data/seed.ts`, `lib/data/bootstrap.ts` |
| Criterio de aceptación | Doble lectura temporal (fixture + JSON) sin diferencias visibles en `/`, `/insignias`, `/series` y `/episodes`; IDs y rutas intactos; progreso local compatible (`isa-progress-v1`); build y navegación verificados |
| Rollback | Revertir commit; la Home y `/insignias` vuelven a fixtures (convivencia temporal) |

**Nota:** hoy hay **31 misiones fixture** en `lib/missions.ts` (6 de Acero + 25 de Cobre) frente a **2** en la base local (`docs/20` §3.9). Unificar exige decisión editorial sobre esas 31, no solo técnica.

### Fase 9 — Propuestas y métricas (futuro, no ejecutar)

| Elemento | Detalle |
|---|---|
| Script | No aplica hasta que exista decisión de privacidad |
| Entrada | — |
| Salida | Hojas `Propuestas` y `Metricas` (esquema en `docs/22` §5.16–5.17) |
| Código/adaptador afectado | `lib/domain/types.ts`, `lib/admin/entities.ts`, `components/...`, endpoint |
| Criterio de aceptación | Requisitos de privacidad, base legal, retención y responsables aprobados; sin datos personales en hojas expuestas; métricas solo agregadas |
| Rollback | No aplica (no se ejecuta) |

### Fase 10 — Versionado, manifiesto e invalidación de caché

| Elemento | Detalle |
|---|---|
| Script | `scripts/content_manifest.py` (**propuesto**) + envoltorio `version` en todos los JSON |
| Entrada | JSON publicados |
| Salida | `lib/data/datasets/manifest.json` con `version`, `generated_at`, `content_hash`, `counts`; `docs/CONTENT_CHANGELOG.md` (**propuesto**) |
| Código/adaptador afectado | `lib/data/bootstrap.ts` (chequeo de versión), `lib/data/seed.ts`, workflows de sync, `next-pages.yml` (sin cambios de lógica) |
| Criterio de aceptación | Hash estable entre corridas sin cambios (el workflow no commitea); versión visible; un navegador con caché vieja detecta la versión nueva y refresca; `museums-snk-2025.json` pasa de array a objeto con `version` y el seed lo consume sin cambios de IDs |
| Rollback | Revertir commit; el manifiesto anterior sigue publicado |

### 6.1 Secuencia recomendada y dependencias

```text
Fase 0 ─▶ Fase 1 ─▶ Fase 2 ─▶ Fase 3 ─▶ Fase 4 ─▶ Fase 5
                                              │
                                              ├─▶ Fase 7 (grilla)
                                              ├─▶ Fase 6a (credenciales locales, sin backend)
                                              └─▶ Fase 8 (Home, cuando el contenido esté estable)
Fase 6b (registro central): fuera de este plan hasta que exista emisor que firme y/o identidad.
Fase 10 transversal: se puede adelantar el envoltorio `version` después de la Fase 1.
Fase 9: fuera de este plan hasta decisión de privacidad.
```

Cada fase termina con una verificación (`tsc --noEmit`, `pnpm build`, diff de JSON, revisión de IDs) y un tag de contenido propuesto (`content-YYYY-MM-DD`).

---

## 7. Compatibilidad de IDs y URLs

### 7.1 Invariantes

1. **Los IDs existentes no se renombran.** El diccionario completo está en `docs/22` §10 y se verificó contra `lib/data/seed.ts`.
2. **Los IDs no se reutilizan.** Un registro retirado se archiva con su ID intacto.
3. **Las rutas no cambian.** `/museums/[id]` consume el ID del museo; `/series`, `/episodes`, `/insignias` y `/profile` consumen IDs de temporada/episodio/insignia desde el código.
4. **En el MVP, las credenciales locales no se renumeran** (`registryNo` `ISA-<año>-<secuencia>` por navegador); si en el futuro existe registro central firmado, tampoco se renumerará.
5. **Los IDs se validan contra el export anterior** en cada sync; un cambio de ID bloquea el commit.

### 7.2 IDs críticos

| ID | Tipo | Dónde se consume | Riesgo si cambia |
|---|---|---|---|
| `MUS-U995` | museo | `/museums/MUS-U995`, seed, compartimento/episodio/misión | Rompe la ficha y las relaciones de la demo |
| `SEA-STEEL`…`SEA-GOLD` | temporada | Home (`lib/seasons.ts`), `/series`, episodios, misiones, insignias | Rompe la navegación de temporadas |
| `EPI-STEEL-04` | episodio | Home, `/episodes`, misiones, reactivos | Rompe el recorrido |
| `MIS-STEEL-04`, `MIS-COPPER-01` | misión | Home, `/insignias`, reactivos, insignias, credenciales | Rompe misiones y otorgamiento |
| `QST-STEEL-04-01`, `QST-COPPER-01-01` | reactivo | misión, demo | Rompe la evaluación |
| `BDG-EXPEDITION-CREDENTIAL`, `BDG-COPPER-COIN` | insignia | perfil, credenciales, Open Badges | Rompe la credencial |
| `INS-LABOE` | institución | claves, credenciales, métricas futuras | Rompe el vínculo institucional |
| `CMP-U995-CONTROL`, `SYS-U995-PERISCOPE` | compartimento/equipo | episodio, misión, reactivo | Rompe la relación de contenido |
| `ROL-*`, `DIS-*` | rol/disciplina | grilla 5×5 | Rompe la matriz |

### 7.3 URLs que no se tocan

| URL | Fuente de IDs | Verificación propuesta |
|---|---|---|
| `/museums/[id]` | `Museos.id` | Los 160 IDs del export deben coincidir con los del dataset anterior |
| `/series` | temporadas/episodios de fixtures o datos | Diff de IDs y build |
| `/episodes` | episodios | Diff de IDs y build |
| `/insignias` | grilla/insignias | 25 celdas y `BDG-*` estables |
| `/profile` | credenciales locales | `registry_no` del navegador se conserva |
| `/admin/*` | colecciones locales | Sin cambio de esquema destructivo |

**Mecanismo de verificación:** antes de publicar una fase, comparar el JSON nuevo contra el anterior por ID (conteo, altas, bajas, cambios de campo) y ejecutar `pnpm exec tsc --noEmit` y `pnpm build`. Una baja de ID sin `archived` es un error de la fase.

---

## 8. Versionado y reversión del contenido publicado

### 8.1 Esquema de versionado

| Elemento | Regla |
|---|---|
| `version` | Entero por dataset, incrementado por el script cuando cambia el contenido (`isa-config.json` ya usa `version: 2`; `museums-snk-2025.json` hoy es un array sin envoltorio → se migra en fase 10) |
| `generated_at` | Timestamp ISO UTC del export |
| `content_hash` | SHA-256 del JSON canónico (claves ordenadas), guardado en `manifest.json` |
| `manifest.json` | `version`, `generated_at`, `content_hash`, `counts` por dataset (propuesto) |
| Changelog | `docs/CONTENT_CHANGELOG.md` (propuesto): fecha, versión, hojas cambiadas, autor, motivo |
| Commit | `chore: sync ISA content from private Sheet` (propuesto), solo si el hash cambió |
| Tag | `content-YYYY-MM-DD` (propuesto) sobre el commit de publicación |
| Fuente | Nombre del dataset; el ID de la spreadsheet **no** se versiona (a decidir, §9) |

### 8.2 Procedimiento de reversión

1. **Identificar** el último tag/commit de contenido válido (`git log -- lib/data/datasets/`).
2. **Revertir** con `git revert <commit>` (no reescribir historia) o hacer checkout del tag y desplegar.
3. **Publicar** con `workflow_dispatch` de `.github/workflows/next-pages.yml` sobre el commit revertido.
4. **Verificar** que los IDs y rutas críticos (`MUS-U995`, `SEA-STEEL`, `/museums/MUS-U995`) responden y que el manifiesto coincide.
5. **Registrar** el motivo en el changelog y en el PR/commit de reversión.
6. **Invalidar la caché** del navegador si cambió la versión (mecanismo de fase 10).

**Ventana de reversión:** el contenido publicado se revierte en minutos (un commit + un deploy). El límite es el build de Pages (**timeout de despliegue de 10 minutos**, [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)).

### 8.3 Criterios de reversión (disparadores)

Se revierte el contenido publicado si:

1. El sync produce errores de validación que no se corrigen en la misma ventana.
2. Aparece un **dato personal** o un **secreto** en un artefacto publicado.
3. Se rompe un **ID o una URL** crítica (§7).
4. El **build** de GitHub Pages falla por el contenido.
5. El **hash** del manifiesto no coincide con el contenido publicado.
6. Se publica contenido no aprobado (estado editorial distinto de `published`/`active`).
7. Se detecta una regresión visible en la Home, `/series`, `/episodes` o `/museums/[id]`.

**Lo que no se revierte:** en el MVP las credenciales locales no forman parte del contenido publicado, así que la reversión de contenido no las toca (viven en el IndexedDB de cada navegador). Si en el futuro existe registro central firmado, será append-only: una emisión no se borra; si corresponde, se revoca (transición de estado) y se registra el motivo. La Sheet conservaría las filas.

**Límite de la reversión:** el historial de versiones de Sheets es una red de seguridad, **no** un mecanismo de publicación; su retención exacta **(a verificar)**. La reversión del contenido se hace siempre por Git, no editando la Sheet hacia atrás.

---

## 9. Qué se necesita decidir

### 9.1 Decisiones del usuario (accionables, cortas)

| # | Decisión | Opciones | Recomendación | Bloquea |
|---|---|---|---|---|
| U1 | **Fuente de museos** | (a) mantener la Sheet pública externa de Submarinos Museos; (b) migrar a la Sheet privada ISA | (b) a mediano plazo, con `--check` y diff cero; (a) mientras tanto | Fase 1 |
| U2 | **Cabeceras de las hojas** | (a) `snake_case` inglés con alias de transición para `docs/07`; (b) conservar encabezados españoles de `docs/07` | (a), actualizando `docs/07` y `Code.gs` en la misma fase | Fases 2–5 |
| U3 | **Endpoint de escritura** (solo etapa futura) | (a) no habilitarlo ahora (credenciales locales); (b) habilitarlo más adelante con emisor que firme y/o identidad | (a) para el MVP; reabrir (b) solo con las condiciones de §3.4 | Fase 6b |
| U4 | **Rol del panel admin** | (a) visor/editor de la caché local; (b) editor de la Sheet vía API (requiere OAuth); (c) retirarlo | (a) en el corto plazo; la fuente es la Sheet | Fase 3+ |
| U5 | **Datos personales** (`contactName`/`contactEmail`) | (a) eliminarlos del modelo hasta tener política; (b) mantenerlos fuera del endpoint y con retención definida | (a) | Fases 3 y 9 |
| U6 | **Hojas vacías `Propuestas`/`Metricas`** | (a) crearlas ahora vacías; (b) esperar flujo y decisión de privacidad | (b) | Fase 9 |
| U7 | **Prefijos nuevos** (`PROP`, `MET`, `CNT`, `PI`, `LOG`, `GRD`) | (a) autorizarlos cuando se implementen; (b) definir otro esquema | (a) | Fases 3, 7, 9 |

### 9.2 Decisiones operativas del equipo (no bloquean el MVP)

| # | Decisión | Opciones | Recomendación | Bloquea |
|---|---|---|---|---|
| D1 | **Responsables** de Sheet, Apps Script, secreto y claves | Nombres y procedimiento de rotación | Definir dos administradores | Fases 0–1 |
| D2 | **ID de la spreadsheet en el repo** | (a) no versionarlo; (b) versionarlo | (a) | Fase 10 |
| D3 | **Versionado uniforme** | (a) envolver todos los JSON con `version`/`generated_at`/`items`; (b) mantener formatos actuales | (a) en fase 10 | Fase 10 |
| D4 | **Plan B de edición** si la grilla no sirve | (a) Baserow Cloud Free + export JSON; (b) repo con formulario mínimo | (a), reabriendo este ADR | Fase 0 |
| D5 | **Unificación de la Home** | (a) fase 8 con doble lectura; (b) posponer | (a) cuando el contenido esté estable; (b) mientras tanto | Fase 8 |
| D6 | **Corrección de `MIS-COPPER-01`** | (a) crear/reasignar episodio de Cobre; (b) mover la misión a Acero; (c) dejarla bloqueada | Decisión editorial del usuario; el script solo detecta | Fase 4 |
| D7 | **Umbral de k-anonimato** para métricas | Valor mínimo de agregación | A definir con privacidad | Fase 9 |
| D8 | **Retiro del gate de evaluación** | Cuándo se reemplaza por el endpoint | Solo cuando el endpoint esté desplegado y probado | Posterior |

---

## 10. Verificación realizada y límites

### 10.1 Qué se comprobó

| Comprobación | Cómo | Resultado |
|---|---|---|
| Coherencia con la decisión del 5/11 | Lectura de `docs/00` §10, §12 y `docs/07` | Confirmada sin extensión: endpoint read-only y credenciales locales en el MVP |
| Estado real del repo | Lectura de `lib/domain/types.ts`, `lib/data/*`, `lib/badges/*`, `apps-script/Code.gs`, `scripts/*.py`, workflows, datasets y `docs/20` | Resumido en §1.1 |
| Volúmenes | Conteo de `museums-snk-2025.json` (160 / 8 validados) y del CSV curado (100 filas) | Confirmado |
| Cifras de cuota | Tomadas de `docs/21` con URL y fecha; las no verificadas se marcan **(a verificar)** | Sin cifras inventadas |
| IDs y rutas | Lectura de `lib/data/seed.ts`, `app/**/page.tsx`, `components/series/*` | Diccionario §7.2 y rutas §7.3 |
| Alternativas | `docs/21` §3 y §4 (14 opciones comparadas) | Descartadas con motivo y fuente |
| Plan de migración | Nombres reales de archivos y scripts del repo; los nuevos se marcan como propuestos | §6 |
| Implementación | No se ejecutó ningún sync, script, endpoint, commit ni despliegue | Ningún archivo de código modificado |

### 10.2 Qué no se verificó

- El despliegue real del Web App, CORS desde producción y las cuotas efectivas de Apps Script **(a verificar; `docs/21` G1–G2)**.
- El comportamiento de Sheets con el volumen futuro y la retención del historial de versiones **(a verificar; `docs/21` G3, G4)**.
- La viabilidad de un **futuro** registro central de credenciales con emisor firmante y/o identidad (no forma parte del MVP) **(a verificar)**.
- El estado real de la Sheet pública de museos (no se ejecutó `sync_museums.py --check` por red; `docs/20` §8.3).
- IndexedDB en navegadores reales y el mecanismo de invalidación de caché (fase 10).
- Volumen futuro de credenciales, instituciones y claves **(a verificar; `docs/21` G19)**.
- Los requisitos formales de privacidad/auditoría (`docs/21` G20; `docs/00` §17).

### 10.3 Limitaciones

Este ADR **no implementa** nada y **no autoriza** por sí solo: la creación de la Sheet, el despliegue del Web App, la migración de datos ni los commits requieren decisión explícita del usuario. Las cifras marcadas **(a verificar)** no deben usarse como compromiso de cuota. Los scripts nuevos (`sync_content.py`, `build_grid.py`, `content_manifest.py`, `sync_questions.py`) son nombres propuestos, no archivos existentes. El registro central de credenciales **no forma parte del MVP** y no se autoriza por este documento.

---

## 11. Referencias

**Documentos internos**

- `docs/00_DOCUMENTO_BASE.md` — decisión Sheets privada + Apps Script (5/11/2026), privacidad, hojas base.
- `docs/07_ENDPOINT_APPS_SCRIPT.md` — contrato del endpoint, seguridad, despliegue.
- `docs/08_DATA_LAYER.md` — repositorios, auditoría, soft delete.
- `docs/13_SHEET_SYNC.md` — sync de museos, IDs, límites.
- `docs/14_OPEN_BADGES.md` — registro de credenciales y fase 2.
- `docs/15_CONFIG_SHEET.md` — tablas de configuración actuales.
- `docs/19_DATA_INFRA_SESSION.md` — pedido de la sesión y preguntas a responder.
- `docs/20_INVENTARIO_COMPONENTES.md` — inventario verificado.
- `docs/21_OPCIONES_PLATAFORMA.md` — comparación con fuentes.
- `docs/22_MODELO_DATOS_SHEET.md` — esquema físico.

**Fuentes externas citadas (consulta 6/11/2026, según `docs/21` §10)**

1. [Google Drive Help — Files you can store](https://support.google.com/drive/answer/37603) — 20 M celdas / 100 MB por spreadsheet.
2. [Google Drive Help — How your Google storage works](https://support.google.com/drive/answer/9312312) — 15 GB por cuenta.
3. [Apps Script — Quotas](https://developers.google.com/apps-script/guides/services/quotas) — página oficial; tabla vigente no extraída completa.
4. [Copia archivada de cuotas de Apps Script (20/12/2019)](https://web.archive.org/web/20191220235549/https://developers.google.com/apps-script/guides/services/quotas) — valores **a verificar**.
5. [AppSheet — Pricing](https://about.appsheet.com/pricing/) — 2.500 filas/base, Starter USD 5/usuario/mes.
6. [AppSheet Help — Use AppSheet for free](https://support.google.com/appsheet/answer/10104499) — condiciones del free.
7. [Airtable — Pricing](https://airtable.com/pricing) — 1.000 registros/base, 1.000 API/mes, 2 semanas de historial.
8. [Airtable — Rate limits](https://airtable.com/developers/web/api/rate-limits) — 5 req/s por base.
9. [NocoDB — Pricing](https://nocodb.com/pricing) — cloud free 1.000 registros; self-hosted gratuito.
10. [Baserow — Pricing](https://baserow.io/pricing) — 3.000 filas/workspace, 2 GB, 14 días de historial.
11. [Supabase — Pricing](https://supabase.com/pricing) — 500 MB, 2 proyectos, pausa tras 1 semana.
12. [Cloudflare D1 — Limits](https://developers.cloudflare.com/d1/platform/limits/) y [Pricing](https://developers.cloudflare.com/d1/platform/pricing/) — 5 M lecturas/día, 100 k escrituras/día, 500 MB/base.
13. [Cloudflare Workers — Pricing](https://developers.cloudflare.com/workers/platform/pricing/) — 100.000 req/día, Workers Paid USD 5/mes.
14. [Grist — Pricing](https://www.getgrist.com/pricing/) — 5.000 registros/documento, 30 días de snapshots.
15. [SeaTable — Prices](https://seatable.com/prices/) — 10.000 filas, snapshots 1 mes.
16. [GitHub Pages — Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 1 GB, 100 GB/mes (soft), 10 min de despliegue.
17. [GitHub Actions — Billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) — Actions gratis en repo público.
18. [GitHub REST API — Rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) — 60 req/h sin token.
19. [Google Sheets API — Authorizing](https://developers.google.com/sheets/api/guides/authorizing) — deriva a OAuth 2.0; API key para hoja privada **a verificar**.
20. [PocketBase — Documentation](https://pocketbase.io/docs/) — pre-1.0, no recomendado para producción crítica.
