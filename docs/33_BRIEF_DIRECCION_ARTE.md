# ISA · Brief de dirección de arte — reconocimientos simbólicos

**Estado:** PROPUESTA pendiente de revisión del usuario. No autoriza producción final.
**Fecha:** 10/11/2026.
**Sesión:** Arte de reconocimientos (Challenge Coins y badges).
**Insumos:** `docs/31_POLITICA_VIGENTE.md`, `docs/32_GRILLA_COBRE_COLORES.md`,
`lib/data/datasets/palette.json`, `docs/25_CATALOGO_RECONOCIMIENTOS.md`,
`docs/00_DOCUMENTO_BASE.md`.

---

## 0. Decisiones confirmadas por el usuario (10/11/2026)

| # | Decisión | Resultado |
|---|---|---|
| 1 | Soporte | **Digital primero**; specs de acuñación quedan como anexo de reserva activable |
| 2 | Familia | **Ribbon por celda** (20 STEM + 15 Factor Humano) + **coins por ruta**; no hay coin por celda |
| 3 | Caras | **Anverso = símbolo común ISA** · **reverso = contenido** |
| 4 | Retratos | **Sin retratos de personas reales**; solo símbolos y alegorías |
| 5 | Lettering | **Inglés**, siempre como **capa vectorial aparte**, nunca dentro del raster |
| 6 | Producción | Prompts IA para **concepto/exploración**; **arte final vectorizado** |

---

## 1. Qué es esta pieza (y qué no es)

Un reconocimiento ISA es **una ficha de memoria de un recorrido**: el objeto que queda
en la mano cuando alguien entendió algo. Se parece a lo que una persona colecciona de un
museo o de un tren, no a lo que cuelga de un uniforme.

| Es | No es |
|---|---|
| Un objeto de **colección** y memoria | Una certificación, título o crédito |
| Una **prueba de recorrido** hecha | Una condecoración ni una medalla militar |
| Un **símbolo de sistema técnico** entendido | Un aval institucional de ISA |
| Un objeto **lúdico** | Un objeto con valor oficial o profesional |

**Frase rectora para el ilustrador:** *"Es el sticker que te ganaste entendiendo cómo
funciona una válvula, fundido en metal."*

### 1.1 Restricción de producto que condiciona el arte

`docs/31_POLITICA_VIGENTE.md` §1 establece que ISA es una plataforma comunitaria, abierta
y **no formal**, que no expide títulos ni certificaciones. `docs/00_DOCUMENTO_BASE.md`
§17 deja abierto el conflicto "Credenciales": si la credencial es avance o acreditación
formal. **El arte no puede resolver ese conflicto por sí solo**, así que se diseña del
lado seguro: ninguna pieza usa recursos visuales de documento oficial (ver §9).

---

## 2. Tres propuestas de concepto

No son variaciones cosméticas: cambian el lenguaje de formas, el peso del relieve y cómo
se resuelve el anverso común.

### Propuesta A — "Ficha técnica de museo"

**Idea rectora:** cada pieza se ve como una **ficha de sala de museo**: un objeto plano,
sobrio, con un símbolo central dibujado como **diagrama**, no como ilustración. El
metal es el soporte; el color llega por **esmalte en superficies planas** y por el bisel.

- **Lenguaje de formas:** geométrico, líneas de grosor constante, esquinas limpias,
  simetría axial estricta. Vocabulario visual de plano técnico: secciones, cortes,
  flechas de flujo, líneas de cota muy simples.
- **Anverso común:** un **disco segmentado tipo rosa de los vientos** con el monograma
  ISA al centro, y un anillo de puntos que codifica la temporada (Acero 1 punto → Oro 5).
- **Metal y esmalte:** metal como campo, esmalte **solo** en el símbolo central y en la
  marca de disciplina. Relieve bajo (grabado fino), lectura por línea y no por volumen.
- **Ventajas:** escalabilidad excelente a 32 px (todo es línea y silueta); coherencia
  natural con `docs/32`; fácil de vectorizar; el más "no militar" de los tres.
- **Riesgos:** puede resultar frío o poco coleccionable; el relieve bajo pierde carácter
  en acuñación física.

### Propuesta B — "Sello de expedición civil"

**Idea rectora:** cada pieza es un **sello de expedición**: un objeto con huella de uso,
borde irregular controlado, como si hubiera viajado. Metáfora de pasaporte cultural, no
de condecoración.

