# ISA · Sistema de badges y Challenge Coins — estructura, geometría y familia

**Estado:** PROPUESTA pendiente de revisión del usuario. No autoriza producción final.
**Fecha:** 10/11/2026.
**Insumos:** `docs/31_POLITICA_VIGENTE.md`, `docs/32_GRILLA_COBRE_COLORES.md`,
`lib/data/datasets/palette.json`, `docs/25_CATALOGO_RECONOCIMIENTOS.md`,
`docs/33_BRIEF_DIRECCION_ARTE.md`, `docs/35_PALETA_BADGES.md`.

---

## 0. Modelo de familia (decidido)

Confirmado por el usuario el 10/11/2026:

- **Un ribbon por celda STEM** → 20 celdas (5 especialidades × 4 disciplinas).
- **Un ribbon por tema de Factor Humano** → 15 temas.
- **Coins por ruta**: STEM, integral, por especialidad, de patrimonio, comunitaria.
- **Credencial.**
- **NO hay coin por celda.**

Total: **35 ribbons + 8 coins + 1 credencial = 44 piezas.**

> **Aviso de conflicto (§7.1).** `docs/25_CATALOGO_RECONOCIMIENTOS.md` describe **25
> celdas** (con `HUM` como quinta disciplina cruzada con especialidad) y el manifiesto
> `public/images/badges/cobre/manifest.json` tiene **25 ribbons** construidos así. El
> modelo **vigente** (`docs/31` §6–7) es **20 STEM + 15 FH**. Este documento sigue el
> vigente. Los 25 assets actuales quedan obsoletos en su estructura.

---

## 1. Anatomía de la pieza

### 1.1 Partes comunes

```text
        ┌─ canto (edge)
     ┌──┴──────────────┐
     │  ╭───────────╮  │  ← anillo exterior / leyenda
     │  │  BISEL    │  │  ← bisel brillante (elemento más claro)
     │  │ ╭───────╮ │  │
     │  │ │ CAMPO │ │  │  ← campo: metal o esmalte
     │  │ │   ◎   │ │  │  ← símbolo central (altorrelieve)
     │  │ ╰───────╯ │  │
     │  ╰───────────╯  │
     └─────────────────┘
```

| Zona | Función | Tratamiento |
|---|---|---|
| **Canto** | Borde físico | Estriado suave (coins) / recto (ribbons) |
| **Anillo de leyenda** | Reservado para la **capa de lettering** | Metal desnudo, sin relieve alto |
| **Bisel** | Separación campo/anillo | Brillante, el punto más luminoso |
| **Campo** | Fondo del símbolo | Metal de temporada o esmalte oscuro |
| **Símbolo** | Contenido | Altorrelieve + esmalte de disciplina |
| **Muesca de especialidad** | Canal estructural | Rampa metálica + código de 3 letras |

### 1.2 Anverso (común a toda la familia)

**El anverso es idéntico en estructura para las 44 piezas.** Solo cambia el metal.

| Elemento | Descripción |
|---|---|
| Forma | Disco completo |
| Bisel | Anillo brillante continuo |
| Centro | Monograma ISA dentro de un campo circular |
| Perímetro | **Onda** continua (agua/superficie) que abraza el campo |
| Marca de temporada | **Puntos en el anillo**: Acero 1 · Cobre 2 · Bronce 3 · Plata 4 · Oro 5 |
| Metal | El de la temporada |

**Regla:** el anverso **nunca** lleva color de disciplina ni código de celda. Esa es la
razón de ser de la decisión "anverso común / reverso contenido": permite que las 5
temporadas compartan una cara y que el sistema escale sin rehacer arte.

**Nota de riesgo:** el monograma ISA y la onda son **diseño original pendiente de
producción**. Deben confirmarse contra el escudo real de ISA antes de vectorizar
(ver §7.4, titularidad del escudo).

### 1.3 Reverso (variable por tipo de pieza)

