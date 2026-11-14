# ISA · Prompts de generación de badges — template y 35 prompts resueltos

**Estado:** PROPUESTA pendiente de revisión del usuario.
**Fecha:** 10/11/2026.
**Uso:** los prompts son para **exploración y concepto**. El arte final se **vectoriza**
(decisión 6 del usuario). Ninguna imagen generada se publica tal cual.

**Insumos:** `docs/33_BRIEF_DIRECCION_ARTE.md`, `docs/34_SISTEMA_BADGES.md`,
`docs/35_PALETA_BADGES.md`, `docs/31_POLITICA_VIGENTE.md`.

---

## 0. Cómo usar este documento

1. **§1 — Template:** la estructura obligatoria de todo prompt, con las variables.
2. **§2 — Bloques reutilizables:** material, iluminación, cámara, negativo. Se copian.
3. **§3 — 20 prompts STEM resueltos** (uno por celda).
4. **§4 — 15 prompts de Factor Humano (placeholder).**
5. **§5 — Variantes flat / photo.**
6. **§6 — Reglas de uso.** Léanlas antes de generar: hay usos prohibidos.

> **REGLA DE ORO:** el prompt **nunca** pide texto. Si el modelo dibuja letras, la imagen
> se descarta. El lettering va aparte, en vector (regla dura 6).

---

## 1. Template obligatorio

Todo prompt tiene **7 bloques, en este orden**. Los corchetes son variables.

```text
[1 SUJETO Y COMPOSICIÓN]
Commemorative circular medal, [TIPO: coin | ribbon], engraved relief, concentric
border rings, [CARA: obverse with a central monogram and a continuous wave band |
reverse with [SÍMBOLO] at the centre], raised rim, empty outer ring reserved for
future lettering, perfectly centred, symmetrical, 1:1 square composition.

[2 MATERIALES Y ACABADO]
[MATERIAL: patinated copper | antique bronze | satin steel | polished silver |
satin gold], [ACABADO], [ZONAS ESMALTADAS: a single recessed enamel field in
[HEX DISCIPLINA]], thin dark separation line between enamel and metal, subtle
micro-texture on the field.

[3 PALETA EXACTA]
Metal base [HEX METAL]; discipline enamel [HEX DISCIPLINA]; structural accent
(muesca) [HEX RAMPA]; field background [HEX #0A0A0A]; separation line [HEX #3A3A3A].

[4 ILUMINACIÓN Y FONDO]
Soft overhead diffuse light, slightly angled, gentle relief shadow, low frontal
fill, controlled specular highlight on the rim only, no dramatic contrast; plain
dark neutral background #0A0A0A, faint vignette, no props, no surface.

[5 ESTILO / CÁMARA]
Macro photograph of a commemorative medal, 1:1 aspect ratio, high depth of field,
centred, product shot, sharp detail on the relief.

[6 NEGATIVE PROMPT]
text, letters, numbers, words, typography, watermark, signature, logo, weapons,
guns, torpedoes, ammunition, explosives, military insignia, military helmet,
medals of honour, real decorations, orders, crosses, stars, crowns, flags,
national symbols, war, battle, explosion, camouflage, skulls, eagles, anchors
with crown, laurel wreaths, certification seal, official stamp, serial number,
deformed, distorted, blurry, noisy, jpeg artifacts, extra rings, asymmetric.

[7 VARIANTE]
[FLAT VECTOR | PHOTOREAL MOCKUP] — ver §5.
```

### 1.1 Variables de disciplina → símbolo

| Código | Símbolo (campo) | Textura | Hex Cobre |
|---|---|---|---|
| SCI | water drop inside an orbit, or a molecule | punteado | `#199FC6` |
| TEC | a node connected to three links | reticulado | `#309833` |
| ING | a gear meshing with a valve wheel | estriado radial | `#DA5291` |
| MAT | a square grid with a diagonal and a spiral | liso | `#D9B717` |
| HUM | two open curved lines interlacing (no hands, no faces) | ondulado | `#D27E0C` |

### 1.2 Variables de especialidad → estructura

| Código | Símbolo (muesca / estructura) | Hex rampa Cobre |
|---|---|---|
| MAQ | gear with an axle | `#855930` |
| ELE | lightning bolt inside a coil | `#9B612B` |
| ELN | sine wave crossing a small node | `#B87333` |
| NAV | ship wheel above a hull curve | `#C38954` |
| LOG | compass rose beside a crate | `#CFA074` |

