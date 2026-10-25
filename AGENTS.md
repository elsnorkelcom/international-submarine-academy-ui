# AGENTS.md

Instrucciones permanentes para agentes que trabajen en este repositorio.

Si detectás diferencias entre este documento, el código o una nueva instrucción del usuario, informalas. Detenete y pedí aclaración cuando afecten el alcance autorizado, la seguridad o una decisión de producto o arquitectura. No corrijas esas diferencias por iniciativa propia.

## Estado actual comprobado

Referencia histórica verificada el 25/10/2026. Estos resultados no garantizan el estado de cambios posteriores: repetir las comprobaciones que correspondan a cada tarea.

- Next.js 16.4.3, fijado de forma exacta en `package.json`.
- React y React DOM 19.2.4 (declarados como `^19`).
- pnpm 12.3.4; `pnpm-lock.yaml` versionado. `sharp` 0.35.5 como dependencia opcional de Next.
- Rutas `/` (serie/streaming) y `/v1` (académica por fases). El build las genera como estáticas, junto con `/manifest.webmanifest` y `/_not-found`.
- `pnpm exec tsc --noEmit` y `pnpm build` finalizan sin errores.
- Prueba manual realizada por el usuario: `/` y `/v1` responden HTTP 200 y su funcionamiento visual es correcto. El usuario también confirmó que el aviso "Security Insight" ya no aparece.
- No se detectaron Server Actions, directivas `use cache` ni `next/og`/`ImageResponse`.
- `next.config.mjs`: `images.unoptimized: true` y `typescript.ignoreBuildErrors: true`. Por eso el typecheck debe ejecutarse aparte con `tsc --noEmit`.
- No hay scripts de `lint` ni de `test`.
- `.gitignore` excluye `node_modules`, `.next/`, `next-env.d.ts` y `*.tsbuildinfo`.
- No hay implementación de Apps Script + Google Sheets en esta UI.
- No hay requisitos documentados en este repositorio de autenticación, tratamiento de datos personales ni contenidos educativos definitivos.
- Limitación conocida y no corregida: aviso de LCP del logo.

## Reglas de trabajo

1. **Idioma:** comunicarse siempre en español.
2. **Etapas:** trabajar en tareas pequeñas y verificables. Al terminar cada etapa, informar y esperar autorización explícita antes de continuar.
3. **Variantes:** preservar `/` (serie/streaming) y `/v1` (académica por fases) como variantes diferenciadas.
4. **Cambios de producto:** no rediseñar, fusionar ni eliminar una variante sin autorización.
5. **Dependencias:** usar pnpm, respetar el lockfile y no editarlo a mano. Cualquier cambio de dependencias debe justificarse y autorizarse.
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
- **Relación entre `/` y `/v1`:** contenido compartido o independiente, navegación, redirecciones y fuente de datos común.
- **Calidad:** incorporar lint, tests y CI; decidir si se mantiene `typescript.ignoreBuildErrors: true`; abordar el LCP del logo.
- **Dependencias:** política de actualizaciones de seguridad y uso de versiones exactas frente a rangos.
- **Entornos:** versión de Node soportada, proveedor de despliegue, ramas, previews y rollback.