| Tipo de pieza | Contenido del reverso |
|---|---|
| Ribbon STEM | Símbolo de disciplina (forma) + símbolo de especialidad (estructura) |
| Ribbon Factor Humano | Símbolo del tema + número de tema `FH-01..FH-15` |
| Coin STEM | Los 5 símbolos de disciplina en anillo + marca de ruta |
| Coin integral | Retícula 5×5 simplificada + marca de completitud |
| Coin de especialidad | Símbolo de especialidad grande + rampa metálica de la fila |
| Coin de patrimonio | Silueta de casco abstracta + onda + marca de museo |
| Coin comunitaria | Red de nodos conectados + onda |
| Credencial | Campo vertical + espacio de composición para datos (compuestos aparte) |

---

## 2. Geometría y retícula

Unidades relativas al diámetro **D** de la pieza. Sirven para cualquier tamaño.

| Elemento | Radio | Notas |
|---|---|---|
| Canto exterior | 0,500 D | Borde físico |
| Outer del bisel | 0,475 D | Inicio del brillo |
| Inner del bisel | 0,450 D | Fin del brillo |
| Anillo de leyenda | 0,450 – 0,400 D | Reservado a lettering |
| Campo | 0,400 – 0,250 D | Zona del símbolo |
| Símbolo | ≤ 0,240 D | Máximo, incluye contorno |
| Muesca de especialidad | 0,470 – 0,430 D | Ángulo fijo, 18° de ancho |

**Reglas:**

1. **Margen de seguridad:** ningún elemento gráfico fuera de 0,475 D ni dentro de 0,02 D
   del canto.
2. **Ejes de simetría:** la pieza es simétrica respecto del eje vertical, salvo la muesca
   de especialidad y la marca de código.
3. **Espacio de lettering:** el anillo 0,450–0,400 D está **vacío** en el asset. El texto
   se compone encima, en vector, en la capa de arte (regla dura 6).
4. **Grosor mínimo de línea:** 2/1024 del master (≈0,2 % de D). Por debajo desaparece a
   32 px.

### 2.1 Formato del ribbon

| Propiedad | Valor |
|---|---|
| Proporción | 3:2 horizontal |
| Campo interior | Cuadrado centrado, 0,62 × 0,62 del ancho |
| Muesca | Lateral izquierdo, misma altura que el campo |
| Bisel | Perimetral, mismo tratamiento que la coin |
| Anillo de leyenda | Franja inferior, 0,14 del alto |

El ribbon **no** imita una cinta de condecoración: no tiene franjas centrales, ni diagonales,
ni colores nacionales (ver `docs/36_REVISION_NO_BELICA.md`). Es un **rectángulo con bisel
y campo**, como una ficha troquelada.

---

## 3. Tamaños de uso digital

| Tamaño | Uso | Qué sobrevive | Qué se simplifica |
|---:|---|---|---|
| **1024** | Master / producción | Todo | Nada |
| **512** | Asset de catálogo (formato actual) | Todo | Nada |
| **256** | Detalle de badge en perfil | Símbolo, código, muesca | Textura de campo |
| **128** | Grilla de colección | Símbolo, código | Textura, marca de temporada |
| **64** | Lista, notificación | Símbolo, color | Código pasa a tooltip, textura fuera |
| **32** | Inline, chip, favicon-like | **Silueta del símbolo** | Todo lo demás |

**Regla de reducción:** a 32 px solo sobreviven **tres** cosas — la forma del símbolo, el
color de disciplina y (si el diseño lo permite) el punto de temporada. Si el símbolo no se
reconoce en negro puro a 32 px, **el símbolo está mal diseñado** y se rediseña, no se
simplifica.

**Simplificación por tamaño (versiones explícitas):** se producen **dos** variantes por
pieza — `full` (1024–256) y `small` (128–32, sin textura ni anillo de leyenda).

---

