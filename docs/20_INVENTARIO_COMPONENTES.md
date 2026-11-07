# ISA · Inventario de componentes de datos

**Sesión:** S · Infraestructura de datos · entregable 1 de 4
**Fecha de verificación:** 6 de noviembre de 2026
**Commit verificado:** `3e7f53f` (2026-11-06 09:28 -03:00)
**Estado del documento:** insumo de diseño. No implementa, no decide plataforma y no propone esquema físico (eso es `docs/21`–`docs/23`).

---

## 1. Propósito y alcance

Este documento responde, para cada componente de datos del sistema ISA: **qué información existe, dónde vive hoy, qué campos reales tiene, cómo se relaciona, cuánto volumen tiene, quién lo edita hoy y quién debería editarlo en el modelo objetivo**.

Alcance:

- los 17 componentes mínimos pedidos por la sesión (14 colecciones del dominio + grilla 5×5 + 2 componentes inexistentes);
- estado actual comprobado en el repositorio y, separado, el estado objetivo declarado en `docs/00_DOCUMENTO_BASE.md`;
- infraestructura de llegada de datos (dataset versionado, JSON de configuración, IndexedDB, panel local, Apps Script de referencia).

Fuera de alcance: comparación de plataformas (`docs/21`), esquema físico de tablas (`docs/22`), decisión de arquitectura y plan de migración (`docs/23`).

### 1.1 Cómo se verificó

Se leyó el código y los datasets del commit `3e7f53f`, y se contaron los volúmenes con comandos reproducibles (§10). No se ejecutó la app ni se consultó la Sheet publicada por red: todos los volúmenes son **conteos de archivos versionados**, no del estado vivo de IndexedDB ni de la Sheet.

### 1.2 Estados usados

| Estado | Significado en este documento |
|---|---|
| **Vigente** | Comprobado en el código o en un archivo del commit verificado. |
| **Objetivo** | Dirección declarada en `docs/00_DOCUMENTO_BASE.md` o `docs/19_DATA_INFRA_SESSION.md`; no implementada. |
| **Fixture** | Dato o estructura local de demo/evaluación; no es contenido aprobado ni dato institucional. |
| **A verificar** | No se pudo comprobar en este repositorio y queda señalado explícitamente. |

### 1.3 Convenciones

- Todas las entidades heredan `EntityBase` (`lib/domain/types.ts`): `id: string`, `createdAt`/`updatedAt` (ISO), `createdBy`/`updatedBy: string`, `deletedAt: string | null` (borrado lógico). No se repiten en cada ficha.
- “Bilingüe” significa que el campo es `LocalizedText` (`{ en: string; es: string }`).
- Los prefijos de ID vienen de `READABLE_ID_PREFIX` en `lib/domain/types.ts`.
- **Editores**, códigos usados en todo el documento:

| Código | Camino de edición |
|---|---|
| **A** | Sheet publicada de museos → `scripts/sync_museums.py` → `lib/data/datasets/museums-snk-2025.json` → seed de IndexedDB. |
| **B** | Tablas CSV/Sheet de configuración → `scripts/sync_config.py` → `lib/data/datasets/isa-config.json` → `applyConfig`. **Hoy el archivo está vacío** (0 filas en todas las secciones). |
| **C** | Panel `/admin` local en el navegador (IndexedDB): CRUD genérico de 12 colecciones, `/admin/settings`, `/admin/import`, `/admin/accreditation`. Sin backend y sin cuentas. |
| **D** | Dataset TIMSS curado en `TIMSS/curated/` (CSV en el repo). No está importado a la app. |
| **E** | Nadie de forma manual: emisión automática de credenciales en el navegador al completar una misión. |
| **F** | GitHub Actions semanal (`.github/workflows/sync-museums.yml` y `sync-config.yml`) que ejecuta A y B y commitea el JSON regenerado. |

---

## 2. Resumen

- **Colecciones de dominio:** 14 en `COLLECTIONS` (`lib/domain/types.ts`): `institutions`, `accessKeys`, `museums`, `compartments`, `systems`, `seasons`, `episodes`, `missions`, `questions`, `badges`, `roles`, `disciplines`, `credentials`, `settings`. Una es singleton (`settings`, id fijo `settings`); las otras 13 son entidades CRUD.
- **CRUD genérico del panel:** 12 colecciones (`lib/admin/entities.ts`). Quedan fuera `credentials` (solo alta automática/revocación desde `/admin/accreditation`) y `settings` (pantalla propia).
- **Componentes pedidos:** 17. De ellos, **14 tienen estructura de datos hoy** (13 colecciones + settings), **1 es derivado sin tabla** (grilla 5×5) y **2 no existen** (propuestas, métricas).
- **Datasets versionados:** `museums-snk-2025.json` con **160 museos**; `isa-config.json` con **versión 2 y todas las secciones vacías**.
- **Banco TIMSS:** **100 reactivos únicos** (`ISA-KNOW-001`…`ISA-KNOW-100`) en el CSV curado, provenientes de **225 filas** de 5 CSV; **no importados** a la base local.
- **Contenido efectivo de la app:** el seed deja 5 temporadas, 5 disciplinas, 5 roles, 1 institución, 160 museos, 1 compartimento, 1 sistema, 1 episodio, 2 misiones, 2 reactivos, 2 insignias, 1 settings; **0 claves de acceso y 0 credenciales**.

### 2.1 Cantidad de “tablas” hoy

| Tipo | Cantidad | Detalle |
|---|---:|---|
| Colecciones reales en IndexedDB | 14 | 13 entidades + 1 singleton; `lib/domain/types.ts`, `lib/data/indexeddb-storage.ts` (DB `isa`, versión 2). |
| Tablas derivadas / sin almacenamiento propio | 1 | Grilla 5×5 (celdas calculadas, no persistidas). |
| Componentes inexistentes | 2 | Propuestas y métricas agregadas. |
| Datasets JSON versionados de contenido | 2 | Museos (160) y configuración (vacía). |
| Dataset curado no conectado | 1 | Reactivos TIMSS (100 IDs). |

### 2.2 Volumen actual verificado (resumen)

| Componente | Volumen | Fuente que lo prueba |
|---|---:|---|
| Configuración | 1 registro (singleton `settings`) | `SEED_SETTINGS` en `lib/data/seed.ts`; `SettingsStore` en `lib/data/repository.ts` |
| Instituciones | 1 | `SEED_INSTITUTIONS` (`INS-LABOE`) |
| Claves de acceso | 0 | `SEED_ACCESS_KEYS: AccessKey[] = []`; no están en `seedCollections()` |
| Museos | 160 | `museums-snk-2025.json` (160 filas, 160 IDs únicos) importado por `SEED_MUSEUMS` |
| Compartimentos | 1 | `SEED_COMPARTMENTS` (`CMP-U995-CONTROL`) |
| Sistemas y equipos | 1 | `SEED_SYSTEMS` (`SYS-U995-PERISCOPE`) |
| Temporadas | 5 | `SEED_SEASONS` (`SEA-STEEL`…`SEA-GOLD`) |
| Episodios | 1 | `SEED_EPISODES` (`EPI-STEEL-04`) |
| Misiones | 2 | `SEED_MISSIONS` (`MIS-STEEL-04`, `MIS-COPPER-01`) |
| Reactivos/preguntas | 2 en base local; 100 en CSV curado | `SEED_QUESTIONS`; `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv` |
| Insignias y reglas | 2 | `SEED_BADGES` (`BDG-EXPEDITION-CREDENTIAL`, `BDG-COPPER-COIN`) |
| Roles | 5 | `SEED_ROLES` (`ROL-MACHINIST`…`ROL-LOGISTICS`) |
| Disciplinas | 5 | `SEED_DISCIPLINES` (`DIS-SCIENCE`…`DIS-HUMANITIES`) |
| Grilla 5×5 | 25 celdas | `cobreMissions` en `lib/missions.ts` (5 specialties × 5 disciplines) |
| Credenciales emitidas | 0 al instalar; variable en uso | No está en `seedCollections()`; se emiten en `lib/badges/registry.ts` |
| Propuestas | 0 (no existe) | No hay colección ni tabla |
| Métricas agregadas | 0 (no existe) | No hay colección ni tabla |