---

## 2. Bloques reutilizables

### 2.1 Material por temporada

| Temporada | Bloque de material |
|---|---|
| Acero | `satin-brushed steel, cool blue-grey, diffuse soft highlight, faint machining lines, minimal patina` |
| Cobre | `patinated copper, warm orange-red, darkened recesses, subtle verdigris deep in the relief` |
| Bronce | `antique bronze, deep golden-brown, heavier patina, faint green in the crevices` |
| Plata | `polished silver, cold mirror finish, crisp specular reflection, no wear` |
| Oro | `satin gold, warm yellow, broad soft highlight, no gaudy sparkle` |

### 2.2 Iluminación (fija, no se cambia)

```text
soft overhead diffuse light, angled about 15 degrees, soft relief shadow,
low frontal fill so recesses stay readable, controlled specular highlight on
the raised rim only, neutral colour temperature around 5500K, no coloured gel,
no rim light, no halo, soft wide contact shadow, no hard shadow.
```

### 2.3 Fondo (fijo, no se cambia)

```text
plain dark neutral background #0A0A0A, very faint vignette, no props, no
surface, no texture, the object floats centred in frame.
```

### 2.4 Cámara (fija, no se cambia)

```text
macro product photograph of a commemorative medal, 1:1 square aspect ratio,
high depth of field, straight-on top view, perfectly centred, sharp focus on
the raised relief, no perspective distortion.
```

### 2.5 Negative prompt maestro

Se repite literalmente en los 35 prompts. El bloque completo está en §1, bloque 6.
**Ninguna línea del negative puede eliminarse**: cada una tapa un riesgo real
(instrucciones del usuario + hallazgos de `docs/36`).

---

## 3. Los 20 prompts STEM resueltos

Temporada **Cobre** (`#B87333`). El metal y los hex cambian por temporada (§5.2).

Cada prompt se arma como: **§1 con las variables resueltas + §2.1 material + §2.2 + §2.3
+ §2.4 + negative de §1 + variante**. Abajo va la **parte resolutiva** de cada uno; los
bloques fijos se agregan tal cual.

---

### 3.1 SCI·MAQ — Ciencia × Maquinista

**Símbolo:** gota de agua dentro de una órbita · **Estructura:** engranaje con eje
**Hex:** metal `#B87333` · disciplina `#199FC6` · rampa `#855930`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a single water drop enclosed by a thin orbit, and
below it a small gear with a visible axle in low relief, raised rim, empty outer
ring reserved for future lettering, perfectly centred, symmetrical, 1:1 square
composition.
[2] Patinated copper, warm orange-red, darkened recesses, subtle verdigris deep
in the relief; a single recessed enamel field in cyan #199FC6 filling the drop;
thin dark separation line between enamel and metal; fine stippled micro-texture
on the field.
[3] Metal base #B87333; discipline enamel #199FC6; structural accent #855930;
field background #0A0A0A; separation line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro
[7] flat vector (art layer)
```

### 3.2 SCI·ELE — Ciencia × Electricista

**Símbolo:** gota dentro de órbita · **Estructura:** rayo dentro de bobina
**Hex:** `#B87333` · `#199FC6` · `#9B612B`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a single water drop enclosed by a thin orbit, and
below it a lightning bolt coiled inside a spiral, low relief, raised rim, empty
outer ring, centred, symmetrical, 1:1.
[2] Patinated copper with darkened recesses; enamel field in cyan #199FC6 on the
drop; dark separation line; stippled micro-texture.
[3] Metal #B87333; enamel #199FC6; accent #9B612B; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.3 SCI·ELN — Ciencia × Electrónico

**Símbolo:** gota dentro de órbita · **Estructura:** onda senoidal con nodo
**Hex:** `#B87333` · `#199FC6` · `#B87333`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a water drop inside a thin orbit, crossed below by a
gentle sine wave passing through a small node, raised rim, empty outer ring,
centred, symmetrical, 1:1.
[2] Patinated copper; cyan #199FC6 enamel on the drop; dark separation line;
stippled texture.
[3] Metal #B87333; enamel #199FC6; accent #B87333; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.4 SCI·NAV — Ciencia × Ingeniero Naval