## 4. Familia completa

### 4.1 Ribbons STEM (20)

Combinaciones: 5 especialidades × 4 disciplinas.

| # | ID | Disciplina | Especialidad | Código visible |
|---:|---|---|---|---|
| 1 | `RIB-SCI-MAQ` | Ciencia | Maquinista | `SCI·MAQ` |
| 2 | `RIB-SCI-ELE` | Ciencia | Electricista | `SCI·ELE` |
| 3 | `RIB-SCI-ELN` | Ciencia | Electrónico | `SCI·ELN` |
| 4 | `RIB-SCI-NAV` | Ciencia | Ingeniero Naval | `SCI·NAV` |
| 5 | `RIB-SCI-LOG` | Ciencia | Logístico | `SCI·LOG` |
| 6 | `RIB-TEC-MAQ` | Tecnología | Maquinista | `TEC·MAQ` |
| 7 | `RIB-TEC-ELE` | Tecnología | Electricista | `TEC·ELE` |
| 8 | `RIB-TEC-ELN` | Tecnología | Electrónico | `TEC·ELN` |
| 9 | `RIB-TEC-NAV` | Tecnología | Ingeniero Naval | `TEC·NAV` |
| 10 | `RIB-TEC-LOG` | Tecnología | Logístico | `TEC·LOG` |
| 11 | `RIB-ING-MAQ` | Ingeniería | Maquinista | `ING·MAQ` |
| 12 | `RIB-ING-ELE` | Ingeniería | Electricista | `ING·ELE` |
| 13 | `RIB-ING-ELN` | Ingeniería | Electrónico | `ING·ELN` |
| 14 | `RIB-ING-NAV` | Ingeniería | Ingeniero Naval | `ING·NAV` |
| 15 | `RIB-ING-LOG` | Ingeniería | Logístico | `ING·LOG` |
| 16 | `RIB-MAT-MAQ` | Matemática | Maquinista | `MAT·MAQ` |
| 17 | `RIB-MAT-ELE` | Matemática | Electricista | `MAT·ELE` |
| 18 | `RIB-MAT-ELN` | Matemática | Electrónico | `MAT·ELN` |
| 19 | `RIB-MAT-NAV` | Matemática | Ingeniero Naval | `MAT·NAV` |
| 20 | `RIB-MAT-LOG` | Matemática | Logístico | `MAT·LOG` |

**Temporada:** Cobre en la etapa actual. La misma retícula se replica en Bronce, Plata y
Oro reemplazando metal y colores (§6 de `docs/35`). Acero no participa: no tiene STEM.

### 4.2 Ribbons de Factor Humano (15)

**PLACEHOLDERS.** Los 15 temas **no están definidos** en los documentos leídos. `docs/31`
§7 dice que son 15 temas con un episodio y una pregunta cada uno, sin variantes y sin
ancla TIMSS, y que requieren fuente. **No se inventan temas.**

| # | ID | Código | Símbolo propuesto (genérico, civil) | Tema |
|---:|---|---|---|---|
| 1 | `RIB-FH-01` | `FH·01` | **Por definir** | ⚠️ pendiente |
| 2 | `RIB-FH-02` | `FH·02` | Por definir | ⚠️ pendiente |
| 3 | `RIB-FH-03` | `FH·03` | Por definir | ⚠️ pendiente |
| … | … | … | … | … |
| 15 | `RIB-FH-15` | `FH·15` | Por definir | ⚠️ pendiente |

**Lo único definible sin los temas** es el **marco visual** de la columna FH:

- Disciplina: Factor Humano, `#D27E0C` en Cobre.
- Familia de forma: **abierta** (manos, red, encastre, círculo incompleto) — §3.3 de `docs/35`.
- Textura: ondulada.
- Ángulo: anillo **interno**, para distinguir FH de las cuatro disciplinas STEM sin
  recurrir al color.
