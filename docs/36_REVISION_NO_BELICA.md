# ISA · Revisión no bélica, no certificación y derechos

**Estado:** PROPUESTA pendiente de revisión del usuario. Rol **adversarial**.
**Fecha:** 10/11/2026.
**Insumos:** `docs/31_POLITICA_VIGENTE.md`, `docs/32_GRILLA_COBRE_COLORES.md`,
`docs/25_CATALOGO_RECONOCIMIENTOS.md`, `docs/00_DOCUMENTO_BASE.md`,
`public/images/badges/*/manifest.json`.

> **Método.** Este documento **no aprueba nada por defecto**. Cada elemento del sistema
> se contrasta contra la política vigente y se clasifica **BLOQUEANTE / RIESGO /
> OBSERVACIÓN**. Las afirmaciones legales se marcan como **requieren asesoría
> profesional** cuando corresponde.

---

## 1. Regla de referencia

`docs/31_POLITICA_VIGENTE.md` §2 (regla dura):

> Se excluyen armamento, explosivos, munición, torpedos, lanzatorpedos, balística,
> tácticas ofensivas, identificación de objetivos, combate, enemigos, entrenamiento
> militar y glorificación del conflicto. Tampoco se admiten eufemismos.
> **La exclusión alcanza a la guerra como contenido.** Aunque ISA hable de tripulantes de
> submarinos, no se presentan hechos, operaciones, anécdotas ni historias de guerra —ni
> siquiera como contexto histórico— para que no se interprete adhesión a esos temas.

**Consecuencia para arte:** un badge **no puede** representar un torpedo ni siquiera como
"objeto de museo", porque el objeto mismo pertenece a la categoría excluida.

---

## 2. Auditoría del estado actual

### 2.1 Hallazgos BLOQUEANTES

| # | Elemento | Ubicación | Problema | Reemplazo propuesto |
|---|---|---|---|---|
| **B-1** | Motivo **"Proa/torpedo"** del ribbon `RIB-AC-PROA` | `docs/25` §2, línea 34 | El torpedo está **explícitamente excluido** por la regla dura 1. Un badge que lo representa introduce el objeto prohibido en el arte del proyecto | **Hidrodinámica / forma del casco**: la proa como curva funcional |
| **B-2** | Estructura de **25 ribbons con `HUM` × especialidad** | `public/images/badges/cobre/manifest.json` (25 entradas `RIB-CU-*`) | El manifiesto trata `HUM` (Factor Humano) como disciplina cruzada con especialidad. `docs/31` §7 lo define como **columna libre**, no intersección. Además, la denominación vigente es "Factor Humano", no "Humanidades y Artes" | Regenerar con modelo **20 STEM + 15 FH** |

> **Nota sobre B-1:** el manifiesto `public/images/badges/acero/manifest.json` **no**
> contiene la palabra "torpedo": su campo es `icon: "bow"` (proa). El torpedo aparece
> **solo en `docs/25`**. Es decir: **el asset ya es correcto, la documentación es la que
> está mal.** La corrección es documental, no de arte.

> **Nota sobre B-2:** `docs/25` (6/11) es **anterior** a `docs/31` (9/11). El conflicto
> está reconocido en `AGENTS.md`, que registra Cobre con **35 experiencias** y **35
> ribbons**. La corrección es regenerar assets, no rediseñar el sistema.

### 2.2 Hallazgos de RIESGO

