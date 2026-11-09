# -*- coding: utf-8 -*-
"""Correcciones de QC de contenido sobre los JSON de la Fase B (STEM).

Motivos: evitar reproducciones demasiado literales del ítem TIMSS, corregir
longitudes de opciones y ajustar números para no copiar los del ítem.
"""

from __future__ import annotations

import json
from pathlib import Path

STAGING = Path(__file__).resolve().parents[1] / "herramientas" / "staging"

PATCHES: dict[str, dict[str, dict[str, str]]] = {
    "MAQ": {
        "COB-STEM-CU-SCI-MAQ-3": {
            "question_es": "Cuando la combustión del carbono es incompleta, el escape contiene monóxido de carbono. ¿Cuál es la fórmula química de ese gas?",
            "question_en": "When carbon burns incompletely, the exhaust contains carbon monoxide. What is the chemical formula of that gas?",
            "option_a_es": "O2", "option_a_en": "O2",
            "option_b_es": "CO2", "option_b_en": "CO2",
            "option_c_es": "CO", "option_c_en": "CO",
            "option_d_es": "C2O", "option_d_en": "C2O",
            "feedback_es": "El monóxido de carbono tiene un átomo de carbono unido a uno de oxígeno, por eso se escribe CO. CO2 corresponde al dióxido, que aparece cuando la combustión es completa; O2 es oxígeno molecular y C2O invierte la proporción de los átomos.",
            "feedback_en": "Carbon monoxide has one carbon atom bonded to one oxygen atom, which is why it is written CO. CO2 is carbon dioxide, formed when combustion is complete; O2 is molecular oxygen and C2O reverses the atom ratio.",
            "reference_relation": "concepto adaptado: fórmula de un compuesto a partir de su nombre → fórmula del monóxido de carbono en una combustión incompleta",
            "justification_es": "El ítem original asocia un nombre con su fórmula; aquí la pregunta usa otro gas real del escape (monóxido de carbono) para no reproducir el ítem, y mantiene la operatoria de leer una fórmula química en un sistema concreto.",
        },
    },
    "ELE": {
        "COB-STEM-CU-SCI-ELE-1": {
            "question_es": "El dióxido de plomo (PbO2) recubre la placa positiva de una batería de plomo-ácido. ¿Cuántos átomos de plomo y de oxígeno contiene una unidad de PbO2?",
            "question_en": "Lead dioxide (PbO2) coats the positive plate of a lead-acid battery. How many lead and oxygen atoms does one PbO2 unit contain?",
            "option_a_es": "1 de plomo y 2 de oxígeno", "option_a_en": "1 lead and 2 oxygen",
            "option_b_es": "1 de plomo y 1 de oxígeno", "option_b_en": "1 lead and 1 oxygen",
            "option_c_es": "2 de plomo y 1 de oxígeno", "option_c_en": "2 lead and 1 oxygen",
            "option_d_es": "2 de plomo y 2 de oxígeno", "option_d_en": "2 lead and 2 oxygen",
            "feedback_es": "Los subíndices indican cuántos átomos de cada elemento hay en la fórmula: PbO2 tiene 1 plomo y 2 oxígenos. Contar 1 oxígeno ignora el subíndice 2, y contar 2 plomos traslada el subíndice al plomo.",
            "feedback_en": "The subscripts give the number of atoms of each element in the formula: PbO2 has 1 lead and 2 oxygen atoms. Reporting 1 oxygen ignores the subscript 2, and reporting 2 lead atoms moves the subscript onto lead.",
            "reference_relation": "concepto adaptado: número de átomos de cada elemento en una fórmula → composición atómica del PbO2 de la placa positiva",
            "justification_es": "El ítem original cuenta átomos en H2SO4; para no reproducirlo, la pregunta traslada la misma operatoria a otro compuesto real del sistema (PbO2 de la placa positiva), en la celda de química de baterías.",
        },
        "COB-STEM-CU-ING-ELE-2": {
            "question_es": "La ventilación del compartimento extrae un caudal fijo de 30 m3/h más 0,4 m3/h por cada metro cuadrado de superficie. Si la superficie es s metros cuadrados, ¿qué expresión da el caudal total extraído?",
            "question_en": "The compartment ventilation draws a fixed 30 m3/h plus 0.4 m3/h for each square metre of surface. If the surface is s square metres, which expression gives the total extracted flow?",
            "option_a_es": "30 · 0,4 · s", "option_a_en": "30 · 0.4 · s",
            "option_b_es": "0,4 + 30 · s", "option_b_en": "0.4 + 30 · s",
            "option_c_es": "s · (30 + 0,4)", "option_c_en": "s · (30 + 0.4)",
            "option_d_es": "30 + 0,4 · s", "option_d_en": "30 + 0.4 · s",
            "feedback_es": "Un caudal fijo más un aporte proporcional a la superficie se escribe 30 + 0,4 · s: la parte fija no depende de s y solo el coeficiente 0,4 multiplica a la variable. Las opciones que multiplican el 30 por s hacen crecer el caudal fijo con la superficie, y sumar 0,4 en lugar de 30 cambia el valor de la parte constante.",
            "feedback_en": "A fixed flow plus a contribution proportional to the surface is written as 30 + 0.4 · s: the fixed part does not depend on s, and only the 0.4 coefficient multiplies the variable. The options that multiply 30 by s make the fixed flow grow with the surface, and adding 0.4 instead of 30 changes the value of the constant part.",
        },
    },
    "ELN": {
        "COB-STEM-CU-SCI-ELN-2": {
            "question_es": "En una prueba se mide el mismo pulso sónico en aire y en agua de mar, y en el agua llega mucho antes. ¿Cuál es la mejor explicación de esa diferencia?",
            "question_en": "In a test, the same sound pulse is measured in air and in seawater, and it arrives much sooner in water. What is the best explanation for that difference?",
            "option_a_es": "Porque en el aire las partículas se mueven con más libertad.", "option_a_en": "Because particles in air move more freely.",
            "option_b_es": "Porque el agua es más densa y transmite la vibración más rápido.", "option_b_en": "Because water is denser and passes the vibration along faster.",
            "option_c_es": "Porque la velocidad depende solo de la frecuencia del pulso.", "option_c_en": "Because the speed depends only on the pulse frequency.",
            "option_d_es": "Porque el sonido no atraviesa el agua y llega por el casco.", "option_d_en": "Because sound cannot cross water and arrives through the hull.",
        },
        "COB-STEM-CU-TEC-ELN-2": {
            "option_a_es": "Un triángulo isósceles de lados iguales.", "option_a_en": "An isosceles triangle with equal sides.",
            "option_b_es": "Un triángulo escaleno de lados distintos.", "option_b_en": "A scalene triangle with unequal sides.",
            "option_c_es": "Un paralelogramo inclinado sin eje.", "option_c_en": "A slanted parallelogram with no symmetry line.",
            "option_d_es": "Un trapecio de lados desiguales.", "option_d_en": "A trapezoid with unequal sides.",
        },
        "COB-STEM-CU-TEC-ELN-3": {
            "option_a_es": "Tres triángulos iguales y dos rectángulos.", "option_a_en": "Three equal triangles and two rectangles.",
            "option_b_es": "Dos triángulos iguales y tres rectángulos.", "option_b_en": "Two equal triangles and three rectangles.",
            "option_c_es": "Un rectángulo y dos círculos iguales.", "option_c_en": "One rectangle and two equal circles.",
            "option_d_es": "Cuatro triángulos y un cuadrado central.", "option_d_en": "Four triangles and one central square.",
        },
    },
    "NAV": {
        "COB-STEM-CU-TEC-NAV-1": {
            "question_es": "Para nivelar el trimado se reparten 14 m³ de lastre entre el tanque de proa y el de popa. El tanque de proa debe quedar con 4 m³ más que el de popa. ¿Cuánto lastre recibe cada tanque?",
            "question_en": "To level the trim, 14 m³ of ballast are split between the bow tank and the stern tank. The bow tank must end up with 4 m³ more than the stern tank. How much ballast does each tank get?",
            "option_a_es": "Proa: 5 m³; popa: 9 m³.", "option_a_en": "Bow: 5 m³; stern: 9 m³.",
            "option_b_es": "Proa: 7 m³; popa: 7 m³.", "option_b_en": "Bow: 7 m³; stern: 7 m³.",
            "option_c_es": "Proa: 9 m³; popa: 3 m³.", "option_c_en": "Bow: 9 m³; stern: 3 m³.",
            "option_d_es": "Proa: 9 m³; popa: 5 m³.", "option_d_en": "Bow: 9 m³; stern: 5 m³.",
            "feedback_es": "Si el tanque de popa lleva x y el de proa x + 4, la suma 2x + 4 = 14 da x = 5: popa 5 m³ y proa 9 m³. La opción A invierte los tanques, la B no cumple la diferencia de 4 m³ y la C no suma los 14 m³.",
            "feedback_en": "If the stern tank holds x and the bow tank holds x + 4, then 2x + 4 = 14 gives x = 5: stern 5 m³ and bow 9 m³. Option A swaps the tanks, B does not meet the 4 m³ difference, and C does not add up to 14 m³.",
        },
        "COB-STEM-CU-ING-NAV-1": {
            "question_es": "Una placa rectangular de recubrimiento anecoico se dobla por una de sus diagonales y luego se apoya abierta y plana sobre el banco. Vista desde arriba, ¿qué se observa?",
            "question_en": "A rectangular plate of anechoic covering is creased along one diagonal and then laid flat and open on the bench. Seen from directly above, what do you see?",
            "option_a_es": "Un rectángulo sin ninguna marca interior.", "option_a_en": "A rectangle with no marks inside it.",
            "option_b_es": "Un triángulo isósceles con la base hacia arriba.", "option_b_en": "An isosceles triangle with its base at the top.",
            "option_c_es": "Un rectángulo con una diagonal marcada.", "option_c_en": "A rectangle with one marked diagonal.",
            "option_d_es": "Un rombo con las dos diagonales marcadas.", "option_d_en": "A rhombus with both diagonals marked.",
            "feedback_es": "La vista en planta conserva el contorno rectangular y muestra el doblez como una diagonal. La opción A borra la marca, la B cambia la forma y la D agrega una segunda diagonal.",
            "feedback_en": "The plan view keeps the rectangular outline and shows the crease as one diagonal. Option A erases the mark, B changes the shape and D adds a second diagonal.",
            "reference_relation": "concepto adaptado: vista desde arriba de una figura doblada → vista en planta de una placa rectangular doblada por una diagonal",
        },
        "COB-STEM-CU-MAT-NAV-1": {
            "question_es": "Las sondas de la carta náutica se refieren a un nivel de referencia fijo y no a la profundidad medida en un instante. ¿Por qué se usa ese nivel de referencia?",
            "question_en": "Nautical chart soundings refer to a fixed datum level, not to the depth measured at a given moment. Why is that datum used?",
            "option_a_es": "Porque las corrientes frías modifican el fondo marino.", "option_a_en": "Because cold currents change the sea floor.",
            "option_b_es": "Porque el nivel del agua cambia con la marea y hay que fijar una referencia.", "option_b_en": "Because the water level changes with the tide, so a reference must be fixed.",
            "option_c_es": "Porque el deshielo estacional cambia la profundidad del fondo.", "option_c_en": "Because seasonal ice melt changes the depth of the sea floor.",
            "option_d_es": "Porque la presión del aire modifica la lectura de la sonda.", "option_d_en": "Because air pressure changes the sounding reading.",
            "feedback_es": "El nivel del mar sube y baja con la marea; por eso las sondas se refieren a un datum fijo y la lectura real se corrige según la hora. Las corrientes, el deshielo y la presión del aire no explican ese ciclo diario.",
            "feedback_en": "Sea level rises and falls with the tide, so soundings refer to a fixed datum and the actual reading is corrected by the time of day. Currents, ice melt and air pressure do not explain that daily cycle.",
            "reference_relation": "concepto adaptado: causa principal de las mareas → nivel de referencia (datum) de las sondas en la carta náutica",
        },
        "COB-STEM-CU-MAT-NAV-2": {
            "question_es": "El plotter de cartas muestra una cadena alargada de montes submarinos. ¿Qué explicación es más probable?",
            "question_en": "The chart plotter shows an elongated chain of undersea mountains. What is the most likely explanation?",
            "option_a_es": "Que una corriente fría depositó sedimentos en línea recta.", "option_a_en": "A cold current deposited sediment in a straight line.",
            "option_b_es": "Que la marea forma montes cada día en el mismo lugar.", "option_b_en": "The tide builds mountains every day in the same place.",
            "option_c_es": "Que se formaron en un borde donde se encuentran placas tectónicas.", "option_c_en": "They formed at an edge where tectonic plates meet.",
            "option_d_es": "Que el deshielo polar levantó el fondo del mar.", "option_d_en": "Polar ice melt raised the sea floor.",
            "feedback_es": "Las cadenas de montes submarinos se asocian a bordes de placas, donde asciende material del interior y se forma relieve volcánico. Las corrientes, la marea y el deshielo no generan ese relieve.",
            "feedback_en": "Undersea mountain chains are linked to plate boundaries, where material from the interior rises and builds volcanic relief. Currents, tides and ice melt do not create that relief.",
            "reference_relation": "concepto adaptado: ubicación de volcanes activos → interpretación de un relieve volcánico en el plotter de cartas",
        },
    },
    "LOG": {
        "COB-STEM-CU-MAT-LOG-2": {
            "question_es": "La cocina debe repartir 48 raciones en bandejas iguales, sin que sobre ninguna. ¿Cuál de estas cantidades de bandejas NO permite un reparto exacto?",
            "question_en": "The galley must split 48 portions into equal trays with none left over. Which of these numbers of trays does NOT allow an exact split?",
            "option_a_es": "4 bandejas con 12 raciones cada una.", "option_a_en": "4 trays with 12 portions each.",
            "option_b_es": "6 bandejas con 8 raciones cada una.", "option_b_en": "6 trays with 8 portions each.",
            "option_c_es": "9 bandejas con 5 raciones cada una.", "option_c_en": "9 trays with 5 portions each.",
            "option_d_es": "8 bandejas con 6 raciones cada una.", "option_d_en": "8 trays with 6 portions each.",
            "feedback_es": "48 = 2⁴ × 3, y sus divisores incluyen 4, 6 y 8, pero no 9. Nueve bandejas de 5 raciones cubren solo 45 y sobran 3. Las otras tres cantidades dividen 48 de forma exacta y no dejan resto.",
            "feedback_en": "48 = 2⁴ × 3, and its divisors include 4, 6 and 8, but not 9. Nine trays of 5 portions cover only 45, leaving 3 over. The other three options divide 48 exactly with no remainder.",
            "reference_relation": "concepto adaptado: descomposición en factores primos → divisores que permiten repartir raciones en partes iguales",
        },
    },
}

for esp, items in PATCHES.items():
    path = STAGING / f"{esp}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data}
    for item_id, fields in items.items():
        target = by_id.get(item_id)
        if target is None:
            raise SystemExit(f"No existe {item_id} en {esp}.json")
        target.update(fields)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{esp}.json: {len(items)} pregunta(s) corregida(s)")