- Campo sugerido por `docs/31` §7: convivencia, comunicación, descanso, inclusión, cuidado
  de la tripulación, historia y patrimonio (p. ej. mujeres en submarinos), siempre sin
  contenido bélico.

**Acción requerida:** conseguir la lista de los 15 temas y sus fuentes antes de producir
estos ribbons.

### 4.3 Coins de ruta (8)

| # | ID | Nombre (es) | Otorgamiento | Estado del criterio |
|---:|---|---|---|---|
| 1 | `COIN-COBRE` | Coin integral de Cobre | 20/20 celdas STEM + 15/15 FH | ⚠️ propuesta |
| 2 | `COIN-STEM` | Coin Trayectoria STEM | 5/5 disciplinas | ⚠️ propuesta |
| 3 | `COIN-ESPECIALIDAD` | Coin Trayectoria Especialidad | 5/5 especialidades | ⚠️ propuesta |
| 4 | `COIN-MAQ` | Coin · Maquinista | 4/4 celdas de Maquinista | ⚠️ propuesta |
| 5 | `COIN-ELE` | Coin · Electricista | 4/4 celdas de Electricista | ⚠️ propuesta |
| 6 | `COIN-ELN` | Coin · Electrónico | 4/4 celdas de Electrónico | ⚠️ propuesta |
| 7 | `COIN-NAV` | Coin · Ingeniero Naval | 4/4 celdas de Naval | ⚠️ propuesta |
| 8 | `COIN-LOG` | Coin · Logístico | 4/4 celdas de Logístico | ⚠️ propuesta |

> Las coins por especialidad pasan de **5/5** (modelo viejo, `docs/25` §3.2) a **4/4**,
> porque con el modelo vigente cada especialidad tiene 4 celdas STEM, no 5.

### 4.4 Coins especiales (2) y credencial (1)

| ID | Nombre (es) | Qué celebra | Otorgamiento | Estado |
|---|---|---|---|---|
| `COIN-PATRIMONIO` | Coin de Patrimonio | Recorrido por museos y patrimonio submarino | ⚠️ **no definido en ningún documento** | Propuesta a revisar |
| `COIN-COMUNIDAD` | Coin Comunitaria | Aporte a la comunidad ISA (propuestas, contenidos, museos) | ⚠️ **no definido en ningún documento** | Propuesta a revisar |
| `CRED-ISA` | Credencial ISA | Recorrido completo de una temporada | 35/35 de Cobre (o equivalente) | ⚠️ propuesta |

**Las tres son propuestas de este documento**, no decisiones de producto. `docs/25` no las
contempla. Requieren aprobación explícita del usuario (regla 8 de `AGENTS.md`).

**Nota sobre la credencial:** es la pieza con más riesgo de parecer documento oficial.
Debe diseñarse como **objeto coleccionable** (una ficha), no como documento. Ver
`docs/36_REVISION_NO_BELICA.md`.

### 4.5 Resumen de la familia

| Grupo | Cantidad | Estado |
|---|---:|---|
| Ribbons STEM | 20 | Criterios definidos |
| Ribbons Factor Humano | 15 | **Temas pendientes** |
| Coins de ruta | 8 | Criterios propuestos |
| Coins especiales | 2 | Criterios no definidos |
| Credencial | 1 | Criterio propuesto |
| **TOTAL** | **46** | |

---

## 5. Reglas de composición

1. **Una pieza, un protagonista.** El símbolo manda; el color lo viste.
2. **Anverso nunca compite.** Sin color de disciplina, sin código.
3. **La especialidad es estructura.** Va en la muesca, no en el campo del símbolo.
4. **Tres canales, nunca uno.** Color + código + forma del símbolo, siempre juntos.
5. **Acero = solo metal.** Sin esmalte de disciplina, sin color de acento.
6. **El lettering no está en el asset.** El anillo se entrega vacío.
7. **Convención de nombre de archivo:** `badge-<TEMP>-<TIPO>-<CODIGO>[-<ESP>].<ext>`
   → `badge-copper-ribbon-sci-maq.svg`, `badge-copper-coin-integral.svg`.

