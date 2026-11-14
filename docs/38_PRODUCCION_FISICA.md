# ISA · Especificaciones de producción física de Challenge Coins

**Estado:** PROPUESTA pendiente de revisión. **ANEXO DE RESERVA.**
**Fecha:** 10/11/2026.

> **Alcance.** Por decisión del usuario (10/11/2026), el proyecto es **digital primero**.
> Este documento especifica la acuñación **por si se activa**, para que el diseño digital
> no tenga que rehacerse si llega el caso. **No hay acuñación aprobada ni presupuestada.**

**Insumos:** `docs/33_BRIEF_DIRECCION_ARTE.md`, `docs/34_SISTEMA_BADGES.md`,
`docs/35_PALETA_BADGES.md`, `docs/37_PROMPTS_BADGES.md`.

---

## 1. Diámetros propuestos

| Tamaño | Diámetro | Uso | Cuándo |
|---|---:|---|---|
| **Estándar** | **39 mm** | Ribbons promocionales, coin de una sola ruta | Producción inicial |
| **Grande** | **45 mm** | Coin integral, coin de patrimonio, credencial | Piezas de hito |

Justificación: 39 mm es el diámetro más común de challenge coin coleccionable y el más
económico de acuñar; 45 mm permite que la retícula 5×5 de la coin integral se lea sin
micrograbado. **Ambos tamaños son propuestas**, sujetas a cotización.

**Regla de consistencia:** una misma ruta **nunca** mezcla diámetros. Si la coin integral
es de 45 mm, todas las integrales lo son.

---

## 2. Geometría física

| Parámetro | 39 mm | 45 mm | Notas |
|---|---:|---:|---|
| Espesor | **3,0 mm** | **3,5 mm** | Menos de 2,5 mm se siente frágil |
| Peso estimado (latón) | ~24 g | ~34 g | Estimación; depende de la aleación |
| Altura de relieve máx. | **0,4 mm** | **0,5 mm** | Límite práctico de acuñación en una pasada |
| Altura del bisel | 0,2 mm | 0,25 mm | El bisel es el punto más alto |
| Profundidad de cavidad de esmalte | **0,5 mm** | **0,6 mm** | Debe superar el relieve para que el esmalte no se desgaste |
| Grosor mínimo de trazo | **0,25 mm** | **0,25 mm** | Por debajo, el metal no llena la matriz |
| Separación mínima entre relieves | 0,3 mm | 0,3 mm | Evita que se fundan visualmente |

### 2.1 Traducción de la retícula digital a milímetros

La retícula de `docs/34` §2 usa radios relativos a **D**. Para 39 mm:

| Elemento | Radio relativo | 39 mm | 45 mm |
|---|---:|---:|---:|
| Canto exterior | 0,500 D | 19,50 mm | 22,50 mm |
| Bisel (outer) | 0,475 D | 18,53 mm | 21,38 mm |
| Bisel (inner) | 0,450 D | 17,55 mm | 20,25 mm |
| Anillo de leyenda | 0,450–0,400 D | 17,55–15,60 mm | 20,25–18,00 mm |
| Campo | 0,400–0,250 D | 15,60–9,75 mm | 18,00–11,25 mm |
| Símbolo | ≤ 0,240 D | ≤ 9,36 mm | ≤ 10,80 mm |
| Muesca | 0,470–0,430 D | 18,33–16,77 mm | 21,15–19,35 mm |

> ⚠️ **Verificación crítica.** El símbolo máximo es de **9,36 mm** en la pieza de 39 mm.
> A esa escala, el símbolo debe tener **como máximo 2 o 3 masas de detalle**. Si el
> símbolo digital tiene más, **no se acuña**: se simplifica la versión física. Esto
> confirma la regla de reducción de `docs/34` §3 y obliga a producir una **variante
> física simplificada** además de la digital.

---

## 3. Esmalte

| Parámetro | Especificación |
|---|---|
| Técnica | Esmalte blando (soft enamel) o duro (hard enamel), a definir por taller |
| **Recomendado** | **Hard enamel** (superficie pulida a nivel del metal) |
| Profundidad de cavidad | 0,5 mm (39 mm) / 0,6 mm (45 mm) |
| Colores | Solo los de disciplina/especialidad de `docs/35` §1 |
| Cantidad de zonas | Máximo **2** por cara (`docs/33` §5.1) |
| Separación | Contorno de metal oscuro obligatorio (hallazgo de `docs/35` §2.3) |

