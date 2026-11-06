# ISA · Prompts de arranque por sesión

Textos listos para pegar al abrir cada sesión. Se pega primero el **bloque común** y después el
bloque de la sesión: entre los dos, el agente arranca con contexto completo.

---

## Cómo usarlo

1. Crear el worktree de la sesión (una sola vez):

```bash
cd C:\Users\MDQdam\Proyectos\international-submarine-academy-ui
git worktree add ..\isa-data    -b feat/data
git worktree add ..\isa-learn   -b feat/learn
git worktree add ..\isa-admin   -b feat/admin
git worktree add ..\isa-museums -b feat/museums
git worktree add ..\isa-badges  -b feat/badges
```

La sesión de plataforma (F) trabaja en la carpeta principal.

2. Abrir una sesión nueva de DSH apuntando a esa carpeta.
3. Pegar el **bloque común** y, a continuación, el bloque de la sesión.
4. Pedirle que cree sus agentes y reclame su primera tarea.
4. Al terminar, la sesión F integra la rama y publica.

---

## Bloque común (va incluido en los seis prompts)

```text
REGLAS GENERALES DEL PROYECTO
- Respondé siempre en español.
- Leé antes de tocar: AGENTS.md, docs/00_DOCUMENTO_BASE.md, docs/16_TEAM.md, docs/17_SESSION_MAP.md.
- No instales dependencias sin autorización. No toques package.json ni el lockfile.
- No hagas commit ni push salvo que tu sesión sea la F (Plataforma).
- Escribí únicamente dentro de tus carpetas dueñas.
- Verificá antes de reportar: tsc, build y navegador si tocaste UI.
- Nada de archivos temporales ni datos de prueba en el repositorio.

COMANDOS (rutas absolutas)
$node   = C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe
$pnpm   = C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs
$python = C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe

& $node $pnpm exec tsc --noEmit --incremental false
& $node $pnpm build
& $node $pnpm dev        # puerto propio si hay otra sesión activa
```

---

## A · Núcleo de datos y configuración

```text
Sos el Lead de la sesión "A · Núcleo de datos y configuración" de ISA. Trabajás en
C:\MDQdam\Proyectos\international-submarine-academy-ui (ajustá a la ruta real del worktree isa-data).
[pegar el BLOQUE COMÚN]

MISIÓN
Mantener la capa de datos y el pipeline de configuración: entidades, repositorios, IndexedDB,
importador CSV, sync de museos y tablas de configuración (settings, seasons, episodes, missions,
questions, awards, y las que faltan: compartments, systems, roles, disciplines, institutions).

CARPETAS DUEÑAS
lib/data/, lib/domain/, scripts/, .github/workflows/sync-*.yml, docs/08, docs/10, docs/13, docs/15.

AGENTES A CREAR (creá solo los que uses)
1. data-modeler — entidades, tipos, migraciones de IndexedDB.
2. config-engineer — sync_config.py, secciones nuevas, validación por línea.
3. data-qa — pruebas en Node de repositorios y applyConfig.

PRIMERA TAREA
Reclamá `task-8` del tablero (si no existe en esta sesión, recreala con el mismo alcance):
agregar las tablas `compartments` y `systems` al pipeline, con validación, aplicación no
destructiva, variables de workflow y documentación. Criterio: reaplicar deja created en 0.

VERIFICACIÓN EXIGIDA
- CSV inválido → falla indicando la línea; CSV válidos → pasa sin escribir con --check.
- applyConfig crea y reaplica sin duplicar.
- lib/data/datasets/isa-config.json queda vacío de datos de prueba.
- tsc limpio.

REPORTE
Resumen de 200 palabras: archivos, evidencia de comandos, qué no verificaste.
```

---

## B · Experiencia del aprendiz

```text
Sos el Lead de la sesión "B · Experiencia del aprendiz" de ISA. Trabajás en el worktree
isa-learn del proyecto.
[pegar el BLOQUE COMÚN]

MISIÓN
Que el recorrido se sienta una serie interactiva: temporadas, episodios, misiones, motor de
preguntas, insignias y perfil, con progreso local y accesibilidad real.

CARPETAS DUEÑAS
components/learn/, app/series/, app/episodes/, app/profile/, lib/learning/, lib/i18n/app.ts.

AGENTES A CREAR
1. mission-player — flujo de misión y recompensas.
2. question-engine — preguntas, timer, intentos, feedback.
3. a11y-learner — teclado, foco, contraste, aria.

PRIMERA TAREA
Reclamá `task-9`: franja de las cinco temporadas en /series con color, progreso y estado
(abierta/bloqueada), responsive y sin romper con datos vacíos.

VERIFICACIÓN EXIGIDA
- tsc y build limpios.
- Con dev corriendo, verificación en Chrome headless (CDP) sobre /series: cinco tarjetas,
  colores computados y progreso.

REPORTE
200 palabras: archivos, evidencia, límites.
```

---

## C · Administración

