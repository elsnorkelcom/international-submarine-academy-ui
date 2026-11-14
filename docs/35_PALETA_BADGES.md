# ISA · Paleta de badges por temporada — metales, esmaltes y contraste verificado

**Estado:** PROPUESTA pendiente de revisión del usuario.
**Fecha:** 10/11/2026.
**Fuente de verdad de color:** `lib/data/datasets/palette.json` (todos los hex de este
documento salen de ahí, salvo los marcados como *derivado propuesto*).
**Insumos:** `docs/32_GRILLA_COBRE_COLORES.md`, `docs/31_POLITICA_VIGENTE.md`,
`docs/33_BRIEF_DIRECCION_ARTE.md`.

> **Nota de método.** Todos los ratios de contraste de este documento fueron **computados**
> con la fórmula WCAG 2.1 (ver §2), ejecutando un script sobre `palette.json`. No son
> estimaciones. Las diferencias con los números publicados en `docs/32` §4 se reportan en §6.

---

## 1. Paleta por temporada

### 1.1 Acero — STEEL (solo metal)

| Rol | Token | Hex |
|---|---|---|
| Metal base | `--badge-steel-metal` | `#8FA3B0` |
| Rampa especialidad 1 (MAQ) | `--badge-steel-ramp-1` | `#616F78` |
| Rampa especialidad 2 (ELE) | `--badge-steel-ramp-2` | `#788994` |
| Rampa especialidad 3 (ELN) | `--badge-steel-ramp-3` | `#8FA3B0` |
| Rampa especialidad 4 (NAV) | `--badge-steel-ramp-4` | `#A1B2BD` |
| Rampa especialidad 5 (LOG) | `--badge-steel-ramp-5` | `#B3C0C9` |
| **Disciplinas STEM** | — | **NINGUNA** |

