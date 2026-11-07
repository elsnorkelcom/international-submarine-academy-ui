# ISA · Modelo de datos físico (Google Sheets)

**Estado:** propuesta de diseño. **No implementada.** No se creó ninguna hoja, script, endpoint ni tabla.
**Fecha:** 6 de noviembre de 2026.
**Referencia de estado real:** commit `3e7f53f` (verificado el 6 de noviembre de 2026 sobre el working tree actual).
**Sesión:** S · Infraestructura de datos.
**Documentos relacionados:** `docs/00_DOCUMENTO_BASE.md` (decisión Sheets privada + Apps Script), `docs/07_ENDPOINT_APPS_SCRIPT.md` (contrato vigente), `docs/08_DATA_LAYER.md` (capa local), `docs/13_SHEET_SYNC.md` (sync de museos), `docs/14_OPEN_BADGES.md` (credenciales), `docs/15_CONFIG_SHEET.md` (tablas de configuración), `docs/19_DATA_INFRA_SESSION.md` (pedido de esta sesión), `docs/20_INVENTARIO_COMPONENTES.md` (inventario verificado) y `docs/21_OPCIONES_PLATAFORMA.md` (comparación de plataformas con fuentes).

Este documento responde una sola pregunta: **si la fuente de verdad es una Google Sheet privada, ¿cuál es el esquema físico concreto?** No decide la plataforma (eso es `docs/23_ADR_INFRAESTRUCTURA.md`) ni implementa nada.

---

## 0. Resumen ejecutivo

- El modelo objetivo son **20 hojas**: 17 que cubren los componentes pedidos, más `Contenidos`, `Propiedad_Intelectual` y `Logs` que ya figuran en el contrato `docs/07` y en `docs/00` como hojas propuestas.
- De esas 20, **solo 2 tienen datos reales hoy** (`Museos` vía dataset versionado de 160 registros y `Config` vía claves sueltas en el código + `isa-config.json` vacío). El resto son modelo en TypeScript/IndexedDB sin hoja.
- La **grilla 5×5** se modela como tabla puente `Grilla_5x5` (especialidad = rol × disciplina) con `mission_id` como FK. No duplica misiones ni contenido.
- Las **credenciales emitidas** van a una hoja `Credenciales_Emitidas` **append-only**, escrita solo por Apps Script mediante un endpoint de append nuevo, **sin datos personales** (`subject = anonymous`). El ADR (`docs/23` §3.4) **posterga** ese registro: en el MVP las credenciales quedan locales en IndexedDB y la hoja es el destino futuro, condicionado a un emisor que firme y/o a una identidad del destinatario.
- La separación clave es **contenido (editable a mano) vs. emitido (solo script)**. El JSON versionado del repo es artefacto publicado, no fuente de verdad.
- El esquema **no rompe IDs existentes**: `MUS-U995`, `SEA-STEEL`, `EPI-STEEL-04`, `MIS-STEEL-04`, `QST-STEEL-04-01`, `BDG-EXPEDITION-CREDENTIAL`, `INS-LABOE`, `CMP-U995-CONTROL`, `SYS-U995-PERISCOPE`, `ROL-*`, `DIS-*`.
- Hallazgo principal: el panel admin actual escribe **solo IndexedDB del navegador**; no publica a ninguna fuente compartida. La Sheet será la primera fuente de verdad compartida del proyecto.
- `AGENTS.md` está parcialmente desactualizado y **no se corrige en esta tarea** (ver §1.2).

---

## 1. Estado real verificado y diferencias con `AGENTS.md`

### 1.1 Hechos comprobados en el repositorio

| # | Hecho | Evidencia (archivo) |
|---|---|---|
| 1 | 14 colecciones en el modelo de dominio | `lib/domain/types.ts` → `COLLECTIONS` = `institutions`, `accessKeys`, `museums`, `compartments`, `systems`, `seasons`, `episodes`, `missions`, `questions`, `badges`, `roles`, `disciplines`, `credentials`, `settings` |
| 2 | 12 entidades con panel admin CRUD genérico | `lib/admin/entities.ts` → `ADMIN_ENTITIES` (12). `credentials` y `settings` no usan el CRUD genérico |
| 3 | Persistencia local en IndexedDB, con fallback a memoria | `lib/data/indexeddb-storage.ts`, `components/app/data-provider.tsx` |
| 4 | 160 museos en dataset versionado; 8 validados | `lib/data/datasets/museums-snk-2025.json` (contado: 160 registros, 8 con `validation = validated`), `scripts/sync_museums.py` |
| 5 | `isa-config.json` con `version: 2` y todas las secciones vacías | `lib/data/datasets/isa-config.json` |
| 6 | 100 reactivos TIMSS curados como CSV (101 líneas con encabezado) | `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv` |
| 7 | Apps Script de referencia **sin desplegar** y **sin consumir** desde la web | `apps-script/Code.gs`, `lib/data/sheets-repository.ts` (contratos que lanzan error), `docs/07` |
| 8 | Hojas expuestas por el endpoint: `Config`, `Museos`, `Episodios`, `Misiones`, `Reactivos`, `Contenidos`, `Propuestas` | `apps-script/Code.gs` → `EXPOSED_SHEETS` |
| 9 | Hojas nunca expuestas: `Claves`, `Logs`, `Metricas`, `Instituciones`, `Propiedad_Intelectual` | `apps-script/Code.gs` → `NEVER_EXPOSED` |
| 10 | Credenciales Open Badges en IndexedDB, sin backend, con `subject: 'anonymous'` | `lib/badges/registry.ts`, `lib/domain/types.ts` → `CredentialRecord` |
| 11 | Grilla 5×5 derivada de roles × disciplinas, sin tabla | 5 `SEED_ROLES` × 5 `SEED_DISCIPLINES` en `lib/data/seed.ts`; no existe entidad ni colección de grilla |
| 12 | La Home **no** consume la capa de datos: sigue usando `lib/missions.ts`, `lib/seasons.ts`, `lib/progress.ts` | `app/page.tsx` y componentes de `components/series/`; `DataProvider` (IndexedDB) se usa en `/admin` (vía `components/admin/admin-shell.tsx`), `/museums`, `/museums/[id]`, `/map`, `/series`, `/episodes` y `/profile` (estas tres vía `components/learn/learn-root.tsx`). `/` y `/insignias` son estáticos: usan fixtures de `lib/missions.ts`/`lib/seasons.ts` sin `DataProvider` |
| 13 | Rutas existentes: `/`, `/series`, `/episodes`, `/museums`, `/museums/[id]`, `/map`, `/insignias`, `/profile`, `/admin`, `/admin/[entity]`, `/admin/settings`, `/admin/import`, `/admin/accreditation` | `app/**/page.tsx` |
| 14 | Sin scripts de `lint` ni `test`; `sync:museums` es el único script de datos en `package.json` | `package.json` |

### 1.2 Diferencias con `AGENTS.md` (no se corrige el archivo)

`AGENTS.md` se actualizó por última vez con el estado del commit `62c42a9` (03/11/2026). Desde entonces el repositorio incorporó la capa de datos, el panel admin, el importador, el registro de credenciales y el archivo de museos. Esta tabla deja constancia de la diferencia; **no se modifica `AGENTS.md`** (regla del pedido).

| Afirmación de `AGENTS.md` | Estado real | Impacto para este modelo |
|---|---|---|
| "No hay implementación de Apps Script + Google Sheets en esta UI" | Correcto en cuanto a la UI (no hay `fetch` ni adaptador activo), pero **sí existe implementación de referencia** del endpoint y contratos de repositorio remoto | El modelo debe describir la Sheet como objetivo, no como algo vigente en la UI |
| "`lib/missions.ts`, `lib/seasons.ts` y `lib/progress.ts` siguen siendo la fuente de datos de la Home; no se migraron" | Sigue siendo cierto para la Home | El modelo de datos convive hoy con **dos fuentes paralelas** (fixtures de Home + IndexedDB); la migración debe unificarlas |
| "No hay scripts de `lint` ni de `test`" | Sigue siendo cierto | Las validaciones propuestas no tienen suite donde apoyarse todavía |
| No menciona capa de datos, panel admin, importador, registro de credenciales ni archivo de museos | Existen `lib/data/*`, `lib/admin/*`, `lib/import/*`, `lib/badges/*`, `lib/learning/*` y las rutas de §1.1 #13 | El inventario de componentes de `docs/20` es la fuente correcta de estado actual |
| "No hay requisitos documentados de autenticación, tratamiento de datos personales ni contenidos educativos definitivos" | Sigue siendo cierto; además el tipo `Institution` tiene `contactName`/`contactEmail` (potencial dato personal) sin política definida | El esquema debe evitar datos personales hasta que exista decisión (ver §7 y §12) |

### 1.3 Límites de este relevamiento

- No se ejecutó la aplicación ni se abrió el navegador: el estado se verificó por lectura de código, conteo de datasets y estructura de rutas.
- No se desplegó el Web App ni se probó el endpoint.
- `docs/20` y `docs/21` se escribieron en paralelo y se leyeron para la revisión final. Los volúmenes y límites de plataforma se toman de `docs/19`/`docs/00`, de `docs/20` y del código; las cifras de cuota, con su URL, están en `docs/21` §3 y se resumen en `docs/23`.
- No se ejecutaron `scripts/sync_museums.py` ni `scripts/sync_config.py`.

---

## 2. Principios del esquema