### 2.3 Quién edita hoy (resumen)

| Componentes | Editor actual | Mecanismo | Observación |
|---|---|---|---|
| Museos | **A** + **F** (fuente) y **C** (local) | Sheet publicada → `sync_museums.py` → JSON → seed; panel CRUD | Primera visita siembra; un navegador ya sembrado no se re-sincroniza |
| Configuración, temporadas, episodios, misiones, reactivos, insignias | **B** (declarado, vacío) y **C** (efectivo) | `sync_config.py` → `isa-config.json` → `applyConfig`; panel CRUD | El archivo no tiene filas: el camino B no está en uso hoy |
| Instituciones, claves de acceso, compartimentos, sistemas, roles, disciplinas | **C** | CRUD `/admin/[entity]`; import CSV para instituciones | Sin fuente externa ni sync |
| Reactivos TIMSS curados | **D** | Edición manual de CSV en `TIMSS/curated/` | No conectado a la app |
| Credenciales emitidas | **E** | Emisión automática en el navegador; revocación desde `/admin/accreditation` | Sin backend ni edición manual |
| Grilla 5×5 | **E** | Edición de código en `lib/missions.ts` | No hay datos que la alimenten |
| Propuestas y métricas | nadie | — | No existen |

---

## 3. Inventario detallado por componente

### 3.1 Configuración (`settings`)

**Dónde vive hoy:** colección singleton en IndexedDB, id fijo `settings` (`SETTINGS_ID = 'settings'`, `SettingsStore` en `lib/data/repository.ts`). El seed carga `SEED_SETTINGS`; `isa-config.json` también puede aportar variables por la sección `settings` de `applyConfig`, pero hoy el archivo tiene `settings: {}`.

**Campos reales** (`Settings` en `lib/domain/types.ts`; hereda base):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `appName` | `string` | no |
| `welcomeMessage` | `LocalizedText` | sí |
| `accessScreenText` | `LocalizedText` | sí |
| `fictionNotice` | `LocalizedText` | sí |
| `theme` | `ThemeColors` (6 colores: `background`, `surface`, `primary`, `accent`, `copper`, `text`) | no |
| `defaultLanguage` | `'en' \| 'es'` | no |
| `featureFlags` | `FeatureFlags` (`enableTimer`, `enableAmbientSound`, `enableProposals`, `enableAdminPreview`) | no |
| `maxAttempts` | `number` | no |
| `timerSeconds` | `number` | no |
| `fallbackContentStatus` | `'validated' \| 'pending'` | no |

Valores del seed: `maxAttempts: 2`, `timerSeconds: 20`, `fallbackContentStatus: 'pending'`, `enableProposals: false`, `enableAdminPreview: true`, tema oscuro (`background #050B12`, `primary #00E08A`).

**Relaciones:** ninguna FK. Es configuración global consumida por la Home, el reproductor de misión y el panel.

**Volumen verificado:** 1 registro. Fuente: `SEED_SETTINGS`; `isa-config.json` con `settings` vacío (0 claves).

**Quién lo edita hoy:** **(C)** `/admin/settings` guarda el registro completo (sin validación de campos más allá del tipo). **(B)** puede sobrescribir 10 claves (`SETTINGS_MAP` en `lib/data/config.ts`), pero la tabla está vacía. **(F)** corre el sync semanal aunque sin URLs configuradas no escribe nada.

**Quién debería editarlo (objetivo):** el responsable funcional del proyecto, desde una tabla `Config` tipo clave/valor o formulario simple; el sitio solo debería leer el resultado versionado (docs/00 §12 y docs/15). Decisión final en `docs/22`/`docs/23`.

**Estado:** **Vigente** (singleton funcional) + **Objetivo** (gobierno de quién edita y versionado de cambios).

**Riesgos / deuda:**
- `applySettings` solo pisa 10 claves; `theme` y `featureFlags` no se pueden configurar desde la tabla.
- El guardado del panel reemplaza el registro completo y no valida contenidos.
- No hay historial de cambios ni “versión publicada” de la configuración.

---

### 3.2 Instituciones (`institutions`)

**Dónde vive hoy:** colección `institutions` (IndexedDB), seed `SEED_INSTITUTIONS`.