| # | Elemento | Ubicación | Problema | Mitigación |
|---|---|---|---|---|
| **R-1** | "Visitante · **Control y Comando**" | `docs/25` §2 | "Comando" tiene connotación militar (cadena de mando, puesto de mando). No es un objeto bélico, pero **la palabra** lo acerca | Renombrar a **"Control y Navegación"** o **"Sala de Control"** |
| **R-2** | "Visitante · **Reactor Nuclear**" + trébol de radiación | `docs/25` §2; `manifest.json` `icon: "radiation"` | El trébol es símbolo **civil** normalizado de peligro (ISO 7010), no militar. Pero "reactor nuclear" asociado a submarinos puede leerse como **propulsión de guerra** | Reformular a **generación de energía**; el trébol se admite solo en contexto de **seguridad técnica**, nunca de amenaza |
| **R-3** | Nombre **"Diploma de Visitante Submarino"** | `docs/25` §2, `BADGE-ACERO-DIPLOMA` | "Diploma" sugiere **certificación educativa**. ISA no certifica (`docs/31` §1) | Renombrar a **"Credencial de Visitante"** o **"Ficha de Recorrido"** |
| **R-4** | **Íconos por especialidad únicamente** | `cobre/manifest.json`: las 5 celdas de una fila comparten `icon` (`gear`, `bolt`, `sonar`, `helm`, `compass`) | Las celdas de igual especialidad y distinta disciplina **solo se distinguen por color**. Viola la regla "no depender solo del color" | Símbolo de **dos capas**: disciplina (campo) + especialidad (estructura) |
| **R-5** | **Rampa metálica** como identificador de especialidad | `docs/32` §4 | Saltos de **1,10:1 a 1,49:1** (computado, `docs/35` §2). Insuficiente por sí sola | Símbolo + código obligatorios |
| **R-6** | Nombre **"Credencial de Expedición Submarina"** | `docs/00` §8, §16 | "Credencial" puede leerse como **documento oficial habilitante** | Revisar. Si se conserva, el diseño debe ser claramente **coleccionable**, no documental |

### 2.3 Hallazgos de OBSERVACIÓN

| # | Elemento | Problema | Acción |
|---|---|---|---|
| **O-1** | `/images/m-torpedo.png` referenciado en `lib/missions.ts` línea 46 | Rastro del modelo viejo y de un motivo prohibido en el código | Reportar; **no corregir** (regla 15). Es insumo de `/insignias` |
| **O-2** | "Sala de Máquinas" (`RIB-AC-MAQUINAS`) | Término naval legítimo y civil (sala de máquinas existe en buques mercantes) | **Sin acción**: se admite |
| **O-3** | Uso de "submarino" en el nombre de ISA | Es el dominio del proyecto; no es bélico por sí mismo | **Sin acción** |
| **O-4** | Onda, hélice, brújula, timón | Iconografía civil/técnica | **Sin acción**: admitida |

---

## 3. Lista de vetos para la sesión de arte

### 3.1 PROHIBIDO

Armas · explosivos · munición · **torpedos** · tubos lanzatorpedos · miras · balística ·
cascos militares · uniformes · insignias militares reales · grados y galones ·
condecoraciones existentes o reconocibles · cruces y estrellas de orden · coronas ·
banderas y símbolos nacionales (reales o estilizados) · escudos de armas reales ·
glorificación del conflicto (explosiones, impacto, "acción", enemigo, objetivo) ·
**la guerra como contexto histórico** · eufemismos · camuflaje · calaveras · águilas ·
anclas con corona · laureles imperiales · dragones navales · retratos de personas reales ·
**texto generado por IA dentro de la imagen** · sellos y timbres · firmas y rúbricas ·
numeración serial · cintas de condecoración · pasadores · marcas de agua.

### 3.2 PERMITIDO CON CONDICIÓN

| Elemento | Condición |
|---|---|
| Trébol de radiación | Solo como **seguridad técnica civil** (ISO 7010), nunca como amenaza |
| "Reactor" | Solo en lenguaje de **generación de energía**, nunca de propulsión de guerra |
| Silueta de submarino | Solo como **curva abstracta del casco**; sin torreta de ataque, sin hélices en movimiento, sin estela |
| Globo con meridianos | Solo muy simplificado (≤3 curvas), **sin aros ni laureles**; riesgo de leerse como emblema de organismo internacional |
| "Comando" / "Control y Comando" | Solo si se renombra (R-1) |
| "Reactor Nuclear" | Solo si se reformula (R-2) |

### 3.3 PERMITIDO

Sistemas · herramientas · **válvulas** · **hélices** · **ondas** · aire · agua ·
**brújulas** · **mapas** · energía · biodiversidad · **redes comunitarias** ·
patrimonio · engranajes · baterías · periscopio (como instrumento óptico civil) ·
timón · rosa de los vientos · nodos y redes · retículas matemáticas.

