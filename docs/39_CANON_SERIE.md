# ISA — Canon de la serie (borrador de trabajo)

Fecha: 10/11/2026. **Documento vivo.** Este es el lugar donde se documentan las
decisiones narrativas de la serie. El producto (app, grilla, TIMSS, badges) se rige por
`docs/31_POLITICA_VIGENTE.md`; este canon no cambia la app sin una decisión aparte.

## 1. Regla base

- La **International Submarine Academy (ISA)** es la plataforma donde se proyecta la
  serie. **No aparece ni se nombra dentro de la ficción.**
- La serie es ficción; los lugares, objetos, museos y conocimientos son reales.
- La capa educativa (el veterano/guía que explica un sistema) complementa la ficción;
  el resto del relato es ficción pura.
- El mapa de submarinos museo es real; en la ficción se ve desde el móvil del POV.

## 2. Decisiones confirmadas

1. **La Señal** es un **ping de sonar** que suena en el móvil del POV seleccionado.
   El POV visitó un submarino museo (posiblemente en una excursión escolar).
2. Cada submarino museo tiene una **fecha de excursión** (indistinta). Sirve para ubicar
   la experiencia de Cobre en la época actual; Acero es el recuerdo de la visita.
3. El POV es el protagonista. En **Acero** recibe un **diploma** con su nombre y un
   **nick de pez aleatorio** de una lista (tradición del bautismo en el dominio de
   Neptuno). Pez Luna es uno de los ejemplos posibles.
4. **Antagonistas:** **El Reloj** (el tiempo que se acaba, presión de la misión) y
   **La Desinformación** (adversario humano). Los dos conviven.
5. **Fracaso:** no hay fracaso definitivo; se reintenta. El temporizador y los intentos
   pueden alimentar un **ranking** (a definir), no bloquear el avance.
6. **Final colectivo:** un artefacto / mini submarino civil para investigar un
   interrogante del océano. Es narrativo, pero la información de las grillas debe estar
   presente; el diseño del artefacto se piensa más adelante.
7. **Producción:** ficción con IA basada en lugares e historias reales. El piloto se hace
   con **presupuesto 0**: herramientas gratuitas, material de voluntarios y YouTube.
8. **Producto:** queda como está. La app complementa la serie con la explicación del
   veterano; el resto es ficción. La numeración “Acero 04” es del proyecto anterior: no
   se usa como total de temporada.
9. **Grilla:** la actual (20 celdas STEM + 15 Factor Humano). El doc viejo de 5×5 solo
   aporta el recurso narrativo.

### 2.1 Confirmadas el 10/11/2026 (11–22)

| # | Decisión |
|---|---|
| 11 | Nombres: **Credencial** (temporada), **Ribbon** (celda/estación), **Coin** (hito/hallazgo) |
| 12 | MVP **estático**; backend y claves institucionales en fase 2 |
| 13 | Serie en **app + YouTube**: YouTube descubre, la app es la experiencia |
| 14 | Episodios **autónomos en Acero**; hilo narrativo suave en Cobre/Bronce, con **scroll sugerido** y “ver siguiente episodio” |
| 15 | Acero con **pregunta de observación, sin TIMSS**; TIMSS solo en Cobre |
| 16 | “Alguien estuvo y dejó una señal”; el misterio se mantiene, y en un episodio se piden datos para el diploma / se escanea un QR |
| 17 | Homenaje + **no-endoso** + contacto formal con la asociación real; nunca ISAGB |
| 18 | Sin nombres reales de submarinos/museos hasta convenio |
| 19 | 1945/1962 como **memoria y reconciliación**, sin batallas ni glorificación |
| 20 | **Todo público**, sin contacto con desconocidos, museos solo con permiso, sin datos personales obligatorios |
| 21 | El museo conserva **control editorial y de imagen**; ISA adapta, valida y atribuye; sin exclusividad |
| 22 | Éxito = **retención/finalización + visitas atribuidas + leads institucionales** |

### 2.2 Confirmadas el 10/11/2026 (ranking, diploma, feed, reloj)

- **Ranking:** local, **diario**, muestra los **primeros 20** y se reinicia a las 24 h;
  pensado para viralizar. Mientras no haya backend es simbólico/local; el ranking global
  se difiere.
- **Diploma:** **descargable en la app**, sin datos obligatorios. El envío por email
  queda para cuando exista backend y política de privacidad.
- **Scroll sugerido:** se implementa **cuanto antes**, cuando la versión definitiva del
  feed vertical esté lista.
- **El Reloj:** **alguien anuncia una fecha** y algo puede pasar ese día. La fecha es
  diegética (la tira un personaje o La Señal), no una promesa real.
- **Mecánica:** aprobada (B + D + ranking opt-in).

## 3. Pez Luna y el bautismo

- Tradición: en el dominio de Neptuno se recibe un nombre de pez.
- En Acero, el reconocimiento no es una Coin: es un **diploma** con nombre y **nick de
  pez aleatorio** de una lista.