- **Lenguaje de formas:** orgánico contenido, radios levemente irregulares (nunca caóticos),
  textura de arenado, microgolpes de matriz, borde con **canto estriado suave**.
- **Anverso común:** **globo con meridianos muy simplificados** (3 curvas, no retícula
  completa) atravesado por una **onda horizontal**; el monograma ISA en el cruce.
- **Metal y esmalte:** metal patinado en los valles, esmalte en altorrelieve en el símbolo.
  Fuerte tratamiento de pátina: el cobre se ve **usado**, no nuevo.
- **Ventajas:** máxima sensación de objeto coleccionable y de "lo gané"; la pátina da
  identidad inmediata a Acero y Cobre; muy fotogénico en mockup.
- **Riesgos:** **cuidado con el globo con meridianos**: puede leerse como emblema de
  organismo internacional (ver §9). El borde irregular complica la consistencia a 32 px.
  Requiere control fino para no caer en estética "militar gastada".

### Propuesta C — "Tesela de sistema"

**Idea rectora:** la pieza no es una moneda: es una **tesela** que encaja con las otras.
Cada reconocimiento es una pieza de un mapa mayor; el conjunto forma el recorrido. El
ribbon es rectangular con un encastre lateral; la coin es circular con el mismo encastre.

- **Lenguaje de formas:** modular, geometría de encastre (muesca y lengüeta), radio
  generoso, símbolo siempre contenido en un campo cuadrado interior.
- **Anverso común:** **silueta abstracta de casco** (una curva continua, sin detalle
  militar) atravesada por la onda; el monograma ISA bajo la curva.
- **Metal y esmalte:** metal en el cuerpo, esmalte en el campo del símbolo; la muesca
  siempre en metal puro para que el encastre se lea.
- **Ventajas:** el sistema se **explica solo** (la colección se ve completa); excelente
  para la grilla 5×5 de Cobre; muy distinto de cualquier medalla.
- **Riesgos:** el encastre obliga a pensar el layout en la app; pierde algo de solemnidad
  de "objeto" a favor de "pieza de juego"; la silueta de casco exige cuidado para no
  parecer un submarino militar en acción.

### Comparación y recomendación

| Criterio | A · Ficha técnica | B · Sello civil | C · Tesela |
|---|---|---|---|
| Legibilidad a 32 px | Alta | Media | Alta |
| Sensación de coleccionable | Media | **Alta** | Alta |
| Distancia de lo militar | **Alta** | Media | Alta |
| Facilidad de vectorizar | **Alta** | Media | Alta |
| Encaje con `docs/32` | **Alta** | Media | Alta |
| Viabilidad en acuñación futura | Media | Alta | Baja |

**Recomendación: A como base, con la pátina de B aplicada al metal.**

La estructura y el lenguaje de formas de **A** ("Ficha técnica de museo") son los que
mejor cumplen las reglas duras: máxima legibilidad, máxima distancia de cualquier
condecoración y vectorización limpia. De **B** se toma una sola cosa, muy valiosa: el
**tratamiento de pátina y microtextura**, que da la sensación de objeto ganado sin
cambiar la geometría.

De **C** se rescata la idea de **encastre visual** (un pequeño campo de disciplina
repetido en todas las piezas), que ayuda a que la colección se lea como conjunto, pero
sin adoptar la forma de tesela.

> **Pendiente de decisión del usuario.** Las tres quedan documentadas para que la
> elección sea explícita. El resto de esta sesión (sistema, paleta y prompts) asume **A+B,
> con encastre visual de C** como dirección recomendada.

---

## 3. Referencias de inspiración (sin copiar)

Se declaran **familias** de referencia, no piezas concretas. Regla: se toma el
*principio* (por qué funciona), nunca la *forma* (cómo se ve).

| Familia de referencia | Qué se toma | Qué NO se copia |
|---|---|---|
| Numismática **conmemorativa civil** (monedas de eventos, aniversarios científicos) | Relación campo/bisel, altura de relieve, presencia de leyenda en anillo | Diseños concretos, retratos, emblemas nacionales, valor facial |
| Medallas de **sociedades científicas y academias** | Sobriedad, uso de un solo símbolo fuerte central | Cruces, estrellas, coronas, cintas, cualquier orden existente |
| **Pins y fichas de museos** | Formato pequeño, color plano, lectura instantánea | Logos e identidades de museos reales |
| **Fichas de transporte y tokens** | Encastre, canto estriado, resistencia al desgaste | Diseños de tokens existentes |
| **Sellos postales y matasellos** | Composición circular con leyenda perimetral, fecha | Escudos, efigies, símbolos de Estado |
| **Planos técnicos y diagramas de taller** | Lenguaje de línea, vocabulario de sección y flujo | Planos reales de sistemas patentados |