> **Coincidencia con el usuario:** las tres listas coinciden con la iconografía que el
> usuario recomendó (regla 3 de su brief). No se encontraron conflictos entre su lista y
> la política vigente.

---

## 4. Riesgo de parecido con medallas reales

Reglas para que **ninguna pieza se confunda** con una condecoración:

| # | Regla | Motivo |
|---|---|---|
| 1 | **Sin cintas.** El ribbon ISA es un rectángulo troquelado, no una cinta | La cinta es el marcador #1 de condecoración |
| 2 | **Sin franjas centrales ni diagonales** en el ribbon | Patrón típico de cintas de órdenes |
| 3 | **Sin colores nacionales** en ninguna combinación | Evita lectura de bandera |
| 4 | **Sin cruz ni estrella** como forma principal | Formas de órdenes de mérito |
| 5 | **Sin corona, laurel imperial ni palma** | Símbolos de condecoración de Estado |
| 6 | **Sin suspensión ni anilla** | El ribbon no cuelga de nada |
| 7 | **Sin efigie ni busto** | Las medallas reales llevan efigie |
| 8 | **Sin lema ni divisa** en latín | Práctica de órdenes |
| 9 | **Sin número de serie visible** | Sugiere pieza oficial numerada |
| 10 | **Forma circular con campo y bisel**, como ficha o token | Se aleja de la medalla colgante |

**Prueba práctica:** mostrar la pieza a alguien sin contexto. Si la primera palabra que
dice es "medalla" o "condecoración", **el diseño falló**.

---

## 5. Riesgo de "parecer certificación oficial"

ISA **no certifica** (`docs/31` §1: no expide títulos, créditos, homologaciones ni
certificaciones profesionales). `docs/00` §17 registra el conflicto **"Credenciales"**
como pendiente de decisión. Mientras no se resuelva, **el arte va del lado seguro**.

### 5.1 Reglas

| # | Regla |
|---|---|
| 1 | Sin **sello** ni timbre de ninguna clase |
| 2 | Sin **firma** manuscrita ni rúbrica |
| 3 | Sin **escudo institucional** que sugiera aval |
| 4 | Sin **numeración serial** que parezca folio de título |
| 5 | Sin las palabras *certificate, certified, diploma, official, award, medal, decoration, honour, rank* — **ni su traducción** |
| 6 | Sin **códigos tipo credencial oficial** (formato de documento de identidad) |
| 7 | Sin la palabra **"válido"**, ni fechas de vigencia |
| 8 | Sin **QR ni código de verificación** que sugiera autenticidad institucional |
| 9 | Sin **logotipos de museos o asociaciones** como si avalaran |
| 10 | La credencial se diseña como **objeto coleccionable** (ficha), no como documento |

### 5.2 Nombres a revisar

| Nombre actual | Riesgo | Alternativa propuesta |
|---|---|---|
| `BADGE-ACERO-DIPLOMA` — "Diploma de Visitante Submarino" | **Alto**: "diploma" es certificación | **"Credencial de Visitante"** o **"Ficha de Recorrido"** |
| "Credencial de Expedición Submarina" | **Medio**: "credencial" puede leerse como habilitación | **"Ficha de Expedición"** o mantener con diseño claramente coleccionable |
| "Coin" (término en inglés) | **Bajo**: es un objeto de colección, no un documento | Sin cambio |

> ⚠️ **Estas decisiones son de producto, no de arte.** `docs/00` §17 las registra como
> conflicto a resolver. **No se resuelven desde la sesión de arte** (regla 8 de
> `AGENTS.md`). Se proponen alternativas y se espera decisión del usuario.

---

## 6. Derechos

### 6.1 Qué NO se puede copiar