| Principio | Regla concreta en este esquema |
|---|---|
| **IDs legibles y estables** | Toda fila tiene `id` con prefijo (`MUS-`, `SEA-`, `EPI-`, `MIS-`, `QST-`, `BDG-`, `INS-`, `KEY-`, `CMP-`, `SYS-`, `ROL-`, `DIS-`, `CRD-`). El `id` nunca se reescribe ni se reutiliza. |
| **Bilingüe desde el modelo** | Todo texto de contenido existe como par `<base>_en` / `<base>_es`. El inglés es la referencia; el español es obligatorio para publicar. |
| **Auditoría** | Toda hoja editable lleva `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at` (§3.8). |
| **Soft delete** | `deleted_at` con timestamp ISO marca baja lógica; `NULL` = vigente. No se permite borrar físicamente una fila con hijos. |
| **Append-only donde corresponde** | `Credenciales_Emitidas` y `Logs` no se editan ni se borran; solo se agregan filas (con la excepción controlada de revocación, §5.15). |
| **Una sola fuente de verdad** | Cada relación tiene una dirección canónica (FK en el hijo). Las listas desnormalizadas del padre (`compartment_ids`, `system_ids`, `episode_ids`, `equipment_ids`) son **derivadas por script**, nunca editadas a mano. |
| **Contenido ≠ emitido** | Lo que se edita (museos, misiones, insignias) vive en hojas editables; lo que se emite (credenciales) vive en hoja append-only escrita solo por Apps Script. |
| **Repositorio como artefacto** | El JSON versionado en `lib/data/datasets/` es un artefacto publicado y reproducible desde la Sheet, no la fuente de verdad. |
| **Sin secretos en la hoja** | La Sheet guarda **hash** de claves, nunca la clave en texto plano. El secreto del token vive en Propiedades del script. |
| **Trazabilidad editorial** | `status`, `source`, `notes` y auditoría permiten distinguir borrador, revisión, publicado y archivado, y declarar el origen. |

---

## 3. Convenciones

### 3.1 Nombres de hojas

- Nombres en español, como ya fija el contrato vigente: `Config`, `Museos`, `Episodios`, `Misiones`, `Reactivos`, `Contenidos`, `Propuestas` (`docs/07`), más las nuevas `Instituciones`, `Claves`, `Compartimentos`, `Sistemas`, `Temporadas`, `Insignias`, `Roles`, `Disciplinas`, `Grilla_5x5`, `Credenciales_Emitidas`, `Metricas`, `Propiedad_Intelectual`, `Logs`.
- Una hoja por entidad; sin prefijos numéricos; sin espacios; guion bajo solo cuando el nombre lo requiere (`Grilla_5x5`, `Credenciales_Emitidas`, `Propiedad_Intelectual`).
- Las hojas calculadas, si alguna vez existen, llevan prefijo `_calc_` y son **de solo lectura**.

### 3.2 Columnas

- `snake_case`, en inglés, alineado con `lib/domain/types.ts` (`museum_id`, `rule_type`, `timss_domain`, `created_at`). Excepción de compatibilidad: mientras dure la transición, el endpoint acepta los encabezados actuales de `docs/07` como alias (§5.3 y §5.2).
- La primera fila es el encabezado; los encabezados son estables (`apps-script/Code.gs` los usa como claves).
- No se admiten columnas con espacios, acentos ni mayúsculas.
- Los nombres normalizados que usan los scripts (`scripts/sync_config.py` normaliza encabezados quitando acentos y pasando a `_`) siguen siendo válidos.
- Una columna vacía con encabezado es un error de integridad, no una columna inexistente.

### 3.3 Enums

- Valores en `snake_case` minúscula, en inglés, cerrados y documentados. Un valor fuera del enum **invalida la fila** (se reporta la línea y no se publica).
- No se usan acentos, mayúsculas ni sinónimos en la hoja. La traducción de etiquetas es responsabilidad de la UI (`lib/i18n/`).
- Los enums vigentes en código son la base: `PublicationStatus`, `QuestionStatus`, `BadgeStatus`, `BadgeType`, `BadgeRuleType`, `TimssDomain`, `SeasonName`, `InstitutionType`, `InstitutionStatus`, `AccessKeyStatus`, `AccessKeyScope`, `ValidationStatus`, `CredentialStatus`.

### 3.4 Campos bilingües

- Sufijos `_en` y `_es` sobre la misma base: `name_en` / `name_es`, `title_en` / `title_es`.
- `_en` es la referencia y el fallback de `localize()` (`lib/domain/types.ts`).
- `_es` puede quedar vacío **solo** en `draft`; si `status = published`, el script rechaza la fila con "falta español".
- No se usan columnas `name` a secas para contenido bilingüe. Los campos técnicos (URL, color, hash, IDs) no son bilingües.

### 3.5 IDs

- Formato general: `PREFIJO-<slug en mayúsculas>`, por ejemplo `MUS-U995`, `EPI-STEEL-04`, `MIS-COPPER-01`.
- Prefijos vigentes en `READABLE_ID_PREFIX` (`lib/domain/types.ts`): `INS`, `KEY`, `MUS`, `CMP`, `SYS`, `SEA`, `EPI`, `MIS`, `QST`, `BDG`, `ROL`, `DIS`, `CRD`.
- Prefijos **propuestos** para componentes futuros (requieren cambio de código cuando se implementen): `PROP` (propuestas), `MET` (métricas), `CNT` (contenidos), `PI` (propiedad intelectual), `LOG` (logs), `GRD` (grilla).
- Los IDs son **inmutables** una vez publicados. Renombrar un ID rompe URLs y relaciones; si un registro se reemplaza, se archiva con su ID intacto y se crea uno nuevo.
- El ID lo propone el editor humano o lo genera el script con un slug estable (nunca un número de fila). `scripts/sync_museums.py` ya aplica esa regla: conserva IDs por nombre y genera `MUS-<SLUG>` para filas nuevas.

### 3.6 Fechas y horas

- Formato único: **ISO 8601 UTC**, `YYYY-MM-DDTHH:MM:SSZ` (timestamp) o `YYYY-MM-DD` (fecha sin hora).
- Nada de `DD/MM/YYYY` en la hoja. El parser de `scripts/sync_config.py`/`sync_museums.py` puede normalizar, pero el valor canónico es ISO.
- `generated_at`, `created_at`, `updated_at`, `deleted_at`, `issued_at`, `revoked_at` deben ser UTC.
- La zona de edición (America/Argentina/Buenos_Aires) es solo de interfaz; no se persiste.

### 3.7 Booleanos, listas, nulos y derivados

| Tipo de dato | Convención |
|---|---|
| Booleano | `TRUE` / `FALSE` (mayúsculas). Se aceptan `true/false/1/0/sí/si` al importar y se normalizan |
| Lista | Separador barra vertical, sin espacios: `CMP-A` y `CMP-B` en la misma celda. Cada elemento es un ID válido |
| Vacío | Celda vacía = `NULL` lógico. No usar `"NULL"`, `"-"` ni `"N/A"` |
| Número | Punto decimal (`.`), sin separador de miles. `latitude`/`longitude` con signo |
| Derivado | Columna calculada por script; encabezado con sufijo `_derived` cuando sea ambiguo. No se edita a mano |
| Color | HEX `#RRGGBB` |
| URL | Absoluta, `https://`. Vacío permitido cuando el campo es opcional |

### 3.8 Auditoría y soft delete (bloque estándar)

Aplica a **toda hoja editable** (no a las emitidas/append-only). No se repite en cada tabla del §5 para evitar duplicación.

| Columna | Tipo | Req. | Default | Notas |
|---|---|---|---|---|
| `created_at` | timestamp ISO UTC | Sí | generado por script | Se conserva en cada export |
| `updated_at` | timestamp ISO UTC | Sí | generado por script | Se actualiza cuando el hash de la fila cambia |
| `created_by` | texto | Sí | `seed` / `sync` / `admin` | Actor, no dato personal |
| `updated_by` | texto | Sí | idem | |
| `deleted_at` | timestamp ISO UTC | No | `NULL` | Baja lógica; fila excluida del export |

Quién escribe la auditoría: el script de sync la mantiene comparando el hash de la fila con el export anterior; el editor humano no necesita escribirla. La primera importación masiva la inicializa. (Decisión abierta en §13; alternativa: dejar que Apps Script escriba estas columnas al exponer, lo que exigiría un endpoint con escritura, hoy inexistente.)

### 3.9 Semántica de estados editoriales

| Enum | Valores | Uso |
|---|---|---|
| `publication_status` | `draft`, `review`, `published`, `archived` | Museos, compartimentos, sistemas, episodios, misiones |
| `question_status` | `idea`, `proposal`, `review`, `validated`, `published`, `archived` | Reactivos |
| `badge_status` | `draft`, `published`, `archived` | Temporadas, insignias, roles, disciplinas |
| `institution_status` | `active`, `inactive` | Instituciones |
| `access_key_status` | `active`, `suspended`, `revoked` | Claves |
| `validation_status` | `validated`, `pending` | Museos (validación histórica) |
| `credential_status` | `issued`, `revoked` | Credenciales emitidas |
| `proof_status` | `unsigned`, `signed` | Credenciales emitidas |

Regla: solo `published` (o `active`) se publica. `archived` nunca se publica, pero se conserva para no romper referencias.

### 3.10 Tipos lógicos usados en las tablas

`texto`, `texto largo`, `entero`, `decimal`, `booleano`, `fecha ISO`, `timestamp ISO`, `enum(...)`, `lista (barra vertical)`, `JSON`, `hash SHA-256 hex`, `URL`. Google Sheets no impone tipos: la validación es del script y del endpoint.

---

## 4. Mapa hoja ↔ colección ↔ estado

| # | Hoja | Colección TypeScript (`lib/domain/types.ts`) | Estado de partida |
|---|---|---|---|
| 1 | `Config` | `settings` (singleton, id `settings`) | Modelo existe; hoja no creada; `isa-config.json` vacío |
| 2 | `Instituciones` | `institutions` | Modelo existe; 1 registro seed (`INS-LABOE`); hoja no creada |
| 3 | `Claves` | `accessKeys` | Modelo existe; 0 registros; hoja no creada |
| 4 | `Museos` | `museums` | Dataset de 160 registros; hoja publicada externa + `sync_museums.py` |
| 5 | `Compartimentos` | `compartments` | Modelo existe; 1 registro seed; hoja no creada |
| 6 | `Sistemas` | `systems` | Modelo existe; 1 registro seed; hoja no creada |
| 7 | `Temporadas` | `seasons` | Modelo existe; 5 registros seed; hoja no creada |
| 8 | `Episodios` | `episodes` | Modelo existe; 1 registro seed; hoja no creada |
| 9 | `Misiones` | `missions` | Modelo existe; 2 registros seed; hoja no creada |
| 10 | `Reactivos` | `questions` | Modelo existe; 2 seed + 100 CSV curados; hoja no creada |
| 11 | `Insignias` | `badges` | Modelo existe; 2 seed; hoja no creada |
| 12 | `Roles` | `roles` | Modelo existe; 5 seed; hoja no creada |
| 13 | `Disciplinas` | `disciplines` | Modelo existe; 5 seed; hoja no creada |
| 14 | `Grilla_5x5` | — (no existe hoy) | Derivada de roles × disciplinas; sin tabla |
| 15 | `Credenciales_Emitidas` | `credentials` | Solo IndexedDB, por navegador; hoja no creada |
| 16 | `Propuestas` | — (futuro) | No existe |
| 17 | `Metricas` | — (futuro) | No existe |
| 18 | `Contenidos` | — (futuro; expuesta en `docs/07`) | No existe como entidad |
| 19 | `Propiedad_Intelectual` | — (futuro; nunca expuesta) | No existe |
| 20 | `Logs` | — (futuro; nunca expuesta) | No existe |

