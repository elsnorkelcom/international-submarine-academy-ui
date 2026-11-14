# Sesiones de producción como presets de DSH

Fecha: 10/11/2026. Implementa lo que `00_LEEME.md` y `01…08` describen como
«fábrica de prompts»: las ocho sesiones ya existen como **presets de agente** dentro
del perfil de DSH de esta máquina, así que se abren desde el selector de sesión nueva
sin pegar ningún prompt de arranque.

## 1. Qué se creó

| Preset (`id` de DSH) | Nombre en el selector | Entrega | Archivo de origen |
|---|---|---|---|
| `isa-documentalista` | ISA · Documentalista | Ficha verificada con citas | `01_documentalista.md` |
| `isa-guionista` | ISA · Guionista | Guion 90 s ES/EN + 3 Shorts | `02_guionista.md` |
| `isa-arte` | ISA · Director de arte / Storyboard | Biblia visual, storyboard y prompts | `03_director_arte_storyboard.md` |
| `isa-productor` | ISA · Productor multimedia | Clips, TTS, subtítulos, ensamble | `04_productor_multimedia.md` |
| `isa-voz` | ISA · Voz y personajes | Persona bible y dirección de voz | `05_voz_personajes.md` |
| `isa-qa` | ISA · QA editorial y accesibilidad | Checklist y veredicto | `06_qa_accesibilidad.md` |
| `isa-coordinador` | ISA · Coordinador de producción | Tracker, estados y rutina semanal | `07_coordinador_produccion.md` |
| `isa-publicacion` | ISA · Publicación y monetización | Metadata, Shorts, 360 y monetización | `08_youtube_monetizacion.md` |

Los ocho presets aparecen después de los cuatro de fábrica (standard, ptc, minimal,
cordis), en el orden de la tabla (`order` 10 a 17).

## 2. Cómo son

- **Solo texto**: no montan herramientas de archivos (`read`/`write`/`edit`), shell,
  búsqueda, web, subagentes ni skills. Cumple `00_LEEME.md` §3: cada sesión cierra en
  3–5 turnos, no lee el repositorio y no llama APIs.
- **System prompt completo**: cada preset usa `@deepseek-ai/dsh-persona` con
  `complete: true` e `includeRuntimeContext: false`. El prompt es la única sección de
  sistema: no se cuelan `AGENTS.md`, el directorio de trabajo ni la guía de tools. El
  texto del rol es autocontenido y no usa la sintaxis de plantillas `{{…}}` (se
  reemplazaron por `<ESTACION>` y similares para no colisionar con las variables del
  prompt registry).
- **Modelo**: el preset no fija modelo. Al crear la sesión hay que elegir el más barato
  disponible (DeepSeek) en el selector de modelo; el chat de dirección queda como
  excepción, igual que en `00_LEEME.md` §2.

## 3. Dónde vive la definición

```
sesiones/dsh-presets/
  package.json       # bundle local: @local/isa-sesiones-produccion
  cordis.patch.yml   # las ocho declaraciones @deepseek-ai/dsh-agent-preset
```

Se instaló como bundle del perfil de DSH (`desktop`) con
`plugin_manager install_bundle`. El perfil referencia esta carpeta local, así que:

- mover o renombrar `sesiones/dsh-presets` rompe la carga de los presets;
- editar `cordis.patch.yml` exige reinstalar el bundle (o reiniciar DSH) para que el
  Loader lea el patch nuevo;
- los presets son del perfil, no del repositorio: cualquier sesión de DSH de esta
  máquina los ve, no solo las que apuntan a este proyecto.

## 4. Cómo se usan

1. Abrir una sesión nueva y elegir el preset del rol en el selector de agente.
2. Elegir el modelo barato.
3. Pegar en el primer mensaje el material que ese rol necesita (fuentes y estación para
   Documentalista; ficha y pregunta abierta para Guionista; guion para Arte; etc.).
4. Copiar la salida y llevarla a Google (NotebookLM, Gemini, Imagen, Flow, Sheets,
   YouTube) según `00_LEEME.md` §5.
5. Handoff: la siguiente sesión recibe el entregable pegado, con el mismo flujo
   Documentalista → Guionista → Arte → Productor → QA → Publicación.

Como las sesiones no tienen herramientas, **todo** entra y sale pegado. Si el material
no se pega, el rol lo pide en una lista corta en vez de inventarlo.

## 5. Mantenimiento

- **Editar un rol**: cambiar su `prefix` en `cordis.patch.yml`, reinstalar el bundle y
  comprobar que las filas `preset-isa-*` siguen en `fiberPhase: active`.
- **Agregar un rol**: insertar otra declaración con `id` nuevo y `order` siguiente;
  no reutilizar `id` (la carga duplica y falla).
- **Desinstalar todo**: `plugin_manager remove_bundle` con
  `@local/isa-sesiones-produccion`. Los presets de fábrica no se tocan.
- **No** editar los presets desde el editor web de configuraciones salvo que se quiera
  que el perfil gane sobre el patch: el patch del bundle es la fuente de verdad.

## 6. Verificación hecha y pendiente

Hecho el 10/11/2026:

- `plugin_manager list_bundles` lista `@local/isa-sesiones-produccion` 1.0.0 habilitado.
- `plugin_manager list_plugins` muestra las ocho filas `include:preset-isa-*`
  habilitadas y en `fiberPhase: active`.
- `cordis_inspect_query` (Config) devuelve las ocho declaraciones con `status: schema`,
  o sea que el patch y el esquema de `@deepseek-ai/dsh-agent-preset` validan.

No verificado todavía:

- Componer una sesión real con cada preset (el roster puede mostrar un diagnóstico si un
  plugin hijo falla recién al activarse). Falta abrir una sesión por rol y confirmar que
  el prompt de sistema es el de la tabla y que no aparecen tools.
- Cuota y costo reales por sesión con el modelo barato.