| Categoría | Ejemplo | Riesgo |
|---|---|---|
| **Diseños de monedas existentes** | Cualquier moneda de curso legal o conmemorativa editada | Derecho de autor y, en muchos países, normativa específica sobre reproducción de moneda |
| **Emblemas de museos** | Logos de submarinos museo (USS Pampanito, HMS Alliance, etc.) | Marca registrada. Los museos aparecen en `lib/missions.ts` como **nodos**, no como avales |
| **Logos de asociaciones** | Asociaciones submarinistas | Marca registrada |
| **Escudos de armas** | Heráldica de ciudades, armadas, instituciones | Protección específica y sensibilidad |
| **Mascotas registradas** | — | Marca registrada |
| **Tipografías sin licencia** | — | Licencia de fuente |
| **Fotografías de referencia** | Fotos de piezas reales usadas como base | Derecho de autor del fotógrafo |

> **Advertencia:** `docs/00` §2 aclara que ISA puede inspirarse en lugares, objetos y
> personas reales, pero **la narrativa no constituye aval** de museos, asociaciones,
> veteranos ni instituciones. **Usar el nombre de un museo como "institución" en un badge
> sugeriría un aval que no existe.** Ver `docs/25`: los museos están como nodos
> narrativos, no como emisores de reconocimientos.

### 6.2 Checklist de originalidad para el ilustrador

| ✔ | Control |
|---|---|
| ☐ | No usé ninguna imagen de referencia para calcar |
| ☐ | No reproduzco símbolos de ninguna institución existente |
| ☐ | No usé tipografías sin licencia |
| ☐ | El símbolo es **original** y no deriva de una moneda o medalla real |
| ☐ | Puedo describir el símbolo **por escrito** sin mirar una referencia |
| ☐ | El resultado no se confunde con ninguna condecoración existente |
| ☐ | No incluí nombres de museos o asociaciones reales |
| ☐ | Registré qué referencias miré (para trazabilidad) |

### 6.3 Titularidad del escudo ISA

`docs/32` §5 (línea 65) establece que los colores de disciplina provienen del **escudo de
la academia**, tomados de `lib/missions.ts` (`DISCIPLINE_META`, líneas 22–29).

**Verificado:** `lib/missions.ts` línea 22 dice literalmente: *"Colores tomados de los
cuadrantes del escudo de la academia."*

**Pregunta abierta:** ¿quién es el **autor y titular** de ese escudo?
**No se puede determinar desde el repositorio.** No hay registro de autoría ni de licencia
en los documentos leídos.

**Recomendación:** antes de vectorizar el monograma ISA para los badges, **confirmar con
el usuario** la titularidad y el estado de derechos del escudo. Si el escudo tiene autor
externo, se necesita autorización para derivar un monograma.

> **Requiere confirmación del usuario.** No es una cuestión que el agente pueda resolver.

---

## 7. Banderas y símbolos nacionales

**Regla: cero banderas y cero símbolos nacionales.**

Alcance del veto:

1. Banderas reales de cualquier país, en cualquier estilo.
2. Versiones "estilizadas" o "abstractas" de una bandera reconocible.
3. Combinaciones de colores que **evoquen** una bandera concreta.
4. **Globo terráqueo con meridianos completos** con aros o laureles: puede leerse como
   emblema de organismo internacional (ONU y similares). Admitido **solo** muy
   simplificado (≤3 curvas) y sin aros.
5. **"Internacional" representado por banderas múltiples**: prohibido.

**Alternativa aprobada** para "internacional": el **agua** (onda continua), que es
transversal a todos los países y no pertenece a ninguno. Es la solución del anverso común
propuesto en `docs/34` §1.2.

---

## 8. Protocolo de revisión

### 8.1 Checklist final binario (por pieza)

Aplicable por cualquier revisor, antes de publicar. **Un solo "NO" detiene la publicación.**

