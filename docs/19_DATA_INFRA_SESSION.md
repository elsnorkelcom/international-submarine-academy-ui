# ISA · Sesión S — Infraestructura de datos

Sesión de **diseño**, previa a la división por incumbencias. No implementa: decide.

---

## 1. Prompt de arranque (pegar en la sesión nueva)

```text
Sos el Lead de la sesión "S · Infraestructura de datos" de ISA.
Proyecto: C:\Users\MDQdam\Proyectos\international-submarine-academy-ui
(Next.js 16 con export estático, TypeScript, pnpm. Hoy los datos viven en JSON versionado +
IndexedDB del navegador, y la configuración se sincroniza desde tablas CSV de Google Sheets.)

Leé antes de escribir: AGENTS.md, docs/00_DOCUMENTO_BASE.md, docs/08_DATA_LAYER.md,
docs/13_SHEET_SYNC.md, docs/14_OPEN_BADGES.md, docs/15_CONFIG_SHEET.md, docs/17_SESSION_MAP.md.

MISIÓN
Rediseñar la infraestructura de datos base del sistema: qué información existe, cómo se
relaciona, dónde vive, quién la edita y cómo llega al sitio. El objetivo es que el proyecto
pueda crecer (más museos, más temporadas, más instituciones) sin rehacer el modelo.

RESTRICCIONES
- Todo debe sostenerse con planes gratuitos razonables y administración simple (ABM).
- El sitio es estático: el navegador no puede guardar secretos ni depender de escrituras.
- Contenido bilingüe (en/es) desde el modelo.
- Nada de implementar en esta sesión: solo diseño, comparación y plan de migración.
- No instalar dependencias. No commit. No push.

ENTREGABLES (en docs/, uno por tema)
1. docs/20_INVENTARIO_COMPONENTES.md — inventario completo de componentes con campos,
   relaciones, volúmenes y quién los edita.
2. docs/21_OPCIONES_PLATAFORMA.md — comparación de plataformas free con límites verificados,
   citando la fuente de cada cifra.
3. docs/22_MODELO_DATOS_SHEET.md — esquema físico propuesto: tablas, columnas, claves,
   enums, relaciones, reglas de integridad y convenciones de nombres.
4. docs/23_ADR_INFRAESTRUCTURA.md — decisión recomendada, alternativas descartadas con motivo,
   riesgos de cuota, plan de migración desde el estado actual y criterio de reversión.

COMPONENTES A ANALIZAR (mínimo)
Configuración, Instituciones, Claves de acceso, Museos, Compartimentos, Sistemas y equipos,
Temporadas, Episodios, Misiones, Reactivos/preguntas, Insignias y reglas de otorgamiento,
Roles, Disciplinas, Grilla 5×5 (especialidad × disciplina), Credenciales emitidas (registro
append-only), Propuestas (futuro), Métricas agregadas (futuro).

PREGUNTAS QUE DEBE RESPONDER
- ¿Cuántas tablas hacen falta y cuáles pueden ser vistas calculadas?
- ¿Qué se edita a mano y qué se genera por script?
- ¿Cómo se representa la grilla 5×5 sin duplicar misiones?
- ¿Dónde vive el registro de credenciales, que es append-only y no debe editarse a mano?
- ¿Cómo se versiona el contenido publicado y cómo se revierte?
- ¿Qué pasa cuando se alcanza el límite del plan free?
- ¿Cómo se migra sin romper las URLs ni los IDs actuales (MUS-U995, SEA-STEEL, …)?

VERIFICACIÓN EXIGIDA
- Cada límite de plan citado debe tener URL de fuente.
- El esquema debe cubrir el 100% de los componentes listados.
- El plan de migración debe indicar qué script toca qué archivo.
- Toda afirmación no comprobada debe quedar marcada como "a verificar".

REPORTE AL USUARIO
Resumen de 250 palabras: recomendación, riesgos y qué se necesita decidir.
```

---

## 2. Inventario de componentes (punto de partida verificado en el código)

