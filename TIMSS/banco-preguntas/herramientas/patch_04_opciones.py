# -*- coding: utf-8 -*-
"""Iguala la longitud de las opciones de las 15 preguntas FH del documento 04."""

from pathlib import Path

P = Path(__file__).resolve().parents[1] / "salidas" / "04_factor_humano_temas.md"

# fid: (clave, {A,B,C,D})
OPTIONS = {
    "FH-01": ("A", {
        "A": "Porque el espacio es limitado y las guardias se alternan.",
        "B": "Porque una litera se gasta si la usa siempre la misma persona.",
        "C": "Porque así se necesita menos energía para calefacción.",
        "D": "Porque cada tripulante debe cambiar de camarote cada semana.",
    }),
    "FH-02": ("B", {
        "A": "El sistema de ventilación elimina todas las partículas olorosas.",
        "B": "La percepción olfativa se adapta a los estímulos constantes.",
        "C": "Los materiales del casco absorben por completo los olores.",
        "D": "La tripulación usa productos que neutralizan cada olor.",
    }),
    "FH-03": ("C", {
        "A": "Porque la luz artificial daña la vista durante la inmersión.",
        "B": "Porque el casco amplifica solo los sonidos más graves.",
        "C": "Porque el sonido viaja bien en el agua y la vista pierde alcance.",
        "D": "Porque todos los instrumentos de navegación son sonoros.",
    }),
    "FH-04": ("D", {
        "A": "Para ahorrar baterías durante las horas de descanso.",
        "B": "Para distinguir por color los turnos de guardia.",
        "C": "Para señalar la profundidad a la que navega el buque.",
        "D": "Para indicar al cuerpo cuándo es de día y cuándo de noche.",
    }),
    "FH-05": ("A", {
        "A": "Un sistema de frío que funciona con la energía del buque.",
        "B": "Un depósito térmico que solo se recarga en superficie.",
        "C": "La baja temperatura natural del agua del mar.",
        "D": "Un horno de convección que enfría los alimentos.",
    }),
    "FH-06": ("B", {
        "A": "Reemplaza las tareas de vigilancia cuando hay poco trabajo.",
        "B": "Ordena el tiempo libre y sostiene la convivencia del grupo.",
        "C": "Permite calcular la profundidad sin usar instrumentos.",
        "D": "Entrena la memoria para las tareas de navegación.",
    }),
    "FH-07": ("C", {
        "A": "Para proteger el ojo de la luz fuerte del exterior.",
        "B": "Para evitar que los dos ojos vean una imagen doble.",
        "C": "Para conservar un ojo ya adaptado a la oscuridad.",
        "D": "Para descansar la vista después de leer cartas.",
    }),
    "FH-08": ("D", {
        "A": "Son llamadas en vivo de pocos minutos cada día.",
        "B": "Son videos grabados que se envían todos los días.",
        "C": "Son cartas largas que se leen en voz alta al grupo.",
        "D": "Son breves, limitados y de una sola dirección.",
    }),
    "FH-09": ("A", {
        "A": "Que un dibujo informal puede volverse emblema del buque.",
        "B": "Que las normas a bordo prohíben cualquier expresión artística.",
        "C": "Que el arte a bordo se usa para señalar la profundidad.",
        "D": "Que los emblemas se eligen en tierra antes de zarpar.",
    }),
    "FH-10": ("B", {
        "A": "La asignación de un camarote individual para cada persona.",
        "B": "Normas de respeto, autocontrol y cuidado del espacio común.",
        "C": "La prohibición de hablar durante las horas de guardia.",
        "D": "El uso de auriculares para aislarse del resto del grupo.",
    }),
    "FH-11": ("C", {
        "A": "Llevar ropa para todas las estaciones del año.",
        "B": "Llevar objetos para regalar en cada puerto.",
        "C": "Llevar solo lo funcional que entra en el espacio.",
        "D": "Llevar un uniforme distinto para cada día.",
    }),
    "FH-12": ("D", {
        "A": "Que las mujeres solo pueden trabajar en cubierta.",
        "B": "Que la experiencia no cambió las rutinas de a bordo.",
        "C": "Que se necesitan camarotes individuales para todas.",
        "D": "Que la habitabilidad se resolvió con ajustes y respeto.",
    }),
    "FH-13": ("A", {
        "A": "Porque la comida es un ancla de bienestar en la rutina.",
        "B": "Porque controla el reparto de las guardias a bordo.",
        "C": "Porque decide la ruta que sigue la travesía.",
        "D": "Porque administra el agua dulce de todo el buque.",
    }),
    "FH-14": ("B", {
        "A": "Indica el cambio de guardia de la mañana.",
        "B": "Marca una pausa que ordena el día y reúne al grupo.",
        "C": "Sirve para calentar el motor antes de la inmersión.",
        "D": "Reemplaza el desayuno cuando hay poco espacio.",
    }),
    "FH-15": ("C", {
        "A": "Porque el agua dulce daña las tuberías del casco.",
        "B": "Porque su sabor cambia al estar en movimiento.",
        "C": "Porque es escasa y hay usos prioritarios, como cocinar.",
        "D": "Porque el agua se congela a poca profundidad.",
    }),
}

text = P.read_text(encoding="utf-8")
MARK_Q = "**Pregunta de banco:**"
MARK_F = "**Feedback:**"

for fid, (key, options) in OPTIONS.items():
    marker = f"### {fid} ·"
    start = text.find(marker)
    if start < 0:
        raise SystemExit(f"No se encontró {fid}")
    q = text.find(MARK_Q, start)
    f = text.find(MARK_F, q)
    if q < 0 or f < 0:
        raise SystemExit(f"Marcadores incompletos en {fid}")
    segment = text[q:f]
    first_line = segment.splitlines()[0]
    new_lines = [first_line]
    for letter in "ABCD":
        tick = " ✅" if letter == key else ""
        new_lines.append(f"  - **{letter})** {options[letter]}{tick}")
    new_segment = "\n".join(new_lines) + "\n"
    text = text[:q] + new_segment + text[f:]

P.write_text(text, encoding="utf-8")
print(f"Opciones reescritas: {len(OPTIONS)} preguntas")