---

## 5. Catálogo de tablas y hojas

Leyenda de la columna "Tipo": **Editable** = se edita a mano o con AppSheet; **Generada** = script; **Append-only** = solo agrega filas; **Vista** = calculada.
Toda hoja Editable incluye además el bloque de auditoría de §3.8.

### 5.1 `Config` — Configuración

**Propósito:** parámetros de la aplicación, textos editables, versiones y flags, como clave/valor tipado.
**PK:** `key`. **FK:** ninguna. **Tipo:** Editable (valores) + Generada (validación de tipo).

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `key` | texto | Sí | — | — | Estable, `snake_case`. Ej.: `app_name`, `default_language`, `max_attempts`, `timer_seconds`, `welcome`, `access`, `fiction` |
| `value` | texto | Sí | — | — | Valor (para claves bilingües: inglés) |
| `value_es` | texto | No | vacío | Sí | Español; obligatorio si la clave es bilingüe y está publicada |
| `value_type` | enum | Sí | `text` | — | `text`, `integer`, `boolean`, `enum`, `color`, `url`, `json` |
| `group` | enum | No | `general` | — | `brand`, `access`, `learning`, `flags`, `editorial` |
| `status` | enum | Sí | `published` | — | `draft`, `published`, `archived` |
| `notes` | texto | No | — | — | |

**Índices/orden:** PK `key`; orden por `group` y `key`.
**Quién la edita:** 1–3 editores del equipo. AppSheet es opcional.
**Validación:** tipo declarado; clave desconocida se ignora con warning (comportamiento actual de `lib/data/config.ts`); `default_language` solo `en`/`es`.
**Compatibilidad con el estado actual:** `lib/data/config.ts` (`SETTINGS_MAP`) hoy mapea claves `app_name`, `default_language`, `max_attempts`, `timer_seconds`, `welcome_en`, `welcome_es`, `access_en`, `access_es`, `fiction_en`, `fiction_es`. El modelo unifica los pares en `welcome`, `access`, `fiction` con `value`/`value_es`; durante la migración el script debe aceptar ambos formatos y `SETTINGS_MAP` debe adaptarse (ver doc 23). `scripts/sync_config.py` hoy lee solo `value` e ignora `value_es`: es una limitación a corregir en la migración.

### 5.2 `Instituciones` — Instituciones

**Propósito:** museos, asociaciones, aliados y escuelas que pueden acceder o ser titulares de credenciales.
**PK:** `id` (`INS-…`). **FK:** ninguna. **Tipo:** Editable (privada, nunca expuesta por el endpoint).

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `INS-…` |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | vacío | Sí | Obligatorio si `published`/`active` |
| `type` | enum | Sí | `other` | — | `museum`, `association`, `partner`, `school`, `other` |
| `country` | texto | No | — | — | |
| `city` | texto | No | — | — | |
| `website` | URL | No | — | — | |
| `contact_name` | texto | No | — | — | **Dato personal potencial: no usar hasta decisión de privacidad** |
| `contact_email` | texto | No | — | — | **Dato personal potencial: idem** |
| `status` | enum | Sí | `active` | — | `active`, `inactive` |
| `notes` | texto | No | — | — | |

**Índices/orden:** PK `id`; orden por `name_en`.
**Quién la edita:** responsable del proyecto.
**Compatibilidad con `docs/07`:** el contrato vigente usa encabezados `id`, `nombre`, `tipo`. El modelo adopta `id`, `name_en`, `name_es`, `type`; durante la transición el endpoint debe aceptar `nombre`/`tipo` como alias de `name_en`/`type` (mapeo explícito en §5.3). Actualizar `docs/07` y `apps-script/Code.gs` es parte de la fase de migración (doc 23).

### 5.3 `Claves` — Claves de acceso

**Propósito:** claves institucionales para el endpoint. Guarda **solo hash**, nunca el texto plano.
**PK:** `id` (`KEY-…`). **FK:** `institution_id` → `Instituciones.id`. **Tipo:** Editable restringida (hash generado con `generarHashDeClave`) / nunca expuesta.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `KEY-…` |
| `clave_hash` | hash SHA-256 hex | Sí | — | — | Minúsculas; único. Encabezado conservado de `docs/07` por contrato |
| `institution_id` | texto (FK) | Sí | — | — | Debe existir en `Instituciones` |
| `etiqueta` | texto | No | — | — | Referencia interna legible; sin datos personales |
| `estado` | enum | Sí | `active` | — | `active`, `suspended`, `revoked` (el endpoint acepta `activa` como alias) |
| `valid_from` | fecha ISO | No | `NULL` | — | |
| `valid_until` | fecha ISO | No | `NULL` | — | |
| `scope` | enum | No | `mvp` | — | `mvp`, `pilot`, `demo`, `internal` |
| `notes` | texto | No | — | — | |

**Índices/orden:** PK `id`; único `clave_hash`; FK `institution_id`.
**Quién la edita:** responsable de seguridad. La clave en texto plano se entrega fuera de la hoja y **no se registra**.
**Reglas:** el endpoint compara por hash y responde siempre genérico (`invalid_key`); una clave suspendida y una inexistente son indistinguibles.

### 5.4 `Museos` — Museos y submarinos preservados

**Propósito:** catálogo de Submarinos Museos, con ficha, geolocalización y estado de validación.
**PK:** `id` (`MUS-…`). **FK:** `institution_id` → `Instituciones.id` (nueva, nullable al migrar).
**Tipo:** Editable (hoy proviene de una Sheet publicada externa; ver más abajo).

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `MUS-U995`, `MUS-SNK-012`, … inmutable |
| `institution_id` | texto (FK) | No | `NULL` | — | **No existe hoy en `Museum`**; se agrega para vincular museo ↔ institución |
| `name_en` | texto | Sí | — | Sí | Nombre del buque |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `museum_name_en` | texto | No | — | Sí | Museo que lo aloja |
| `museum_name_es` | texto | No | = `museum_name_en` | Sí | |
| `country` | texto | No | — | — | Nombre canónico en inglés (el sheet actual está en español y se normaliza) |
| `city` | texto | No | — | — | |
| `website` | URL | No | — | — | |
| `vessel_type` | texto | No | — | — | Clase del buque |
| `propulsion` | texto | No | — | — | Diesel, nuclear, eléctrica, manual |
| `origin` | texto | No | — | — | País de origen normalizado |
| `description_en` | texto largo | Cond. | — | Sí | Si falta: "Information to be validated." |
| `description_es` | texto largo | Cond. | — | Sí | Si falta: "Información a validar." |
| `compartment_ids` | lista | No | vacío | — | **Derivada** de `Compartimentos.museum_id`; no editar |
| `episode_ids` | lista | No | vacío | — | **Derivada** de `Episodios.museum_id`; no editar |
| `status` | enum | Sí | `draft` | — | `draft`, `review`, `published`, `archived` |
| `source` | texto | No | — | — | Origen del dato |
| `notes` | texto | No | — | — | |
| `latitude` | decimal | No | `NULL` | — | |
| `longitude` | decimal | No | `NULL` | — | |
| `launch_year` | entero | No | `NULL` | — | |
| `address` | texto | No | — | — | |
| `media_url` | URL | No | — | — | Video |
| `validation` | enum | Sí | `pending` | — | `validated`, `pending` |
| `dossier` | texto | No | `NULL` | — | Código de archivo `SNK-012`; el sheet actual no tiene columna y cae al orden de fila (limitación conocida) |
| `situation` | enum | No | `NULL` | — | `flote`, `agua`, `tierra`, `cerrado`, `monumento` |
| `featured` | booleano | Sí | `FALSE` | — | |

**Índices/orden:** PK `id`; único `dossier` (a verificar unicidad real del fallback por fila); orden por `name_en`, `country`, `dossier`; filtros por `situation`, `validation`, `featured`.
**Quién la edita:** el dataset se regenera con `scripts/sync_museums.py` desde la Sheet publicada de `submarinos_museo` (fuente externa actual). En el modelo objetivo, la hoja `Museos` se vuelve la fuente y el script deja de depender de la Sheet pública externa (decisión abierta, ver §13).
**Mapeo desde la hoja publicada actual** (según `scripts/sync_museums.py`): `Name`→`name`, `Description` (`<b>` bloque)→`museum_name`/`origin`/`vessel_type`/`launch_year`, `Clase`→`vessel_type`, `Group`→`propulsion`, `Nationality`→`origin`, `Launch year`→`launch_year`, `Latitude`/`Longitude`, `Country`, `City / Town`, `Address found`, `URL`, `Video`, `Featured`, `Situacion`/`Icon URL`→`situation`, `Estado`→`validation`/`notes`, orden de fila→`dossier`. Los campos bilingües hoy se duplican en inglés y español a partir del mismo valor.

### 5.5 `Compartimentos`

**Propósito:** secciones del submarino (sala de control, sala de máquinas, etc.).
**PK:** `id` (`CMP-…`). **FK:** `museum_id` → `Museos.id`. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `CMP-U995-CONTROL` |
| `museum_id` | texto (FK) | Sí | — | — | |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `description_en` | texto largo | Cond. | — | Sí | |
| `description_es` | texto largo | Cond. | — | Sí | |
| `system_ids` | lista | No | vacío | — | **Derivada** de `Sistemas.compartment_id`; no editar |
| `status` | enum | Sí | `draft` | — | `draft`, `review`, `published`, `archived` |