**Acero no lleva colores de disciplina.** Lo declara `docs/32` §3 y lo confirma
`palette.json` (`"disciplines": {}` con la nota *"Acero no usa dimensiones STEM: se
representa solo con su metal"*). Acero no tiene preguntas TIMSS ni dominios STEM: su
codificación es **solo metal + neutros**.

### 1.2 Cobre — COPPER

| Rol | Token | Hex |
|---|---|---|
| Metal base | `--badge-copper-metal` | `#B87333` |
| Rampa 1 (MAQ) | `--badge-copper-ramp-1` | `#855930` |
| Rampa 2 (ELE) | `--badge-copper-ramp-2` | `#9B612B` |
| Rampa 3 (ELN) | `--badge-copper-ramp-3` | `#B87333` |
| Rampa 4 (NAV) | `--badge-copper-ramp-4` | `#C38954` |
| Rampa 5 (LOG) | `--badge-copper-ramp-5` | `#CFA074` |
| Ciencia | `--badge-copper-sci` | `#199FC6` |
| Tecnología | `--badge-copper-tec` | `#309833` |
| Ingeniería | `--badge-copper-ing` | `#DA5291` |
| Matemática | `--badge-copper-mat` | `#D9B717` |
| Factor Humano | `--badge-copper-hum` | `#D27E0C` |

### 1.3 Bronce — BRONZE

| Rol | Token | Hex |
|---|---|---|
| Metal base | `--badge-bronze-metal` | `#CD7F32` |
| Rampa 1 (MAQ) | `--badge-bronze-ramp-1` | `#8B5622` |
| Rampa 2 (ELE) | `--badge-bronze-ramp-2` | `#AC6B2A` |
| Rampa 3 (ELN) | `--badge-bronze-ramp-3` | `#CD7F32` |
| Rampa 4 (NAV) | `--badge-bronze-ramp-4` | `#D59353` |
| Rampa 5 (LOG) | `--badge-bronze-ramp-5` | `#DDA874` |
| Ciencia | `--badge-bronze-sci` | `#1FA1C6` |
| Tecnología | `--badge-bronze-tec` | `#369B32` |
| Ingeniería | `--badge-bronze-ing` | `#DB498A` |
| Matemática | `--badge-bronze-mat` | `#DDBA16` |
| Factor Humano | `--badge-bronze-hum` | `#D67F0B` |

### 1.4 Plata — SILVER

| Rol | Token | Hex |
|---|---|---|
| Metal base | `--badge-silver-metal` | `#C0C7CE` |
| Rampa 1 (MAQ) | `--badge-silver-ramp-1` | `#83878C` |
| Rampa 2 (ELE) | `--badge-silver-ramp-2` | `#A1A7AD` |
| Rampa 3 (ELN) | `--badge-silver-ramp-3` | `#C0C7CE` |
| Rampa 4 (NAV) | `--badge-silver-ramp-4` | `#CAD0D6` |
| Rampa 5 (LOG) | `--badge-silver-ramp-5` | `#D4D9DE` |
| Ciencia | `--badge-silver-sci` | `#13ADE9` |
| Tecnología | `--badge-silver-tec` | `#2FAB58` |
| Ingeniería | `--badge-silver-ing` | `#D750A7` |
| Matemática | `--badge-silver-mat` | `#DBCE40` |
| Factor Humano | `--badge-silver-hum` | `#D49335` |

### 1.5 Oro — GOLD

| Rol | Token | Hex |
|---|---|---|
| Metal base | `--badge-gold-metal` | `#D4AF37` |
| Rampa 1 (MAQ) | `--badge-gold-ramp-1` | `#907725` |
| Rampa 2 (ELE) | `--badge-gold-ramp-2` | `#B2932E` |
| Rampa 3 (ELN) | `--badge-gold-ramp-3` | `#D4AF37` |
| Rampa 4 (NAV) | `--badge-gold-ramp-4` | `#DBBC57` |
| Rampa 5 (LOG) | `--badge-gold-ramp-5` | `#E2C977` |
| Ciencia | `--badge-gold-sci` | `#20AFC7` |
| Tecnología | `--badge-gold-tec` | `#35A631` |
| Ingeniería | `--badge-gold-ing` | `#DC538A` |
| Matemática | `--badge-gold-mat` | `#DFC517` |
| Factor Humano | `--badge-gold-hum` | `#D88C0C` |

### 1.6 Tonos STEM base (escudo ISA)

Estos son los tonos **sin mezclar**, fuente de la fórmula de `docs/32` §5. Se listan para
trazabilidad; **los badges no los usan directamente**, usan la columna mezclada con metal
de cada temporada.

| Disciplina | Hex base | Código |
|---|---|---|
| Ciencia | `#14B4F0` | SCI |
| Tecnología | `#22A34A` | TEC |
| Ingeniería | `#D6339A` | ING |
| Matemática | `#E2D23C` | MAT |
| Factor Humano | `#D9942F` | HUM |

---

## 2. Contraste WCAG 2.1 computado

### 2.1 Fórmula utilizada

```
Para cada canal c ∈ {R,G,B}:  v = c/255
  si v ≤ 0.03928  →  v' = v / 12.92
  si v >  0.03928  →  v' = ((v + 0.055) / 1.055) ^ 2.4

Luminancia relativa:
  L = 0.2126·R' + 0.7152·G' + 0.0722·B'

Ratio de contraste:
  ratio = (L_claro + 0.05) / (L_oscuro + 0.05)
```

Umbrales aplicados: **AA texto normal ≥ 4,5** · **AA texto grande ≥ 3,0** ·
**no textual ≥ 3,0** · **AAA ≥ 7,0**.

### 2.2 Colores de disciplina contra fondo oscuro `#0A0A0A`

Este es el uso principal: el color de disciplina esmaltado sobre el campo oscuro de la
pieza.

| Temporada | Disciplina | Hex | Ratio | AA normal | AA grande | No textual | AAA |
|---|---|---|---:|---|---|---|---|
| Cobre | Ciencia | `#199FC6` | **6,43** | ✅ | ✅ | ✅ | ✗ |
| Cobre | Tecnología | `#309833` | **5,34** | ✅ | ✅ | ✅ | ✗ |
| Cobre | Ingeniería | `#DA5291` | **5,28** | ✅ | ✅ | ✅ | ✗ |
| Cobre | Matemática | `#D9B717` | **10,12** | ✅ | ✅ | ✅ | ✅ |
| Cobre | Factor Humano | `#D27E0C` | **6,34** | ✅ | ✅ | ✅ | ✗ |
| Bronce | Ciencia | `#1FA1C6` | **6,57** | ✅ | ✅ | ✅ | ✗ |
| Bronce | Tecnología | `#369B32` | **5,55** | ✅ | ✅ | ✅ | ✗ |
| Bronce | Ingeniería | `#DB498A` | **5,03** | ✅ | ✅ | ✅ | ✗ |
| Bronce | Matemática | `#DDBA16` | **10,47** | ✅ | ✅ | ✅ | ✅ |
| Bronce | Factor Humano | `#D67F0B` | **6,50** | ✅ | ✅ | ✅ | ✗ |
| Plata | Ciencia | `#13ADE9` | **7,71** | ✅ | ✅ | ✅ | ✅ |
| Plata | Tecnología | `#2FAB58` | **6,68** | ✅ | ✅ | ✅ | ✗ |
| Plata | Ingeniería | `#D750A7` | **5,27** | ✅ | ✅ | ✅ | ✗ |
| Plata | Matemática | `#DBCE40` | **12,18** | ✅ | ✅ | ✅ | ✅ |
| Plata | Factor Humano | `#D49335` | **7,57** | ✅ | ✅ | ✅ | ✅ |
| Oro | Ciencia | `#20AFC7` | **7,56** | ✅ | ✅ | ✅ | ✅ |
| Oro | Tecnología | `#35A631` | **6,27** | ✅ | ✅ | ✅ | ✗ |
| Oro | Ingeniería | `#DC538A` | **5,32** | ✅ | ✅ | ✅ | ✗ |
| Oro | Matemática | `#DFC517` | **11,44** | ✅ | ✅ | ✅ | ✅ |
| Oro | Factor Humano | `#D88C0C` | **7,24** | ✅ | ✅ | ✅ | ✅ |

**Resultado: los 20 pares pasan AA texto normal.** Ninguno falla. El mínimo es
**Ingeniería en Plata (5,27)** y el máximo **Matemática en Plata (12,18)**.

**Punto de atención — verde y magenta son los más ajustados.** Tecnología, Ingeniería y
Factor Humano se mueven entre 5,0 y 6,7. Pasan, pero con poco margen: cualquier
oscurecimiento futuro del metal o de la mezcla los puede llevar por debajo de 4,5. En
esas tres disciplinas, el esmalte debe ir **siempre sobre campo oscuro**, nunca sobre el
metal claro.

### 2.3 Colores de disciplina contra el metal de su propia temporada

Este par mide si el esmalte se distingue del cuerpo metálico. **No es un requisito de
texto** (el esmalte no lleva texto encima), pero es la medida de si el color "se ve".

| Temporada | Disciplina | Hex | vs. metal | Diagnóstico |
|---|---|---|---:|---|
| Cobre | Ciencia | `#199FC6` | 1,23 | Bajo → exige separación |
| Cobre | Tecnología | `#309833` | 1,02 | **Crítico** |
| Cobre | Ingeniería | `#DA5291` | 1,01 | **Crítico** |
| Cobre | Matemática | `#D9B717` | 1,94 | Bajo |
| Cobre | Factor Humano | `#D27E0C` | 1,22 | Bajo |
| Bronce | Ciencia | `#1FA1C6` | 1,04 | **Crítico** |
| Bronce | Tecnología | `#369B32` | 1,13 | **Crítico** |
| Bronce | Ingeniería | `#DB498A` | 1,25 | Bajo |
| Bronce | Matemática | `#DDBA16` | 1,66 | Bajo |
| Bronce | Factor Humano | `#D67F0B` | 1,03 | **Crítico** |
| Plata | Ciencia | `#13ADE9` | 1,50 | Bajo |
| Plata | Tecnología | `#2FAB58` | 1,74 | Bajo |
| Plata | Ingeniería | `#D750A7` | 2,20 | Aceptable |
| Plata | Matemática | `#DBCE40` | **1,05** | **Crítico — casi idénticos** |
| Plata | Factor Humano | `#D49335` | 1,53 | Bajo |
| Oro | Ciencia | `#20AFC7` | 1,25 | Bajo |
| Oro | Tecnología | `#35A631` | 1,50 | Bajo |
| Oro | Ingeniería | `#DC538A` | 1,77 | Bajo |
| Oro | Matemática | `#DFC517` | 1,22 | Bajo |
| Oro | Factor Humano | `#D88C0C` | 1,30 | Bajo |

**Hallazgo importante:** en **todos** los casos el color de disciplina y el metal de su
temporada tienen contraste bajo (1,01–2,20). Esto es esperable —la fórmula de `docs/32`
**mezcla** el tono STEM con el metal a propósito— pero tiene una consecuencia de diseño
que hay que asumir explícitamente:

> **El color de disciplina NUNCA puede ir directamente sobre el metal del cuerpo.**
> Va siempre **dentro de una cavidad esmaltada** con **contorno de separación** en metal
> oscuro. Sin ese contorno, Matemática sobre Plata (1,05) y Tecnología sobre Cobre (1,02)
> son literalmente invisibles como diferencia.

### 2.4 Comparación con los valores publicados en `docs/32`

`docs/32_GRILLA_COBRE_COLORES.md` §4 publica una tabla de contraste. Al recalcular con la
fórmula WCAG, **los cinco valores no coinciden**:

| Disciplina Cobre | Publicado en `docs/32` | **Computado real** | Diferencia |
|---|---:|---:|---:|
| Ciencia `#199FC6` | 5,98 | **6,43** | +0,45 |
| Tecnología `#309833` | 4,97 | **5,34** | +0,37 |
| Ingeniería `#DA5291` | 4,91 | **5,28** | +0,37 |
| Matemática `#D9B717` | 9,42 | **10,12** | +0,70 |
| Factor Humano `#D27E0C` | 5,90 | **6,34** | +0,44 |

**La conclusión de `docs/32` se sostiene** (los cinco pasan 4,5:1), pero **los números
publicados no son reproducibles** con la fórmula WCAG estándar. Se reporta la diferencia
sin corregir `docs/32` (regla 15 de `AGENTS.md`: no corregir problemas ajenos a la tarea).

Hipótesis de la discrepancia: `docs/32` pudo haber medido contra un fondo ligeramente
distinto de `#0A0A0A` (dice "sobre tarjeta"), o haber usado una simplificación de
luminancia. **Requiere confirmación del usuario.**

### 2.5 Metales contra fondo

| Metal | Hex | vs. `#0A0A0A` | vs. blanco |
|---|---|---:|---:|
| Acero | `#8FA3B0` | 7,57 | 2,61 |
| Cobre | `#B87333` | 5,22 | 3,79 |
| Bronce | `#CD7F32` | 6,30 | 3,14 |
| Plata | `#C0C7CE` | 11,60 | 1,71 |
| Oro | `#D4AF37` | 9,42 | 2,10 |

**Ningún metal alcanza contraste suficiente contra blanco** (1,71–3,79; solo Cobre pasa
3,0). Como el brief (`docs/33` §4) fija fondo **oscuro neutro**, esto es aceptable: el
fondo claro **no está permitido** para las piezas. Ver §5.

---

## 3. Daltonismo y redundancia no cromática

### 3.1 Pares confundibles

| Par | Deuteranopía | Protanopía | Tritanopía | Riesgo |
|---|---|---|---|---|
| Tecnología `#309833` ↔ Factor Humano `#D27E0C` | **Alto** (verde↔naranja) | **Alto** | Bajo | Crítico |
| Ciencia `#199FC6` ↔ Tecnología `#309833` | Medio | Medio | **Alto** (azul↔verde) | Alto |
| Ingeniería `#DA5291` ↔ Factor Humano `#D27E0C` | Medio | **Alto** (magenta↔naranja) | Bajo | Alto |
| Matemática `#D9B717` ↔ Factor Humano `#D27E0C` | **Alto** (amarillo↔naranja) | **Alto** | Bajo | Crítico |
| Ciencia `#199FC6` ↔ Ingeniería `#DA5291` | Bajo | Bajo | Medio | Bajo |
| Las 5 temporadas entre sí | Metal↔metal: **bajo riesgo** por valor | — | — | Bajo |

**Los dos pares más peligrosos:** *Tecnología ↔ Factor Humano* y *Matemática ↔ Factor
Humano*. En ambos el Factor Humano (naranja) se vuelve indistinguible de su vecino.

### 3.2 Redundancia obligatoria (regla dura)

`docs/32` §1 ya establece que el color nunca va solo. Se refuerza con **cuatro**
redundancias simultáneas, obligatorias en toda pieza:

| Canal redundante | Implementación | Sobrevive a 32 px |
|---|---|---|
| **Código de 3 letras** | `SCI` `TEC` `ING` `MAT` `HUM` en el anillo o muesca | ✅ |
| **Forma del icono** | Cada disciplina tiene una **familia de formas** distinta (ver §3.3) | ✅ |
| **Textura del relieve** | Fondo del campo: liso / punteado / estriado / reticulado / ondulado | ⚠️ se simplifica |
| **Posición angular** | La disciplina ocupa siempre el **mismo ángulo** en la pieza | ✅ |

Con estos cuatro canales, un usuario con cualquier tipo de daltonismo identifica la
disciplina **sin ver color**. Ninguno de los cuatro puede eliminarse "por limpieza".

### 3.3 Familia de formas por disciplina

Regla de diseño: **la silueta del icono debe ser reconocible en negro puro.**

| Disciplina | Familia de forma | Textura de campo | Ángulo |
|---|---|---|---|
| Ciencia | Curvas cerradas, gota y órbita | Punteado fino | 12 h |
| Tecnología | Ángulos rectos, nodo y enlace | Reticulado | 3 h |
| Ingeniería | Estructura, travesaño, engranaje | Estriado radial | 6 h |
| Matemática | Simetría estricta, retícula, proporción | Liso | 9 h |
| Factor Humano | Formas abiertas, manos/red/encastre | Ondulado | 12 h (anillo interno) |

---

## 4. Reglas de mezcla metal + disciplina

### 4.1 Casos problemáticos concretos

| Caso | Ratio vs. metal | Problema | Solución obligatoria |
|---|---:|---|---|
| **Matemática `#DBCE40` sobre Plata `#C0C7CE`** | **1,05** | Amarillo claro sobre gris claro: **invisibles entre sí** | Cavidad esmaltada + contorno `#3A3A3A`; o invertir: campo oscuro con la disciplina en metal coloreado |
| **Tecnología `#309833` sobre Cobre `#B87333`** | **1,02** | Verde sobre naranja rojizo: mismo valor | Contorno oscuro + código `TEC` + textura reticulada |
| **Factor Humano `#D67F0B` sobre Bronce `#CD7F32`** | **1,03** | Naranja sobre naranja | Contorno oscuro; considerar mover FH a un anillo interior diferenciado |
| **Ciencia `#14B4F0` sobre Acero `#8FA3B0`** | *no aplica* | **Acero no lleva disciplina** por decisión de producto (`docs/32` §3) | Sin acción. Acero = solo metal |
| **Matemática `#DFC517` sobre Oro `#D4AF37`** | 1,22 | Amarillo sobre dorado: se pierde el símbolo | Contorno oscuro obligatorio; el esmalte matemático sobre oro es el caso más frágil del sistema |

### 4.2 Cuánto metal admite cada disciplina

La fórmula vigente (`docs/32` §2) mezcla con peso `metal_weight = 0.22`. Se propone
**mantener 0,22 uniforme** —que es lo que ya está en `palette.json`— y resolver los casos
frágiles por **composición** (cavidad, contorno, tamaño), no cambiando la mezcla. Razón:
cambiar el peso por disciplina rompería la legibilidad del sistema (dos disciplinas de la
misma temporada ya no serían comparables).

**Excepción propuesta:** *Matemática*. Es la única que en las cuatro temporadas con color
supera 10:1 sobre fondo y en cambio tiene los peores pares contra metal. Al ser la más
clara del sistema, se propone que **Matemática use siempre campo oscuro** (nunca el metal
como fondo del símbolo), invirtiendo la relación respecto de las otras cuatro.

### 4.3 Esmalte sobre metal claro vs. oscuro

| Metal de fondo | Comportamiento | Regla |
|---|---|---|
| Acero `#8FA3B0` | Neutro frío, no compite | El esmalte se lee bien; contorno fino alcanza |
| Cobre `#B87333` | Cálido, "come" verdes y naranjas | Contorno obligatorio en TEC, HUM, ING |
| Bronce `#CD7F32` | Más saturado que el cobre | Contorno obligatorio en TEC, HUM |
| Plata `#C0C7CE` | Muy claro, "come" amarillos y verdes | Contorno obligatorio en **todas**; MAT exige inversión |
| Oro `#D4AF37` | Claro y cálido, "come" amarillos | Contorno obligatorio en **todas**; MAT exige inversión |

---

## 5. Fondos permitidos

Derivado de §2.5 y de `docs/33` §4:

| Fondo | ¿Permitido? | Motivo |
|---|---|---|
| Oscuro neutro `#0A0A0A` | ✅ **Preferido** | Único donde los 20 pares pasan AA |
| Oscuro cálido `#141210` | ✅ | Alternativa para piezas de Cobre/Bronce |
| Metal de la temporada (campo de la pieza) | ⚠️ Solo con contorno | Contraste 1,01–2,20 con la disciplina |
| Blanco `#FFFFFF` | ❌ **Prohibido** | Ningún metal pasa 4,5:1; solo Cobre pasa 3,0 |
| Claro neutro `#F5F5F5` | ❌ **Prohibido** | Mismo problema |
| Fotográfico o con textura | ❌ | Rompe la consistencia entre temporadas |

---

## 6. Acabados por temporada

Descripción visual reutilizable como vocabulario de prompt (ver `docs/37_PROMPTS_BADGES.md`).

| Temporada | Acabado | Pátina | Descripción para prompt |
|---|---|---|---|
| Acero | Satinado | Mínima | *"satin-brushed steel, cool blue-grey, diffuse soft highlight, faint machining lines"* |
| Cobre | Patinado | Media | *"patinated copper, warm orange-red, darkened recesses, subtle verdigris in the deepest relief"* |
| Bronce | Patinado | Media-alta | *"antique bronze, deep golden-brown, heavier patina, faint green in crevices"* |
| Plata | Pulido | Ninguna | *"polished silver, cold mirror finish, crisp specular reflection, no wear"* |
| Oro | Satinado | Ninguna | *"satin gold, warm yellow, broad soft highlight, no gaudy sparkle"* |

**Regla de consistencia:** el acabado es función de la **temporada**, nunca del contenido.
Ciencia en Plata se ve plateada; Ciencia en Oro se ve dorada. Esto es lo que hace que la
colección se lea como progresión.

---

## 7. Tokens CSS propuestos

Solo nombres y valores; **no se escribe código de la aplicación en esta sesión** y no se
modifica `globals.css`. La convención continúa la ya usada `--grid-*` de `docs/32` §6.

```text
--badge-steel-metal:   #8FA3B0;
--badge-copper-metal:  #B87333;
--badge-bronze-metal:  #CD7F32;
--badge-silver-metal:  #C0C7CE;
--badge-gold-metal:    #D4AF37;

--badge-copper-sci:    #199FC6;   --badge-copper-tec: #309833;
--badge-copper-ing:    #DA5291;   --badge-copper-mat: #D9B717;
--badge-copper-hum:    #D27E0C;
--badge-bronze-sci:    #1FA1C6;   --badge-bronze-tec: #369B32;
--badge-bronze-ing:    #DB498A;   --badge-bronze-mat: #DDBA16;
--badge-bronze-hum:    #D67F0B;
--badge-silver-sci:    #13ADE9;   --badge-silver-tec: #2FAB58;
--badge-silver-ing:    #D750A7;   --badge-silver-mat: #DBCE40;
--badge-silver-hum:    #D49335;
--badge-gold-sci:      #20AFC7;   --badge-gold-tec:   #35A631;
--badge-gold-ing:      #DC538A;   --badge-gold-mat:   #DFC517;
--badge-gold-hum:      #D88C0C;

/* Estructura */
--badge-field-dark:    #0A0A0A;
--badge-separator:     #3A3A3A;   /* contorno de separación del esmalte */
```

---

## 8. Fuente de verdad vs. derivados

**Fuente de verdad (`lib/data/datasets/palette.json`, no se edita aquí):**
los 5 metales, las 5 rampas de especialidad, los 20 colores de disciplina de temporada y
los 5 tonos STEM base. **Todos los hex de §1 salen de ese archivo, copiados literalmente.**

**Derivados propuestos en este documento:**
- `--badge-field-dark: #0A0A0A` — ya usado por `docs/32` §2 como fondo de contraste.
- `--badge-separator: #3A3A3A` — **nuevo**, propuesto como contorno de separación del
  esmalte. Necesario por el hallazgo de §2.3. Requiere aprobación.

`palette.json` declara `"status": "provisional-stem-colors"`: los tonos STEM son
provisorios y `docs/32` §8 deja pendiente reemplazarlos por los del logo oficial. Todos
los ratios de §2 deberán **recomputarse** cuando eso ocurra.

---

## 9. Verificación y límites

**Comprobado:**

- Los 55 hex de §1 fueron leídos de `palette.json` y copiados literalmente.
- Los 20 ratios de disciplina/fondo, los 20 de disciplina/metal, los 5 de metal/fondo y
  las 20 diferencias de rampa fueron **computados con la fórmula WCAG 2.1** mediante un
  script Python ejecutado sobre `palette.json` (no estimados).
- El hallazgo de que los 5 valores publicados en `docs/32` §4 no coinciden con el cálculo
  está respaldado por la corrida del script.
- Acero tiene `"disciplines": {}` en `palette.json` (confirmado).

**No comprobado:**

- La causa exacta de la discrepancia de §2.4 (se propone una hipótesis, no se verifica).
- El comportamiento de los esmaltes en impresión física o acuñación real.
- La simulación de daltonismo de §3.1 es **cualitativa** (basada en los ejes de confusión
  conocidos de cada tipo), no una simulación por software con matrices de conversión.
  Si se requiere rigor, hay que correr una simulación real (p. ej. Viénot) y revisar.
- Que los hex de disciplina de Bronce/Plata/Oro sean definitivos: `palette.json` los
  marca como provisionales.

**Limitaciones:**

- Este documento es una **propuesta**, no una decisión aprobada.
- No modifica la app, no edita `palette.json` ni `globals.css`, y no hace commit.
- El contorno `#3A3A3A` es una propuesta nueva que requiere aprobación explícita.