| # | Control | SÍ/NO |
|---|---|---|
| 1 | ¿Aparece un arma, explosivo, munición o torpedo? | ☐ |
| 2 | ¿Aparece una insignia, grado, uniforme o casco militar? | ☐ |
| 3 | ¿Aparece una condecoración, cruz, estrella, corona o cinta? | ☐ |
| 4 | ¿Aparece una bandera o símbolo nacional? | ☐ |
| 5 | ¿Alude a guerra, combate o conflicto, incluso como contexto? | ☐ |
| 6 | ¿Usa un eufemismo para conservar un objeto bélico? | ☐ |
| 7 | ¿Parece un certificado, diploma o documento oficial? | ☐ |
| 8 | ¿Tiene sello, firma, escudo, serial o palabra de certificación? | ☐ |
| 9 | ¿Copia una moneda, emblema, logo o medalla existente? | ☐ |
| 10 | ¿Incluye un retrato de persona real? | ☐ |
| 11 | ¿Incluye texto generado dentro de la imagen? | ☐ |
| 12 | ¿Depende solo del color para comunicar? | ☐ |
| 13 | ¿Se confunde con una medalla a primera vista? | ☐ |
| 14 | ¿Usa nombre de museo o asociación como si avalara? | ☐ |
| 15 | ¿Tiene alt-text sin palabras prohibidas? | ☐ |

**Interpretación:** las preguntas 1 a 11 se responden **NO** para aprobar. Las preguntas
12 a 15 se responden **SÍ** para aprobar.

### 8.2 Quién revisa

| Rol | Responsabilidad |
|---|---|
| Ilustrador | Checklist de originalidad (§6.2) |
| Dirección de arte | Consistencia y legibilidad |
| **Revisor no bélico** | Checklist §8.1 (este documento) |
| Usuario | Decisión sobre nombres y criterios de otorgamiento |

---

## 9. Veredicto

**La sesión de arte, tal como está planteada, es compatible con la política vigente**,
con **dos correcciones obligatorias** antes de producir:

1. **Reemplazar el motivo "Proa/torpedo"** de `RIB-AC-PROA` por hidrodinámica (B-1).
   *Nota: el asset ya usa `bow`; el problema está en `docs/25`.*
2. **Regenerar los ribbons de Cobre** con el modelo vigente de 20 STEM + 15 FH (B-2).

Y **tres decisiones de producto** pendientes del usuario:

3. Renombrar "Control y Comando" (R-1).
4. Reformular "Reactor Nuclear" (R-2).
5. Renombrar "Diploma de Visitante Submarino" (R-3).

**No se identificó ningún elemento de la propuesta de arte** —dirección, sistema, paleta,
prompts, producción— **que requiera contenido bélico o certificante.** El sistema
propuesto es, por diseño, más restrictivo que el estado actual del repositorio.

**El riesgo principal no es la sesión de arte: es el contenido heredado** (`docs/25` y los
25 assets), que arrastra el modelo viejo y el motivo prohibido.

---

## 10. Verificación y límites

**Comprobado:**

- `docs/25` §2 línea 34 contiene "Proa/torpedo" para `RIB-AC-PROA` (leído).
- `docs/31` §2 prohíbe torpedos y la guerra como contenido (leído).
- `public/images/badges/acero/manifest.json` usa `icon: "bow"`, **sin** la palabra torpedo
  (extraído y verificado).
- `public/images/badges/cobre/manifest.json` tiene **25** ribbons con `HUM-*` y el icono
  depende **solo** de la especialidad (extraído y verificado).
- `lib/missions.ts` línea 22 atribuye los colores al escudo; línea 46 referencia
  `/images/m-torpedo.png` (leído).
- `docs/31` §1 establece que ISA no certifica (leído).
- `docs/00` §17 registra el conflicto "Credenciales" como no resuelto (leído).

**No comprobado:**

- **La titularidad del escudo ISA.** No hay registro de autoría en el repositorio.
  **Requiere confirmación del usuario.**
- Si "Control y Comando" o "Reactor Nuclear" provienen de vocabulario militar real: se
  marcan por **riesgo de lectura**, no por certeza.
- Si algún museo mencionado en `lib/missions.ts` reclamó o podría reclamar uso de marca.
- El estado de derechos de las tipografías (Inter, Barlow Condensed vía `next/font/google`).

**Limitaciones:**

- **Este documento no es asesoría legal.** Las cuestiones de derechos de autor, marca
  registrada y reproducción de moneda **requieren asesoría profesional** si el proyecto
  avanza a producción comercial o física.
- Las clasificaciones BLOQUEANTE/RIESGO/OBSERVACIÓN son **criterio de revisión**, no
  determinaciones legales.
- No modifica la app, no edita `docs/25`, no regenera assets y no hace commit.