**Índices/orden:** PK `id`; FK `museum_id`; orden por `name_en`.
**Quién la edita:** curador de contenido.

### 5.6 `Sistemas` — Sistemas y equipos

**Propósito:** equipos y sistemas de a bordo (periscopio, sonar, baterías, etc.).
**PK:** `id` (`SYS-…`). **FK:** `compartment_id` → `Compartimentos.id`; `museum_id` → `Museos.id` (**derivada** de la FK del compartimento). **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `SYS-U995-PERISCOPE` |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `category` | texto | No | — | — | Ej.: `Observation` |
| `description_en` | texto largo | Cond. | — | Sí | |
| `description_es` | texto largo | Cond. | — | Sí | |
| `compartment_id` | texto (FK) | Sí | — | — | Dueño de la relación |
| `museum_id` | texto (FK) | No | derivado | — | Derivada de `compartment.museum_id`; no editar |
| `topics` | lista | No | vacío | — | Temas, no IDs |
| `status` | enum | Sí | `draft` | — | `draft`, `review`, `published`, `archived` |

**Índices/orden:** PK `id`; FK `compartment_id`; orden por `name_en`.
**Quién la edita:** curador de contenido.

### 5.7 `Temporadas`

**Propósito:** las cinco temporadas (Steel, Copper, Bronze, Silver, Gold) con su dominio TIMSS y énfasis GSA.
**PK:** `id` (`SEA-…`). **FK:** ninguna. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `SEA-STEEL` … `SEA-GOLD`; inmutable |
| `name` | enum | Sí | — | — | `steel`, `copper`, `bronze`, `silver`, `gold` |
| `title_en` | texto | Sí | — | Sí | |
| `title_es` | texto | Cond. | = `title_en` | Sí | |
| `description_en` | texto largo | No | — | Sí | Énfasis de la temporada |
| `description_es` | texto largo | No | = `description_en` | Sí | |
| `order` | entero | Sí | 0 | — | 1–5 |
| `color_theme` | color | No | `#8FA3B0` | — | Color en la ruta de acreditación |
| `timss_domain` | enum | Sí | `knowing` | — | `knowing`, `applying`, `reasoning`, `integrated` |
| `gsa_en` | texto | No | — | Sí | Énfasis GSA |
| `gsa_es` | texto | No | = `gsa_en` | Sí | |
| `status` | enum | Sí | `published` | — | `draft`, `published`, `archived` |

**Índices/orden:** PK `id`; único `name`; orden por `order`.
**Quién la edita:** responsable editorial.

### 5.8 `Episodios`

**Propósito:** episodios de la serie, asociados a museo, compartimento y equipo.
**PK:** `id` (`EPI-…`). **FK:** `season_id` → `Temporadas.id`; `museum_id` → `Museos.id`; `compartment_id` → `Compartimentos.id`; `equipment_id` → `Sistemas.id`. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `EPI-STEEL-04` |
| `title_en` | texto | Sí | — | Sí | |
| `title_es` | texto | Cond. | = `title_en` | Sí | |
| `season_id` | texto (FK) | Sí | — | — | |
| `museum_id` | texto (FK) | Sí | — | — | |
| `compartment_id` | texto (FK) | No | `NULL` | — | |
| `equipment_id` | texto (FK) | No | `NULL` | — | En la UI se llama "equipment"; en el modelo `Sistemas` |
| `media_url` | URL | No | — | — | |
| `duration_seconds` | entero | No | `NULL` | — | |
| `description_en` | texto largo | No | — | Sí | |
| `description_es` | texto largo | No | = `description_en` | Sí | |
| `narrative_en` | texto largo | No | — | Sí | |
| `narrative_es` | texto largo | No | = `narrative_en` | Sí | |
| `order` | entero | Sí | 0 | — | |
| `status` | enum | Sí | `draft` | — | `draft`, `review`, `published`, `archived` |

**Índices/orden:** PK `id`; FK `season_id`, `museum_id`; orden por `season_id`, `order`.

### 5.9 `Misiones`

**Propósito:** misiones educativas asociadas a un episodio, con objetivo, compartimento, equipo y alineación.
**PK:** `id` (`MIS-…`). **FK:** `episode_id` → `Episodios.id`; `season_id` → `Temporadas.id`; `museum_id` → `Museos.id`; `compartment_id` → `Compartimentos.id`; `equipment_id` → `Sistemas.id`. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `MIS-STEEL-04`, `MIS-COPPER-01` |
| `title_en` | texto | Sí | — | Sí | |
| `title_es` | texto | Cond. | = `title_en` | Sí | |
| `episode_id` | texto (FK) | Sí | — | — | |
| `season_id` | texto (FK) | Sí | — | — | Debe coincidir con `episode.season_id` (validación) |
| `museum_id` | texto (FK) | Sí | — | — | Debe coincidir con `episode.museum_id` (validación) |
| `compartment_id` | texto (FK) | No | `NULL` | — | |
| `equipment_id` | texto (FK) | No | `NULL` | — | |
| `description_en` | texto largo | No | — | Sí | |
| `description_es` | texto largo | No | = `description_en` | Sí | |
| `objective_en` | texto largo | No | — | Sí | `learningObjective` en el tipo |
| `objective_es` | texto largo | No | = `objective_en` | Sí | |
| `timss_domain` | enum | Sí | `knowing` | — | `knowing`, `applying`, `reasoning`, `integrated` |
| `gsa_competency` | texto | No | — | — | Nombre de competencia, no URL de marco todavía |
| `civil_en` | texto largo | No | — | Sí | Vínculo con sociedad civil |
| `civil_es` | texto largo | No | = `civil_en` | Sí | |
| `order` | entero | Sí | 0 | — | |
| `status` | enum | Sí | `draft` | — | `draft`, `review`, `published`, `archived` |

**Índices/orden:** PK `id`; FK `episode_id`, `season_id`; orden por `season_id`, `order`.
**Nota:** la consistencia `mission.season_id = episode.season_id` y `mission.museum_id = episode.museum_id` hoy no se valida en código; el script debe hacerlo (el seed actual ya es consistente salvo `MIS-COPPER-01`, que cuelga de un episodio de Acero; ver §12).

### 5.10 `Reactivos` — Reactivos / preguntas

**Propósito:** banco de preguntas de cuatro opciones con respuesta correcta, feedback y alineación.
**PK:** `id` (`QST-…`). **FK:** `mission_id`, `episode_id`, `museum_id`, `compartment_id`, `equipment_id`. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `QST-STEEL-04-01` |
| `text_en` | texto largo | Sí | — | Sí | |
| `text_es` | texto largo | Cond. | = `text_en` | Sí | |
| `mission_id` | texto (FK) | Sí | — | — | |
| `episode_id` | texto (FK) | No | `NULL` | — | Derivado de la misión si se omite |
| `museum_id` | texto (FK) | No | `NULL` | — | ídem |
| `compartment_id` | texto (FK) | No | `NULL` | — | ídem |
| `equipment_id` | texto (FK) | No | `NULL` | — | ídem |
| `area` | texto | No | — | — | Ej.: `Science — Physics (Optics)` |
| `timss_domain` | enum | Sí | `knowing` | — | |
| `gsa_competency` | texto | No | — | — | |
| `topic` | texto | No | — | — | |
| `level` | texto | No | — | — | |
| `option_a_en` | texto | Sí | — | Sí | Cuatro opciones obligatorias |
| `option_a_es` | texto | Cond. | = `_en` | Sí | |
| `option_b_en` / `option_b_es` | texto | Sí | — | Sí | |
| `option_c_en` / `option_c_es` | texto | Sí | — | Sí | |
| `option_d_en` / `option_d_es` | texto | Sí | — | Sí | |
| `correct_option_id` | enum | Sí | — | — | `A`, `B`, `C`, `D` |
| `feedback_en` | texto largo | No | — | Sí | |
| `feedback_es` | texto largo | Cond. | = `_en` | Sí | |
| `civil_en` | texto largo | No | — | Sí | |
| `civil_es` | texto largo | No | = `civil_en` | Sí | |
| `source` | texto | No | — | — | Fuente y derechos a revisar |
| `status` | enum | Sí | `proposal` | — | `idea`, `proposal`, `review`, `validated`, `published`, `archived` |
| `notes` | texto | No | — | — | |

**Índices/orden:** PK `id`; FK `mission_id`; único lógico por `id`; orden por `topic`, `level`.
**Quién la edita:** curador de reactivos, con revisión pedagógica y de derechos.
**Nota:** el CSV curado (`TIMSS/curated/…curated.csv`, 100 filas) tiene columnas en español y `curation_status`; el importador ya mapea 100 filas a `questions` según `docs/10`. El modelo fija encabezados canónicos en inglés y el script de importación traduce.

### 5.11 `Insignias` — Insignias y reglas de otorgamiento

**Propósito:** credenciales, coins y badges, con su regla de otorgamiento y criterios.
**PK:** `id` (`BDG-…`). **FK:** `season_id` → `Temporadas.id`; `mission_id` → `Misiones.id` (solo para `rule_type = mission`). **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `BDG-EXPEDITION-CREDENTIAL`, `BDG-COPPER-COIN` |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `type` | enum | Sí | `badge` | — | `credential`, `coin`, `badge` |
| `season_id` | texto (FK) | Sí | — | — | |
| `mission_id` | texto (FK) | Cond. | `NULL` | — | Obligatorio si `rule_type = mission`; vacío si `season-count` |
| `description_en` | texto largo | No | — | Sí | |
| `description_es` | texto largo | No | = `_en` | Sí | |
| `icon` | texto | No | — | — | Nombre de icono |
| `color` | color | No | `#8FA3B0` | — | |
| `criteria_en` | texto largo | No | — | Sí | Texto de criterio mostrado en la credencial |
| `criteria_es` | texto largo | No | = `_en` | Sí | |
| `status` | enum | Sí | `draft` | — | `draft`, `published`, `archived` |
| `rule_type` | enum | Sí | `mission` | — | `mission`, `season-count` |
| `rule_count` | entero | Cond. | 1 | — | Misiones requeridas; solo `season-count`; `>= 1` |