**Regla de originalidad (obligatoria):** el ilustrador no debe trabajar "a partir de una
imagen de referencia", sino **a partir de esta especificación escrita**. Si en algún
momento necesita mirar una moneda real como referencia de *técnica*, debe cambiar al
menos: símbolo, composición, leyenda, proporciones y paleta.

---

## 4. Estilo visual

- **Forma:** disco perfecto para coins y credencial; rectángulo de proporción 3:2 con
  campo interior cuadrado para ribbons.
- **Línea:** grosor constante, mínimo 2 unidades sobre un master de 1024 px (≈0,2 % del
  diámetro). Nada de línea modulada ni caligráfica.
- **Nivel de detalle:** **bajo por diseño**. Máximo un símbolo principal + un elemento
  secundario (onda, retícula, trazo de flujo). Todo detalle que no sobreviva a 32 px se
  elimina en la versión reducida (ver §5 de `docs/34_SISTEMA_BADGES.md`).
- **Relieve:** grabado bajo en el campo, altorrelieve **solo** en el símbolo central y en
  el bisel. El bisel es siempre el elemento más brillante.
- **Fondo:** campo **oscuro neutro** (`#0A0A0A` o el metal en su valor más bajo), nunca
  blanco puro, nunca con textura fotográfica.
- **Prohibido en el estilo:** sombras dramáticas, efectos de "explosión", rayos, brillos
  tipo estrella, filtros de alto contraste agresivo, HDR, viñeteo fuerte.

---

## 5. Materiales

La materialidad es lo que separa un badge de dibujo de un objeto. Cada temporada tiene
una receta (los hex exactos están en `docs/35_PALETA_BADGES.md`).

| Temporada | Metal | Acabado | Pátina | Cómo se ve |
|---|---|---|---|---|
| Acero | `#8FA3B0` | Satinado | Mínima | Gris azulado frío, brillo difuso, aspecto de herramienta limpia |
| Cobre | `#B87333` | Patinado | Media | Naranja rojizo con valles oscurecidos, calidez, huella de tiempo |
| Bronce | `#CD7F32` | Patinado | Media-alta | Más dorado y más oscuro que el cobre, verdín muy leve en las profundidades |
| Plata | `#C0C7CE` | Pulido | Ninguna | Espejo frío, reflejo nítido, máximo contraste especular |
| Oro | `#D4AF37` | Satinado | Ninguna | Dorado cálido sin brillo vulgar, reflejo ancho y suave |

**Acero es el caso especial:** no lleva color de disciplina (`docs/32` §3). Se representa
**solo con su metal**. Esto es una decisión de producto, no un olvido: Acero no tiene
preguntas TIMSS ni dimensiones STEM.

### 5.1 Esmalte

- Técnica: esmalte **aplicado en cavidad** (champlevé simplificado), superficie plana,
  levemente por debajo del bisel.
- Color: **solo** el color de disciplina o de especialidad de la temporada. **Nunca
  esmalte de metal** (no hay "esmalte plateado").
- Cantidad: máximo **dos** zonas esmaltadas por cara. El resto es metal.
- Sobre oro y plata el esmalte debe ir con **contorno de separación** en metal oscuro,
  porque el metal claro "come" el color.

---

## 6. Iluminación

Especificación única, para que todas las piezas se lean como una familia:

- **Luz principal:** cenital suave, difusa, ligeramente desviada ~15° para que el relieve
  proyecte sombra legible sin dramatismo.
- **Luz de relleno:** frontal baja intensidad, para que las cavidades no se pierdan.
- **Contraluz:** ausente o mínimo. Sin halo.
- **Especular:** controlado. El bisel y el canto llevan el brillo; el campo nunca.
- **Sombra proyectada:** contacto suave, radio amplio, opacidad baja. Sin sombra dura.
- **Temperatura:** neutra (≈5500 K). Sin dominante azul ni ámbar, para que el metal de
  cada temporada se lea por sí mismo.
- **Fondo:** oscuro neutro, viñeta leve, sin elementos. El objeto flota, no se apoya.

---

## 7. Tratamiento del metal y del esmalte