### 5.1 Acero (caso especial)

Acero **no tiene celdas STEM** (`docs/31` §4). Su familia es distinta:

| ID | Nombre (es) | Motivo | Estado |
|---|---|---|---|
| `RIB-AC-CONTROL` | Visitante · Control y Comando | ⚠️ revisar (§7.2) | A revisar |
| `RIB-AC-MAQUINAS` | Visitante · Sala de Máquinas | Engranaje | OK |
| `RIB-AC-BATERIAS` | Visitante · Baterías | Batería | OK |
| `RIB-AC-PROA` | Visitante · Proa | ⚠️ **"Proa/torpedo" prohibido** | **Bloqueante** |
| `RIB-AC-POPA` | Visitante · Popa | Hélice | OK |
| `RIB-AC-REACTOR` | Visitante · Reactor | ⚠️ trébol de radiación | Condicional |
| `CRED-ACERO` | ⚠️ revisar nombre ("Diploma") | 6 emblemas | A revisar |

Todos en **acero `#8FA3B0`, sin color de disciplina**, con neutros.

---

## 6. Catálogo de iconos

### 6.1 Por disciplina (4 STEM + FH)

Cada icono debe ser reconocible **en negro puro** (regla de accesibilidad).

| Código | Familia de forma | Símbolos candidatos (civiles/técnicos) | Por qué es no bélico |
|---|---|---|---|
| `SCI` | Curvas cerradas, órbita | Gota, órbita, onda, molécula, termómetro | Fenómenos naturales y medición |
| `TEC` | Ángulos rectos, nodo | Nodo y enlace, chispa, circuito, antena | Sistemas y conexiones, no armamento |
| `ING` | Estructura, travesaño | Engranaje, válvula, viga, hélice | Mecánica y construcción civil |
| `MAT` | Simetría estricta | Retícula, proporción, espiral, escuadra | Herramientas de cálculo |
| `HUM` | Abierta | Manos, red, círculo abierto, onda de voz | Convivencia y cuidado |

### 6.2 Por especialidad (5)

La especialidad no se distingue solo por el paso metálico (los saltos son de 1,10:1 a
1,49:1 — **insuficientes**, ver `docs/35` §2.4 y §7.3). Se distingue por **forma**:

| Código | Especialidad | Símbolo civil | Justificación no bélica |
|---|---|---|---|
| `MAQ` | Maquinista | Engranaje + eje | Transmisión de energía mecánica |
| `ELE` | Electricista | Rayo dentro de bobina | Distribución eléctrica |
| `ELN` | Electrónico | Onda senoidal + nodo | Señal y control |
| `NAV` | Ingeniero Naval | Timón + carena | Hidrodinámica y navegación |
| `LOG` | Logístico | Brújula + caja | Abastecimiento y orientación |

### 6.3 Hallazgo sobre los iconos actuales

El manifiesto `public/images/badges/cobre/manifest.json` asigna el icono **solo por
especialidad**: las 5 celdas de una fila comparten `gear`, `bolt`, `sonar`, `helm` o
`compass` (verificado: `RIB-*-MAQ` → `gear` en las 5 disciplinas).

**Consecuencia:** en el asset actual, dos celdas de la misma especialidad y distinta
disciplina **solo se diferencian por color**. Viola la regla "no depender solo del color"
(regla dura 4 y `docs/32` §7).

**Corrección propuesta:** el símbolo del reverso combina **dos capas** — forma de
disciplina (campo) + forma de especialidad (estructura/muesca). Así `SCI·MAQ` y `TEC·MAQ`
se distinguen **en blanco y negro**.

---

## 7. Conflictos y pendientes detectados

Reportados sin corregir (regla 15 de `AGENTS.md`).