**Símbolo:** gota dentro de órbita · **Estructura:** timón sobre curva de carena
**Hex:** `#B87333` · `#199FC6` · `#C38954`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a water drop inside a thin orbit, and beneath it a
ship wheel resting on a single smooth hull curve, raised rim, empty outer ring,
centred, symmetrical, 1:1.
[2] Patinated copper; cyan #199FC6 enamel on the drop; dark separation line;
stippled texture.
[3] Metal #B87333; enamel #199FC6; accent #C38954; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.5 SCI·LOG — Ciencia × Logístico

**Símbolo:** gota dentro de órbita · **Estructura:** rosa de los vientos junto a caja
**Hex:** `#B87333` · `#199FC6` · `#CFA074`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a water drop inside a thin orbit, beside it a simple
compass rose and a plain supply crate, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; cyan #199FC6 enamel on the drop; dark separation line;
stippled texture.
[3] Metal #B87333; enamel #199FC6; accent #CFA074; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

---

### 3.6 TEC·MAQ — Tecnología × Maquinista

**Símbolo:** nodo con tres enlaces · **Estructura:** engranaje con eje
**Hex:** `#B87333` · `#309833` · `#855930`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a single circular node connected to three short
links forming a network, below it a gear with a visible axle, raised rim, empty
outer ring, centred, symmetrical, 1:1.
[2] Patinated copper; a single recessed enamel field in green #309833 on the
node; dark separation line; fine cross-hatched micro-texture on the field.
[3] Metal #B87333; enamel #309833; accent #855930; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.7 TEC·ELE — Tecnología × Electricista

**Símbolo:** nodo con tres enlaces · **Estructura:** rayo en bobina
**Hex:** `#B87333` · `#309833` · `#9B612B`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a circular node connected to three links, below it a
lightning bolt coiled inside a spiral, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; green #309833 enamel on the node; dark separation line;
cross-hatched texture.
[3] Metal #B87333; enamel #309833; accent #9B612B; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.8 TEC·ELN — Tecnología × Electrónico

**Símbolo:** nodo con tres enlaces · **Estructura:** onda senoidal con nodo
**Hex:** `#B87333` · `#309833` · `#B87333`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a circular node with three links, a gentle sine wave
passing through a small node beneath, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; green #309833 enamel on the node; dark separation line;
cross-hatched texture.
[3] Metal #B87333; enamel #309833; accent #B87333; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.9 TEC·NAV — Tecnología × Ingeniero Naval

**Símbolo:** nodo con tres enlaces · **Estructura:** timón sobre carena
**Hex:** `#B87333` · `#309833` · `#C38954`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a circular node with three links, beneath it a ship
wheel on a smooth hull curve, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; green #309833 enamel on the node; dark separation line;
cross-hatched texture.
[3] Metal #B87333; enamel #309833; accent #C38954; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.10 TEC·LOG — Tecnología × Logístico

**Símbolo:** nodo con tres enlaces · **Estructura:** rosa de los vientos y caja
**Hex:** `#B87333` · `#309833` · `#CFA074`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a circular node with three links, beside it a
compass rose and a plain supply crate, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; green #309833 enamel on the node; dark separation line;
cross-hatched texture.
[3] Metal #B87333; enamel #309833; accent #CFA074; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

---

### 3.11 ING·MAQ — Ingeniería × Maquinista

**Símbolo:** engranaje con válvula · **Estructura:** engranaje con eje
**Hex:** `#B87333` · `#DA5291` · `#855930`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a gear meshing with a valve handwheel shown in
section, below it a small gear with a visible axle, raised rim, empty outer ring,
centred, symmetrical, 1:1.
[2] Patinated copper; a single recessed enamel field in magenta #DA5291 on the
valve wheel; dark separation line; fine radial micro-texture on the field.
[3] Metal #B87333; enamel #DA5291; accent #855930; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.12 ING·ELE — Ingeniería × Electricista

**Símbolo:** engranaje con válvula · **Estructura:** rayo en bobina
**Hex:** `#B87333` · `#DA5291` · `#9B612B`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a gear meshing with a valve handwheel, below it a
lightning bolt inside a spiral coil, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; magenta #DA5291 enamel on the valve wheel; dark separation
line; radial texture.
[3] Metal #B87333; enamel #DA5291; accent #9B612B; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.13 ING·ELN — Ingeniería × Electrónico

