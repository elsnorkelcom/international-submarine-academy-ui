# AGENTS.md

Instrucciones permanentes para agentes que trabajen en este repositorio.

Si detectás diferencias entre este documento, el código o una nueva instrucción del usuario, informalas. Detenete y pedí aclaración cuando afecten el alcance autorizado, la seguridad o una decisión de producto o arquitectura. No corrijas esas diferencias por iniciativa propia.

## Referencia canónica de producto

La visión, el alcance y la reconciliación entre objetivos y estado real del repositorio están en [`docs/00_DOCUMENTO_BASE.md`](docs/00_DOCUMENTO_BASE.md). Debe leerse junto con este archivo antes de proponer cambios. Sus etiquetas `Vigente`, `Objetivo`, `Propuesta pendiente`, `Fixture/demo` y `Conflicto a resolver` son obligatorias para distinguir intención de implementación.

## Estado actual comprobado

Referencia histórica verificada el 28/10/2026, ampliada el 03/11/2026 con el estado del commit `e3148f0` y actualizada el 03/11/2026 (tarde) con el estado del commit `62c42a9`. Estos resultados no garantizan el estado de cambios posteriores: repetir las comprobaciones que correspondan a cada tarea.

- Next.js 16.4.3, fijado de forma exacta en `package.json`.
- React y React DOM 19.2.4 (declarados como `^19`).
- pnpm 12.3.4; `pnpm-lock.yaml` versionado. `sharp` 0.35.5 como dependencia opcional de Next.
- Ruta `/` (serie vertical educativa). `/v1` fue desestimada y **responde 404** (la redirección de `next.config.mjs` fue eliminada el 03/11/2026 por decisión del usuario). El build genera `/`, `/manifest.webmanifest` y `/_not-found`, y con `output: 'export'` además produce la carpeta estática `out/`.
- `pnpm exec tsc --noEmit` y `pnpm build` finalizan sin errores.
- Verificación de esta etapa: `/` responde HTTP 200 (local y en producción) y `/v1` responde 404 (local y en producción).
- `components/academy/mission-badge.tsx` permanece porque lo usa `/insignias`; `hero-backdrop.tsx` fue eliminado con la unificación de la Home (8/11/2026).
- La Home se alimenta del modelo de datos (IndexedDB sembrado desde `isa-config.json`) vía `components/home/*`; `lib/missions.ts` queda solo como insumo de `/insignias`; `lib/seasons.ts` y `lib/progress.ts` fueron eliminados.
- Base de internacionalización integrada en `lib/i18n/` (`config.ts`, `index.ts` con `getMessages` y `formatMessage`, mensajes `en.ts` y `es.ts` en `lib/i18n/messages/`); la usan la Home (`app/page.tsx`) y todos los componentes de `components/series/`.
- `TEMPORARY_VISIBLE_HOME_LOCALE = 'es'` mantiene la Home en español de forma provisoria. El inglés (`en`, `TRANSLATION_BASE_LOCALE`) es el idioma base de los diccionarios y de la forma (`Messages = DeepString<typeof en>`), pero no debe mostrarse en la interfaz ni habilitarse un selector de idioma en esta etapa.
- En el MVP de esta UI no existen rutas por idioma; la Home se pinta con el idioma fijado en `lib/i18n/config.ts`, mientras que el encabezado de la app ofrece un selector EN/ES que cambia `/series`, `/episodes`, `/profile` y museos (verificado el 8/11/2026). Los diccionarios se tienen sincronizados (`en.ts` y `es.ts`, ninguna clave faltante, extra o vacía, y marcadores `{}` coincidentes).
- La demo Acero/Cobre fue retirada y eliminada (8/11/2026): el recorrido real vive en `/series` y `/episodes`, y la Home es la presentación con tráiler.
- Los componentes legacy de la Home (`series-hero`, `season-rails`, `episode-rail`, `episode-card`, `progress-band`, `series-context`, `demo-*`) fueron eliminados con la unificación.
- `/series` abre con una franja de progresión de temporadas (`components/learn/season-progression.tsx`): color por temporada, progreso `hechas/total` y estados disponible, bloqueada, completada y sin misiones. La primera temporada con misiones publicadas está abierta y cada temporada siguiente se abre al completar al menos una misión de la anterior (APP-010, 8/11/2026).
- No se detectaron Server Actions, directivas `use cache` ni `next/og`/`ImageResponse`.
- `next.config.mjs`: `output: 'export'`, `images.unoptimized: true` y `typescript.ignoreBuildErrors: true`. Por eso el typecheck debe ejecutarse aparte con `tsc --noEmit`. `app/manifest.ts` declara `export const dynamic = 'force-static'` (requisito de la exportación estática).
- Despliegue: **GitHub Pages vía GitHub Actions** (`.github/workflows/next-pages.yml`, pnpm + Node 22, build exportable, `.nojekyll`); producción en `https://academy.elsnorkel.com` con CNAME DNS que llega a GitHub a través del proxy Cloudflare del dominio. Cada push a `main` dispara el despliegue.
- Protección contra buscadores activa en producción: `public/robots.txt` con `Disallow: /` y `robots: { index: false, follow: false }` en `app/layout.tsx` (meta `noindex, nofollow`). Cloudflare antepone además su bloque gestionado de "content signals" al `robots.txt` del origen.
- Referencias a Vercel y v0 eliminadas del código (dependencia `@vercel/analytics` removida, `generator: 'v0.app'` quitado; verificación de 0 coincidencias el 03/11/2026). Vercel no tiene ninguna relación con el proyecto.
- `.gitignore` excluye `node_modules`, `.next/`, `out/`, `next-env.d.ts` y `*.tsbuildinfo`; las entradas de restos v0/.vercel fueron eliminadas.
- No hay scripts de `lint` ni de `test`.
- No hay implementación de Apps Script + Google Sheets en esta UI.
- No hay requisitos documentados en este repositorio de autenticación, tratamiento de datos personales ni contenidos educativos definitivos.
- Limitación conocida y no corregida: aviso de LCP del logo.

