# Matriz de las 20 celdas de Cobre (STEM)

**Proyecto:** International Submarine Academy · **Temporada:** Cobre (Nivel 1) · **Dominio cognitivo:** Knowing
**Fecha:** 9 de noviembre de 2026 · **Estado:** propuesta para producción

Cada celda es una experiencia: un episodio de guía + 3 variantes de pregunta. La variante se sortea por día
(ALFA/BRAVO/CHARLY) en la implementación; el banco solo la etiqueta `variant_index` 1–3.

El código de sistema (`SYS-<código del CSV>`) remite al catálogo de sistemas por compartimentos; el CSV original
no se editó. La rama `1.2` del catálogo está excluida y no se usa.

| # | Celda | Especialidad | Disciplina | Episodio (tema) | Sistemas ancla | Compartimento |
|---:|---|---|---|---|---|---|
| 1 | `CU-SCI-MAQ` | Maquinista | Ciencias | calor y combustión en la sala de máquinas | SYS-4.1.1 Motores Diésel; SYS-4.1.2 Esmórquel; SYS-4.1.3 Escape de Gases | `CMP-MAQUINAS` |
| 2 | `CU-TEC-MAQ` | Maquinista | Tecnología | presión y energía acumulada en el circuito hidráulico | SYS-4.2.1 Bombas Principales; SYS-4.2.2 Acumuladores | `CMP-MAQUINAS` |
| 3 | `CU-ING-MAQ` | Maquinista | Ingeniería | caudal, achique y compresión | SYS-4.3.1 Bombas de Achique; SYS-4.3.2 Compresores de Aire | `CMP-MAQUINAS` |
| 4 | `CU-MAT-MAQ` | Maquinista | Matemática | medición, mezclas y mantenimiento | SYS-4.3.3 Separadores de Aceite; SYS-4.3.1 Bombas de Achique | `CMP-MAQUINAS` |
| 5 | `CU-SCI-ELE` | Electricista | Ciencias | la química que guarda energía: baterías | SYS-3.1.1 Bancos de Baterías | `CMP-BATERIAS-LOGISTICA` |
| 6 | `CU-TEC-ELE` | Electricista | Tecnología | convertir y distribuir la energía | SYS-3.1.2 Conversores AC/DC; SYS-5.1.1 Motor Eléctrico (MEP) | `CMP-BATERIAS-LOGISTICA` |
| 7 | `CU-ING-ELE` | Electricista | Ingeniería | seguridad de gases y ventilación | SYS-3.1.3 Ventilación de Gases | `CMP-BATERIAS-LOGISTICA` |
| 8 | `CU-MAT-ELE` | Electricista | Matemática | autonomía, potencia y rendimiento | SYS-3.1.1 Bancos de Baterías; SYS-5.1.1 Motor Eléctrico (MEP) | `CMP-BATERIAS-LOGISTICA` |
| 9 | `CU-SCI-ELN` | Electrónico | Ciencias | ondas que exploran: sonar | SYS-1.1.1 Sonar Pasivo; SYS-1.1.2 Sonar Activo; SYS-1.1.3 Arreglo de Flanco | `CMP-PROA` |
| 10 | `CU-TEC-ELN` | Electrónico | Tecnología | ver sin ventanas: periscopio y mástil optrónico | SYS-2.1.1 Periscopio de observación; SYS-2.1.2 Periscopio de búsqueda; SYS-2.1.3 Mástil Optrónico | `CMP-CONTROL` |
| 11 | `CU-ING-ELN` | Electrónico | Ingeniería | comunicar bajo el agua y desde la superficie | SYS-2.3.1 Antena HF/VHF; SYS-2.3.2 Antena de Satélite; SYS-2.3.3 Teléfono Submarino | `CMP-CONTROL` |
| 12 | `CU-MAT-ELN` | Electrónico | Matemática | orientación y medida: giroscopio, carta y ecosonda | SYS-2.2.1 Giroscopio Láser; SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda | `CMP-CONTROL` |
| 13 | `CU-SCI-NAV` | Ingeniero Naval | Ciencias | presión, estanqueidad y compartimentación | SYS-S.1 Mamparos Estancos; SYS-5.3.2 Sello del Eje; SYS-S.2 Escotillas de Rescate | `CMP-TRANSVERSAL` |
| 14 | `CU-TEC-NAV` | Ingeniero Naval | Tecnología | flotar, sumergir y trimar | SYS-1.3 Tanques de Inundación; SYS-5.3.1 Tanques de Trimado; SYS-2.4.2 Panel de Inmersión | `CMP-CONTROL` |
| 15 | `CU-ING-NAV` | Ingeniero Naval | Ingeniería | forma, ruido y movimiento | SYS-5.1.3 Hélice de Bajo Ruido; SYS-5.2.1 Timón de Dirección; SYS-5.3.3 Recubrimiento Anecoico | `CMP-POPA` |
| 16 | `CU-MAT-NAV` | Ingeniero Naval | Matemática | profundidad, carta y geometría del fondo | SYS-2.2.2 Plotter de Cartas; SYS-2.2.3 Ecosonda | `CMP-CONTROL` |
| 17 | `CU-SCI-LOG` | Logístico | Ciencias | el aire que se respira | SYS-3.2.1 Generador de Oxígeno; SYS-3.2.2 Scrubber de CO2 | `CMP-BATERIAS-LOGISTICA` |
| 18 | `CU-TEC-LOG` | Logístico | Tecnología | temperatura y humedad a bordo | SYS-3.2.3 Climatización | `CMP-BATERIAS-LOGISTICA` |
| 19 | `CU-ING-LOG` | Logístico | Ingeniería | agua potable, residuos y cocina | SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora; SYS-3.3.3 Eyector de Basura | `CMP-BATERIAS-LOGISTICA` |
| 20 | `CU-MAT-LOG` | Logístico | Matemática | víveres, proporciones y autonomía | SYS-3.3.1 Cocina; SYS-3.3.2 Desalinizadora | `CMP-BATERIAS-LOGISTICA` |