| Componente | Dónde vive hoy | Volumen | Quién lo edita |
|---|---|---|---|
| Configuración | `settings` en IndexedDB + `isa-config.json` | 1 registro | Tabla `settings` |
| Instituciones | `institutions` | 1 | Panel / config |
| Claves de acceso | `accessKeys` | 0 | Panel (futuro) |
| Museos | `museums` (dataset versionado) | **160** | Sheet publicada de museos |
| Compartimentos | `compartments` | 1 | Panel |
| Sistemas y equipos | `systems` | 1 | Panel |
| Temporadas | `seasons` | 5 | Panel / config |
| Episodios | `episodes` | 1 | Panel / config |
| Misiones | `missions` | 2 | Panel / config |
| Reactivos | `questions` | 100 (TIMSS curado) | Panel / config / importador |
| Insignias y reglas | `badges` | 2 | Config |
| Roles | `roles` | 5 | Panel |
| Disciplinas | `disciplines` | 5 | Panel |
| Grilla 5×5 | derivada de roles × disciplinas | 25 celdas | — (no hay tabla propia) |
| Credenciales emitidas | `credentials` (IndexedDB) | variable | **Nadie: append-only** |
| Propuestas | no existe | — | futuro |
| Métricas | no existe | — | futuro |

Lectura del estado: **la grilla 5×5 no tiene tabla**, se infiere de temporadas/roles. Eso es una decisión a tomar en esta sesión.

## 3. Requisitos que el modelo debe cumplir

| Requisito | Implicancia |
|---|---|
| ABM simple y gratuito | La plataforma debe tener plan free usable y edición tipo formulario |
| Sitio estático | Lectura pública sin secretos; datos servidos como JSON o endpoint público |
| Bilingüe | Todo texto de contenido en par en/es |
| Trazabilidad | Origen, estado editorial, quién y cuándo |
| Integridad | No borrar un museo con misiones asociadas; IDs estables |
| Credenciales | Append-only, con estado y número de registro |
| Crecimiento | 160 museos hoy; cientos después; 100 reactivos hoy |
| Reversión | Volver a una versión anterior del contenido publicado |

## 4. Plataformas a evaluar

Verificado al escribir este documento:

- **Supabase Free**: 500 MB de base, 2 proyectos activos, pausa tras 1 semana de inactividad, API ilimitada, 1 GB storage, 50.000 MAU. Fuente: [supabase.com/pricing.md](https://supabase.com/pricing.md)

A verificar por la sesión, con URL de fuente:

- Google Sheets + **AppSheet** (plan free/prototipo: límite de usuarios y de filas).
- Google Sheets + **Apps Script** (cuotas diarias de ejecución, URL Fetch, triggers).
- **Airtable** free (registros por base, tasa de requests).
- **NocoDB** o **Baserow** (self-hosted gratis vs. cloud free).
- **Cloudflare D1** (lecturas/escrituras diarias, tamaño).
- **PocketBase** (self-hosted, un binario).
- **Grist** o **SeaTable** free.

## 5. Criterios de comparación

| Criterio | Peso |
|---|---|
| Edición tipo formulario sin programar | Alto |
| Plan free sostenible para 1–3 editores | Alto |
| Lectura pública para sitio estático | Alto |
| Modelo relacional con claves y enums | Alto |
| Campos bilingües | Medio |
| Historial y auditoría | Medio |
| Export/backup completo | Medio |
| Costo de salida (migrar después) | Medio |
| Requiere servidor propio | Bajo |

## 6. Qué NO debe hacer esta sesión

- No implementar scripts ni cambiar código de la app.
- No elegir por elección de herramienta sin comparar límites reales.
- No inventar cifras: si un límite no se puede verificar, se marca como tal.
- No borrar ni renombrar IDs existentes.

## 7. Después de esta sesión

Con el ADR aprobado, se abren las sesiones por incumbencia (`docs/17_SESSION_MAP.md`) y la A ·
Datos ejecuta la migración al modelo decidido.