**Soft vs. hard enamel:**

| | Soft enamel | Hard enamel |
|---|---|---|
| Superficie | Esmalte por debajo del metal, se sienten las líneas | Pulida al ras, superficie lisa |
| Detalle | Acepta más detalle | Menos detalle, más resistente |
| Sensación | Más artesanal | Más premium, más "moneda" |
| **Para ISA** | Aceptable en ribbons | **Preferido en coins** |

> ⚠️ **Advertencia de color.** El esmalte **no reproduce hex exactos**. La carta de
> esmaltes del taller (Pantone o similar) es la referencia real. Los colores de `docs/35`
> deben **convertirse a la carta del taller** y verificarse con una **prueba física**
> antes de producir el lote. El contraste calculado en `docs/35` §2 es sobre pantalla, no
> sobre esmalte.

---

## 4. Canto

| Tipo | Descripción | Uso |
|---|---|---|
| **Estriado (reeded)** | Estrías verticales finas | **Recomendado** para coins |
| Liso | Sin estrías | Alternativa económica |
| Con leyenda | Texto grabado en el canto | ❌ **No usar**: riesgo de parecer moneda oficial |

**Regla:** el canto **nunca** lleva el nombre de un país, un año de emisión ni un valor.
Eso convertiría la pieza en algo que parece moneda de curso legal.

---

## 5. Anverso y reverso

Confirmado por el usuario: **anverso común ISA · reverso contenido** (`docs/34` §1.2–1.3).

| Cara | Contenido | Notas de producción |
|---|---|---|
| **Anverso** | Monograma ISA, onda, puntos de temporada | Idéntico en todas las piezas; solo cambia el metal |
| **Reverso** | Símbolo de disciplina/especialidad/tema | Variable por badge |

**Ventaja de producción:** el **cuño del anverso se reutiliza** en todas las piezas de la
misma temporada. Solo se graba un cuño nuevo por reverso. Esto **reduce el costo por pieza
de forma significativa** — es la razón de negocio de la decisión 3 del usuario.

**Cantidad de cuños:** 1 por temporada (anverso) + 1 por badge (reverso).
Para Cobre: 1 + 44 = **45 cuños** (si se producen todas las piezas). Ojo: los 35 ribbons
comparten el mismo cuño de anverso.

---

## 6. Archivos y resolución

| Entregable | Formato | Especificación |
|---|---|---|
| Arte vectorial | **SVG** o **AI/EPS** | Trazado, sin mapa de bits, texto convertido a curvas |
| Capa de lettering | **SVG separado** | Una capa por idioma (regla dura 6 y decisión 5) |
| Prueba de impresión | **PDF/X-4** | CMYK, sangrado incluido |
| Mockup | **PNG 300 dpi** | Fondo transparente + versión con fondo |
| Ficha técnica | **PDF** | Medidas, materiales, colores, cantidades |

### 6.1 Resolución y DPI

| Uso | Resolución |
|---|---|
| **Master digital** | Vectorial (sin límite) |
| **Raster para producción** | **300 dpi** al tamaño final |
| Mockup web | 72–150 dpi |
| Asset de app | PNG 1024 / 512 / 256 px (`docs/34` §3) |

**Cálculo de píxeles a 300 dpi:**

| Diámetro | Píxeles a 300 dpi |
|---|---:|
| 39 mm | **461 px** |
| 45 mm | **531 px** |

### 6.2 Sangrado y márgenes

| Parámetro | Valor |
|---|---:|
| Sangrado | **3 mm** por lado |
| Margen de seguridad | **2 mm** desde el canto |
| Zona de corte | 0,5 mm fuera del bisel |

**Advertencia:** el sangrado **no aplica al arte de la moneda en sí** (que es un recorte
circular exacto), sino a la **ficha técnica, el packaging y la lámina de presentación**.
En la moneda, el margen relevante es el **margen de seguridad de 2 mm**, para que ningún
elemento quede en el canto.