## Variantes por celda

### CU-SCI-MAQ · calor y combustión en la sala de máquinas

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Antes de poner en marcha el motor diésel, el maquinista repasa las condiciones para que el gasóleo se queme dentro del cilindro. ¿Qué par de condiciones son imprescindibles para la combustión? | `S052046` | concepto adaptado: condiciones para apagar un fuego (falta de oxígeno) → condiciones de la combustión en el arranque del motor diésel | A |
| 2 | Durante la combustión en el cilindro ocurren varios cambios a la vez. ¿Cuál par de observaciones indica que hubo un cambio químico y no solo un cambio físico? | `S042100` | concepto adaptado: observaciones que evidencian un cambio químico → señales de combustión en el cilindro y en el escape | B |
| 3 | Cuando la combustión del carbono es incompleta, el escape contiene monóxido de carbono. ¿Cuál es la fórmula química de ese gas? | `S042073` | concepto adaptado: fórmula de un compuesto a partir de su nombre → fórmula del monóxido de carbono en una combustión incompleta | C |

### CU-TEC-MAQ · presión y energía acumulada en el circuito hidráulico

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | En el circuito hidráulico, la presión se calcula con p = F / A. Una bomba principal aplica una fuerza de 900 N sobre un émbolo de 0,03 m². ¿Qué presión ejerce sobre el aceite, en pascales? | `M032538` | concepto adaptado: sustituir un valor en una fórmula (y = 10t) → sustituir fuerza y área en p = F/A | D |
| 2 | Antes de una prueba se verifica que la presión p del acumulador, en bar, cumpla la condición 4p − 6 < 2p + 4. ¿Qué valores de p mantienen el circuito dentro del rango previsto? | `M042103` | concepto adaptado: resolver una inecuación lineal → umbral de presión admisible del acumulador | A |
| 3 | El circuito hidráulico reparte 120 bar entre dos ramas: la rama A recibe 20 bar más que la rama B. ¿Cuánta presión corresponde a cada rama? | `M042226` | concepto adaptado: sistema de ecuaciones con tres incógnitas → reparto de presión entre dos ramas del circuito | B |

### CU-ING-MAQ · caudal, achique y compresión

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Una bomba de achique extrae 4,5 m³ de agua de la sentina en 90 s. ¿Cuál es el caudal medio de la bomba? | `M052302` | concepto adaptado: evaluar una expresión con una división (y = a + b/c) → caudal como cociente volumen/tiempo | C |
| 2 | El compresor eleva la presión del aire y después un enfriador baja su temperatura. ¿Qué le ocurre al vapor de agua que lleva ese aire? | `S042272` | concepto adaptado: movimiento de las moléculas al enfriarse → condensación del vapor en el aire comprimido | D |
| 3 | Una bomba de achique extrae 4,5 m³ de agua en 90 s, pero una fuga devuelve el 20 % del caudal. ¿Cuál es el caudal neto de achique? | `M032166` | concepto adaptado: estimación de orden de magnitud de un cociente → volumen estimado a partir del caudal | A |