**Índices/orden:** PK `id`; FK `season_id`; orden por `season_id`, `name_en`.
**Decisión:** la regla va **inline** en la insignia (como en el código actual: `ruleType`, `ruleCount`, `missionId`). Si en el futuro aparecen más tipos de regla (`score`, `streak`, `manual`), se separa `Reglas_Otorgamiento` con FK `badge_id`; hoy no se justifica.
**Validación:** `season-count` exige `mission_id` vacío y `rule_count` entero; `mission` exige `mission_id` existente y `rule_count` ignorado.

### 5.12 `Roles`

**Propósito:** roles de tripulación que sirven de "especialidad" en la grilla 5×5.
**PK:** `id` (`ROL-…`). **FK:** ninguna. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `ROL-MACHINIST`, `ROL-ELECTRICIAN`, `ROL-ELECTRONICS`, `ROL-NAVAL`, `ROL-LOGISTICS` |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `description_en` | texto largo | No | — | Sí | |
| `description_es` | texto largo | No | = `_en` | Sí | |
| `equipment_ids` | lista | No | vacío | — | **Derivada** de la relación equipo↔rol (o de `Grilla_5x5`); no editar a mano |
| `status` | enum | Sí | `published` | — | `draft`, `published`, `archived` |

**Índices/orden:** PK `id`; orden por `name_en`. Exactamente 5 roles publicados para la grilla 5×5.

### 5.13 `Disciplinas`

**Propósito:** disciplinas curriculares STEM+A de la grilla.
**PK:** `id` (`DIS-…`). **FK:** ninguna. **Tipo:** Editable.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | `DIS-SCIENCE`, `DIS-TECHNOLOGY`, `DIS-ENGINEERING`, `DIS-MATHEMATICS`, `DIS-HUMANITIES` |
| `name_en` | texto | Sí | — | Sí | |
| `name_es` | texto | Cond. | = `name_en` | Sí | |
| `description_en` | texto largo | No | — | Sí | |
| `description_es` | texto largo | No | = `_en` | Sí | |
| `color` | color | No | — | — | |
| `status` | enum | Sí | `published` | — | `draft`, `published`, `archived` |

**Índices/orden:** PK `id`; orden por `name_en`. Exactamente 5 disciplinas publicadas.

### 5.14 `Grilla_5x5` — Grilla especialidad × disciplina

**Propósito:** tabla puente que asigna una misión (existente) a cada celda especialidad × disciplina, sin duplicar contenido.
**PK:** `id` (`GRD-<ROL>-<DIS>`). **FK:** `especialidad_id` → `Roles.id`; `disciplina_id` → `Disciplinas.id`; `mission_id` → `Misiones.id` (nullable). **Tipo:** Editable (composición de celdas generada/validada por script).

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | `GRD-<rol>-<dis>` | — | Determinístico |
| `especialidad_id` | texto (FK) | Sí | — | — | Un `Roles.id` |
| `disciplina_id` | texto (FK) | Sí | — | — | Un `Disciplinas.id` |
| `mission_id` | texto (FK) | No | `NULL` | — | Slug/ID de misión existente; **no** se copia contenido |
| `order` | entero | No | 0 | — | Orden de presentación |
| `notes` | texto | No | — | — | |
| `status` | enum | Sí | `published` | — | `draft`, `published`, `archived` |

**Índices/orden:** PK `id`; único (`especialidad_id`, `disciplina_id`); FK `mission_id`; orden por `order`.
**Reglas:** exactamente 25 filas (5 roles publicados × 5 disciplinas publicadas). Una celda sin `mission_id` es una celda vacía legítima, no un error. El script valida que cada `mission_id` exista y esté publicado; **la misión no se duplica**. La grilla publicada se exporta como vista (`grilla-5x5.json`, propuesto) desde esta tabla.
**Estado actual:** no existe. Hoy la grilla es una matriz derivada en el cliente (`lib/missions.ts` expone `SPECIALTIES`/`DISCIPLINES`, usada por `components/insignias/badge-matrix.tsx`) y `lib/missions.ts` incluye misiones de demo. La tabla reemplaza esa derivación.

### 5.15 `Credenciales_Emitidas` — Registro append-only

**Propósito:** registro de credenciales Open Badges emitidas. **Sin datos personales.** Escrito **solo** por Apps Script mediante un endpoint de append nuevo.
**PK:** `id` (`CRD-…`). **FK:** `badge_id`, `mission_id`, `season_id`, `institution_id`. **Tipo:** Append-only + never exposed.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | generado | — | `CRD-…` (hoy el prefijo lo asigna `LocalRepository`) |
| `registry_no` | texto | Sí | generado | — | `ISA-<año>-<secuencia 4 dígitos>`; único global; asignado bajo `LockService` |
| `badge_id` | texto (FK) | Sí | — | — | |
| `mission_id` | texto (FK) | Sí | — | — | |
| `season_id` | texto (FK) | No | `NULL` | — | |
| `institution_id` | texto (FK) | No | `NULL` | — | Hoy el código escribe el **ID del museo** en `institutionId`; normalizar en migración (a verificar) |
| `criteria_snapshot` | texto largo | No | — | — | Copia del criterio vigente al emitir |
| `document_json` | JSON | Sí | — | — | Documento OB 3.0 **sin firmar** (sin `proof`) |
| `credential_status` | enum | Sí | `issued` | — | `issued`, `revoked` |
| `proof_status` | enum | Sí | `unsigned` | — | `unsigned`, `signed` |
| `subject` | enum | Sí | `anonymous` | — | ISA no identifica al aprendiz |
| `issued_at` | timestamp ISO UTC | Sí | ahora | — | |
| `revoked_at` | timestamp ISO UTC | No | `NULL` | — | Solo si `revoked` |
| `revocation_reason` | texto | No | `NULL` | — | Motivo técnico, sin dato personal |
| `app_version` | texto | No | — | — | Versión del sitio que emitió (contexto técnico) |

**Índices/orden:** PK `id`; único `registry_no`; único lógico (`badge_id`, `mission_id`, `subject`) para idempotencia; orden por `issued_at`.
**Append-only:** no se edita ni se borra ninguna fila. Excepción controlada: la transición `issued → revoked` sobre `credential_status`, `revoked_at` y `revocation_reason` la ejecuta **solo el endpoint**, y queda registrada en `Logs`. Cualquier otra modificación es un error de integridad.
**Quién escribe:** exclusivamente el Web App de Apps Script, con un endpoint `appendCredential` que todavía **no existe** en `docs/07` (el contrato vigente es read-only). Su creación requiere decisión y autorización; ver doc 23.
**Nunca se expone** al navegador: se agrega a `NEVER_EXPOSED` de `apps-script/Code.gs`.
**Concurrencia:** `LockService` para serializar la asignación de `registry_no`; si el lock no se obtiene, el endpoint responde error y no emite (no se inventa un número).
**Privacidad:** `subject = anonymous`; no se guardan email, nombre, IP, dispositivo ni ubicación. El registro es un contador de emisión, no una traza de personas.

### 5.16 `Propuestas` — Propuestas (futuro)

**Propósito:** propuestas de museos, reactivos, contenidos o colaboraciones. **No implementada.**
**PK:** `id` (`PROP-…`). **FK:** `institution_id` → `Instituciones.id` (nullable); `target_id` puede referenciar otra hoja. **Tipo:** futura (Editable con revisión previa de privacidad).

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | — | — | Prefijo `PROP` propuesto |
| `type` | enum | Sí | — | — | `museum`, `question`, `content`, `partnership` |
| `title_en` | texto | Sí | — | Sí | |
| `title_es` | texto | Cond. | = `title_en` | Sí | |
| `description_en` | texto largo | Sí | — | Sí | |
| `description_es` | texto largo | Cond. | = `_en` | Sí | |
| `institution_id` | texto (FK) | No | `NULL` | — | |
| `target_id` | texto | No | `NULL` | — | ID del registro propuesto a modificar, si aplica |
| `source_url` | URL | No | — | — | |
| `status` | enum | Sí | `new` | — | `new`, `review`, `accepted`, `rejected`, `archived` |
| `submitted_at` | timestamp ISO UTC | No | `NULL` | — | |
| `notes` | texto | No | — | — | |

**Privacidad:** los campos de contacto del proponente (`proposer_name`, `proposer_email`) **no se incluyen** en el esquema hasta que exista requisito, base legal y retención (regla 10 de `AGENTS.md`). Si se agregan, deben quedar fuera del endpoint público y con política de borrado. Doc 23 debe decidir si `Propuestas` se expone (hoy figura en `EXPOSED_SHEETS`).
**Estado:** futuro. No crear la hoja hasta que exista el flujo de propuestas aprobado.

### 5.17 `Metricas` — Métricas agregadas (futuro)

**Propósito:** indicadores agregados por institución y período. **No implementada.**
**PK:** `id` (`MET-…`). **FK:** `institution_id` → `Instituciones.id`. **Tipo:** futura, **generada** (nunca editada a mano), nunca expuesta.

| Columna | Tipo | Req. | Default | Bilingüe | Notas |
|---|---|---|---|---|---|
| `id` | texto | Sí | generado | — | Prefijo `MET` propuesto |
| `period` | texto | Sí | — | — | `YYYY-MM` (UTC) |
| `institution_id` | texto (FK) | No | `NULL` | — | `NULL` = agregado global |
| `metric` | enum | Sí | — | — | `accesses`, `missions_completed`, `credentials_issued`, `episodes_viewed`, `active_institutions` |
| `value` | entero | Sí | 0 | — | Solo agregados; nunca por persona |
| `unit` | texto | No | `count` | — | |
| `source` | texto | No | `logs` | — | |
| `generated_at` | timestamp ISO UTC | Sí | generado | — | |
| `notes` | texto | No | — | — | |

**Reglas:** umbral mínimo de agregación (k-anonimato) a definir con privacidad; **nunca** filas por aprendiz. No se expone al navegador (`NEVER_EXPOSED`).
**Estado:** futuro; depende de decisión de privacidad y base legal (`docs/00`).

### 5.18 Hojas adicionales del contrato vigente

