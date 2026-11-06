# ISA · Session map

Cómo dividir el proyecto en sesiones de trabajo con agentes, sin pisarse.

---

## 1. Qué comparte y qué no

| Recurso | Alcance |
|---|---|
| Archivos del repositorio | **Compartido** por todas las sesiones que abran el mismo workspace |
| Equipo de agentes (cupo de 8) | **Por sesión** |
| Tablero de tareas (`team_task_*`) | **Por sesión** |
| Historial y contexto del agente | **Por sesión** |

Consecuencia: varias sesiones pueden trabajar sobre el mismo código, pero **no comparten el tablero ni se ven entre sí**. La coordinación tiene que ser explícita.

## 2. Riesgos reales

| Riesgo | Por qué | Mitigación |
|---|---|---|
| Dos sesiones construyen a la vez | `.next` compartido se corrompe | Un worktree por sesión (cada uno tiene su `.next`) |
| Dos `pnpm dev` | Puerto 3000 ocupado | Puerto distinto por sesión o un worktree por sesión |
| Dos sesiones editan el mismo archivo | El último guardado pisa al otro | Un dueño por carpeta |
| Commits cruzados | Ramas y push simultáneos | Cada sesión commitea en su rama; la sesión de plataforma integra |

## 3. Modelo recomendado

```bash
# sesión UI
git worktree add ../isa-ui -b feat/ui
# sesión datos
git worktree add ../isa-data -b feat/data
# sesión museos
git worktree add ../isa-museums -b feat/museums
```

Cada sesión abre su propio directorio. `main` se integra desde la sesión de plataforma, que es la única que hace `push`.

Alternativa más simple: **una sesión activa a la vez** y las demás pausadas. Funciona, pero pierde el paralelismo.

## 4. Catálogo de sesiones

### A · Núcleo de datos y configuración

Carpetas dueñas: `lib/data/`, `lib/domain/`, `scripts/`, `.github/workflows/sync-*.yml`, `docs/08`, `docs/10`, `docs/13`, `docs/15`

| Rol | Responsabilidad |
|---|---|
| data-modeler | Entidades, tipos, migraciones de IndexedDB |
| config-engineer | `sync_config.py`, secciones, validación por línea |
| config-applier | `applyConfig` no destructivo e idempotente |
| dataset-curator | Integridad de datasets (museos, TIMSS) |
| import-engineer | Importador CSV, mapeo de columnas, errores |
| workflow-engineer | Actions de sincronización |
| data-qa | Pruebas Node de repositorios y configuración |
| docs-data | Documentación de la capa de datos |

### B · Experiencia del aprendiz

Carpetas dueñas: `components/learn/`, `app/series/`, `app/episodes/`, `app/profile/`, `lib/learning/`, `lib/i18n/app.ts`

| Rol | Responsabilidad |
|---|---|
| mission-player | Flujo de misión y recompensas |
| question-engine | Preguntas, timer, intentos, feedback |
| progress-model | Puntos, rachas, persistencia local |
| badge-display | Insignias, credenciales y su presentación |
| i18n-learner | Diccionarios EN/ES del recorrido |
| a11y-learner | Teclado, foco, contraste, aria |
| visual-learner | Identidad visual y responsive |
| qa-learner | Verificación en navegador (CDP) |

### C · Administración

Carpetas dueñas: `components/admin/`, `app/admin/`

| Rol | Responsabilidad |
|---|---|
| crud-engineer | Tabla y formulario genéricos por entidad |
| accreditation-admin | Reglas, registro y revocación de credenciales |
| import-center-admin | Flujo de importación en la UI |
| settings-admin | Variables de la app |
| access-keys | Claves institucionales (fase futura) |
| admin-ux | Densidad, atajos, confirmaciones |
| i18n-admin | Textos del panel |
| qa-admin | Verificación del panel |

### D · Archivo de museos y contenido

Carpetas dueñas: `app/museums/`, `app/map/`, `components/museums/`, `lib/data/datasets/museums-*.json`, `scripts/sync_museums.py`

| Rol | Responsabilidad |
|---|---|
| dataset-sync | Sincronía con la Sheet publicada de museos |
| archive-register | Registro, filtros y búsqueda |
| archive-file | Fichas de museo |
| map-engineer | Leaflet, clustering, tiles |
| media-curator | Video, imágenes y atribución |
| i18n-archive | Textos bilingües del archivo |
| a11y-archive | Accesibilidad del archivo y del mapa |
| qa-archive | Verificación de archivo y plot |

### E · Acreditaciones Open Badges 3.0

Carpetas dueñas: `lib/badges/`, `docs/14_OPEN_BADGES.md`

| Rol | Responsabilidad |
|---|---|
| ob-model | Mapeo a `AchievementCredential`, issuer, achievement |
| rules-engine | Reglas `mission` y `season-count` |
| registry | Registro, numeración, revocación, bundle |
| signing-research | Servicio emisor, claves, VC-JWT / Data Integrity |
| identity-privacy | Identidad del destinatario y sus implicancias |
| validator | Validaciones estructurales y de estado |
| qa-badges | Pruebas de otorgamiento y documentos |
| docs-badges | Documentación y límites declarados |

### F · Plataforma, despliegue y calidad

Carpetas dueñas: `app/` (raíz), `next.config.mjs`, `.github/workflows/next-pages.yml`, `public/`, `package.json`

| Rol | Responsabilidad |
|---|---|
| build-engineer | Export estático y errores de build |
| pwa-engineer | Manifest, service worker, offline |
| perf-engineer | Peso de bundle, LCP, imágenes |
| ci-engineer | Workflows y checks |
| release-manager | Única sesión que hace commit a `main` y push |
| security | Secretos, `.env`, dependencias |
| qa-integration | Verificación cruzada entre áreas |
| docs-platform | Documentación transversal |

## 5. Archivos compartidos y su dueño

| Archivo | Dueño | Cómo lo tocan las demás |
|---|---|---|
| `lib/i18n/app.ts` | B | Piden el cambio o agregan solo su namespace |
| `package.json` | F | Cualquier dependencia pasa por F |
| `AGENTS.md` | F | Propuestas por mensaje |
| `docs/00_DOCUMENTO_BASE.md` | F | Propuestas por mensaje |
| `lib/data/datasets/isa-config.json` | A | Generado por script, nunca editado a mano |

## 6. Reglas de convivencia

1. Una carpeta tiene un solo dueño.
2. Un worktree por sesión; un puerto de desarrollo por sesión.
3. Solo la sesión F hace `push` a `main`.
4. Cada sesión verifica antes de reportar: `tsc`, build y navegador si tocó UI.
5. Los contratos se documentan en `docs/` antes de cambiar interfaces entre áreas.
6. Si dos sesiones necesitan el mismo archivo compartido, gana el dueño y la otra espera.

## 7. Cuántos agentes activar

El cupo es 8, pero **no es una meta**. Lo razonable por sesión:

| Sesión | Agentes activos sugeridos |
|---|---|
| A · Datos | 2–3 |
| B · Aprendiz | 2–3 |
| C · Admin | 1–2 |
| D · Museos | 1–2 |
| E · Badges | 1–2 |
| F · Plataforma | 1 |

Más de eso genera coordinación sin ganancia, porque el trabajo es secuencial dentro de cada área.