**Símbolo:** engranaje con válvula · **Estructura:** onda senoidal con nodo
**Hex:** `#B87333` · `#DA5291` · `#B87333`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a gear meshing with a valve handwheel, a sine wave
crossing a small node beneath, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; magenta #DA5291 enamel on the valve wheel; dark separation
line; radial texture.
[3] Metal #B87333; enamel #DA5291; accent #B87333; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.14 ING·NAV — Ingeniería × Ingeniero Naval

**Símbolo:** engranaje con válvula · **Estructura:** timón sobre carena
**Hex:** `#B87333` · `#DA5291` · `#C38954`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a gear meshing with a valve handwheel, beneath it a
ship wheel on a smooth hull curve, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; magenta #DA5291 enamel on the valve wheel; dark separation
line; radial texture.
[3] Metal #B87333; enamel #DA5291; accent #C38954; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.15 ING·LOG — Ingeniería × Logístico

**Símbolo:** engranaje con válvula · **Estructura:** rosa de los vientos y caja
**Hex:** `#B87333` · `#DA5291` · `#CFA074`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a gear meshing with a valve handwheel, beside it a
compass rose and a plain supply crate, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; magenta #DA5291 enamel on the valve wheel; dark separation
line; radial texture.
[3] Metal #B87333; enamel #DA5291; accent #CFA074; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

---

### 3.16 MAT·MAQ — Matemática × Maquinista

**Símbolo:** retícula con diagonal y espiral · **Estructura:** engranaje con eje
**Hex:** `#B87333` · `#D9B717` · `#855930`

> ⚠️ **Caso frágil.** Matemática es el color más claro del sistema. En Plata
> (`#DBCE40` sobre `#C0C7CE`) el contraste es **1,05:1** (`docs/35` §2.3). En Cobre el
> par es 1,94:1, aceptable pero bajo: **exige contorno oscuro**.

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a square grid crossed by a single diagonal, with a
small spiral in one corner, below it a gear with a visible axle, raised rim,
empty outer ring, centred, symmetrical, 1:1.
[2] Patinated copper; a single recessed enamel field in soft yellow #D9B717 on
the grid; a clear dark separation line around the enamel is essential; smooth
field, no micro-texture.
[3] Metal #B87333; enamel #D9B717; accent #855930; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.17 MAT·ELE — Matemática × Electricista

**Hex:** `#B87333` · `#D9B717` · `#9B612B`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a square grid crossed by a diagonal with a small
spiral, below it a lightning bolt inside a spiral coil, raised rim, empty outer
ring, centred, symmetrical, 1:1.
[2] Patinated copper; yellow #D9B717 enamel on the grid; clear dark separation
line essential; smooth field.
[3] Metal #B87333; enamel #D9B717; accent #9B612B; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.18 MAT·ELN — Matemática × Electrónico

**Hex:** `#B87333` · `#D9B717` · `#B87333`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a square grid with a diagonal and a small spiral, a
sine wave through a node beneath, raised rim, empty outer ring, centred,
symmetrical, 1:1.
[2] Patinated copper; yellow #D9B717 enamel on the grid; clear dark separation
line essential; smooth field.
[3] Metal #B87333; enamel #D9B717; accent #B87333; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.19 MAT·NAV — Matemática × Ingeniero Naval

**Hex:** `#B87333` · `#D9B717` · `#C38954`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a square grid with a diagonal and a small spiral,
beneath it a ship wheel on a smooth hull curve, raised rim, empty outer ring,
centred, symmetrical, 1:1.
[2] Patinated copper; yellow #D9B717 enamel on the grid; clear dark separation
line essential; smooth field.
[3] Metal #B87333; enamel #D9B717; accent #C38954; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

### 3.20 MAT·LOG — Matemática × Logístico

**Hex:** `#B87333` · `#D9B717` · `#CFA074`

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre a square grid with a diagonal and a small spiral,
beside it a compass rose and a plain supply crate, raised rim, empty outer ring,
centred, symmetrical, 1:1.
[2] Patinated copper; yellow #D9B717 enamel on the grid; clear dark separation
line essential; smooth field.
[3] Metal #B87333; enamel #D9B717; accent #CFA074; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

---

## 4. Los 15 prompts de Factor Humano (PLACEHOLDER)

> **BLOQUEADO.** Los 15 temas no están definidos en los documentos del repositorio
> (`docs/34` §7.5). **No se inventan temas ni símbolos.** Abajo va el **template
> resuelto salvo el símbolo**, listo para completar cuando existan los temas.