Estas tres hojas no forman parte de los 17 componentes pedidos, pero ya están previstas en `docs/00`/`docs/07` y el esquema debe dejarlas explícitas para no contradecir el contrato.

| Hoja | Propósito | Estado propuesto |
|---|---|---|
| `Contenidos` | Videos, audios, imágenes, documentos y enlaces con sus derechos | Futuro; entidad nueva `CNT-…`; expuesta por `docs/07` |
| `Propiedad_Intelectual` | Autorías, licencias y autorizaciones por entidad | Futuro; nunca expuesta; `PI-…` |
| `Logs` | Registro técnico de eventos (append-only) | Futuro; nunca expuesta; `LOG-…`; sin datos personales |

Columnas mínimas sugeridas para `Contenidos`: `id`, `type` (`video`, `audio`, `image`, `document`, `link`), `title_en`, `title_es`, `url`, `duration_seconds`, `author`, `license`, `episode_id` (FK nullable), `status`.

---

## 6. Decisiones de modelado

### 6.1 La grilla 5×5 es una tabla puente, no una copia de misiones

Se modela como `Grilla_5x5` (25 filas máximo): `especialidad_id` (rol), `disciplina_id`, `mission_id` (FK opcional). La celda **referencia** la misión; no repite título, objetivo ni reactivos. Esto responde la pregunta de `docs/19` ("¿cómo se representa la grilla 5×5 sin duplicar misiones?") y elimina la derivación actual en `lib/missions.ts`.

- "Especialidad" = rol de tripulación (`Roles`), consistente con el estado real ("derivada de roles × disciplinas", `docs/19`).
- La composición de las 25 celdas puede generarse por script (producto cartesiano de roles y disciplinas publicados) y luego editarse a mano solo en `mission_id`, `order`, `notes`, `status`.
- La grilla publicada es una **vista calculada** en JSON; la tabla es la fuente editable.

### 6.2 Separación contenido vs. emitido

- **Contenido** (museos, temporadas, episodios, misiones, reactivos, insignias, roles, disciplinas, grilla, config): hojas editables, versión en git, borradores y revisión.
- **Emitido** (credenciales): hoja append-only, escrita por el endpoint, sin edición humana, sin datos personales.
- No se mezclan en la misma hoja: una credencial emitida **no** se edita para "corregir" un dato de la insignia; si la insignia cambia, las credenciales anteriores conservan `criteria_snapshot` y `document_json` de la emisión. Eso hace que la emisión sea reproducible y auditable.

### 6.3 Configuración como clave/valor tipado

Una sola hoja `Config` con `key`/`value`/`value_es`/`value_type`. Ventajas: crece sin migración de columnas, y el script puede validar por tipo. Límite: no es relacional; para parámetros con estructura (tema, flags) se usa `value_type = json` con JSON canónico validado. El código actual ya tolera claves desconocidas (`lib/data/config.ts`), lo que permite agregar claves sin romper el sitio.

### 6.4 Claves: hash sí, texto plano no

La hoja `Claves` guarda `clave_hash` (SHA-256 hex) y jamás la clave. El hash se genera con `generarHashDeClave()` (`apps-script/Code.gs`) o el generador del panel. El endpoint compara en tiempo constante y responde genérico. La clave en claro se entrega a la institución por un canal externo y no se versiona.

### 6.5 Una sola dirección para las relaciones

Cada relación se guarda en el hijo (`episode.season_id`, `mission.episode_id`, `system.compartment_id`, etc.). Las listas del padre que hoy existen en el tipo (`Museum.compartmentIds`, `Museum.episodeIds`, `Compartment.systemIds`, `Role.equipmentIds`) se tratan como **caché derivada** para la UI, recalculada por script, nunca editada a mano. Esto evita que dos filas se contradigan y cumple "una sola fuente de verdad".

### 6.6 Insignias con regla inline (por ahora)

Se mantiene `rule_type`/`rule_count`/`mission_id` en `Insignias`, igual que `Badge` en el código y que la tabla `Awards` de `docs/15`. Solo si aparecen más tipos de regla se separa una tabla `Reglas_Otorgamiento`. No se sobre-modela hoy.

### 6.7 Propuestas y métricas como tablas futuras

Se documentan con esquema y estado "futuro". **No se crean** hasta que exista: flujo de propuestas, decisión de privacidad, retención y base legal. `docs/07` ya las lista como expuestas; el esquema deja claro que `Propuestas` requeriría revisión de privacidad antes de exponerse y que `Metricas` nunca se expone.

### 6.8 Bilingüe en el modelo, no en la UI

El par `_en`/`_es` vive en la hoja. La UI decide qué mostrar con `localize()`. La falta de `_es` en contenido `published` bloquea la publicación, pero no impide guardar un borrador.

---

## 7. Reglas de integridad

### 7.1 Catálogo de reglas

| # | Regla | Dónde se aplica | Cómo se hace cumplir | Error esperado |
|---|---|---|---|---|
| 1 | `id` único por hoja y no vacío | Todas | Validación por fila del script de sync | "L<n>: id duplicado/vacío" |
| 2 | `id` inmutable una vez publicado | Todas | El script compara con export anterior; un cambio de ID se rechaza | "L<n>: el id X no puede cambiar a Y" |
| 3 | Enums cerrados | Todas | Lista de valores permitidos | "L<n>: valor 'x' no válido para <columna>" |
| 4 | FK existente | Todas las relaciones | Índice del padre cargado antes de validar el hijo | "L<n>: museum_id 'X' no existe" |
| 5 | No borrar padre con hijos | Museos, Temporadas, Episodios, Misiones, Insignias, Roles, Disciplinas | Chequeo referencial + soft delete/`archived` | "No se puede borrar: N hijos activos" |
| 6 | Bilingüe completo al publicar | Contenido | `status = published` exige `_en` y `_es` no vacíos | "L<n>: falta name_es para publicar" |
| 7 | Opciones A–D y respuesta correcta | `Reactivos` | Exactamente cuatro opciones no vacías y `correct_option_id` en A–D | "L<n>: falta option_c_en" |
| 8 | Regla de insignia coherente | `Insignias` | `mission` exige `mission_id`; `season-count` exige `rule_count >= 1` y `mission_id` vacío | "L<n>: regla incoherente" |
| 9 | Grilla 5×5 completa | `Grilla_5x5` | 25 combinaciones únicas; FK válidas; sin misiones duplicadas | "Faltan celdas" / "celda duplicada" |
| 10 | Clave única y con hash | `Claves` | Único `clave_hash`; longitud 64 hex; sin texto plano | "L<n>: hash inválido o duplicado" |
| 11 | Credenciales append-only | `Credenciales_Emitidas` | El endpoint solo agrega; `registry_no` único bajo lock; no update/delete | "conflicto de registro" |
| 12 | No secretos en la hoja | `Claves`, `Config` | Revisión + validación de patrón de claves en claro | "posible secreto en hoja" |
| 13 | Fechas ISO UTC | Todas | Parser estricto | "L<n>: fecha no ISO 8601" |
| 14 | Booleanos normalizados | Todas | Normalización a `TRUE`/`FALSE` | warning |
| 15 | Fila inválida no aborta el lote | Todas | Error por fila con línea; el resto se importa (`docs/08`/`docs/10`) | reporte de importación |
| 16 | Consistencia misión ↔ episodio | `Misiones` | `season_id` y `museum_id` deben coincidir con el episodio | "L<n>: temporada no coincide" |
| 17 | Sin datos personales en hojas expuestas | `Instituciones`, `Propuestas`, `Credenciales_Emitidas`, `Metricas` | Revisión y filtro del endpoint | a verificar con privacidad |

### 7.2 Matriz de referencias (padre → hijos)

| Padre | Hijos que lo referencian | Acción al intentar borrar |
|---|---|---|
| `Instituciones` | `Claves.institution_id`, `Museos.institution_id`, `Credenciales_Emitidas.institution_id`, `Propuestas.institution_id`, `Metricas.institution_id` | Archivar (`inactive`); nunca borrar |
| `Museos` | `Compartimentos`, `Sistemas`, `Episodios`, `Misiones`, `Reactivos` | Archivar; nunca borrar |
| `Compartimentos` | `Sistemas`, `Episodios`, `Misiones`, `Reactivos` | Archivar; nunca borrar |
| `Temporadas` | `Episodios`, `Misiones`, `Insignias`, `Credenciales_Emitidas` | Archivar; nunca borrar |
| `Episodios` | `Misiones`, `Reactivos` | Archivar; nunca borrar |
| `Misiones` | `Reactivos`, `Insignias`, `Grilla_5x5`, `Credenciales_Emitidas` | Archivar; nunca borrar |
| `Insignias` | `Credenciales_Emitidas` | Archivar; nunca borrar |
| `Roles` | `Grilla_5x5` | Archivar; nunca borrar |
| `Disciplinas` | `Grilla_5x5` | Archivar; nunca borrar |

El export público solo incluye filas con `deleted_at = NULL` y estado publicado/activo. Los hijos de ancestros archivados no se publican en cascada: cada fila tiene su propio estado.

### 7.3 Append-only de credenciales

1. La única vía de escritura es el endpoint `appendCredential` de Apps Script (a crear; el contrato actual es read-only).
2. `registry_no` se compone `ISA-<año UTC>-<secuencia de 4 dígitos>`; se calcula `max(sequence) + 1` del año bajo `LockService`; nunca se reutiliza ni se renumera.
3. Idempotencia: si ya existe una credencial con la misma terna (`badge_id`, `mission_id`, `subject`), el endpoint devuelve la existente y no agrega fila.
4. No se corrige ni se borra una fila emitida. La revocación es una transición de estado registrada en `Logs`.
5. La hoja no se expone al navegador y no se incluye en el export público del repo.
6. Si el lock o la cuota fallan, la emisión falla explícitamente (no se emite una credencial "a medias").

---

## 8. Tablas vs. vistas calculadas

### 8.1 Qué se edita a mano (hoja editable)

`Config`, `Instituciones`, `Claves` (hash generado, fila editada), `Museos`, `Compartimentos`, `Sistemas`, `Temporadas`, `Episodios`, `Misiones`, `Reactivos`, `Insignias`, `Roles`, `Disciplinas`, `Grilla_5x5` (solo celdas), y a futuro `Propuestas` y `Contenidos`.