---

## 7. Colores en producción

### 7.1 Conversión

Los hex de `docs/35` son **RGB de pantalla**. Para acuñar hay que convertir:

| Destino | Sistema | Acción |
|---|---|---|
| Esmalte | **Carta del taller** (Pantone) | Conversión + prueba física |
| Metal | Aleación, no color | Elegir aleación por temporada |
| Ficha impresa | **CMYK** | Conversión con perfil del taller |

### 7.2 Aleaciones por temporada

⚠️ **Este mapeo es una propuesta sin validar con taller.** Los metales reales tienen un
color propio que **no coincide necesariamente** con el hex de pantalla.

| Temporada | Hex pantalla | Aleación propuesta | Observación |
|---|---|---|---|
| Acero | `#8FA3B0` | Acero inoxidable cepillado | El metal real es más frío y oscuro |
| Cobre | `#B87333` | Cobre con pátina aplicada | La pátina se controla en taller |
| Bronce | `#CD7F32` | Bronce antiguo | Más oscuro que el hex en la práctica |
| Plata | `#C0C7CE` | Baño de plata sobre latón | + costo; el plateado se oxida |
| Oro | `#D4AF37` | Baño de oro sobre latón | + costo elevado |

> ⚠️ **Riesgo de color real.** Ninguna de las cinco aleaciones reproduce el hex de
> pantalla. **El sistema de color digital y el físico van a divergir.** Decisión pendiente
> del usuario: ¿se acepta la divergencia, o se ajustan los hex de `palette.json` para
> acercarse al metal real? **No se puede resolver sin muestras físicas.**

---

## 8. Packaging (propuesta)

No especificado en ningún documento del repositorio. **Propuesta a revisar:**

| Elemento | Propuesta |
|---|---|
| Funda | Cartulina 300 g, fondo `#0A0A0A`, sin plástico |
| Ventana | Troquel circular, sin film |
| Impresión | Lettering en vector, tipografía Barlow Condensed |
| Contenido | Coin + tarjeta con: nombre del badge (es/en), criterio, código |
| **Sin certificado** | No incluir ninguna pieza que parezca certificado |

---

## 9. Ritmo de producción sugerido

| Fase | Piezas | Prioridad |
|---|---|---|
| 1 | Coin integral de Cobre + 5 coins de especialidad | Las más "hito" |
| 2 | Ribbons STEM de Cobre (20) | Volumen alto |
| 3 | Ribbons FH (15) | **Bloqueado** hasta tener los temas |
| 4 | Coin de patrimonio, coin comunitaria, credencial | Requieren criterio |

**Advertencia de costo:** producir 46 diseños distintos con 45 cuños es un proyecto de
acuñación **grande**. Los talleres cobran por cuño, no por pieza. Conviene validar la
demanda antes de producir la familia completa.

---

## 10. Verificación y límites

**Comprobado:**

- Las medidas derivadas de la retícula se calcularon con la fórmula `radio × D` sobre las
  proporciones definidas en `docs/34` §2.
- El símbolo máximo resultante (9,36 mm a 39 mm) se calculó y se contrastó con la regla de
  reducción.
- El diámetro 39 mm y 45 mm son los propuestos por el usuario.

**No comprobado — y es importante:**

- **No hay cotización.** Ningún taller fue consultado. Todos los costos, tiempos y
  viabilidades son **estimaciones**.
- **No hay muestra física.** Los espesores, pesos y profundidades de esmalte son valores
  de referencia de la industria, **no verificados con un taller concreto**.
- **La conversión de color a esmalte no fue hecha.** Requiere la carta del taller.
- **Que las aleaciones reproduzcan el hex**: se afirma lo contrario (van a divergir), pero
  no se cuantificó.
- Que el relieve de 0,4/0,5 mm sea suficiente para los símbolos elegidos.
- Packaging: es una propuesta sin validar.

**Limitaciones:**

- Documento de **reserva**: no hay acuñación aprobada, presupuestada ni planificada.
- No modifica la app, no crea assets, no hace commit.
- Cualquier producción real requiere **consulta con taller de acuñación** antes de
  comprometer el diseño.