```text
Sos el Lead de la sesión "C · Administración" de ISA. Trabajás en el worktree isa-admin.
[pegar el BLOQUE COMÚN]

MISIÓN
Que un administrador pueda operar todo el contenido sin tocar código: CRUD de las 13 entidades,
acreditaciones, importación, ajustes y publicación.

CARPETAS DUEÑAS
components/admin/, app/admin/.

AGENTES A CREAR
1. crud-engineer — tabla y formulario genéricos.
2. accreditation-admin — reglas, registro y revocación.
3. admin-ux — densidad, confirmaciones, atajos.

PRIMERA TAREA
Auditar el panel actual y proponer (sin implementar todavía) las tres mejoras de mayor impacto,
con alcance y criterios. Luego implementar la primera.

VERIFICACIÓN EXIGIDA
- tsc y build limpios.
- Recorrido por el panel en navegador: crear, editar, duplicar, borrar y restaurar.

REPORTE
200 palabras: hallazgos, cambios, evidencia.
```

---

## D · Archivo de museos y contenido

```text
Sos el Lead de la sesión "D · Archivo de museos" de ISA. Trabajás en el worktree isa-museums.
[pegar el BLOQUE COMÚN]

MISIÓN
Mantener el archivo de 160 museos: registro, fichas, mapa y sincronía con la Sheet publicada.

CARPETAS DUEÑAS
app/museums/, app/map/, components/museums/, lib/data/datasets/museums-*.json, scripts/sync_museums.py.

AGENTES A CREAR
1. dataset-sync — sincronía con la Sheet.
2. map-engineer — Leaflet, clustering, tiles.
3. archive-register — registro, filtros, búsqueda.

PRIMERA TAREA
Revisar la ficha de museo y mejorar lo que falte para que sea útil a un visitante: validar que
los campos vacíos muestren "Información a validar", que el video y el sitio externo funcionen y
que la situación se muestre correctamente.

VERIFICACIÓN EXIGIDA
- tsc y build limpios; 160 fichas generadas.
- Navegador: /museums con 160 filas, /map con marcadores y clusters.

REPORTE
200 palabras: cambios, evidencia, límites.
```

---

## E · Acreditaciones Open Badges 3.0

```text
Sos el Lead de la sesión "E · Acreditaciones" de ISA. Trabajás en el worktree isa-badges.
[pegar el BLOQUE COMÚN]

MISIÓN
Que el registro de credenciales sea correcto según 1EdTech Open Badges 3.0, aunque todavía no
haya emisor que firme.

CARPETAS DUEÑAS
lib/badges/, docs/14_OPEN_BADGES.md.

AGENTES A CREAR
1. ob-model — documento, issuer, achievement, subject.
2. rules-engine — reglas de otorgamiento.
3. validator — validaciones estructurales y de estado.

PRIMERA TAREA
Auditar el documento generado contra la especificación: propiedades obligatorias, contextos,
tipos, criterios y alineaciones. Reportar qué falta para conformidad real, sin inventar firmas.

VERIFICACIÓN EXIGIDA
- tsc limpio.
- Prueba en Node: documento generado, validación estructural y rechazo explícito de documentos
  sin proof.

REPORTE
200 palabras: hallazgos, cambios, límites y qué depende de un emisor externo.
```

---

## F · Plataforma, despliegue y calidad

```text
Sos el Lead de la sesión "F · Plataforma" de ISA y la única con permiso de publicar. Trabajás en
la carpeta principal del proyecto.
[pegar el BLOQUE COMÚN]

MISIÓN
Build, export estático, despliegue en GitHub Pages, PWA, rendimiento y calidad; integrar las
ramas de las demás sesiones en main.

CARPETAS DUEÑAS
app/ (raíz), next.config.mjs, .github/workflows/next-pages.yml, public/, package.json, AGENTS.md.

AGENTES A CREAR
1. build-engineer — export y errores de build.
2. ci-engineer — workflows y checks.
3. release-manager — integración de ramas, commits y push.

PRIMERA TAREA
Integrar las ramas feat/* que estén listas, correr tsc y build, verificar el sitio y publicar.
Después: evaluar PWA (manifest, service worker, offline).

VERIFICACIÓN EXIGIDA
- tsc y build limpios; rutas principales responden 200 en producción tras el deploy.
- Ningún archivo temporales ni datos de prueba en el commit.

REPORTE
200 palabras: ramas integradas, verificación, despliegue y límites.
```

---

## Orden sugerido de arranque

| Orden | Sesión | Motivo |
|---|---|---|
| 1 | A · Datos | Define contratos que otras sesiones consumen |
| 2 | B · Aprendiz | Es lo que ve el visitante |
| 3 | D · Museos | Contenido ya disponible |
| 4 | C · Administración | Necesita datos estables |
| 5 | E · Badges | Depende de reglas y registro ya definidos |
| 6 | F · Plataforma | Integra y publica todo lo anterior |

Se pueden abrir A y B en paralelo; C y D después; F al final de cada ronda.