### 8.2 Qué se genera por script (nunca a mano)

| Artefacto | Generador | Fuente | Estado |
|---|---|---|---|
| `lib/data/datasets/museums-snk-2025.json` | `scripts/sync_museums.py` | Sheet publicada de museos | **Existe** |
| `lib/data/datasets/isa-config.json` | `scripts/sync_config.py` | Tablas de configuración | **Existe** (vacío) |
| `Credenciales_Emitidas` (filas) | Apps Script `appendCredential` | Emisión desde la web | **No existe** (a crear) |
| `Logs` (filas) | Apps Script | Eventos técnicos | **No existe** |
| `Metricas` (filas) | Script de agregación (propuesto `scripts/aggregate_metrics.py`) | `Logs`/credenciales | **No existe** |
| `grilla-5x5.json` | Script de export (propuesto `scripts/export_content.py`) | `Grilla_5x5` | **No existe** |
| `manifest.json` (versión + hash por dataset) | Script de export (propuesto `scripts/content_manifest.py`) | Todos los JSON publicados | **No existe** |
| Índices de búsqueda y conteos | Script de export | Hojas publicadas | **No existe** |
| Listas derivadas (`compartment_ids`, `episode_ids`, `system_ids`, `equipment_ids`) | Script de export | FK de los hijos | **No existe** |

### 8.3 Qué es vista calculada (no hoja)

- La **grilla 5×5 publicada** (JSON) es la vista de `Grilla_5x5`.
- Las **métricas agregadas** son vistas de eventos; no se editan.
- El **contenido publicado** (`published`) es una vista filtrada de las hojas.
- Los **conteos del panel admin** (`docs/11`) son vistas de la base local, no datos.

No se proponen hojas calculadas dentro del spreadsheet: el cálculo se hace en el script de export, que es versionable y testeable.

### 8.4 Flujo de publicación propuesto (sin implementar)

```text
Google Sheet privada
   │  scripts/sync_*.py (validación por fila + hash)
   ▼
lib/data/datasets/*.json + manifest.json (versionado en git)
   │  commit automático (GitHub Actions)
   ▼
GitHub Pages (build estático)
   │  primera visita
   ▼
IndexedDB (caché local, no fuente de verdad)
```

El endpoint read-only de Apps Script queda como vía de lectura autenticada para datos institucionales; la web pública sigue leyendo el JSON versionado. Ver doc 23 para la decisión final.

---

## 9. Versionado del contenido publicado

| Elemento | Regla propuesta |
|---|---|
| Versión del dataset | Cada JSON publicado lleva `version` entero (hoy `isa-config.json` ya usa `version: 2`; `museums-snk-2025.json` es un array sin envoltorio → migrar a objeto con `version`, `generated_at`, `items`) |
| `generated_at` | Timestamp ISO UTC del export |
| `content_hash` | SHA-256 del JSON canónico (claves ordenadas) por dataset; se guarda en `manifest.json` |
| Fuente | Nombre de la hoja y, si aplica, ID de la spreadsheet **fuera del repo** (no versionar IDs sensibles; a decidir) |
| Conteos | `counts` por hoja en `manifest.json` |
| Changelog | Archivo propuesto `docs/CONTENT_CHANGELOG.md` (no existe) con fecha, versión, hojas cambiadas, autor y motivo |
| Tag de git | Propuesto `content-YYYY-MM-DD` sobre el commit del export |
| Commit automático | Si el hash no cambia, el workflow no commitea (evita ruido) |

**Reversión:** el contenido publicado se revierte con `git revert` del commit de contenido (o re-deploy de un commit anterior por GitHub Actions), porque el JSON versionado es el artefacto que consume el sitio. La Sheet no es el punto de rollback: su historial de versiones es una red de seguridad, no un mecanismo de publicación.
**Criterio de reversión propuesto:** (a) el export falla la validación; (b) el contenido publicado rompe IDs o URLs; (c) aparece un dato personal o secreto; (d) el hash no coincide con el manifiesto; (e) el build de Pages falla. En todos los casos se vuelve al último commit de contenido válido y se documenta el motivo.

---

## 10. Diccionario de IDs existentes que NO se pueden romper

Verificado en `lib/data/seed.ts` (ids reales) y `lib/data/datasets/museums-snk-2025.json`.

| Prefijo | IDs reales verificados | Hoja destino | Notas |
|---|---|---|---|
| `INS-` | `INS-LABOE` | `Instituciones` | `docs/00` sugiere `INS-001`; **discrepancia** con el seed real. No renombrar |
| `KEY-` | ninguno (seed vacío) | `Claves` | Prefijo asignado por `READABLE_ID_PREFIX` |
| `MUS-` | `MUS-U995`; dataset de 160 (`MUS-SNK-012` citado en `docs/13`) | `Museos` | IDs de filas nuevas: `MUS-<SLUG>`; nunca número de fila |
| `CMP-` | `CMP-U995-CONTROL` | `Compartimentos` | |
| `SYS-` | `SYS-U995-PERISCOPE` | `Sistemas` | |
| `SEA-` | `SEA-STEEL`, `SEA-COPPER`, `SEA-BRONZE`, `SEA-SILVER`, `SEA-GOLD` | `Temporadas` | |
| `EPI-` | `EPI-STEEL-04` | `Episodios` | `docs/00` sugiere `EPI-ACERO-04`; **discrepancia**. No renombrar |
| `MIS-` | `MIS-STEEL-04`, `MIS-COPPER-01` | `Misiones` | `docs/00` sugiere `MIS-COBRE-01`; **discrepancia** |
| `QST-` | `QST-STEEL-04-01`, `QST-COPPER-01-01` | `Reactivos` | `docs/00` sugiere `REA-TIMSS-001`; **discrepancia** |
| `BDG-` | `BDG-EXPEDITION-CREDENTIAL`, `BDG-COPPER-COIN` | `Insignias` | |
| `ROL-` | `ROL-MACHINIST`, `ROL-ELECTRICIAN`, `ROL-ELECTRONICS`, `ROL-NAVAL`, `ROL-LOGISTICS` | `Roles` | |
| `DIS-` | `DIS-SCIENCE`, `DIS-TECHNOLOGY`, `DIS-ENGINEERING`, `DIS-MATHEMATICS`, `DIS-HUMANITIES` | `Disciplinas` | |
| `CRD-` | los asigna `LocalRepository` (aleatorio) | `Credenciales_Emitidas` | Además `registry_no` `ISA-2026-0001` (formato documentado en `docs/14`; en el código real es `ISA-<año>-<seq>` con 4 dígitos) |
| `settings` | id fijo del singleton | `Config` | No es un ID prefijado; se conserva |

**Reglas de compatibilidad de URLs**

- `/museums/[id]` consume el `id` del museo: si `MUS-U995` cambia, el enlace muere. Por eso los IDs de museo son inmutables.
- `/series`, `/episodes` y `/profile` consumen temporadas/episodios/misiones/insignias por ID desde IndexedDB (poblada por `lib/data/seed.ts`); `/insignias` y la Home los consumen desde fixtures (`lib/missions.ts`, `lib/seasons.ts`). La migración debe conservar esos IDs en ambos caminos.
- El registro de credenciales usa `registry_no` como identificador público; no se renumera.
- No existe hoy tabla de alias/redirecciones; la única protección es **no cambiar IDs**. Si algún día se fusionan registros, se debe agregar una tabla de alias (futuro, no incluida).

---

## 11. Cobertura: 17 componentes → hoja → estado

| # | Componente pedido | Tabla/hoja | Estado de partida | Cobertura |
|---|---|---|---|---|
| 1 | Configuración | `Config` | Modelo `settings`; hoja no creada | ✅ |
| 2 | Instituciones | `Instituciones` | Modelo; 1 seed; hoja no creada | ✅ |
| 3 | Claves de acceso | `Claves` | Modelo; 0 registros; hoja no creada | ✅ |
| 4 | Museos | `Museos` | 160 registros vía dataset + Sheet publicada | ✅ |
| 5 | Compartimentos | `Compartimentos` | Modelo; 1 seed; hoja no creada | ✅ |
| 6 | Sistemas y equipos | `Sistemas` | Modelo; 1 seed; hoja no creada | ✅ |
| 7 | Temporadas | `Temporadas` | Modelo; 5 seed; hoja no creada | ✅ |
| 8 | Episodios | `Episodios` | Modelo; 1 seed; hoja no creada | ✅ |
| 9 | Misiones | `Misiones` | Modelo; 2 seed; hoja no creada | ✅ |
| 10 | Reactivos / preguntas | `Reactivos` | Modelo; 2 seed + 100 CSV; hoja no creada | ✅ |
| 11 | Insignias y reglas | `Insignias` (regla inline) | Modelo; 2 seed; hoja no creada | ✅ |
| 12 | Roles | `Roles` | Modelo; 5 seed; hoja no creada | ✅ |
| 13 | Disciplinas | `Disciplinas` | Modelo; 5 seed; hoja no creada | ✅ |
| 14 | Grilla 5×5 | `Grilla_5x5` | Calculada en cliente; sin tabla | ✅ |
| 15 | Credenciales emitidas | `Credenciales_Emitidas` | IndexedDB, append-only de hecho; hoja no creada | ✅ |
| 16 | Propuestas (futuro) | `Propuestas` | No existe; esquema futuro | ✅ |
| 17 | Métricas agregadas (futuro) | `Metricas` | No existe; esquema futuro | ✅ |

**Cobertura: 17/17 componentes con tabla, columnas, PK/FK, estado y quién la edita.** Las hojas adicionales del contrato (`Contenidos`, `Propiedad_Intelectual`, `Logs`) están en §5.18 y no se cuentan en los 17.

---

## 12. Hallazgos, riesgos y puntos a verificar

### 12.1 Hallazgos del estado real