### CU-MAT-MAQ · medición, mezclas y mantenimiento

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El separador de aceite se controla con cinco lecturas de aceite residual en el agua de sentina: 8, 11, 13, 16 y 22 mg/L. ¿Cuál es la media de esas cinco lecturas? | `M042169A` | concepto adaptado: media aritmética de cinco datos → media de las lecturas de aceite residual del separador | B |
| 2 | El micrómetro del taller registra un espesor de película de aceite de 0,47 mm. ¿Qué valor representa el dígito 7 en esa lectura? | `M032094` | concepto adaptado: valor posicional al combinar centésimas y milésimas → valor posicional en una lectura de micrómetro | C |
| 3 | En el registro de mantenimiento se suman dos consumos de aceite: 12,35 L y 4,628 L. ¿Cuál es el total registrado? | `M052231` | concepto adaptado: suma de decimales con distinta cantidad de cifras → acumulación de consumos en el registro de mantenimiento | D |

### CU-SCI-ELE · la química que guarda energía: baterías

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El dióxido de plomo (PbO2) recubre la placa positiva de una batería de plomo-ácido. ¿Cuántos átomos de plomo y de oxígeno contiene una unidad de PbO2? | `S042076` | concepto adaptado: número de átomos de cada elemento en una fórmula → composición atómica del PbO2 de la placa positiva | A |
| 2 | El electrolito del banco contiene ácido sulfúrico, de fórmula H2SO4. ¿Cuál afirmación explica correctamente por qué el H2SO4 es un compuesto? | `S042306` | concepto adaptado: definición de compuesto → clasificación del electrolito del banco de baterías | B |
| 3 | Mientras el banco de baterías se carga, el electrolito acumula energía. ¿Cuál afirmación describe correctamente un proceso que absorbe energía? | `S042112` | concepto adaptado: proceso químico que absorbe energía → carga del electrolito que guarda energía | C |

### CU-TEC-ELE · convertir y distribuir la energía

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | En inmersión, el banco de baterías alimenta al conversor y el conversor alimenta al motor eléctrico que mueve la hélice. ¿Cuál es la cadena de conversiones de energía? | `S032024` | concepto adaptado: cadena de conversiones de energía en un dispositivo a batería → cadena banco, conversor y motor eléctrico | D |
| 2 | La ficha del conversor indica que entrega como energía útil el 37,5 % de la energía que recibe; el resto se pierde como calor. ¿Qué fracción de la energía recibida se entrega como energía útil? | `M042032` | concepto adaptado: fracción equivalente a un decimal → rendimiento del conversor expresado como fracción | A |
| 3 | El registro de una inmersión anota 400 kWh disponibles a las 07:00. El motor consume 40 kWh por hora y un banco de reserva aporta 20 kWh por hora. Si esos valores se mantienen constantes, ¿a qué hora el banco principal queda con 260 kWh? | `M032681A` | concepto adaptado: lectura de un registro de valores en el tiempo → balance entre carga y consumo del banco hora por hora | B |

### CU-ING-ELE · seguridad de gases y ventilación

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El sensor de la ventilación mide 0,8 m3 de hidrógeno en un compartimento de 40 m3. ¿Qué porcentaje del volumen del compartimento representa esa cantidad? | `M042059` | concepto adaptado: proporción y porcentaje de una parte sobre un total → concentración de hidrógeno en el volumen del compartimento | C |
| 2 | La ventilación del compartimento extrae un caudal fijo de 30 m3/h más 0,4 m3/h por cada metro cuadrado de superficie. Si la superficie es s metros cuadrados, ¿qué expresión da el caudal total extraído? | `M032477` | concepto adaptado: relación lineal con base fija más término proporcional → caudal de extracción de la ventilación según la superficie | D |
| 3 | Para mantener el balance, el aire que entra en el compartimento debe igualar al que sale. Si el extractor trabaja a 12,5 m³ por minuto, ¿cuál igualdad expresa correctamente ese caudal en metros cúbicos por hora? | `M052214` | concepto adaptado: igualdad numérica verdadera → balance entre caudal de aire que entra y que sale, con cambio de unidad | A |