## Reglas de trabajo

1. **Idioma:** comunicarse siempre en español.
2. **Etapas:** trabajar en tareas pequeñas y verificables. Al terminar cada etapa, informar y esperar autorización explícita antes de continuar.
3. **Variante única:** `/` es la serie vertical educativa. `/v1` fue desestimada y responde 404 (sin redirección ni ruta).
4. **Cambios de producto y rutas:** no rediseñar, fusionar ni eliminar una variante, ni agregar rutas nuevas, sin autorización.
5. **Dependencias:** no agregar dependencias nuevas sin justificación y autorización; usar pnpm, respetar el lockfile y no editarlo a mano.
6. **Datos de demostración:** mantenerlos separados de las funcionalidades reales e identificarlos claramente. No presentarlos como datos o contenidos reales.
7. **Contenido:** no inventar contenidos educativos, resultados de investigación, equivalencias curriculares ni requisitos de la tesina. Si falta información, indicar qué falta y pedir fuentes.
8. **Responsabilidad académica:** el agente puede implementar requisitos aprobados y documentar decisiones técnicas y pruebas. No debe definir por su cuenta objetivos, metodología, criterios pedagógicos ni conclusiones de la tesina. Las propuestas académicas deben identificarse como tales y quedar pendientes de revisión del usuario.
9. **Apps Script + Google Sheets:** tratarlo como una propuesta pendiente de validación, no como una arquitectura implementada ni definitiva.
10. **Autenticación y datos personales:** no implementar autenticación ni almacenar datos personales sin requisitos definidos y revisión previa.
11. **Secretos:** no leer archivos `.env` ni credenciales, y no exponer secretos en respuestas, logs, capturas ni commits.
12. **Skills, MCP, plugins y dependencias nuevas:** no instalarlos sin explicar su finalidad, su impacto y las alternativas. Esperar autorización.
13. **Git y despliegue:** no hacer commits, push, tags ni despliegues sin autorización específica.
14. **Cierre de tareas:** antes de declarar una tarea terminada, informar qué se comprobó, cómo se comprobó, qué no se comprobó y qué limitaciones quedan.
15. **Alcance:** no corregir problemas ajenos a la tarea. Reportarlos y esperar autorización.

## Decisiones pendientes

- **Contenidos educativos y tesina:** fuentes, criterios de revisión, responsables y nivel de rigor esperado.
- **Apps Script + Google Sheets:** si se implementa, dónde vive el código, quién lo administra, permisos, límites y manejo de credenciales.
- **Datos de demostración:** mecanismo concreto (fixtures, flags o seeds), ubicación y forma de excluirlos de producción.
- **Autenticación y datos personales:** requisitos, roles, retención, base legal y revisión de seguridad.
- **i18n:** si y cuándo se mostrará `en` en la interfaz, si se agregará selector de idioma o rutas por idioma, y qué se quita de la etapa provisoria (`TEMPORARY_VISIBLE_HOME_LOCALE`).
- **Calidad:** incorporar lint, tests y CI; decidir si se mantiene `typescript.ignoreBuildErrors: true`; abordar el LCP del logo.
- **Dependencias:** política de actualizaciones de seguridad y uso de versiones exactas frente a rangos.
- **Entornos:** versión de Node local soportada (el workflow de CI/despliegue usa Node 22), ramas y previews (hoy solo `main` despliega), rollback (re-run de un commit anterior en Actions).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