### 7.1 Modelo de celdas (BLOQUEANTE para producción)

| Fuente | Modelo |
|---|---|
| `docs/25` (6/11) | 25 celdas, `HUM` × especialidad, "Humanidades y Artes" |
| Manifiesto `cobre/manifest.json` | 25 ribbons `RIB-CU-{5 disciplinas}-{5 esp}`, `HUM-MAQ`…`HUM-LOG` |
| **`docs/31` (9/11, VIGENTE)** | **20 STEM + 15 FH**, "Factor Humano" como columna libre |
| `AGENTS.md` (actualizado) | Cobre jugable: 35 experiencias, 35 ribbons |

**Resolución adoptada:** modelo vigente (20+15). **Los 25 assets de Cobre quedan
obsoletos**: hay que reemplazarlos por 35.

### 7.2 Motivos prohibidos en Acero

| ID | Motivo actual | Problema | Reemplazo propuesto |
|---|---|---|---|
| `RIB-AC-PROA` | "Proa/**torpedo**" | Viola regla dura 1 (torpedo prohibido) | **Hidrodinámica / forma del casco** |
| `RIB-AC-CONTROL` | "Control y Comando" | "Comando" tiene connotación militar | **"Control y Navegación"** o **"Sala de Control"** |
| `RIB-AC-REACTOR` | "Reactor Nuclear" + radiación | El trébol es símbolo civil de peligro, pero "nuclear" + reactor puede leerse bélico | Reformular a **generación de energía**; conservar el trébol como seguridad civil |

### 7.3 Rampa de especialidad insuficiente

Los saltos adyacentes de la rampa metálica van de **1,10:1 a 1,49:1** (computado, ver
`docs/35` §2). `docs/32` §4 ya advierte que los dos primeros pasos son estructurales y no
texto. **Se confirma y se refuerza:** el paso metálico **no alcanza** para identificar la
especialidad. Se exige símbolo + código (§6.2).

### 7.4 Titularidad del escudo

`docs/32` §5 dice que los tonos STEM salen del **escudo de la academia**
(`lib/missions.ts`, `DISCIPLINE_META`). Antes de vectorizar el monograma ISA hay que
confirmar **quién es titular de ese escudo**. Pendiente con el usuario.

### 7.5 Temas de Factor Humano

No existen en los documentos leídos. **Bloquea la producción de 15 de 35 ribbons.**

### 7.6 Coins sin criterio definido

`COIN-PATRIMONIO` y `COIN-COMUNIDAD` no figuran en ningún documento. Propuestas de este
documento, requieren aprobación.

---

## 8. Verificación y límites

**Comprobado:**

- Los 25 ribbons del manifiesto de Cobre y sus iconos fueron extraídos y verificados: el
  icono depende **solo** de la especialidad (`gear`/`bolt`/`sonar`/`helm`/`compass`).
- El manifiesto contiene `HUM-MAQ`…`HUM-LOG` (modelo viejo), confirmando el conflicto §7.1.
- `docs/31` §6–7 establece 20 celdas STEM + 15 temas FH (leído).
- Los saltos de la rampa metálica fueron computados (`docs/35` §2).
- Acero tiene 6 ribbons + 1 diploma en `public/images/badges/acero/` (glob verificado).

**No comprobado:**

- La lista de los 15 temas de Factor Humano (no está en el repositorio).
- La titularidad del escudo ISA.
- Que "Control y Comando" o "Reactor Nuclear" provengan de un vocabulario militar real:
  se marcan por riesgo de lectura, no por certeza.
- La viabilidad de producción de las 46 piezas (es un plan, no un cálculo de esfuerzo).

**Limitaciones:**

- Documento de **sistema y dirección**, no de arte producido.
- No modifica la app, no crea pantallas, no regenera assets, no hace commit.
- Las geometrías son especificación de diseño; **no hay trazo vectorial producido**.