### CU-MAT-ELE · autonomía, potencia y rendimiento

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El cálculo de autonomía del banco da 5 7/8 horas. ¿Cuál es ese valor en horas, redondeado a dos decimales? | `M032725` | concepto adaptado: número mixto a decimal → autonomía del banco expresada en horas decimales | B |
| 2 | En una hora de inmersión, cada una de las m luces del compartimento consume P kWh y cada uno de los n motores consume 2P kWh. ¿Qué expresión da el consumo total de esa hora? | `M032295` | concepto adaptado: expresión algebraica de un total con dos grupos de distinto consumo → consumo horario de luces y motores del compartimento | C |
| 3 | El consumo registrado se estima con C = P · t + 1, donde P es la potencia en kW, t el tiempo en horas y 1 representa un consumo fijo de 1 kWh. Si P = 6 y t = 3, ¿cuál es el valor de C? | `M032738` | concepto adaptado: orden de operaciones en una expresión con producto y suma → evaluación de la fórmula de consumo del motor | D |

### CU-SCI-ELN · ondas que exploran: sonar

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Un hidrófono del sonar pasivo recibe el sonido de un motor que se acerca por el agua. ¿De qué depende la velocidad con que ese sonido viaja hasta el sensor? | `S042274` | concepto adaptado: la velocidad de una onda depende del medio → velocidad del sonido en el agua que recibe el sonar pasivo | A |
| 2 | En una prueba se mide el mismo pulso sónico en aire y en agua de mar, y en el agua llega mucho antes. ¿Cuál es la mejor explicación de esa diferencia? | `S052207` | concepto adaptado: propiedades del medio y propagación de la onda → comparación de la velocidad del sonido en aire y en agua de mar (compresibilidad) | B |
| 3 | El arreglo de flanco registra un chasquido repetido junto a la hélice cuando el agua forma burbujas de vapor que se expanden y colapsan. ¿Por qué ese fenómeno produce sonido? | `S052297` | concepto adaptado: burbujas de gas como fuente de sonido → chasquido de las burbujas de vapor que colapsan junto a la hélice | C |

### CU-TEC-ELN · ver sin ventanas: periscopio y mástil optrónico

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | En el banco de calibración óptica del taller se colocan dos espejos planos perpendiculares. Un rayo se refleja primero en el espejo horizontal y después en el vertical. ¿A qué transformación equivale ese par de reflexiones? | `M032397` | concepto adaptado: composición de transformaciones (reflexión y giro) → par de espejos perpendiculares en el banco óptico del periscopio de observación | D |
| 2 | Para calibrar el ocular del periscopio de búsqueda se elige una marca que coincida consigo misma al plegarla por una sola línea. ¿Cuál de estas marcas cumple esa condición? | `M042150` | concepto adaptado: eje de simetría e imagen especular → marca de calibración del ocular del periscopio | A |
| 3 | El alojamiento del mástil optrónico tiene forma de prisma de base triangular. Para cortar su chapa se necesita el desarrollo plano. ¿Cuál corresponde a ese prisma? | `M032679` | concepto adaptado: desarrollo plano de un cuerpo (el prisma) → chapa del alojamiento del mástil optrónico | B |

### CU-ING-ELN · comunicar bajo el agua y desde la superficie

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | La antena de satélite transmite datos desde la superficie. ¿Cuál de estas afirmaciones sobre la órbita de un satélite de comunicaciones es correcta? | `S032160` | concepto adaptado: cuerpos que orbitan (satélites alrededor de la Tierra) → órbita de un satélite de comunicaciones | C |
| 2 | El receptor de radio acepta frecuencias f que cumplen 8 ≤ f ≤ 12, en kHz. Si el oscilador local suma 3 kHz a la frecuencia recibida, ¿qué intervalo llega al filtro? | `M032673` | concepto adaptado: intervalo de valores admisibles → ventana de frecuencias del receptor desplazada por el oscilador local | D |
| 3 | El teléfono submarino emite un pulso y el intervalo entre pulsos sigue la secuencia 2/5 s, 3/6 s, 4/7 s, 5/8 s… ¿Cuál es el intervalo siguiente? | `M042198A` | concepto adaptado: regularidad y patrón (periodicidad de los pulsos) → secuencia de intervalos del teléfono submarino | A |