### 4.1 Template FH

```text
[1] Commemorative circular medal, reverse face, engraved relief, concentric
border rings, at the centre [SÍMBOLO DEL TEMA] rendered as two open interlacing
curved lines, with a small mark reading as FH·[NN] formed only by geometric
shapes and NOT by letters, raised rim, empty outer ring reserved for future
lettering, centred, symmetrical, 1:1.
[2] Patinated copper, warm orange-red, darkened recesses, subtle verdigris deep
in the relief; a single recessed enamel field in orange #D27E0C; thin dark
separation line; gently undulating micro-texture on the field.
[3] Metal #B87333; discipline enamel #D27E0C; accent per specialty; field
#0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro   [7] flat vector
```

**Nota:** la marca `FH·NN` se pide como **formas geométricas**, nunca como texto. Si el
modelo dibuja letras, la imagen se descarta.

### 4.2 Los 15 temas

| # | ID | Tema | Símbolo | Estado |
|---:|---|---|---|---|
| 1 | `RIB-FH-01` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 2 | `RIB-FH-02` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 3 | `RIB-FH-03` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 4 | `RIB-FH-04` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 5 | `RIB-FH-05` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 6 | `RIB-FH-06` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 7 | `RIB-FH-07` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 8 | `RIB-FH-08` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 9 | `RIB-FH-09` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 10 | `RIB-FH-10` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 11 | `RIB-FH-11` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 12 | `RIB-FH-12` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 13 | `RIB-FH-13` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 14 | `RIB-FH-14` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |
| 15 | `RIB-FH-15` | ⚠️ Pendiente | ⚠️ Pendiente | **Bloqueado** |

**Marco visual ya definido** (`docs/34` §4.2): familia de forma **abierta**, textura
ondulada, ángulo en **anillo interno**, campo temático según `docs/31` §7 (convivencia,
comunicación, descanso, inclusión, cuidado de la tripulación, historia y patrimonio).

### 4.3 Cómo completar cada prompt

Cuando exista el tema, se reemplaza **una sola cosa** en §4.1: `[SÍMBOLO DEL TEMA]`.
El resto del prompt es idéntico para los 15. Eso garantiza consistencia.

**Restricciones del símbolo del tema:**
1. Sin figuras humanas reconocibles, sin caras, sin manos detalladas (decisión 4).
2. Sin nada bélico ni eufemístico (`docs/31` §2).
3. Debe leerse **en negro puro a 32 px**.
4. Debe pertenecer a la familia de forma **abierta** (curvas que no cierran).

---

## 5. Variantes flat y photo

### 5.1 Variante "flat vector" (capa de arte)

Reemplaza el bloque `[5]`:

```text
flat vector illustration, clean geometric shapes, uniform stroke weight, no
gradients, no shadows, no texture, solid flat colours only, crisp edges,
centred on a plain transparent background, suitable for vector tracing.
```

**Uso:** capa de arte, base para vectorizar, ícono de interfaz.
**Con esta variante:** se **omiten** los bloques de iluminación (§2.2) y de acabado
fotográfico, porque no aplican.

### 5.2 Variante "photoreal mockup"

Reemplaza el bloque `[5]`:

```text
photorealistic product mockup, macro lens 100mm, f/8, high depth of field,
straight-on top view, soft studio lighting as specified, sharp relief detail,
realistic metal reflections, 1:1 square aspect ratio.
```

**Uso:** presentación, mockup de acuñación, vista previa para el equipo.
**Con esta variante:** se aplican **todos** los bloques (material, iluminación, fondo).

### 5.3 Tabla de variantes por temporada

El prompt es el mismo; cambia **solo el material** (§2.1) y los hex.

| Temporada | Metal hex | Material block | Nota |
|---|---|---|---|
| Acero | `#8FA3B0` | satin-brushed steel | **Sin** disciplina: símbolo en metal, no esmalte |
| Cobre | `#B87333` | patinated copper | Temporada de referencia (los 20 prompts de §3) |
| Bronce | `#CD7F32` | antique bronze | Reemplazar hex y bloque |
| Plata | `#C0C7CE` | polished silver | ⚠️ Matemática exige inversión de campo |
| Oro | `#D4AF37` | satin gold | ⚠️ Contorno oscuro obligatorio en todas |

### 5.4 Prompt del anverso común