Cómo se combinan los tres canales de color de `docs/32` sin ensuciar la pieza:

| Canal | Superficie | Comportamiento |
|---|---|---|
| **Temporada (metal)** | Cuerpo de la pieza, canto, bisel | Siempre metal. Nunca esmalte. Define el nivel |
| **Disciplina (tono STEM)** | Símbolo central o campo del símbolo | Esmalte, o metal coloreado si el contraste lo permite |
| **Especialidad (paso metálico)** | Elemento estructural: muesca, barra, canto interno | Metal de la rampa de 5 pasos; elemento, no texto |

Reglas de composición:

1. **Una pieza, un protagonista.** El símbolo manda; el color de disciplina lo viste.
2. **El metal nunca compite con el esmalte.** Si el metal de la temporada es claro (Plata,
   Oro) y la disciplina también (Matemática `#E2D23C`), se separa con **contorno oscuro**
   o se pasa la disciplina a metal coloreado sobre campo oscuro.
3. **La especialidad es estructura, no color de lectura.** Va en la muesca o barra, con
   la etiqueta de la fila (`MAQ`, `ELE`, …) siempre presente.
4. **Ningún canal depende solo del color** (ver §8 y `docs/35` §daltonismo).
5. **Acero:** solo metal + neutros. Sin esmalte de disciplina.

---

## 8. Sistema de alt-text

Cada badge necesita texto alternativo breve. Reglas:

1. **Una sola frase**, 8–16 palabras, en el idioma de la interfaz.
2. **Estructura fija:** `[Tipo] de [contenido] · [temporada]` + qué muestra el símbolo.
3. **Describe la pieza, no el logro.** No decir "ganaste", "felicitaciones", "certifica".
4. **No repetir el nombre visible** si el lector de pantalla ya lo lee: el alt agrega el
   *aspecto visual*, no duplica el texto.
5. **Nunca decir que es una medalla, condecoración, insignia militar o certificado.**
6. Sin emojis, sin mayúsculas grito, sin signos de exclamación.

Ejemplos:

| Pieza | Alt-text (es) | Alt-text (en) |
|---|---|---|
| Ribbon SCI×MAQ (Cobre) | `Ribbon circular de cobre con engranaje esmaltado en cian y la marca SCI` | `Copper circular ribbon with a cyan-enamelled gear and the SCI mark` |
| Coin Cobre (integral) | `Moneda de cobre patinado con la hélice de ISA y cinco marcas de disciplina` | `Patina copper coin with the ISA propeller and five discipline marks` |
| Ribbon FH-01 (Cobre) | `Ribbon de cobre con símbolo de convivencia a bordo y la marca FH` | `Copper ribbon with a life-on-board symbol and the FH mark` |
| Coin Acero | `Moneda de acero satinado, sin color de disciplina, con la onda de ISA` | `Satin steel coin, no discipline colour, with the ISA wave` |

**Regla de contraste del alt:** el alt-text debe ser suficiente para entender la pieza
**sin verla y sin leer el nombre**. Si no lo es, el alt está mal escrito.

---

## 9. Qué NO se hace nunca

Lista de vetos para el ilustrador y para quien escribe prompts. Alineada con
`docs/31_POLITICA_VIGENTE.md` §2 y con las reglas duras de la sesión.

### 9.1 Contenido bélico (BLOQUEANTE)

- Armas, explosivos, munición, torpedos, tubos lanzatorpedos, miras, balística.
- Cascos militares, uniformes, insignias militares reales, grados, galones.
- Condecoraciones existentes o reconocibles, cruces, estrellas de orden, coronas.
- Banderas o símbolos nacionales, ni reales ni estilizados.
- Glorificación del conflicto: explosiones, impacto, "acción", enemigo, objetivo.
- **La guerra como contexto histórico**, incluso sin imágenes bélicas explícitas.
- **Eufemismos:** no se sustituye "torpedo" por "cilindro" para conservar el objeto.
  Se cambia el **tema**, no la palabra (`docs/31` §2).

### 9.2 Parecer certificación o medalla real (BLOQUEANTE)

- Sellos, timbres, firmas, rúbricas, cintas de condecoración, pasadores.
- Numeración serial que sugiera título oficial o folio.
- Palabras en el arte: *certificate, certified, diploma, official, award, medal,
  decoration, honour, rank*. Tampoco su traducción.