- La lista de peces se define como recurso narrativo: Pez Luna, Pez Espada, Pez Globo,
  Pez Ángel, Pez Payaso, Pez Volador, Pez Martillo, Pez Sierra, Pez Gato, Pez Tigre…
- El nick es **aleatorio por usuario** de la lista de peces (Pez Luna es uno de los
  ejemplos); sin repetición dentro de una cohorte. El diploma se guarda en la app y se
  puede compartir.

## 4. Mecánica de preguntas: opciones

Hoy: 20 s, 2 intentos, respuesta incorrecta o tiempo agotado cierra la misión; puntos
100/80/25; se reintenta la misión; no hay ranking.

| Opción | Cómo funciona | Pro | Contra |
|---|---|---|---|
| A. Actual | 2 intentos; si falla, misión cerrada y reintento | Simple | Frustra; el tiempo castiga |
| B. Otra variante | Si falla, explicación y **otra pregunta** de la misma celda/estación | Aprovecha el banco (3 variantes) | Expone variantes; más trabajo de UX |
| C. Dominio | Sin fallo: explicación y reintento de la misma pregunta hasta acertar | Educativo, sin frustración | Pierde tensión |
| D. Sin tiempo | El timer no falla; solo mide para el ranking | Accesible | Menos urgencia |
| E. Adaptativa | Preguntas de dificultad creciente según respuestas | Rica | Compleja; riesgo de exponer banco TIMSS |

**Aprobado (10/11/2026): B + D + ranking optativo.**
- El error no bloquea: muestra explicación y ofrece **otra variante** (o reintentar).
- El tiempo no falla: suma al puntaje/ranking.
- Ranking **opt-in**, con nick de pez, por temporada, sin datos personales; solo
  “cuadro de honor” si el usuario acepta.
- Mientras la app sea estática, el ranking es **local/simbólico**; el ranking global
  requiere backend y se difiere.
- Puntaje: 100 al primer intento; 60 tras una explicación; 40 tras dos intentos; hasta
  +20 por tiempo restante; práctica posterior = 0. El ribbon se otorga una vez.

### 4.1 Scroll sugerido (decisión 14)

Además del botón “Ver siguiente episodio”, al terminar un episodio la app muestra un
**feed vertical** de episodios sugeridos (scroll tipo reel), con:
- portada, título, temporada y estado;
- swipe arriba/abajo;
- un botón fijo “Ver siguiente”;
- criterio de sugerencia: misma temporada → mismo sistema/compartimento → mismo museo →
  Factor Humano; sin bucle infinito y sin autoplay con sonido.
- Accesibilidad: navegación por teclado, `prefers-reduced-motion`, subtítulos siempre.

### 4.2 Datos, diploma y QR (decisión 16)

- El diploma de Acero se genera **primero en la app**, sin pedir datos.
- El envío por email es **opcional** y con consentimiento explícito; para menores, sin
  datos o con consentimiento del adulto responsable. Nada de datos personales
  obligatorios.
- En la ficción, un personaje puede pedir “dejen sus datos para el diploma” y otro
  episodio puede mostrar el escaneo de un **QR**.
- Ese QR puede volverse **real** en museos colaboradores: deep link a una estación o a
  información ampliada; sin tracking personal.
- El QR de la ficción no debe confundirse con el QR real: etiqueta “QR de la ficción”
  vs “QR del museo”.

## 5. Presupuesto 0: implicancias

- Nada de Uscreen/Vimeo/Cloudflare Stream pagos por ahora: app estática + YouTube.
- Imagen: Gemini/ImageFX free; video: clips cortos gratuitos o stills con movimiento;
  voz: TTS gratuito; edición: CapCut/Canva free.
- La producción “real” llega con voluntarios, museos o un sponsor.
- El piloto se hace con **still + voz + subtítulos** (v0.1) y se mejora por iteración.
- Buscar después: microcréditos, fondos culturales, auspiciantes, canje con museos.

## 6. Preguntas abiertas

- **Implementación de la mecánica** aprobada (B + D + ranking): falta definir el motor
  de variantes y el registro de progreso. Para FH se reintenta la misma pregunta.
- **Ranking:** local/simbólico hasta tener backend; decidir si y cuándo se invierte en
  uno pequeño.
- **Diploma y email:** definir el flujo de consentimiento, la política de menores y el
  texto legal.
- **Scroll sugerido:** implementar el feed vertical después del piloto.
- **QR real en museos:** depende de un museo colaborador y del acuerdo de uso.
- **Antagonistas:** El Reloj y La Desinformación conviven; falta decidir el peso de cada
  uno por temporada.

## 7. Fuentes

- `docs/31_POLITICA_VIGENTE.md` (producto y contenidos).
- `docs/36_HISTORIA_REAL_EN_LA_WEB.md` (historia real de la ISA/ISAGB).
- `docs/38_CUESTIONARIO_SERIE_ISA.md` (cuestionario).
- `C:\Users\MDQdam\Proyectos\snk\ISC - Historia\Serie.txt` (borrador de presentación;
  no es canon).