### CU-MAT-ELN · orientación y medida: giroscopio, carta y ecosonda

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | La escala de la ecosonda va de 20 m a 30 m con cinco divisiones iguales. La marca K está en la segunda división después de 20 m. ¿Qué profundidad indica K? | `M042024` | concepto adaptado: ubicar una medida en una escala graduada → lectura de la escala de la ecosonda | B |
| 2 | El registro del giroscopio anota tres tramos de rumbo: 1/2 h, 1/3 h y 1/6 h. ¿Cuál es el tiempo total registrado? | `M032683` | concepto adaptado: suma de fracciones con distinto denominador → tiempos de rumbo acumulados en el giroscopio | C |
| 3 | El plotter de cartas indica que un tramo mide 7/8 de milla náutica. ¿Cuál es esa medida expresada en decimal? | `M052216` | concepto adaptado: equivalencia entre fracción y decimal en unidades de medida → distancia en millas náuticas del plotter de cartas | D |

### CU-SCI-NAV · presión, estanqueidad y compartimentación

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El aire de un compartimento estanco pasa de 20 °C a 35 °C sin cambiar de volumen. ¿Qué ocurre con la presión y por qué? | `S032158` | concepto adaptado: calor y movimiento de moléculas en un gas → aire calentado por los equipos dentro de un compartimento estanco | A |
| 2 | Un compartimento inundado queda retenido por un mamparo estanco, con agua hasta cierta altura sobre la válvula de descarga. Antes de abrirla, ¿de qué depende la energía almacenada en esa columna de agua? | `S052165A` | concepto adaptado: energía potencial del agua almacenada en un tanque → agua retenida por un mamparo estanco antes de abrir la válvula | B |
| 3 | Una fuga descarga 30 kg de agua a 4 m/s mientras golpea la tapa interior de la escotilla. ¿Cuánta energía cinética lleva el chorro? | `S052165B` | concepto adaptado: energía cinética del agua en movimiento → energía cinética de un chorro que golpea la tapa de una escotilla | C |

### CU-TEC-NAV · flotar, sumergir y trimar

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Para nivelar el trimado se reparten 14 m³ de lastre entre el tanque de proa y el de popa. El tanque de proa debe quedar con 4 m³ más que el de popa. ¿Cuánto lastre recibe cada tanque? | `M042235` | concepto adaptado: sistema de dos ecuaciones con suma y diferencia → reparto de lastre entre el tanque de proa y el de popa | D |
| 2 | En el panel de inmersión, el lastre de dos tanques de trimado se dibuja como dos franjas de 1 unidad de ancho: una de 2 unidades de largo y otra de 3. ¿Cuántas unidades cuadradas suman sus áreas? | `M032419` | concepto adaptado: suma 2x + 3x representada por áreas → suma de volúmenes de dos tanques de trimado de igual sección | A |
| 3 | Cinco tanques de lastre iguales llevan 2 m³ de lastre fijo cada uno y x m³ de lastre ajustable cada uno. ¿Qué expresión da el lastre total de los cinco tanques? | `M042077` | concepto adaptado: propiedad distributiva 5(2 + x) → lastre total de cinco tanques de lastre iguales | B |

### CU-ING-NAV · forma, ruido y movimiento

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Una placa rectangular de recubrimiento anecoico se dobla por una de sus diagonales y luego se apoya abierta y plana sobre el banco. Vista desde arriba, ¿qué se observa? | `M032734` | concepto adaptado: vista desde arriba de una figura doblada → vista en planta de una placa rectangular doblada por una diagonal | C |
| 2 | Una embarcación navega con rumbo 030° y el timonel ordena una media vuelta, es decir, un giro de 180°. ¿Qué rumbo se lee en el compás al terminar la maniobra? | `M042152` | concepto adaptado: rotación de media vuelta alrededor de un punto → cambio de rumbo de 180° accionado por el timón | D |
| 3 | El informe de vibración de la hélice de bajo ruido anota cuatro aportes: 4k², 3k, 2k² y 2k, donde k es el factor de escala del banco de pruebas. ¿Cuál es la expresión simplificada del informe? | `M042236` | concepto adaptado: simplificar 3p² + 2p + 2p² + p → ordenar aportes de vibración en potencias distintas del factor de escala | A |

### CU-MAT-NAV · profundidad, carta y geometría del fondo

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Las sondas de la carta náutica se refieren a un nivel de referencia fijo y no a la profundidad medida en un instante. ¿Por qué se usa ese nivel de referencia? | `S032151` | concepto adaptado: causa principal de las mareas → nivel de referencia (datum) de las sondas en la carta náutica | B |
| 2 | El plotter de cartas muestra una cadena alargada de montes submarinos. ¿Qué explicación es más probable? | `S042141` | concepto adaptado: ubicación de volcanes activos → interpretación de un relieve volcánico en el plotter de cartas | C |
| 3 | La ecosonda registra cinco sondajes en una misma pasada: 14 m, 16 m, 18 m, 20 m y 45 m. ¿Cuál es la mediana de los cinco registros? | `M042169B` | concepto adaptado: mediana de cinco datos → mediana de cinco sondajes para descartar un eco atípico | D |

