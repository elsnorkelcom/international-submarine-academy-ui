# -*- coding: utf-8 -*-
"""Aplica los hallazgos del QA independiente al banco STEM (claves asignadas intactas)."""

from __future__ import annotations

import json
from pathlib import Path

STAGING = Path(__file__).resolve().parents[1] / "herramientas" / "staging"

PATCHES: dict[str, dict[str, dict[str, str]]] = {
    "ELE": {
        "COB-STEM-CU-MAT-ELE-1": {
            "question_es": "El cálculo de autonomía del banco da 5 7/8 horas. ¿Cuál es ese valor en horas, redondeado a dos decimales?",
            "question_en": "The battery bank autonomy calculation gives 5 7/8 hours. What is that value in hours, rounded to two decimal places?",
            "option_a_es": "5,78 h", "option_a_en": "5.78 h",
            "option_b_es": "5,88 h", "option_b_en": "5.88 h",
            "option_c_es": "5,87 h", "option_c_en": "5.87 h",
            "option_d_es": "5,80 h", "option_d_en": "5.80 h",
            "feedback_es": "7/8 vale 0,875, así que 5 7/8 = 5,875 y al redondear a dos decimales queda 5,88. La opción C trunca en lugar de redondear, la A copia los dígitos de la fracción y la D redondea solo a décimas.",
            "feedback_en": "7/8 is 0.875, so 5 7/8 = 5.875, which rounds to 5.88 at two decimal places. Option C truncates instead of rounding, A copies the fraction's digits, and D rounds only to tenths.",
        },
        "COB-STEM-CU-TEC-ELE-2": {
            "question_es": "La ficha del conversor indica que entrega como energía útil el 37,5 % de la energía que recibe; el resto se pierde como calor. ¿Qué fracción de la energía recibida se entrega como energía útil?",
            "question_en": "The converter data sheet states that it delivers 37.5 % of the incoming energy as useful energy; the rest is lost as heat. What fraction of the incoming energy is delivered as useful energy?",
            "option_a_es": "3/8 de la energía recibida", "option_a_en": "3/8 of the incoming energy",
            "option_b_es": "1/3 de la energía recibida", "option_b_en": "1/3 of the incoming energy",
            "option_c_es": "3/4 de la energía recibida", "option_c_en": "3/4 of the incoming energy",
            "option_d_es": "3/7 de la energía recibida", "option_d_en": "3/7 of the incoming energy",
            "feedback_es": "37,5 % equivale a 37,5/100, que simplificado es 3/8: ocho partes de 12,5 % completan el 100 %. La opción B corresponde a 33,3 %, la C a 75 % y la D a 42,9 %; ninguna coincide con el rendimiento indicado.",
            "feedback_en": "37.5 % equals 37.5/100, which simplifies to 3/8: eight parts of 12.5 % make 100 %. Option B is 33.3 %, C is 75 % and D is 42.9 %, so none matches the stated efficiency.",
        },
        "COB-STEM-CU-TEC-ELE-3": {
            "question_es": "El registro de una inmersión anota 400 kWh disponibles a las 07:00. El motor consume 40 kWh por hora y un banco de reserva aporta 20 kWh por hora. Si esos valores se mantienen constantes, ¿a qué hora el banco principal queda con 260 kWh?",
            "question_en": "A dive log records 400 kWh available at 07:00. The motor draws 40 kWh per hour and a reserve battery bank supplies 20 kWh per hour. If those values stay constant, at what time does the main bank reach 260 kWh?",
            "feedback_es": "El banco principal pierde 20 kWh por hora, porque el motor consume 40 y el banco de reserva aporta 20; bajar de 400 a 260 kWh exige perder 140 kWh, es decir 7 horas, y las 07:00 más 7 horas dan las 14:00. Dividir solo por el consumo del motor da las 10:30 porque ignora el aporte del banco de reserva.",
            "feedback_en": "The main bank loses 20 kWh per hour, because the motor draws 40 and the reserve bank supplies 20; going from 400 to 260 kWh means losing 140 kWh, that is 7 hours, so 07:00 plus 7 hours is 14:00. Dividing only by the motor draw gives 10:30 because it ignores the reserve bank.",
        },
        "COB-STEM-CU-ING-ELE-1": {
            "feedback_es": "El porcentaje compara la parte con el total: 0,8 dividido 40 da 0,02, que equivale a 2 %. El 0,2 % corre la coma un lugar de más, el 20 % multiplica por diez el resultado correcto y el 5 % sale de dividir 40 entre 8, sin arrastrar el decimal de 0,8.",
            "feedback_en": "A percentage compares the part with the total: 0.8 divided by 40 gives 0.02, which is 2 %. Option 0.2 % shifts the decimal one place too far, 20 % multiplies the correct result by ten, and 5 % comes from dividing 40 by 8 and dropping the decimal in 0.8.",
        },
        "COB-STEM-CU-ING-ELE-3": {
            "question_es": "Para mantener el balance, el aire que entra en el compartimento debe igualar al que sale. Si el extractor trabaja a 12,5 m³ por minuto, ¿cuál igualdad expresa correctamente ese caudal en metros cúbicos por hora?",
            "question_en": "To keep the balance, the air entering the compartment must equal the air leaving. If the extractor runs at 12.5 m³ per minute, which equality correctly expresses that flow in cubic metres per hour?",
            "option_a_es": "12,5 × 60 = 750 m³/h", "option_a_en": "12.5 × 60 = 750 m³/h",
            "option_b_es": "12,5 ÷ 60 = 0,21 m³/h", "option_b_en": "12.5 ÷ 60 = 0.21 m³/h",
            "option_c_es": "12,5 × 6 = 75 m³/h", "option_c_en": "12.5 × 6 = 75 m³/h",
            "option_d_es": "12,5 × 600 = 7 500 m³/h", "option_d_en": "12.5 × 600 = 7,500 m³/h",
            "feedback_es": "Una hora tiene 60 minutos, así que el caudal por hora es el caudal por minuto multiplicado por 60: 12,5 × 60 = 750 m³/h, y esa cifra sostiene la igualdad entre el aire que entra y el que sale. Dividir entre 60 o multiplicar por 6 o por 600 usa un factor equivocado y rompe el balance.",
            "feedback_en": "One hour has 60 minutes, so the hourly flow is the per-minute flow multiplied by 60: 12.5 × 60 = 750 m³/h, and that figure sustains the balance between incoming and outgoing air. Dividing by 60 or multiplying by 6 or 600 uses the wrong factor and breaks the balance.",
        },
        "COB-STEM-CU-MAT-ELE-3": {
            "question_es": "El consumo registrado se estima con C = P · t + 1, donde P es la potencia en kW, t el tiempo en horas y 1 representa un consumo fijo de 1 kWh. Si P = 6 y t = 3, ¿cuál es el valor de C?",
            "question_en": "The recorded consumption is estimated with C = P · t + 1, where P is power in kW, t is time in hours and 1 represents a fixed consumption of 1 kWh. If P = 6 and t = 3, what is the value of C?",
        },
    },
    "ELN": {
        "COB-STEM-CU-ING-ELN-3": {
            "question_es": "El teléfono submarino emite un pulso y el intervalo entre pulsos sigue la secuencia 2/5 s, 3/6 s, 4/7 s, 5/8 s… ¿Cuál es el intervalo siguiente?",
            "question_en": "The underwater telephone sends a pulse, and the interval between pulses follows the sequence 2/5 s, 3/6 s, 4/7 s, 5/8 s… What is the next interval?",
            "option_a_es": "6/9 s", "option_a_en": "6/9 s",
            "option_b_es": "5/9 s", "option_b_en": "5/9 s",
            "option_c_es": "6/8 s", "option_c_en": "6/8 s",
            "option_d_es": "9/6 s", "option_d_en": "9/6 s",
            "feedback_es": "En cada paso el numerador y el denominador suben una unidad: 2/5, 3/6, 4/7, 5/8 y sigue 6/9. La opción B deja el denominador en 9 sin subir el numerador, la C salta un paso y la D invierte la fracción.",
            "feedback_en": "At each step both the numerator and the denominator increase by one: 2/5, 3/6, 4/7, 5/8, so the next one is 6/9. Option B leaves the denominator at 9 without raising the numerator, C skips a step and D flips the fraction.",
        },
        "COB-STEM-CU-SCI-ELN-2": {
            "option_b_es": "Porque el agua es mucho menos compresible que el aire y transmite la vibración más rápido.",
            "option_b_en": "Because water is much less compressible than air and passes the vibration along faster.",
            "feedback_es": "El sonido viaja más rápido en un medio más rígido y menos compresible: el agua transmite la vibración con menos pérdida que el aire. La frecuencia cambia el tono, no la velocidad, y el sonido sí atraviesa el agua, por eso funciona el sonar.",
            "feedback_en": "Sound travels faster in a stiffer, less compressible medium: water passes the vibration along with less loss than air. Frequency changes pitch, not speed, and sound does travel through water, which is why sonar works.",
            "reference_relation": "concepto adaptado: propiedades del medio y propagación de la onda → comparación de la velocidad del sonido en aire y en agua de mar (compresibilidad)",
            "justification_es": "Comparar aire y agua de mar permite trabajar la relación entre las propiedades del medio y la propagación de la onda; la referencia aporta la comparación entre medios, aunque su foco original es la densidad.",
            "confidence": "revisar",
        },
        "COB-STEM-CU-TEC-ELN-1": {
            "question_es": "En el banco de calibración óptica del taller se colocan dos espejos planos perpendiculares. Un rayo se refleja primero en el espejo horizontal y después en el vertical. ¿A qué transformación equivale ese par de reflexiones?",
            "question_en": "On the workshop's optical calibration bench, two perpendicular plane mirrors are set up. A ray reflects first on the horizontal mirror and then on the vertical one. Which transformation is equivalent to that pair of reflections?",
            "justification_es": "La calibración de instrumentos ópticos exige entender cómo se combinan dos reflexiones; el banco de pruebas reproduce el principio que se usa en el mantenimiento del periscopio de observación.",
        },
        "COB-STEM-CU-MAT-ELN-3": {
            "option_a_es": "0,780 millas", "option_a_en": "0.780 miles",
            "option_b_es": "0,870 millas", "option_b_en": "0.870 miles",
            "option_c_es": "0,750 millas", "option_c_en": "0.750 miles",
            "option_d_es": "0,875 millas", "option_d_en": "0.875 miles",
        },
        "COB-STEM-CU-ING-ELN-1": {
            "option_d_es": "Orbita la Tierra a una altura fija de 500 km.", "option_d_en": "It orbits Earth at a fixed altitude of 500 km.",
            "feedback_es": "Un satélite de comunicaciones gira alrededor de la Tierra y puede ubicarse a distintas alturas según el servicio que deba cubrir. La opción A describe la órbita de un planeta alrededor del Sol, B confunde el satélite con la atmósfera y D fija una altura particular que no es una condición general.",
            "feedback_en": "A communications satellite orbits Earth and can be placed at different altitudes depending on the service it must cover. Option A describes a planet's orbit around the Sun, B confuses the satellite with the atmosphere, and D fixes a particular altitude that is not a general condition.",
        },
        "COB-STEM-CU-ING-ELN-2": {
            "feedback_es": "Sumar 3 kHz a cada extremo desplaza la ventana sin cambiar su ancho: 8 + 3 = 11 y 12 + 3 = 15. La opción A olvida el desplazamiento, la B resta en lugar de sumar y la C duplica el intervalo en lugar de desplazarlo.",
            "feedback_en": "Adding 3 kHz to each end shifts the window without changing its width: 8 + 3 = 11 and 12 + 3 = 15. Option A forgets the shift, B subtracts instead of adding, and C doubles the interval instead of shifting it.",
        },
        "COB-STEM-CU-MAT-ELN-1": {
            "feedback_es": "Cada división vale (30 − 20) ÷ 5 = 2 m, así que la segunda marca después de 20 m está en 20 + 2 × 2 = 24 m. Elegir 22 m supone dividir la escala en diez partes, 25 m la parte en cuatro y 28 m salta tres divisiones.",
            "feedback_en": "Each division is (30 − 20) ÷ 5 = 2 m, so the second mark after 20 m is at 20 + 2 × 2 = 24 m. Choosing 22 m assumes ten parts, 25 m splits the scale into four parts, and 28 m skips three divisions.",
        },
    },
    "NAV": {
        "COB-STEM-CU-SCI-NAV-1": {
            "question_es": "El aire de un compartimento estanco pasa de 20 °C a 35 °C sin cambiar de volumen. ¿Qué ocurre con la presión y por qué?",
            "question_en": "The air in a watertight compartment goes from 20 °C to 35 °C without changing volume. What happens to the pressure, and why?",
            "option_a_es": "Sube, porque los choques de las moléculas son más frecuentes y fuertes.",
            "option_a_en": "It rises, because molecular collisions are more frequent and stronger.",
            "option_b_es": "Baja, porque el aire se expande al calentarse.",
            "option_b_en": "It falls, because the air expands as it warms up.",
            "option_c_es": "No cambia, porque el volumen del compartimento es constante.",
            "option_c_en": "It stays the same, because the compartment volume is constant.",
            "option_d_es": "Sube, porque las moléculas crecen al calentarse.",
            "option_d_en": "It rises, because the molecules grow larger as they warm up.",
            "feedback_es": "En un volumen fijo, calentar el gas aumenta la energía cinética de las moléculas: chocan más seguido y con más fuerza contra las paredes, y la presión sube. El aire no se expande porque el compartimento es estanco (B), el volumen constante no impide el cambio de presión (C) y las moléculas no crecen (D).",
            "feedback_en": "At a fixed volume, heating the gas increases the molecules' kinetic energy: they hit the walls more often and harder, so the pressure rises. The air cannot expand because the compartment is sealed (B), constant volume does not prevent a pressure change (C), and molecules do not grow (D).",
        },
        "COB-STEM-CU-SCI-NAV-3": {
            "question_es": "Una fuga descarga 30 kg de agua a 4 m/s mientras golpea la tapa interior de la escotilla. ¿Cuánta energía cinética lleva el chorro?",
            "question_en": "A leak discharges 30 kg of water at 4 m/s as it strikes the inner cover of the hatch. How much kinetic energy does the jet carry?",
            "option_a_es": "120 J", "option_a_en": "120 J",
            "option_b_es": "60 J", "option_b_en": "60 J",
            "option_c_es": "240 J", "option_c_en": "240 J",
            "option_d_es": "480 J", "option_d_en": "480 J",
            "feedback_es": "La energía cinética es ½ · m · v² = ½ · 30 kg · (4 m/s)² = 240 J. La opción A olvida el factor ½, la B divide por 4 y la D usa m · v² sin el ½.",
            "feedback_en": "Kinetic energy is ½ · m · v² = ½ · 30 kg · (4 m/s)² = 240 J. Option A drops the ½ factor, B divides by 4, and D uses m · v² without the ½.",
            "reference_relation": "concepto adaptado: energía cinética del agua en movimiento → energía cinética de un chorro que golpea la tapa de una escotilla",
        },
        "COB-STEM-CU-TEC-NAV-2": {
            "question_es": "En el panel de inmersión, el lastre de dos tanques de trimado se dibuja como dos franjas de 1 unidad de ancho: una de 2 unidades de largo y otra de 3. ¿Cuántas unidades cuadradas suman sus áreas?",
            "question_en": "On the dive panel, the ballast of two trim tanks is drawn as two strips 1 unit wide: one 2 units long and one 3 units long. How many square units do their areas add up to?",
            "option_a_es": "5 unidades cuadradas", "option_a_en": "5 square units",
            "option_b_es": "6 unidades cuadradas", "option_b_en": "6 square units",
            "option_c_es": "2,5 unidades cuadradas", "option_c_en": "2.5 square units",
            "option_d_es": "1 unidad cuadrada", "option_d_en": "1 square unit",
            "feedback_es": "Cada franja tiene 1 unidad de ancho: la de largo 2 suma 2 unidades cuadradas y la de largo 3 suma 3; juntas suman 5. Multiplicar (B), promediar (C) o restar (D) responde a otras operaciones y no representa el lastre total.",
            "feedback_en": "Each strip is 1 unit wide: the 2-unit strip covers 2 square units and the 3-unit strip covers 3, so together they cover 5. Multiplying (B), averaging (C) or subtracting (D) describes other operations and does not represent the total ballast.",
        },
        "COB-STEM-CU-TEC-NAV-3": {
            "question_es": "Cinco tanques de lastre iguales llevan 2 m³ de lastre fijo cada uno y x m³ de lastre ajustable cada uno. ¿Qué expresión da el lastre total de los cinco tanques?",
            "question_en": "Five identical ballast tanks each hold 2 m³ of fixed ballast and x m³ of adjustable ballast. Which expression gives the total ballast of the five tanks?",
            "option_a_es": "2 + 5x", "option_a_en": "2 + 5x",
            "option_b_es": "10 + 5x", "option_b_en": "10 + 5x",
            "option_c_es": "10 + x", "option_c_en": "10 + x",
            "option_d_es": "7 + x", "option_d_en": "7 + x",
            "feedback_es": "Cada tanque aporta 2 + x y son cinco tanques: 5 · (2 + x) = 10 + 5x. Sumar 2 una sola vez (A), sumar x una sola vez (C) o juntar 7 sin distribuir (D) olvida que son cinco tanques iguales.",
            "feedback_en": "Each tank holds 2 + x and there are five tanks: 5 · (2 + x) = 10 + 5x. Adding 2 only once (A), adding x only once (C) or combining 7 without distributing (D) forgets that there are five identical tanks.",
            "reference_relation": "concepto adaptado: propiedad distributiva 5(2 + x) → lastre total de cinco tanques de lastre iguales",
        },
        "COB-STEM-CU-MAT-NAV-1": {
            "confidence": "revisar",
            "justification_es": "La carta náutica usa un datum ligado a la marea; la celda es de Matemática y la referencia es de Ciencias de la Tierra, así que el encaje disciplinar es débil y queda marcado para revisión.",
        },
        "COB-STEM-CU-MAT-NAV-2": {
            "confidence": "revisar",
            "justification_es": "Interpretar el relieve volcánico del fondo exige ciencia de la Tierra; la celda es de Matemática y el encaje disciplinar es débil, así que queda marcado para revisión.",
        },
    },
    "LOG": {
        "COB-STEM-CU-SCI-LOG-2": {
            "question_es": "El soporte vital renueva el aire y retira los gases que produce la tripulación. Al usar el oxígeno, ¿qué dos sustancias producen las células?",
            "question_en": "Life support refreshes the air and removes the gases the crew produces. When cells use oxygen, which two substances do they produce?",
            "option_a_es": "Oxígeno y agua.", "option_a_en": "Oxygen and water.",
            "option_b_es": "Dióxido de carbono y agua.", "option_b_en": "Carbon dioxide and water.",
            "option_c_es": "Nitrógeno y vapor de agua.", "option_c_en": "Nitrogen and water vapour.",
            "option_d_es": "Sales minerales y agua.", "option_d_en": "Mineral salts and water.",
            "feedback_es": "Al usar el oxígeno, las células producen dióxido de carbono y agua, que el soporte vital debe retirar o renovar. El oxígeno es lo que se consume, no lo que se produce (A); el nitrógeno no participa de la reacción (C) y las sales minerales no son el producto gaseoso de la respiración (D).",
            "feedback_en": "When cells use oxygen, they produce carbon dioxide and water, which life support must remove or refresh. Oxygen is consumed, not produced (A); nitrogen does not take part in the reaction (C), and mineral salts are not the gaseous product of respiration (D).",
            "reference_relation": "concepto adaptado: ecuación de la respiración → productos gaseosos que retira el soporte vital",
        },
        "COB-STEM-CU-TEC-LOG-2": {
            "question_es": "La climatización enfría el aire y el agua condensada se recoge en una bandeja. ¿Qué riesgo evita drenar esa bandeja con regularidad?",
            "question_en": "The air-conditioning cools the air and the condensed water collects in a tray. What risk does draining that tray regularly prevent?",
            "option_a_es": "Humedad alta y corrosión de la electrónica.", "option_a_en": "High humidity and corrosion of the electronics.",
            "option_b_es": "Que el serpentín se congele por completo.", "option_b_en": "The coil freezing completely.",
            "option_c_es": "Que suba el dióxido de carbono del compartimento.", "option_c_en": "The compartment's carbon dioxide rising.",
            "option_d_es": "Que caiga la presión del circuito refrigerante.", "option_d_en": "The refrigerant circuit pressure dropping.",
            "feedback_es": "El agua condensada acumulada eleva la humedad del compartimento y favorece la corrosión de la electrónica; por eso se drena. Congelar el serpentín (B), modificar el CO₂ (C) o la presión del refrigerante (D) no dependen del drenaje de la bandeja.",
            "feedback_en": "Accumulated condensate raises the compartment's humidity and promotes corrosion of the electronics, so it is drained. Freezing the coil (B), changing CO₂ (C) or the refrigerant pressure (D) do not depend on draining the tray.",
            "reference_relation": "concepto adaptado: el vapor condensa al enfriarse → gestión del agua condensada en la climatización",
        },
        "COB-STEM-CU-TEC-LOG-3": {
            "reference_relation": "concepto invertido: condiciones que activan la germinación → condiciones que la inhiben y conservan los víveres secos",
            "justification_es": "La referencia trata las condiciones que activan un proceso biológico; la pregunta las invierte para explicar qué condiciones lo frenan y conservan los víveres secos. El encaje es conceptual y queda en confianza media.",
        },
    },
    "MAQ": {
        "COB-STEM-CU-TEC-MAQ-2": {
            "option_d_es": "p < 10 bar", "option_d_en": "p < 10 bar",
            "feedback_es": "Se agrupan los términos: 4p − 2p < 4 + 6, es decir 2p < 10, y al dividir por 2 queda p < 5 bar. Dar vuelta el signo (p > 5) o no dividir 2p < 10 entre 2 (p < 10) deja dentro del rango valores que no cumplen la condición, y p < 2 descarta valores que sí son admisibles.",
            "feedback_en": "Grouping terms gives 4p − 2p < 4 + 6, that is 2p < 10, and dividing by 2 gives p < 5 bar. Flipping the sign (p > 5) or failing to divide 2p < 10 by 2 (p < 10) keeps values inside the range that do not satisfy the condition, while p < 2 rules out values that are admissible.",
        },
        "COB-STEM-CU-ING-MAQ-3": {
            "question_es": "Una bomba de achique extrae 4,5 m³ de agua en 90 s, pero una fuga devuelve el 20 % del caudal. ¿Cuál es el caudal neto de achique?",
            "question_en": "A bilge pump removes 4.5 m³ of water in 90 s, but a leak returns 20 % of that flow. What is the net bilge flow?",
            "option_a_es": "0,04 m³/s", "option_a_en": "0.04 m³/s",
            "option_b_es": "0,05 m³/s", "option_b_en": "0.05 m³/s",
            "option_c_es": "0,045 m³/s", "option_c_en": "0.045 m³/s",
            "option_d_es": "0,036 m³/s", "option_d_en": "0.036 m³/s",
            "feedback_es": "El caudal bruto es 4,5 ÷ 90 = 0,05 m³/s; con un 20 % de retorno queda el 80 %, es decir 0,04 m³/s. La opción B ignora la fuga, la C descuenta un 10 % y la D aplica el 20 % dos veces.",
            "feedback_en": "The gross flow is 4.5 ÷ 90 = 0.05 m³/s; with 20 % returning, 80 % remains, that is 0.04 m³/s. Option B ignores the leak, C deducts 10 %, and D applies the 20 % twice.",
        },
        "COB-STEM-CU-ING-MAQ-2": {
            "feedback_en": "As the vapour is compressed and then cooled, its molecules lose energy, slow down and move closer until they become liquid; that is why compressed air leaves water in traps and separators. High pressure does not prevent the change of state, and cooling does not create oxygen or expand the vapour.",
        },
        "COB-STEM-CU-SCI-MAQ-1": {
            "feedback_en": "Combustion needs an oxidiser, the oxygen in the compressed air supplied through the snorkel (air-intake mast), plus enough heat to reach the fuel's ignition temperature. Cooling the air, adding vapour or lowering the pressure keeps the mixture below that temperature, so the fuel does not burn.",
        },
    },
}

for esp, items in PATCHES.items():
    path = STAGING / f"{esp}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    for item_id, fields in items.items():
        if item_id not in by_id:
            raise SystemExit(f"No existe {item_id} en {esp}.json")
        by_id[item_id].update(fields)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{esp}: {len(items)} pregunta(s) corregida(s)")
