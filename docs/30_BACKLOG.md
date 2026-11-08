# ISA · Estado y backlog

Foto del proyecto al 7 de noviembre de 2026, con el backlog priorizado.

---

## 1. Qué está funcionando en producción

| Área | Estado | Evidencia |
|---|---|---|
| Home con acceso | ✅ | `academy.elsnorkel.com` con gate de evaluación (`ISA-DEMO`) |
| Serie del aprendiz | ✅ | `/series`, `/episodes?id=`, `/profile` sobre IndexedDB |
| Archivo de museos | ✅ | 160 fichas en `/museums`, detalle en `/museums/[id]` |
| Mapa | ✅ | `/map` con Leaflet + markercluster |
| Panel admin | ✅ | `/admin` + 12 entidades, CRUD completo |
| Acreditaciones | ✅ | `/admin/accreditation` con reglas, registro y revocación |
| Importador CSV | ⚠️ | museos, instituciones y reactivos |
| Config desde Sheet | ✅ | `sync_config.py` con 12 secciones + validación referencial |
| Investigación de museos | ✅ | pipeline con fuentes; 13 museos procesados |
| Open Badges 3.0 | ⚠️ | documento y registro local, sin firma |

## 2. Qué está parcial

| Tema | Situación |
|---|---|
| **Contenido educativo** | 1 temporada con 1 episodio y 2 misiones; los 100 reactivos curados no están en la app |
| **Datos de museos** | 421 campos faltantes; 147 museos sin investigar |
| **Home** | sigue usando fixtures legacy (`lib/missions.ts`), no la base de datos |
| **i18n** | bilingüe en museos y aprendiz; Home y admin sólo en inglés |
| **PWA** | hay `manifest.ts`, **no hay service worker** |
| **Credenciales** | sin firma ni identidad del destinatario |
| **Importador** | no cubre temporadas, episodios, misiones, insignias ni grilla |
| **Videos** | el campo existe en episodios, no se renderiza |

## 3. Qué falta

- PWA offline y instalación.
- Tests, lint y CI de calidad (hoy sólo `tsc` y `build` manuales).
- Endpoint Apps Script desplegado.
- Claves institucionales reales.
- Métricas y propuestas de instituciones.
- Unificación de la Home con el modelo nuevo.

---

## 4. Backlog

Escala: esfuerzo **S** (≤1 jornada), **M** (2–3), **L** (>3). Impacto 1–5.
Prioridad = impacto × 2 − esfuerzo (S=1, M=3, L=5).

### Contenido y datos

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-001 | Cargar temporadas reales (roles, disciplinas, temporadas, grilla) desde la planilla | M | 5 | 7 | A | planilla cargada |
| APP-002 | Importar los 100 reactivos curados a la app | S | 5 | 9 | A | — |
| APP-003 | Completar investigación de los 147 museos restantes (lotes de 5) | L | 5 | 5 | A | — |
| APP-004 | Sumar descripción y video oficial al pipeline de investigación | M | 4 | 5 | A | política de derechos |
| APP-005 | Aplicar lote 3 en adelante con revisión | M | 4 | 5 | A | APP-003 |
| APP-006 | Importador para temporadas, episodios, misiones e insignias | M | 3 | 3 | A | — |

### Experiencia del aprendiz

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-010 | Franja de temporadas con color y progreso en `/series` | S | 4 | 7 | B | — |
| APP-011 | Render de video en episodios (con fallback sin media) | S | 4 | 7 | B | APP-004 |
| APP-012 | Sonido ambiente opcional con mute | M | 2 | 1 | B | — |
| APP-013 | Repaso de misión y reintento explícito | S | 3 | 5 | B | — |

### Administración

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-020 | Selector de relaciones en lugar de IDs escritos a mano | M | 4 | 5 | C | — |
| APP-021 | Historial de cambios por registro | L | 3 | 1 | C | — |
| APP-022 | Vista de estado de configuración (qué secciones cargó la planilla) | S | 3 | 5 | C | — |
| APP-023 | Generador de claves institucionales con hash | M | 3 | 3 | C | decisión de claves |

### Acreditaciones

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-030 | Definir emisor y firma de credenciales | L | 4 | 3 | E | identidad del sujeto |
| APP-031 | Exportar bundle firmable y validarlo | M | 3 | 3 | E | APP-030 |
| APP-032 | Página de verificación de credencial | M | 3 | 3 | E | APP-030 |

### Plataforma

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-040 | Service worker + cache offline + instalación | M | 4 | 5 | F | — |
| APP-041 | Unificar Home con el modelo nuevo y retirar fixtures legacy | L | 4 | 3 | B | APP-001 |
| APP-042 | i18n completo en Home y admin | M | 3 | 3 | B | — |
| APP-043 | Desplegar endpoint Apps Script read-only | M | 3 | 3 | F | decisiones U1–U3 |

### Calidad

| ID | Tema | E | I | P | Sesión | Depende |
|---|---|---|---|---|---|---|
| APP-050 | Suite mínima de tests (repositorios, reglas, config) | M | 4 | 5 | F | — |
| APP-051 | Lint + CI con typecheck y build en cada push — **completado 8/11/2026** (`ci.yml` + typecheck en el deploy) | S | 4 | 7 | F | — |
| APP-052 | Revisión de accesibilidad AA en rutas públicas | M | 3 | 3 | B | — |

---

## 5. Próximos cinco, en orden

| # | ID | Por qué ahora |
|---|---|---|
| 1 | APP-051 | CI evita publicar roto; es barato y protege todo lo demás |
| 2 | APP-002 | 100 reactivos ya curados: convierten el recorrido en contenido real |
| 3 | APP-001 | Habilita temporadas completas y la grilla |
| 4 | APP-010 | Mejora visible de `/series` |
| 5 | APP-040 | Cierra la promesa de “PWA instalable” |

## 6. Cómo se relaciona con el backlog del universo

| Backlog | Dónde | Contenido |
|---|---|---|
| Producto (este) | `ISA docs/30_BACKLOG.md` | Ingeniería y producto de ISA |
| Editorial | `snk/queue/content_queue.csv` | Ideas de artículos, videos y posts |

Una idea editorial que requiere desarrollo entra acá como ítem propio y mantiene el enlace a la idea original.