Un solo prompt sirve para las 44 piezas (solo cambia el metal):

```text
[1] Commemorative circular medal, obverse face, engraved relief, concentric
border rings, at the centre a simple original monogram formed by geometric
shapes forming the letters I, S and A, enclosed in a plain circular field, a
continuous low wave band running around the field, and small raised dots on the
outer ring marking the season, raised rim, perfectly centred, symmetrical, 1:1.
[2] [material block por temporada]; no enamel, metal only; subtle micro-texture
on the field.
[3] Metal base [HEX METAL]; no discipline colour; field #0A0A0A; line #3A3A3A.
[4] + §2.2   [5] + §2.4   [6] + negative maestro
[7] flat vector (art layer)
```

> ⚠️ El monograma es **diseño original pendiente**. Debe confirmarse contra el escudo
> real de ISA antes de producirlo (`docs/34` §7.4).

---

## 6. Reglas de uso de los prompts

### 6.1 Obligatorio

1. **Un prompt por badge.** No generar una grilla de 20 en una sola imagen: se pierde
   control de detalle y de composición.
2. **El lettering no se pide nunca.** El anillo se pide **vacío**.
3. **El negative prompt va completo.** No se recorta.
4. **Toda imagen generada se revisa** contra `docs/36_REVISION_NO_BELICA.md` antes de
   usarse como referencia.
5. **Las variantes flat y photo se generan por separado**, no en la misma imagen.

### 6.2 Prohibido

1. **Publicar una imagen generada como asset final.** El arte final se vectoriza
   (decisión 6). Las imágenes son **exploración**.
2. **Usarlas como capa de interfaz** sin vectorizar.
3. **Pedir texto, letras o números** al modelo, ni siquiera "solo el código SCI".
4. **Pedir retratos** de personas reales (decisión 4).
5. **Iterar sobre una imagen que ya violó una regla dura**: se descarta y se regenera
   desde el prompt, no se "arregla" con edición.
6. **Aceptar una imagen con marcas de agua** o firma de modelo.

### 6.3 Checklist rápido por imagen generada

| ✔ | Control |
|---|---|
| ☐ | Sin texto, letras ni números legibles |
| ☐ | Sin armas, torpedos, insignias, banderas, condecoraciones |
| ☐ | Sin retratos ni figuras humanas reconocibles |
| ☐ | El símbolo se reconoce en negro puro |
| ☐ | El anillo exterior está vacío |
| ☐ | Los hex de la imagen se acercan a los de `docs/35` (verificar con cuentagotas) |
| ☐ | Fondo oscuro neutro, sin props |
| ☐ | Composición centrada y simétrica |
| ☐ | Sin marcas de agua ni firmas |

---

## 7. Verificación y límites

**Comprobado:**

- Los 20 prompts STEM cubren las 20 combinaciones 4 disciplinas × 5 especialidades
  (verificado contra `docs/34` §4.1).
- Los hex usados provienen de `lib/data/datasets/palette.json` (Cobre) y fueron
  verificados con script en `docs/35`.
- El negative prompt cubre las prohibiciones del usuario (armas, explosivos, munición,
  torpedos, miras, cascos militares, insignias militares reales, condecoraciones
  existentes, banderas y símbolos nacionales, glorificación del conflicto) más texto,
  marcas de agua, deformaciones y ruido.
- Los iconos de especialidad propuestos (`docs/34` §6.2) reemplazan los del manifiesto
  actual, que solo distinguían por color.

**No comprobado:**

- **Que los prompts produzcan el resultado esperado.** No se ejecutó ningún modelo de
  generación de imágenes en esta sesión. Los prompts están **sin validar contra salida
  real**.
- Que el negative prompt sea suficiente para impedir texto en todos los modelos: cada
  modelo responde distinto y requiere ajuste empírico.
- Los símbolos definitivos de los 15 temas FH (bloqueado).
- Que la paleta renderizada en la imagen coincida con el hex pedido: los modelos de
  imagen **no respetan hex exactos de forma fiable**. Es una limitación conocida del
  medio, no del prompt.

**Limitaciones:**

- **Los 15 prompts de Factor Humano están bloqueados** y son placeholders. Solo 20 de 35
  prompts están resueltos.
- No se generó ninguna imagen. Este documento es **especificación de prompts**.
- No modifica la app, no crea assets en `public/`, no hace commit.