- Retratos, efigies, bustos, coronas de laurel imperiales.
- Cintas de ribbon con patrones de cintas de condecoraciones reales (franjas
  centrales, diagonales, colores nacionales).
- Escudos de armas reales o de instituciones existentes.

### 9.3 Riesgos de interpretación (CONDICIÓN)

| Elemento | Condición |
|---|---|
| Globo terráqueo con meridianos | Solo si es **muy simplificado** (≤3 curvas) y sin aros/laureles; puede leerse como emblema de organismo internacional |
| Silueta de submarino | Solo como **curva abstracta del casco**, sin torreta de ataque, sin hélices en movimiento, sin estela de acción |
| Radiación (trébol) | Símbolo de **peligro civil** normalizado. Permitido solo en contexto técnico de seguridad, nunca de amenaza |
| "Reactor" | Usar lenguaje civil de **planta de energía / generación**. Evitar cualquier connotación de propulsión de guerra |
| Nombres de compartimentos | Revisar uno por uno contra `docs/31` §2 (ver conflicto en §10) |

### 9.4 Técnica

- **Texto generado por IA dentro de la imagen.** El lettering va aparte, en vector.
- Deformaciones, ruido, artefactos, manos, caras o texto ilegible.
- Marcas de agua, firmas de modelo, logos de herramienta.
- Depender solo del color para comunicar cualquier dato.

---

## 10. Conflictos detectados (informar, no corregir por iniciativa propia)

Según `AGENTS.md` ("Si detectás diferencias… informalas"), se reportan sin corregir:

| # | Conflicto | Evidencia | Impacto en arte |
|---|---|---|---|
| 1 | **Modelo de celdas** | `docs/25` (6/11) define 25 celdas con HUM×especialidad y "Humanidades y Artes"; `docs/31` (9/11, **vigente**) lo reemplaza por 20 celdas STEM + 15 temas de Factor Humano como columna libre | La familia de ribbons pasa de 25 a **35 piezas** (20+15) |
| 2 | **Motivo torpedo** | `docs/25` §2 asigna "Proa/torpedo" a `RIB-AC-PROA` | Viola la regla dura 1. Reemplazo propuesto: **hidrodinámica / forma del casco** |
| 3 | **Código desactualizado** | `lib/missions.ts` conserva `DISCIPLINES` con "Humanidades y Artes" y `IMAGES` incluye `/images/m-torpedo.png` | Insumo de arte obsoleto; no usarlo como referencia |
| 4 | **Nombre "Diploma"** | `docs/25` §2 nombra `BADGE-ACERO-DIPLOMA` "Diploma de Visitante Submarino" | Un diploma sugiere certificación. Ver `docs/36_REVISION_NO_BELICA.md` |
| 5 | **Titularidad del escudo** | `docs/32` §5 dice que los tonos vienen del escudo de ISA (`lib/missions.ts`, `DISCIPLINE_META`) | Necesario confirmar quién es titular del escudo antes de reproducirlo en arte |
| 6 | **Assets provisorios** | 40 PNG + 2 manifiestos en `public/images/badges/`, generados con Pillow, con iconos por celda | Son insumo de **iconografía** (ver `docs/34` §iconos), no de estilo. Se reemplazan |

---

## 11. Verificación y límites de este documento

**Comprobado:**

- Leídos los cinco insumos obligatorios y `docs/00_DOCUMENTO_BASE.md`.
- Los hex citados provienen de `lib/data/datasets/palette.json` (leído completo).
- Existen 40 PNG + 2 manifiestos en `public/images/badges/` (glob verificado).
- `lib/missions.ts` contiene el modelo antiguo de 5 disciplinas (leído, líneas 11–29).
- El manifiesto de Cobre trae `icon` por celda (`gear`, `bolt`, …) — sirve de base para
  el catálogo de iconos de `docs/34`.

**No comprobado:**

- Que el escudo de ISA sea original y de titularidad del proyecto (requiere confirmación).
- Contraste final de cada decisión de color (se computa en `docs/35_PALETA_BADGES.md`).
- Que existan los 15 temas de Factor Humano con nombres definitivos (no están en los
  documentos leídos; se usan placeholders `FH-01..FH-15`).
- Viabilidad real de acuñación (anexo de reserva; requiere taller).

**Limitaciones:**

- Las tres propuestas son **dirección de arte**, no arte. No hay pieza gráfica producida.
- La recomendación A+B es una **propuesta**, no una decisión tomada.
- Este documento **no modifica la app**, no crea pantallas y no hace commit.