1. **Dos fuentes de datos paralelas.** La Home usa `lib/seasons.ts`/`lib/missions.ts`/`lib/progress.ts`; el panel admin y el archivo usan IndexedDB. El modelo objetivo unifica ambas en la Sheet/export, pero la migración debe resolver Home primero.
2. **El panel admin no publica.** Escribe IndexedDB local por navegador; dos editores no ven los mismos cambios. La Sheet es la primera fuente compartida y el panel debe pasar a ser editor de la fuente remota o importador/validador, no la fuente.
3. **`registryNo` local no es global.** `lib/badges/registry.ts` numera con `count() + 1` sobre IndexedDB; dos navegadores pueden generar el mismo número y no hay unicidad real. El append con `LockService` corrige esto.
4. **`revokeCredential` actualiza la fila.** El registro local no es estrictamente append-only: la revocación muta `credentialStatus` y `criteriaSnapshot`. El modelo lo formaliza como transición controlada (§5.15).
5. **`CredentialRecord.institutionId` recibe el ID del museo** (`registry.ts` usa `museum?.id`), no un `INS-…`. Hay que normalizar a `Institution` en la migración (a verificar si se mantiene museo como institución).
6. **No existe FK museo ↔ institución.** `Museum` no tiene `institutionId`; `INS-LABOE` y `MUS-U995` representan el mismo lugar sin vínculo. El modelo agrega `institution_id` nullable a `Museos`.
7. **`MIS-COPPER-01` cuelga de `EPI-STEEL-04`** (episodio de Acero) aunque su `seasonId` es `SEA-COPPER`. El seed es inconsistente y el modelo agrega la regla de consistencia §7.1 #16; corregirlo requiere decisión editorial, no la tomo aquí.
8. **`isa-config.json` no se usa todavía** (secciones vacías); el sync de configuración no está conectado a URLs (`ISA_CONFIG_*_URL` sin configurar).
9. **`sync_config.py` ignora `value_es`** (solo lee `value`), aunque `docs/15` lo declara; el modelo lo corrige.
10. **El JSON de museos es un array sin `version`**, a diferencia de `isa-config.json` (`version: 2`); el versionado uniforme (§9) requiere envolverlo.
11. **`AGENTS.md` desactualizado** (§1.2); no se corrige.

### 12.2 Riesgos del esquema

| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| Límite de celdas/filas de Google Sheets | Frena el crecimiento (160 museos + 100 reactivos hoy; cientos después) | Cifras en `docs/21` (20 M celdas / 100 MB por spreadsheet y 15 GB por cuenta, verificadas el 6/11/2026); el modelo usa una fila por registro; si se supera, migrar a otro backend sin cambiar IDs (diseño agnóstico) |
| Cuota de Apps Script | Emisión de credenciales y lectura autenticada fallan | Caché de lectura (`Code.gs` ya usa `CacheService`), lock corto, reintentos; cifras y estado de verificación en `docs/21` §3.1 |
| Concurrencia de edición (1–3 editores) | Última escritura gana; filas pisadas | Una hoja por tema, campos acotados, auditoría `updated_at`, y validación de hash al publicar; no hay locking real de Sheets |
| Corrupción de datos por edición manual | Enums/IDs inválidos llegan al export | Validación por fila con línea y aborto del commit si hay errores |
| Vendor lock-in (Sheets/Apps Script) | Salida costosa | Export JSON versionado en el repo es portable; el modelo no usa fórmulas ni features propietarias |
| Privacidad | Datos personales en `Instituciones`/`Propuestas`/`Metricas` | No incluir contactos hasta decisión; métricas solo agregadas; `Credenciales` anónimas |
| IDs rotos | URLs y credenciales inválidas | IDs inmutables + diccionario §10 + validación de IDs contra export anterior |
| `registry_no` duplicado | Credenciales no verificables | `LockService` + único en hoja + idempotencia (solo en la etapa futura con emisor firmante; en el MVP el registro es local) |

### 12.3 A verificar (marcado explícito)

- Cuotas de Google Sheets y Drive: verificadas con URL en `docs/21` §3.1. Cuotas de Apps Script y AppSheet: `docs/21` las marca `(a verificar)` cuando corresponde; aquí no se duplican cifras.
- Retención del historial de versiones de Google Sheets: **a verificar**.
- Si el endpoint de append de Apps Script puede escribir con `LockService` dentro de la cuota y del tiempo máximo de ejecución: **a verificar**; el ADR (`docs/23` §3.4) no adopta ese endpoint en el MVP.
- Si la Sheet publicada de museos (hoy externa y pública) se reemplaza por la Sheet privada del proyecto o se mantiene como fuente: **decisión abierta** (§13).
- Unicidad real de `dossier` en el dataset actual (el script cae al orden de fila): **a verificar**.
- Si el volumen de 160 museos + 100 reactivos + contenido futuro entra cómodo en una Sheet: holgura amplia según `docs/21` (20 M celdas / 100 MB por spreadsheet); el riesgo real es de integridad, no de volumen.
- Política de privacidad para `contactName`/`contactEmail` de `Instituciones` y para propuestas: **a verificar / decidir**.
- Umbral de k-anonimato para `Metricas`: **a decidir**.
- Quién administra la Sheet, el Apps Script, el secreto del token y las claves: **decisión abierta** (también en `docs/00`).
- Si se versiona el ID de la spreadsheet en el repo o solo en Propiedades del script: **a decidir** (seguridad).
- Comportamiento de `localize()` con `_es` vacío en contenido publicado: hoy cae a `_en`; el modelo prohíbe publicar con `_es` vacío, lo que puede requerir ajustar la validación del importador: **a verificar**.

---

## 13. Decisiones abiertas para el usuario

1. **Fuente de museos:** ¿la Sheet pública externa de `submarinos_museo` sigue siendo fuente, o se migra a la Sheet privada ISA? (El modelo ya define `Museos` como tabla destino.)
2. **Cabeceras y contrato:** ¿se adopta el estándar `snake_case` inglés para todas las hojas (requiere actualizar `docs/07` y `Code.gs` con alias de transición), o se conservan las cabeceras españolas del contrato vigente para `Claves`/`Instituciones`?
3. **Endpoint de escritura:** ¿se autoriza agregar `appendCredential` (y eventualmente `appendLog`) al Web App, que hoy es read-only? Sin eso no hay registro global de credenciales.
4. **Panel admin:** ¿pasa a editar la fuente remota, o queda como visor/importador local y la edición se hace en la Sheet/AppSheet?
5. **Auditoría:** ¿la mantiene el script de export (propuesto) o se agrega escritura de auditoría en el endpoint?
6. **Datos personales:** ¿se eliminan `contactName`/`contactEmail` de `Instituciones` hasta tener política, o se mantienen fuera del endpoint y con retención definida?
7. **Propuestas y métricas:** ¿se crean ahora como hojas vacías o recién cuando exista flujo y decisión de privacidad?
8. **Versionado:** ¿se adopta el envoltorio `{version, generated_at, items}` para todos los datasets y el `manifest.json` con hash?
9. **Prefijos futuros:** ¿se autoriza agregar `PROP`, `MET`, `CNT`, `PI`, `LOG` a `READABLE_ID_PREFIX` cuando se implementen?

---

## 14. Verificación realizada para este documento

| Comprobación | Cómo se hizo | Resultado |
|---|---|---|
| 14 colecciones | Lectura de `lib/domain/types.ts` (`COLLECTIONS`) | Confirmado |
| 12 entidades admin | Lectura de `lib/admin/entities.ts` (`ADMIN_ENTITIES`) | Confirmado |
| 160 museos / 8 validados | Conteo del JSON `museums-snk-2025.json` | 160 / 8 |
| 100 reactivos curados | Conteo de líneas del CSV curado | 101 líneas = 100 filas + encabezado |
| Secciones vacías de config | Lectura de `isa-config.json` | `version: 2`, todas vacías |
| Hojas expuestas / nunca expuestas | Lectura de `apps-script/Code.gs` | 7 / 5; `Credenciales_Emitidas` no figura en ninguna lista |
| IDs reales | Lectura de `lib/data/seed.ts` | Diccionario §10 |
| Rutas que usan IDs persistidos | Lectura de `app/**/page.tsx`, `components/learn/*` y `components/series/*` | `/museums/[id]`, `/series`, `/episodes`, `/profile`; `/insignias` usa fixtures de `lib/missions.ts`, sin IDs de la base |
| IndexedDB como almacenamiento | Lectura de `components/app/data-provider.tsx`, `lib/data/indexeddb-storage.ts` | Confirmado |
| `registryNo` local | Lectura de `lib/badges/registry.ts` | `count()+1`, por navegador |
| Home no usa la capa de datos | Lectura de `app/page.tsx` y `grep` de imports | Home usa `lib/seasons`/`lib/missions` |
| Docs 20/21 | Glob de `docs/` + lectura de `docs/20` y `docs/21` | `docs/20` y `docs/21` existen y se leyeron (§1.3) |

**No verificado:** ejecución de la app, despliegue del endpoint, cuotas efectivas de plataformas (las cifras están en `docs/21` con su estado de verificación), comportamiento de Google Sheets con el volumen final, validez de `dossier` único, y las decisiones abiertas que dependen del usuario (`docs/23` §9).

**Limitaciones:** documento de diseño; no crea hojas, scripts ni datos; las cifras de cuota quedan a verificar; las propuestas de nombres de scripts nuevos (`scripts/export_content.py`, `scripts/content_manifest.py`, `scripts/aggregate_metrics.py`) son propuestas, no archivos existentes.

---

## 15. Referencias internas

- `docs/00_DOCUMENTO_BASE.md` §10, §12 (decisión Sheets privada + endpoint, hojas base, IDs sugeridos).
- `docs/07_ENDPOINT_APPS_SCRIPT.md` (contrato vigente, hojas expuestas, claves por hash).
- `docs/08_DATA_LAYER.md` (colecciones, adaptadores, auditoría, soft delete).
- `docs/10_IMPORT_CENTER.md` (importación por fila, unificación de duplicados).
- `docs/11_ADMIN_PANEL.md` (panel local, límites de concurrencia).
- `docs/13_SHEET_SYNC.md` (sync de museos, mapeo de columnas, IDs).
- `docs/14_OPEN_BADGES.md` (registro de credenciales, `registryNo`, `subject` anónimo).
- `docs/15_CONFIG_SHEET.md` (tablas de configuración, columnas actuales).
- `docs/19_DATA_INFRA_SESSION.md` (componentes mínimos, preguntas a responder).