**Campos reales** (`Institution`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `type` | `'museum' \| 'association' \| 'partner' \| 'school' \| 'other'` | no |
| `country` | `string` | no |
| `city` | `string` | no |
| `website` | `string` | no |
| `contactName` | `string` | no |
| `contactEmail` | `string` | no |
| `status` | `'active' \| 'inactive'` | no |
| `notes` | `string` | no |

**Relaciones:** `AccessKey.institutionId` → `Institution.id` (1:N, 0 filas hoy). `CredentialRecord.institutionId` **no** apunta a esta colección: `lib/badges/registry.ts` guarda ahí `museum.id`. No existe FK `Museum.institutionId`.

**Volumen verificado:** **1** (`INS-LABOE`, tipo `museum`, Laboe/Alemania). Fuente: `SEED_INSTITUTIONS`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/institutions` e importación CSV (spec `INSTITUTION_IMPORT` en `lib/import/schemas.ts`). Es la única vía; no hay consumidor en la UI pública.

**Quién debería editarlo (objetivo):** el equipo de alianzas/administración desde una tabla `Instituciones` con clave estable; la web debería usarla como emisora de credenciales y para métricas agregadas (docs/00 §10 y §12). A decidir en `docs/22`.

**Estado:** **Vigente** (estructura y CRUD) + **Objetivo** (vínculo real con museos, claves y credenciales).

**Riesgos / deuda:**
- **No hay relación institución ↔ museo**: 160 museos y 1 institución conviven sin FK. Esto bloquea métricas por institución y credenciales con emisor correcto.
- El campo `CredentialRecord.institutionId` guarda un museo, no una institución: nombre engañoso y datos no comparables.
- Las credenciales usan el museo como `issuer` (docs/14 §2); falta decidir si el emisor será la institución, el museo o ISA.
- Sin datos de contacto cargados en el seed (`contactName` y `contactEmail` vacíos).

---

### 3.3 Claves de acceso (`accessKeys`)

**Dónde vive hoy:** colección `accessKeys` (IndexedDB), **sin seed**. En paralelo existe un mecanismo distinto: el gate cliente `components/series/access-gate.tsx` compara un código de evaluación (`NEXT_PUBLIC_ISA_EVALUATION_CODE`, fallback `ISA-DEMO`) y el Apps Script de referencia valida claves contra una hoja privada `Claves` (docs/07), todavía **no desplegado**.

**Campos reales** (`AccessKey`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `institutionId` | `string` (FK a `institutions`) | no |
| `label` | `string` (etiqueta legible, nunca la clave) | no |
| `keyHash` | `string` (SHA-256; la clave plana no se guarda) | no |
| `status` | `'active' \| 'suspended' \| 'revoked'` | no |
| `validFrom` | `string \| null` (ISO) | no |
| `validUntil` | `string \| null` (ISO) | no |
| `scope` | `'mvp' \| 'pilot' \| 'demo' \| 'internal'` | no |
| `notes` | `string` | no |

**Relaciones:** `institutionId` → `institutions.id` (N:1). No hay consumidor que valide una clave contra esta colección.

**Volumen verificado:** **0**. Fuente: `SEED_ACCESS_KEYS` es `[]` y `accessKeys` no figura en `seedCollections()`; `/admin/accessKeys` existe pero arranca vacío.

**Quién lo edita hoy:** **(C)** CRUD `/admin/accessKeys` (hash pegado a mano; no hay generador de claves, docs/11 §7). **(E)** nadie valida esas claves en la web: el gate usa el código de evaluación y el endpoint no está conectado.

**Quién debería editarlo (objetivo):** administración del proyecto, con alta/rotación/suspensión controlada y verificación del lado del servicio (Apps Script read-only o el backend que se decida). La clave plana nunca debería vivir en la Sheet ni en el repo (docs/00 §10 y §12).

**Estado:** **Vigente** (estructura y CRUD) + **Objetivo** (verificación real server-side; el gate cliente es un filtro de evaluación, no seguridad).

**Riesgos / deuda:**
- Tres mecanismos conviven: colección local sin uso, gate cliente con código en el bundle y hoja `Claves` del Apps Script sin desplegar.
- No hay generador de hash en el panel; el operador debe generarlo aparte.
- No hay rate limiting ni auditoría de intentos.
- `scope`, `validFrom` y `validUntil` no se aplican en ninguna validación hoy.

---

### 3.4 Museos (`museums`)

**Dónde vive hoy:** colección `museums` (IndexedDB). El seed **no** contiene un museo hardcodeado: importa los **160 registros** de `lib/data/datasets/museums-snk-2025.json` (generado desde la Sheet publicada de Submarinos Museos por `scripts/sync_museums.py`).

**Campos reales** (`Museum`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` (nombre del submarino) | sí |
| `museumName` | `LocalizedText` (museo que lo aloja) | sí |
| `country` | `string` | no |
| `city` | `string` | no |
| `website` | `string` | no |
| `vesselType` | `string` | no |
| `propulsion` | `string` | no |
| `origin` | `string` | no |
| `description` | `LocalizedText` | sí |
| `compartmentIds` | `string[]` (FK a `compartments`) | no |
| `episodeIds` | `string[]` (FK a `episodes`) | no |
| `status` | `'draft' \| 'review' \| 'published' \| 'archived'` | no |
| `source` | `string` | no |
| `notes` | `string` | no |
| `latitude` | `number \| null` | no |
| `longitude` | `number \| null` | no |
| `launchYear` | `number \| null` | no |
| `address` | `string` | no |
| `mediaUrl` | `string` | no |
| `validation` | `'validated' \| 'pending'` | no |
| `dossier` | `string` (`SNK-011`, …) | no |
| `situation` | `string` (`flote`, `agua`, `tierra`, `cerrado`, `monumento`) | no |
| `featured` | `boolean` | no |

**Relaciones:** `compartments.museumId`, `systems.museumId`, `episodes.museumId`, `missions.museumId`, `questions.museumId` → `museums.id`. Además `compartmentIds[]` y `episodeIds[]` son referencias inversas denormalizadas, pobladas solo para `MUS-U995` en el seed.

**Volumen verificado:** **160** registros, **160 IDs únicos**. 159 con prefijo `MUS-SNK-###` + 1 `MUS-U995`. 35 países. 8 `validation: validated` y 152 `pending`; 8 `featured`; 160 con latitud/longitud y `dossier`; 65 sin `launchYear`; 20 con `website`; 27 con `mediaUrl`; `situation` vacía en 140, `agua` 9, `tierra` 11. Fuente: conteo directo de `museums-snk-2025.json` (ver §10).

**Quién lo edita hoy:** **(A)+(F)** Sheet publicada → script semanal → JSON versionado → seed (solo en la primera visita a un navegador vacío). **(C)** CRUD local `/admin/museums` y export CSV. **(C)** Import Center acepta un CSV de museos (`MUSEUM_IMPORT`). El sitio no consulta la Sheet en runtime.

**Quién debería editarlo (objetivo):** el equipo de archivo/museos en la fuente editorial (Sheet publicada o tabla equivalente), con el dataset regenerado por script y versionado; el panel local queda como vista de trabajo, no como fuente de verdad (docs/13).

**Estado:** **Vigente** para 160 fichas importadas; **Fixture/demo** para la ficha `MUS-U995` en la medida en que alimenta la demo; **A verificar** el estado editorial real de cada ficha (152 en `pending`).

**Riesgos / deuda:**
- La Sheet es **fuente de un export versionado**, no un backend: los cambios no llegan solos al navegador ya sembrado (el seed corre una vez; el panel no re-sincroniza).
- `compartmentIds` y `episodeIds` no se editan desde `/admin/museums` (no están en `lib/admin/entities.ts`), así que las referencias inversas solo existen para `MUS-U995`.
- Renombres y bajas de la Sheet no se reconcilian automáticamente (docs/13 §7); una fila eliminada deja el registro viejo en la base.
- 152 fichas con `validation: pending` conviven con 8 validadas; la UI debe seguir mostrando el aviso.
- El seed no contiene un museo hardcodeado: importa los 160 del dataset. Cualquier ajuste a una ficha en el panel es local y se pierde si se resiembra el navegador.

---

### 3.5 Compartimentos (`compartments`)

**Dónde vive hoy:** colección `compartments` (IndexedDB), seed `SEED_COMPARTMENTS`.

**Campos reales** (`Compartment`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `museumId` | `string` (FK a `museums`) | no |
| `description` | `LocalizedText` | sí |
| `systemIds` | `string[]` (FK a `systems`) | no |
| `status` | `'draft' \| 'review' \| 'published' \| 'archived'` | no |

**Relaciones:** `museumId` → `museums.id` (N:1); `systems.compartmentId` → `compartments.id` (1:N); `episodes.compartmentId`, `missions.compartmentId`, `questions.compartmentId` → `compartments.id`; `systemIds[]` es el inverso denormalizado.

**Volumen verificado:** **1** (`CMP-U995-CONTROL`, “Control Room”, museo `MUS-U995`, `systemIds: ['SYS-U995-PERISCOPE']`, descripción = “Información a validar.”). Fuente: `SEED_COMPARTMENTS`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/compartments`. No hay sección de configuración ni sync para compartimentos.

**Quién debería editarlo (objetivo):** el equipo de contenido/archivo, junto con sistemas; en el modelo objetivo debería existir como tabla propia con FK a museo y validación de integridad (docs/19 §3).

**Estado:** **Vigente** (estructura) pero **Fixture** (un solo compartimento, descripción pendiente).

**Riesgos / deuda:**
- `systemIds[]` y `systems.compartmentId` duplican la relación y no se mantienen sincronizados al editar desde el panel.
- No hay validación de que `museumId` exista.
- Un solo compartimento para 160 museos: el catálogo de compartimentos está prácticamente vacío.

---

### 3.6 Sistemas y equipos (`systems`)

**Dónde vive hoy:** colección `systems` (IndexedDB), seed `SEED_SYSTEMS`. El tipo se llama `SubmarineSystem`.

**Campos reales** (`SubmarineSystem`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `category` | `string` | no |
| `description` | `LocalizedText` | sí |
| `compartmentId` | `string` (FK a `compartments`) | no |
| `museumId` | `string` (FK a `museums`) | no |
| `topics` | `string[]` | no |
| `status` | `'draft' \| 'review' \| 'published' \| 'archived'` | no |

**Relaciones:** `compartmentId` → `compartments.id`; `museumId` → `museums.id`; referenciado por `episodes.equipmentId`, `missions.equipmentId`, `questions.equipmentId` y `roles.equipmentIds[]`.

**Volumen verificado:** **1** (`SYS-U995-PERISCOPE`, “Periscope”, categoría `Observation`, topics `Optics`, `Reflection`, `Observation`). Fuente: `SEED_SYSTEMS`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/systems` (el formulario lo rotula “Systems”, singular “System”).

**Quién debería editarlo (objetivo):** contenido técnico/archivo, con tabla propia y FK validadas a compartimento y museo.

**Estado:** **Vigente** (estructura) pero **Fixture** (un solo sistema).

**Riesgos / deuda:**
- `equipmentId` en episodios/misiones/preguntas no tiene validación de existencia.
- `topics` es texto libre sin catálogo.
- El nombre `SubmarineSystem` y la colección `systems` conviven con el campo `equipmentId`: mismo concepto con dos nombres.

---

### 3.7 Temporadas (`seasons`)

**Dónde vive hoy:** colección `seasons` (IndexedDB), seed `SEED_SEASONS`.

**Campos reales** (`Season`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `'steel' \| 'copper' \| 'bronze' \| 'silver' \| 'gold'` | no |
| `title` | `LocalizedText` | sí |
| `description` | `LocalizedText` | sí |
| `order` | `number` | no |
| `colorTheme` | `string` | no |
| `timssDomain` | `'knowing' \| 'applying' \| 'reasoning' \| 'integrated'` | no |
| `gsaEmphasis` | `LocalizedText` | sí |
| `status` | `'draft' \| 'published' \| 'archived'` | no |

**Relaciones:** `episodes.seasonId`, `missions.seasonId`, `badges.seasonId`, `credentials.seasonId` → `seasons.id` (1:N). También se usa para derivar la grilla 5×5 (indirectamente, vía fixtures de la Home).

**Volumen verificado:** **5** (`SEA-STEEL`, `SEA-COPPER`, `SEA-BRONZE`, `SEA-SILVER`, `SEA-GOLD`; órdenes 1–5; dominios `knowing`, `knowing`, `applying`, `reasoning`, `integrated`). Fuente: `SEED_SEASONS`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/seasons`. **(B)** la sección `seasons` de `applyConfig` puede crear/actualizar temporadas, pero `isa-config.json` está vacío.

**Quién debería editarlo (objetivo):** diseño curricular/producto, idealmente en la tabla de configuración versionada; no debería cambiarse desde un navegador suelto (docs/15 §1.1).

**Estado:** **Vigente** (catálogo completo) + **Objetivo** (gobierno centralizado y versionado).

**Riesgos / deuda:**
- El seed ya está completo; las temporadas futuras (Bronce, Plata, Oro) están publicadas pero sin episodios/misiones.
- `timssDomain` y `gsaEmphasis` son afirmaciones curriculares: hoy son propuesta, no validación (docs/00 §9).
- **Dos lectores distintos del color:** `/series` y `/episodes` usan `season.colorTheme` de IndexedDB (`components/learn/series-view.tsx`, `mission-view.tsx`); la Home lee `seasonsConfig()` directamente de `isa-config.json` (`components/series/accreditation-path.tsx`), archivo que está vacío y cae al color por defecto. Cambiar una temporada en el panel no cambia la Home, y editar la tabla de configuración no actualiza la colección salvo que se aplique `applyConfig`.

---

### 3.8 Episodios (`episodes`)

**Dónde vive hoy:** colección `episodes` (IndexedDB), seed `SEED_EPISODES`.

**Campos reales** (`Episode`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `title` | `LocalizedText` | sí |
| `seasonId` | `string` (FK a `seasons`) | no |
| `museumId` | `string` (FK a `museums`) | no |
| `compartmentId` | `string` (FK a `compartments`) | no |
| `equipmentId` | `string` (FK a `systems`) | no |
| `mediaUrl` | `string` | no |
| `durationSeconds` | `number \| null` | no |
| `description` | `LocalizedText` | sí |
| `narrative` | `LocalizedText` | sí |
| `status` | `'draft' \| 'review' \| 'published' \| 'archived'` | no |
| `order` | `number` | no |

**Relaciones:** N:1 con temporada, museo, compartimento y sistema; `missions.episodeId` y `questions.episodeId` → `episodes.id`; `museums.episodeIds[]` es el inverso denormalizado.

**Volumen verificado:** **1** (`EPI-STEEL-04`, “Steel 04 — Submarine Command”, temporada `SEA-STEEL`, museo `MUS-U995`, compartimento `CMP-U995-CONTROL`, equipo `SYS-U995-PERISCOPE`, `durationSeconds: null`, `mediaUrl: ''`, `order: 1`, `status: published`). Fuente: `SEED_EPISODES`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/episodes`. **(B)** sección `episodes` de `applyConfig` (vacía). Además la Home usa `lib/seasons.ts` (fixtures) en paralelo.

**Quién debería editarlo (objetivo):** producción de contenido en la fuente editorial versionada; el episodio debería ser la unidad de publicación y reversión.

**Estado:** **Vigente** (estructura) + **Fixture** (1 de 1; el contenido es de demo/evaluación).

**Riesgos / deuda:**
- **Dos universos de episodios:** el de IndexedDB (1 episodio) y el de `lib/seasons.ts` (fixtures de la Home). No están unificados.
- IDs de docs/00 (`EPI-ACERO-04`) no coinciden con el ID real (`EPI-STEEL-04`).
- `durationSeconds` y `mediaUrl` vacíos; no hay validación de URL.

---

### 3.9 Misiones (`missions`)

**Dónde vive hoy:** colección `missions` (IndexedDB), seed `SEED_MISSIONS`.

**Campos reales** (`Mission`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `title` | `LocalizedText` | sí |
| `episodeId` | `string` (FK a `episodes`) | no |
| `seasonId` | `string` (FK a `seasons`) | no |
| `museumId` | `string` (FK a `museums`) | no |
| `compartmentId` | `string` (FK a `compartments`) | no |
| `equipmentId` | `string` (FK a `systems`) | no |
| `description` | `LocalizedText` | sí |
| `learningObjective` | `LocalizedText` | sí |
| `timssDomain` | `'knowing' \| 'applying' \| 'reasoning' \| 'integrated'` | no |
| `gsaCompetency` | `string` | no |
| `civilSocietyConnection` | `LocalizedText` | sí |
| `status` | `'draft' \| 'review' \| 'published' \| 'archived'` | no |
| `order` | `number` | no |

**Relaciones:** N:1 con episodio, temporada, museo, compartimento y sistema; `questions.missionId`, `badges.missionId`, `credentials.missionId` → `missions.id`.

**Volumen verificado:** **2** (`MIS-STEEL-04`, `MIS-COPPER-01`). Fuente: `SEED_MISSIONS`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/missions`. **(B)** sección `missions` de `applyConfig` (vacía). En paralelo, `lib/missions.ts` define 6 misiones Acero (`aceroMissions`) y 25 Cobre (`cobreMissions`) como fixtures de la Home y de la grilla.

**Quién debería editarlo (objetivo):** contenido educativo, con IDs estables y FK validadas; la misión no debería duplicarse entre fixture y base.

**Estado:** **Vigente** (estructura) + **Fixture** (2 misiones; las 31 de `lib/missions.ts` son demo).

**Riesgos / deuda:**
- **Inconsistencia real:** `MIS-COPPER-01` tiene `seasonId: 'SEA-COPPER'` y `episodeId: 'EPI-STEEL-04'`, cuyo `seasonId` es `SEA-STEEL`. La relación episodio→temporada no se valida.
- Dos fuentes de misiones (IndexedDB y `lib/missions.ts`) con 31 misiones ficticias frente a 2 reales.
- `gsaCompetency` y `civilSocietyConnection` son texto libre; `civilSocietyConnection` está vacío en `MIS-STEEL-04`.

---

### 3.10 Reactivos / preguntas (`questions`)

**Dónde vive hoy:** colección `questions` (IndexedDB), seed `SEED_QUESTIONS`; y un banco curado separado en `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv` que **no está importado** a la app.

**Campos reales** (`Question`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `missionId` | `string` (FK a `missions`) | no |
| `episodeId` | `string` (FK a `episodes`) | no |
| `museumId` | `string` (FK a `museums`) | no |
| `compartmentId` | `string` (FK a `compartments`) | no |
| `equipmentId` | `string` (FK a `systems`) | no |
| `area` | `string` | no |
| `timssDomain` | `'knowing' \| 'applying' \| 'reasoning' \| 'integrated'` | no |
| `gsaCompetency` | `string` | no |
| `topic` | `string` | no |
| `level` | `string` | no |
| `text` | `LocalizedText` | sí |
| `options` | `QuestionOption[]` (`{ id: 'A'\|'B'\|'C'\|'D'; text: LocalizedText }`) | sí |
| `correctOptionId` | `'A' \| 'B' \| 'C' \| 'D'` | no |
| `feedback` | `LocalizedText` | sí |
| `civilSocietyConnection` | `LocalizedText` | sí |
| `source` | `string` | no |
| `status` | `'idea' \| 'proposal' \| 'review' \| 'validated' \| 'published' \| 'archived'` | no |
| `notes` | `string` | no |

**Relaciones:** N:1 con misión, episodio, museo, compartimento y sistema (todas como ID suelto). Un reactivo puede existir sin misión en el modelo, pero la UI de misión busca por `missionId`.

**Volumen verificado:**
- **2** reactivos en el seed (`QST-STEEL-04-01` y `QST-COPPER-01-01`), ambos `status: 'review'`, con 4 opciones A–D cada uno; los IDs `A`–`D` vistos en el seed son IDs de opción, no registros. Fuente: `SEED_QUESTIONS`.
- **100** reactivos únicos en el CSV curado (`ISA-KNOW-001`…`ISA-KNOW-100`, 100 filas de datos, 100 IDs únicos, sin duplicados), consolidados de **225** filas de 5 CSV. Todos `Estado sugerido: Propuesta` y `curation_status: curated_pending_human_review`; flags de QA: `OPERATIONAL_CONTEXT_REVIEW` en 12 filas, `EDITORIAL_ABSOLUTE_CLAIM_REVIEW` en 4, `EDITORIAL_PLACEHOLDER_REVIEW` en 3, 83 sin flags (algunas filas acumulan más de un flag). Fuente: `reactivos_timss_isa_knowing_curated.csv` y `reactivos_timss_isa_knowing_manifest.csv` (225 filas).
- **Import Center:** acepta CSV de preguntas (`QUESTION_IMPORT`) con mapeo de columnas, pero el CSV curado usa encabezados en español y no se importó.

**Quién lo edita hoy:** **(C)** CRUD `/admin/questions` e Import Center. **(B)** sección `questions` de `applyConfig` (vacía). **(D)** el banco TIMSS se cura a mano en archivos dentro de `TIMSS/curated/`, sin conexión con la base.

**Quién debería editarlo (objetivo):** equipo educativo/editorial con revisión humana; el banco curado debería ser la fuente del banco publicado, con estados editoriales explícitos (docs/00 §9, docs/19). El detalle de tabla queda para `docs/22`.

**Estado:** **Vigente** (2 reactivos en base, `review`) + **Fixture** (los 2 del seed provienen de la especificación piloto) + **A verificar** los 100 curados (pendientes de revisión humana).

**Riesgos / deuda:**
- **El banco TIMSS no está conectado:** 100 reactivos curados no llegan a la app; la base local tiene 2.
- El seed usa `status: 'review'`, pero `mission-view.tsx` elige el reactivo con fallback aunque no esté `published`.
- `civilSocietyConnection` está vacío en `QST-STEEL-04-01`.
- Los encabezados del CSV curado no coinciden 1:1 con `QUESTION_IMPORT` (requiere mapeo manual).

---

### 3.11 Insignias y reglas de otorgamiento (`badges`)

**Dónde vive hoy:** colección `badges` (IndexedDB), seed `SEED_BADGES`; reglas en `Badge.ruleType`/`Badge.ruleCount`; motor en `lib/badges/rules.ts`.

**Campos reales** (`Badge`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `type` | `'credential' \| 'coin' \| 'badge'` | no |
| `seasonId` | `string` (FK a `seasons`) | no |
| `missionId` | `string` (FK a `missions`; vacío en reglas de temporada) | no |
| `description` | `LocalizedText` | sí |
| `icon` | `string` | no |
| `color` | `string` | no |
| `criteria` | `LocalizedText` | sí |
| `status` | `'draft' \| 'published' \| 'archived'` | no |
| `ruleType` | `'mission' \| 'season-count'` | no |
| `ruleCount` | `number` (misiones requeridas en `season-count`) | no |

**Relaciones:** `seasonId` → `seasons.id`; `missionId` → `missions.id`; `credentials.badgeId` → `badges.id`.

**Volumen verificado:** **2** (`BDG-EXPEDITION-CREDENTIAL`, tipo `credential`, regla `mission`, `MIS-STEEL-04`; `BDG-COPPER-COIN`, tipo `coin`, regla `mission`, `MIS-COPPER-01`). Fuente: `SEED_BADGES`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/badges`. **(B)** la sección `awards` de `applyConfig`: actualiza solo `ruleType`, `ruleCount`, `seasonId`, `missionId` y `status` de insignias existentes, o crea insignias nuevas; **no actualiza nombre, descripción, color ni criterios** de una insignia existente. La tabla está vacía.

**Quién debería editarlo (objetivo):** contenido/acreditaciones en una tabla `Awards` con `badge_id` estable y reglas versionadas (docs/15 §1); el motor de otorgamiento no debería depender de fixtures.

**Estado:** **Vigente** (estructura, motor y reglas) + **Fixture** (dos insignias de demo).

**Riesgos / deuda:**
- El motor evalúa todas las insignias `published` en cada respuesta correcta y cuenta misiones de la temporada **sin filtrar por estado** (`lib/badges/rules.ts`), lo que puede contar misiones en borrador.
- `applyAwards` no sincroniza textos ni color de insignias existentes: la tabla no es fuente completa.
- No hay validación de que `ruleCount` sea alcanzable (el panel lo advierte visualmente, pero no lo bloquea).
- No existen reglas de temporada en el seed: `season-count` está implementado pero sin datos.

---

### 3.12 Roles (`roles`)

**Dónde vive hoy:** colección `roles` (IndexedDB), seed `SEED_ROLES`. **No alimenta la grilla 5×5** (ver 3.14).

**Campos reales** (`Role`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `description` | `LocalizedText` | sí |
| `equipmentIds` | `string[]` (FK a `systems`) | no |
| `status` | `'draft' \| 'published' \| 'archived'` | no |

**Relaciones:** `equipmentIds[]` → `systems.id` (N:N sin tabla puente, como array). No hay FK desde misiones/preguntas hacia `roles`.

**Volumen verificado:** **5** (`ROL-MACHINIST`, `ROL-ELECTRICIAN`, `ROL-ELECTRONICS`, `ROL-NAVAL`, `ROL-LOGISTICS`). Solo `ROL-ELECTRONICS` tiene `equipmentIds: ['SYS-U995-PERISCOPE']`; el resto, `[]`. Fuente: `SEED_ROLES`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/roles`. No hay otro consumidor.

**Quién debería editarlo (objetivo):** diseño curricular, si el rol pasa a ser una dimensión real de la grilla y de las misiones; a decidir en `docs/22` (hoy es una colección sin uso).

**Estado:** **Vigente** (estructura) + **Fixture** (catálogo de 5 roles sin uso funcional).

**Riesgos / deuda:**
- Colección huérfana: nadie la lee fuera del panel.
- La grilla 5×5 usa constantes `SPECIALTIES` de `lib/missions.ts`, no esta colección; los nombres ni siquiera coinciden (`Electronics Technician` vs `Electrónico`).
- `equipmentIds` es un array sin tabla puente ni validación.

---

### 3.13 Disciplinas (`disciplines`)

**Dónde vive hoy:** colección `disciplines` (IndexedDB), seed `SEED_DISCIPLINES`. **No alimenta la grilla 5×5** (ver 3.14).

**Campos reales** (`Discipline`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `name` | `LocalizedText` | sí |
| `description` | `LocalizedText` | sí |
| `color` | `string` | no |
| `status` | `'draft' \| 'published' \| 'archived'` | no |

**Relaciones:** ninguna FK. No hay campo `disciplineId` en misiones, preguntas ni episodios.

**Volumen verificado:** **5** (`DIS-SCIENCE`, `DIS-TECHNOLOGY`, `DIS-ENGINEERING`, `DIS-MATHEMATICS`, `DIS-HUMANITIES`). Fuente: `SEED_DISCIPLINES`.

**Quién lo edita hoy:** **(C)** CRUD `/admin/disciplines`. No hay otro consumidor.

**Quién debería editarlo (objetivo):** diseño curricular, si la disciplina pasa a ser una dimensión real del contenido. A decidir en `docs/22`.

**Estado:** **Vigente** (estructura) + **Fixture** (catálogo sin uso funcional).

**Riesgos / deuda:**
- Colección huérfana, igual que roles.
- No existe relación pregunta/misión ↔ disciplina: el vínculo curricular hoy vive en `area`, `topic` y `level` como texto libre.
- La grilla muestra disciplinas desde `DISCIPLINES` de `lib/missions.ts` (con otros colores: `#14b4f0`, etc.), no desde esta colección (que usa `#4CAF93`, etc.).

---

### 3.14 Grilla 5×5 (derivada)

**Dónde vive hoy:** **no existe como tabla ni colección**. La grilla visible en `/insignias` se calcula en `components/insignias/badge-matrix.tsx` a partir de `SPECIALTIES` (5) y `DISCIPLINES` (5) definidas como constantes en `lib/missions.ts`, cruzadas con `cobreMissions`, que se construye con `SPECIALTIES.flatMap(... DISCIPLINES.map(...))` = **25 misiones ficticias** (`CU-A1`…`CU-E5`). Es un **fixture de la demo**, no el modelo de datos.

**Campos reales:** no aplica (no hay entidad). La celda se compone en runtime de: especialidad (string de `SPECIALTIES`), disciplina (string de `DISCIPLINES`), `mission.id` (ej. `cobre-7`), `mission.code` (ej. `CU-B2`), estado `'locked' | 'available' | 'completed'` (derivado de `COBRE_COMPLETED`/`COBRE_AVAILABLE` hardcodeados), y una insignia visual (`MissionBadge`).

**Relaciones:** ninguna FK real. En el discurso del producto la grilla relaciona roles/especialidades × disciplinas; en el código relaciona dos constantes y una misión fixture. Las colecciones `roles` y `disciplines` **no se leen**.

**Volumen verificado:** **25 celdas** (5×5). Distribución de estados en el fixture: 5 `completed` (índices 0, 1, 6, 7, 12), 6 `available` (2, 5, 8, 11, 13, 18) y 14 `locked`. Fuente: `lib/missions.ts` y `badge-matrix.tsx`.

**Quién lo edita hoy:** **(E)** nadie desde datos: se edita cambiando código (`lib/missions.ts`). No hay importación ni tabla.

**Quién debería editarlo (objetivo):** derivarse de roles × disciplinas (o de la dimensión curricular que se decida) **sin duplicar misiones** (docs/19 §1). La decisión de cómo representarla está explícitamente abierta para `docs/22`; este documento solo registra que hoy no hay tabla.

**Estado:** **Fixture** (demo) + **Objetivo** (sin decisión de representación).

**Riesgos / deuda:**
- Los nombres de especialidades usados por la grilla (`Maquinista`, `Electricista`, `Electrónico`, `Naval`, `Logístico`) no coinciden con los roles de la colección (`Machinist`, `Electrician`, `Electronics Technician`, `Naval Officer`, `Logistics`).
- Los colores de disciplina también difieren entre `lib/missions.ts` y `SEED_DISCIPLINES`.
- Si el modelo objetivo exige “una misión por celda”, hoy no hay ninguna relación persistida entre misión y celda.

---

### 3.15 Credenciales emitidas (`credentials`)

**Dónde vive hoy:** colección `credentials` (IndexedDB), escrita por `lib/badges/registry.ts` en el navegador del aprendiz. **No** está en `seedCollections()` (arranca en 0), no está en el CRUD genérico de `/admin` y no tiene backend. La pantalla `/profile` lista las credenciales locales y `/admin/accreditation` permite revocarlas y exportar un bundle.

**Campos reales** (`CredentialRecord`):

| Campo | Tipo | Bilingüe |
|---|---|---|
| `badgeId` | `string` (FK lógica a `badges`) | no |
| `missionId` | `string` (FK lógica a `missions`) | no |
| `seasonId` | `string` (FK lógica a `seasons`) | no |
| `institutionId` | `string` (en la práctica, `museum.id`; ver 3.2) | no |
| `registryNo` | `string` (`ISA-<año>-<secuencia>`) | no |
| `criteriaSnapshot` | `string` (criterio al emitir; se sobrescribe al revocar) | no |
| `document` | `Record<string, unknown>` (documento Open Badges 3.0 sin firmar) | no |
| `credentialStatus` | `'issued' \| 'revoked'` | no |
| `proofStatus` | `'unsigned' \| 'signed'` | no |
| `subject` | `'anonymous'` (ISA no recoge datos personales) | no |

**Relaciones:** referencias lógicas a insignia, misión, temporada y museo/institución. La emisión se dispara desde `components/learn/mission-view.tsx` → `evaluateAwards` → `issueCredential`; se evita duplicar por combinación `badgeId + missionId + estado issued`.

**Volumen verificado:** **0** al instalar (no hay seed de credenciales). En uso, el volumen es variable y local a cada navegador; no hay cifra agregada posible sin backend. Fuente: ausencia en `seedCollections()`; `COLLECTIONS` incluye `credentials`.

**Quién lo edita hoy:** **(E)** nadie manualmente: se emiten solas al completar una misión. **(C)** el panel solo permite **revocar** (no editar ni borrar). El export de bundle es manual.

**Quién debería editarlo (objetivo):** nadie de forma manual; el registro debe ser append-only, con revocación como estado (no borrado), y una eventual firma/estatus a cargo de un servicio emisor (docs/14 §4). Dónde persiste ese registro es una decisión de `docs/22`/`docs/23`.

**Estado:** **Vigente** (emisión, numeración, revocación y export local) + **Objetivo** (firma, hosting de issuer, status list, identidad del destinatario).

**Riesgos / deuda:**
- **No es append-only estricto:** `revokeCredential` reescribe `credentialStatus` y **sobrescribe `criteriaSnapshot` con el motivo de revocación**, perdiendo el criterio original.
- El registro vive en el IndexedDB de cada aprendiz: se pierde al limpiar el navegador o cambiar de dispositivo. No hay registro central.
- `registryNo` se calcula con `count + 1`; ante borrados o concurrencia de pestañas podría repetirse (no hay secuencia persistente).
- La credencial no está firmada (`proofStatus: 'unsigned'`) ni hosteada; el `issuer` se deriva del origen del sitio.
- No hay forma de consultar una credencial desde otro dispositivo ni de verificar el registro.

---

### 3.16 Propuestas (no existe)

**Dónde vive hoy:** **no existe** como colección, tabla ni formulario. Rastros parciales:
- `FeatureFlags.enableProposals: false` en `Settings` (bandera apagada).
- El Apps Script declara una hoja `Propuestas` entre las `EXPOSED_SHEETS` (`apps-script/Code.gs`), pero el endpoint no está desplegado ni conectado.
- `QuestionStatus` incluye `'proposal'` y `applyConfig` usa `proposal` como estado por defecto de preguntas; no es un componente de propuestas de museos/contenidos.
- `docs/00` §12 lista una hoja `Propuestas` como propuesta, no implementada.

**Campos reales:** ninguno.

**Relaciones:** no aplica.

**Volumen verificado:** 0. Fuente: `COLLECTIONS` no incluye `proposals`; no hay archivo ni tabla.

**Quién lo edita hoy:** nadie.

**Quién debería editarlo (objetivo):** el público invitado/docentes/museos mediante un formulario, con revisión editorial; requiere decidir canal (Sheet/Apps Script/otro) y tratamiento de datos. Ver §7 y la comparación de `docs/21`.

**Estado:** **Objetivo** (declarado en docs/00, sin implementación).

**Riesgos / deuda:** el formulario es una promesa del MVP (docs/00 §5, punto 6) y hoy no tiene dónde persistir; además implica datos de contacto y, por lo tanto, una decisión de privacidad y retención.

---

### 3.17 Métricas agregadas (no existe)

**Dónde vive hoy:** **no existe**. Lo más cercano es el progreso local del aprendiz en `localStorage` (`lib/learning/progress.ts`, clave `isa-progress-v1`: puntos, racha, misiones, insignias), que **no se agrega ni se envía a ningún lado**. El Apps Script incluye `Metricas` entre las hojas que **nunca** expone (`NEVER_EXPOSED`). `docs/00` §12 lista `Metricas` como propuesta sujeta a privacidad.

**Campos reales:** no hay entidad. El progreso local tiene: `version`, `points`, `streak`, `bestStreak`, `missions` (mapa por `missionId` con `episodeId`, `seasonId`, `badgeId`, `correct`, `attempts`, `points`, `completedAt`), `badges` (IDs). No incluye institución, usuario ni timestamp de sesión.

**Relaciones:** el progreso local referencia IDs de misión/episodio/temporada/insignia, pero no se cruza con `institutions`.

**Volumen verificado:** 0 registros agregados. Fuente: no hay colección `metrics`; `COLLECTIONS` no la incluye.

**Quién lo edita hoy:** nadie. **(E)** el navegador del aprendiz escribe su progreso local.

**Quién debería editarlo (objetivo):** nadie manualmente; se generarían agregados por institución/temporada/museo a partir de eventos o del registro de credenciales, con base legal y retención definidas (docs/00 §10 y §11).

**Estado:** **Objetivo** (declarado, sin implementación).

**Riesgos / deuda:** sin backend ni identificación institucional no hay métricas posibles; cualquier diseño requiere decidir privacidad, consentimiento, retención y responsable (docs/00 §12 y §17). Además, el progreso local se pierde al limpiar el navegador.

---

## 4. Matriz de relaciones

| Entidad origen | Campo / referencia | Entidad destino | Cardinalidad | Integridad esperada | Estado real |
|---|---|---|---|---|---|
| `institutions` | `id` | `accessKeys.institutionId` | 1:N | Toda clave pertenece a una institución existente | 0 claves; sin uso |
| `institutions` | `id` | `credentials.institutionId` | 1:N | La credencial identifica la institución emisora | **No se cumple:** guarda `museum.id` |
| `museums` | `id` | `compartments.museumId` | 1:N | No borrar museo con compartimentos/misiones | Sin validación |
| `museums` | `id` | `systems.museumId` | 1:N | Ídem | Sin validación |
| `museums` | `id` | `episodes.museumId` | 1:N | Ídem | Sin validación |
| `museums` | `id` | `missions.museumId` | 1:N | Ídem | Sin validación |
| `museums` | `id` | `questions.museumId` | 1:N | Ídem | Sin validación |
| `museums` | `compartmentIds[]` | `compartments.id` | N:N denormalizada | Coincidir con `compartments.museumId` | Solo `MUS-U995`; no editable en admin |
| `museums` | `episodeIds[]` | `episodes.id` | N:N denormalizada | Coincidir con `episodes.museumId` | Solo `MUS-U995`; no editable en admin |
| `compartments` | `id` | `systems.compartmentId` | 1:N | Sistema dentro de un compartimento existente | Sin validación |
| `compartments` | `systemIds[]` | `systems.id` | N:N denormalizada | Coincidir con `systems.compartmentId` | Sin validación |
| `seasons` | `id` | `episodes.seasonId` | 1:N | Temporada existente | Sin validación |
| `seasons` | `id` | `missions.seasonId` | 1:N | Coincidir con la temporada del episodio | **No se cumple** en `MIS-COPPER-01` |
| `seasons` | `id` | `badges.seasonId` | 1:N | Temporada existente | Sin validación |
| `seasons` | `id` | `credentials.seasonId` | 1:N | Temporada existente | Sin validación |
| `episodes` | `id` | `missions.episodeId` | 1:N | Episodio existente y de la misma temporada | **No se cumple** (misma fila anterior) |
| `episodes` | `id` | `questions.episodeId` | 1:N | Episodio existente | Sin validación |
| `missions` | `id` | `questions.missionId` | 1:N | Misión existente | Sin validación |
| `missions` | `id` | `badges.missionId` | 1:N | Misión existente (solo reglas `mission`) | Sin validación |
| `missions` | `id` | `credentials.missionId` | 1:N | Misión existente | Sin validación |
| `systems` | `id` | `episodes.equipmentId` | 1:N | Sistema existente | Sin validación |
| `systems` | `id` | `missions.equipmentId` | 1:N | Sistema existente | Sin validación |
| `systems` | `id` | `questions.equipmentId` | 1:N | Sistema existente | Sin validación |
| `systems` | `id` | `roles.equipmentIds[]` | N:N denormalizada | Sistema existente | Sin validación |
| `badges` | `id` | `credentials.badgeId` | 1:N | Insignia existente y publicada al emitir | Sin validación retroactiva |
| `roles` / `disciplines` | — | grilla 5×5 | — | La grilla debería derivarse de datos | **No se leen:** la grilla usa `lib/missions.ts` |

**Diagnóstico de integridad:** el repositorio valida ID no vacío y timestamps (`assertValid` en `lib/data/repository.ts`), pero **no valida existencia de FK, unicidad de código, estado editorial ni coherencia entre entidades**. `applyConfig` crea/actualiza registros sin comprobar que las FK existan. El panel no tiene selectores de relación: las FK se tipean como texto (docs/11 §7).

---

## 5. Volúmenes y proyección de crecimiento

### 5.1 Actual verificado vs. objetivo declarado

| Componente | Actual verificado | Objetivo declarado | Fuente del objetivo | Observación |
|---|---:|---|---|---|
| Museos | 160 | “cientos después” | `docs/19` §3 (“160 museos hoy; cientos después”) | Sin cifra cerrada; **a verificar** con el equipo |
| Temporadas | 5 | 5 (Acero, Cobre, Bronce, Plata, Oro) | `docs/00` §9 | Bronce/Plata/Oro sin episodios/misiones cargados |
| Instituciones | 1 | Sin cifra definida | — | **A verificar**; el modelo debería ligar museos a instituciones |
| Reactivos en base | 2 (seed) | “100 reactivos hoy” | `docs/19` §3 | Los 100 existen en CSV curado, **no** en la base |
| Reactivos curados | 100 | 100 tras revisión humana | `TIMSS/curated/QA_TIMSS_reactivos.md` | Todos pendientes de revisión humana |
| Episodios | 1 | Sin cifra definida | — | **A verificar** |
| Misiones en base | 2 | Sin cifra definida | — | Además hay 31 misiones fixture en `lib/missions.ts` |
| Badges | 2 | Sin cifra definida | — | 0 reglas `season-count` cargadas |
| Roles | 5 | Sin cifra definida | — | Colección sin uso funcional |
| Disciplinas | 5 | Sin cifra definida | — | Colección sin uso funcional |
| Grilla 5×5 | 25 celdas fixture | 25 celdas (insumo curricular a conservar) | `docs/00` §16; `docs/19` §1 | Sin tabla; representación a decidir |
| Credenciales | 0 al instalar | Append-only, sin techo definido | `docs/19` §3 | Volumen real por navegador; no agregable |
| Claves de acceso | 0 | Sin cifra definida | — | **A verificar** cuántas instituciones piloto |
| Propuestas | 0 | Sin cifra definida | `docs/00` §12 | Componente inexistente |
| Métricas | 0 | Sin cifra definida | `docs/00` §12 | Componente inexistente |

### 5.2 Lectura de crecimiento

- **Museos:** es el único volumen ya “grande”. Pasar de 160 a cientos no requiere cambiar el modelo (el dataset ya es una lista versionada), pero sí resolver identidad estable, reconciliación de bajas/renombres y el vínculo con instituciones.
- **Reactivos:** el cuello de botella no es técnico sino editorial: 100 curados esperan revisión. El modelo actual soporta el volumen (`importRecords` está pensado para lotes de 160+), pero falta el puente CSV curado → base.
- **Temporadas/roles/disciplinas:** el crecimiento esperado es de catálogo pequeño y estable; el problema no es volumen sino que hoy no alimentan la grilla ni el contenido.
- **Instituciones y claves:** hoy 1 institución y 0 claves. El objetivo de acceso institucional (docs/00 §10) implica un salto de volumen no dimensionado: **a verificar** cuántas instituciones y claves se prevén en el piloto.
- **Credenciales:** el crecimiento es indefinido y distribuido (cada navegador emite las suyas). Sin backend no hay una métrica central de emisión.
- **Sin cifras cerradas:** este documento no fija metas de crecimiento; las que figuran arriba son las declaradas en docs y quedan marcadas como objetivo o a verificar.

---

## 6. Qué falta / a verificar

1. **Vínculo institución ↔ museo:** no existe en el modelo; hoy `credentials.institutionId` guarda un museo. Definir si el emisor es ISA, el museo o la institución.
2. **Puente TIMSS → base:** los 100 reactivos curados no se importaron; falta definir mapeo, estado editorial y quién aprueba.
3. **Grilla 5×5:** decidir representación (derivada de roles × disciplinas, tabla puente u otra) sin duplicar misiones.
4. **Credenciales:** decidir dónde vive el registro append-only, cómo se numera sin colisiones y cómo se revoca sin perder el `criteriaSnapshot`.
5. **Claves de acceso:** decidir mecanismo único (colección local, hoja `Claves` del Apps Script u otro) y su verificación server-side.
6. **Configuración:** definir qué claves son configurables por tabla, quién las edita y cómo se versionan; hoy la tabla está vacía.
7. **Propuestas:** definir formulario, canal de persistencia, estados editoriales y tratamiento de datos personales.
8. **Métricas:** definir qué se mide, con qué base legal, retención y nivel de agregación; hoy no hay backend ni identificación institucional.
9. **Unificación de fixtures:** `lib/missions.ts`, `lib/seasons.ts` y `lib/progress.ts` siguen alimentando la Home con datos paralelos a IndexedDB (31 misiones fixture vs 2 en base). Es el mayor riesgo de inconsistencia.
10. **Integridad referencial:** no hay validación de FK ni de coherencia temporada↔episodio; hay al menos una inconsistencia real (`MIS-COPPER-01`).
11. **Volumen objetivo de instituciones, claves y episodios:** no está definido en los documentos leídos; **a verificar** con el equipo.
12. **Estado del Apps Script:** existe como referencia en `apps-script/Code.gs`, **no desplegado** y no consumido por la web; no se pudo verificar su comportamiento real.
13. **Estado de la Sheet publicada:** no se ejecutó `sync_museums.py --check` por red; el volumen 160 se verificó sobre el JSON versionado y el reporte de docs/13.
14. **IndexedDB real:** los conteos son de seed/archivos; no se inspeccionó la base de un navegador en uso.

---

## 7. Componentes NO existentes hoy

| Componente | Estado | Qué existiría hoy | Qué requeriría (a nivel datos, sin decidir plataforma) |
|---|---|---|---|
| **Propuestas** | **Objetivo** | Bandera `enableProposals: false`; hoja `Propuestas` declarada solo en el Apps Script de referencia; estado `proposal` dentro de preguntas | Entidad con ID, tipo (museo/reactivo/contenido/alianza), texto, contacto, estado editorial, origen, fechas y trazabilidad; canal de alta para invitados; política de datos personales y retención; revisión y respuesta. |
| **Métricas agregadas** | **Objetivo** | Progreso local en `localStorage` (no agregado); hoja `Metricas` declarada como no expuesta en Apps Script | Definir eventos/indicadores, unidad de agregación (institución/temporada/museo), frecuencia, almacenamiento, base legal, retención, acceso y responsable; sin identificación individual. |

Ninguno de los dos debe implementarse en esta sesión (docs/19 §6).

---

## 8. Comprobaciones realizadas y limitaciones

### 8.1 Archivos leídos

Documentación: `AGENTS.md`, `docs/00_DOCUMENTO_BASE.md`, `docs/07_ENDPOINT_APPS_SCRIPT.md`, `docs/08_DATA_LAYER.md`, `docs/11_ADMIN_PANEL.md`, `docs/13_SHEET_SYNC.md`, `docs/14_OPEN_BADGES.md`, `docs/15_CONFIG_SHEET.md`, `docs/17_SESSION_MAP.md`, `docs/19_DATA_INFRA_SESSION.md`.

Código y datos: `lib/domain/types.ts`, `lib/admin/entities.ts`, `lib/admin/local-auth.ts`, `lib/data/seed.ts`, `lib/data/bootstrap.ts`, `lib/data/config.ts`, `lib/data/repository.ts`, `lib/data/index.ts`, `lib/data/indexeddb-storage.ts`, `lib/data/sheets-repository.ts`, `lib/badges/registry.ts`, `lib/badges/rules.ts`, `lib/badges/openbadge.ts`, `lib/learning/progress.ts`, `lib/import/schemas.ts`, `lib/missions.ts`, `apps-script/Code.gs`, `scripts/sync_museums.py`, `scripts/sync_config.py`, `.github/workflows/sync-museums.yml`, `.github/workflows/sync-config.yml`, `lib/data/datasets/museums-snk-2025.json`, `lib/data/datasets/isa-config.json`, `TIMSS/curated/reactivos_timss_isa_knowing_curated.csv`, `TIMSS/curated/reactivos_timss_isa_knowing_manifest.csv`, `TIMSS/curated/QA_TIMSS_reactivos.md`.

Componentes de UI revisados para determinar consumo: `components/insignias/badge-matrix.tsx`, `components/admin/admin-dashboard.tsx`, `components/admin/accreditation-panel.tsx`, `components/admin/settings-form.tsx`, `components/app/data-provider.tsx`, `components/learn/mission-view.tsx`, `components/learn/profile-view.tsx`, `components/series/access-gate.tsx`, `app/admin/page.tsx`, `app/admin/[entity]/page.tsx`.

### 8.2 Comandos de conteo (reproducibles)

Contaje del seed y de las colecciones (Node sobre los archivos versionados):

```text
SEED_SEASONS 5 | SEA-STEEL, SEA-COPPER, SEA-BRONZE, SEA-SILVER, SEA-GOLD
SEED_DISCIPLINES 5 | DIS-SCIENCE, DIS-TECHNOLOGY, DIS-ENGINEERING, DIS-MATHEMATICS, DIS-HUMANITIES
SEED_ROLES 5 | ROL-MACHINIST, ROL-ELECTRICIAN, ROL-ELECTRONICS, ROL-NAVAL, ROL-LOGISTICS
SEED_INSTITUTIONS 1 | INS-LABOE
SEED_COMPARTMENTS 1 | CMP-U995-CONTROL
SEED_SYSTEMS 1 | SYS-U995-PERISCOPE
SEED_EPISODES 1 | EPI-STEEL-04
SEED_MISSIONS 2 | MIS-STEEL-04, MIS-COPPER-01
SEED_QUESTIONS 2 registros (QST-STEEL-04-01, QST-COPPER-01-01; las opciones A–D no son registros)
SEED_BADGES 2 | BDG-EXPEDITION-CREDENTIAL, BDG-COPPER-COIN
SEED_MUSEUMS 160 (dataset)
config.seasons/episodes/missions/questions/awards = 0; config.settings = 0 claves
COLLECTIONS (14): institutions, accessKeys, museums, compartments, systems, seasons, episodes, missions, questions, badges, roles, disciplines, credentials, settings
ADMIN_ENTITIES (12): museums, institutions, accessKeys, compartments, systems, seasons, episodes, missions, questions, badges, roles, disciplines
IMPORT_SPECS (3): museums, institutions, questions
```

Dataset de museos:

```text
filas 160 · IDs únicos 160 · MUS-SNK-### 159 + MUS-U995 1
países 35 · validados 8 · pending 152 · featured 8
con latitud/longitud 160 · dossier 160 · address 160
sin launchYear 65 · website 20 · mediaUrl 27
situation vacía 140 · agua 9 · tierra 11
```

Configuración versionada (`lib/data/datasets/isa-config.json`): `version: 2`, secciones `seasons`/`episodes`/`missions`/`questions`/`awards` con 0 elementos y `settings: {}`.

Banco TIMSS:

```text
reactivos_timss_isa_knowing_curated.csv: 100 filas de datos, 100 IDs únicos, rango ISA-KNOW-001..100
manifest: 225 filas
curation_status: curated_pending_human_review = 100
Estado sugerido: Propuesta = 100
qa_flags: OPERATIONAL_CONTEXT_REVIEW 12 filas, EDITORIAL_ABSOLUTE_CLAIM_REVIEW 4,
          EDITORIAL_PLACEHOLDER_REVIEW 3, sin flag 83 (algunas filas acumulan flags)
```

Repositorio: commit `3e7f53f` (2026-11-06 09:28 -03:00); `package.json` con `next 16.4.3`; scripts `dev`, `build`, `start`, `sync:museums`; sin lint ni test.

### 8.3 Limitaciones

- No se ejecutó la aplicación ni se abrió IndexedDB en un navegador: los volúmenes son de seed/archivos, no de una base en uso.
- No se ejecutó `scripts/sync_museums.py` ni `scripts/sync_config.py` (no había red ni autorización): no se verificó el estado actual de la Sheet publicada.
- No se verificó el despliegue del Apps Script ni sus cuotas; solo se leyó el código de referencia.
- No se contaron credenciales emitidas en navegadores reales: no existe agregado.
- Los conteos de la grilla 5×5 y de las 31 misiones fixture se derivan de `lib/missions.ts`; no hay persistencia que los confirme en runtime.
- Las cifras objetivo (museos “cientos”, 100 reactivos, instituciones) provienen de documentos; no hay decisión cerrada ni fuente externa verificada en esta sesión.
- No se modificó ningún archivo fuera de este documento, no se instalaron dependencias y no se hicieron commits.