### CU-SCI-LOG · el aire que se respira

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El generador de oxígeno del compartimento de baterías y logística obtiene O₂ del agua por electrólisis. ¿Para qué usa el organismo de la tripulación ese oxígeno? | `S032611` | concepto adaptado: propósito de la respiración celular → para qué usa la tripulación el O₂ que produce el generador | A |
| 2 | El soporte vital renueva el aire y retira los gases que produce la tripulación. Al usar el oxígeno, ¿qué dos sustancias producen las células? | `S042024` | concepto adaptado: ecuación de la respiración → productos gaseosos que retira el soporte vital | B |
| 3 | El conjunto de soporte vital del compartimento renueva el aire y retira el dióxido de carbono. ¿Qué funciones vitales de la tripulación cubre principalmente ese equipamiento? | `S042261` | concepto adaptado: funciones vitales de un organismo → funciones vitales que cubre el soporte vital del compartimento | C |

### CU-TEC-LOG · temperatura y humedad a bordo

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | Para vigilar la climatización se instala un sensor de temperatura en el compartimento. ¿Qué ubicación da una lectura representativa del aire que respira la tripulación? | `S042238A` | concepto adaptado: ubicación del termómetro para una medida precisa → ubicación del sensor que vigila la climatización | D |
| 2 | La climatización enfría el aire y el agua condensada se recoge en una bandeja. ¿Qué riesgo evita drenar esa bandeja con regularidad? | `S042272` | concepto adaptado: el vapor condensa al enfriarse → gestión del agua condensada en la climatización | A |
| 3 | En la despensa del compartimento se guardan víveres secos como harina y legumbres. ¿Qué combinación de temperatura y humedad los conserva mejor? | `S032530Z` | concepto invertido: condiciones que activan la germinación → condiciones que la inhiben y conservan los víveres secos | B |

### CU-ING-LOG · agua potable, residuos y cocina

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | El agua que sale de la desalinizadora queda con un pH algo bajo y se corrige antes de almacenarla. ¿Qué se agrega para acercar ese pH al neutro? | `S042095` | concepto adaptado: reacción ácido-base con indicador → neutralización del pH del agua tratada | C |
| 2 | Los desechos de la cocina se compactan antes de salir por el eyector. ¿Cuál de estos residuos se degrada más rápido en el medio marino? | `S032510` | concepto adaptado: qué material de desecho se descompone antes → qué residuo de la cocina se degrada más rápido en el mar | D |
| 3 | El agua potable almacenada se analiza antes de consumirla. ¿Qué propiedad del agua explica que pueda arrastrar sales y otras sustancias disueltas? | `S032463` | concepto adaptado: el agua como agente que altera y moviliza materiales → el agua que disuelve y arrastra sales en el circuito de agua potable | A |

### CU-MAT-LOG · víveres, proporciones y autonomía

| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |
|---:|---|---|---|---|
| 1 | En la despensa hay 10 latas de fruta: 4 de durazno y 6 de pera. Se retiran 2 al azar, sin devolver la primera. ¿Cuál es la probabilidad de que las dos sean de durazno? | `M032132` | concepto adaptado: probabilidad de extraer sin reposición → control de stock de latas en la despensa | B |
| 2 | La cocina debe repartir 48 raciones en bandejas iguales, sin que sobre ninguna. ¿Cuál de estas cantidades de bandejas NO permite un reparto exacto? | `M032626` | concepto adaptado: descomposición en factores primos → divisores que permiten repartir raciones en partes iguales | C |
| 3 | La cocina prepara las comidas con vegetales cultivados en tierra firme. ¿De dónde proviene la energía que contienen esos alimentos? | `S032645` | concepto adaptado: los productores captan energía luminosa → origen solar de la energía de los víveres que se cocinan | D |

## Cobertura

- Celdas: 20 · preguntas STEM: 60
- Una experiencia = una celda (episodio + 1 variante sorteada por día).
- Factor Humano no forma parte de la grilla: son 15 temas libres, con una pregunta cada uno, documentados en `04_factor_humano_temas.md` y en el banco.
