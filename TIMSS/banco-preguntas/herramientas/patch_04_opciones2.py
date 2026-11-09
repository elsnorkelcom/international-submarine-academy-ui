# -*- coding: utf-8 -*-
"""Segundo ajuste de longitudes en las preguntas FH (7 casos con ratio > 1,2)."""

from pathlib import Path

P = Path(__file__).resolve().parents[1] / "salidas" / "04_factor_humano_temas.md"

OPTIONS = {
    "FH-03": ("C", {
        "A": "Porque la luz artificial daña la vista durante la inmersión.",
        "B": "Porque el casco amplifica solo los sonidos más graves.",
        "C": "Porque el sonido viaja bien en el agua y la vista no alcanza.",
        "D": "Porque todos los instrumentos de navegación son sonoros.",
    }),
    "FH-04": ("D", {
        "A": "Para ahorrar baterías durante las horas de descanso.",
        "B": "Para distinguir por color los turnos de guardia.",
        "C": "Para señalar la profundidad a la que navega el buque.",
        "D": "Para indicar al cuerpo cuándo es de día y de noche.",
    }),
    "FH-05": ("A", {
        "A": "Un sistema de frío que usa la energía del buque.",
        "B": "Un depósito térmico que solo se recarga en superficie.",
        "C": "La baja temperatura natural del agua del mar.",
        "D": "Un horno de convección que enfría los alimentos.",
    }),
    "FH-06": ("B", {
        "A": "Reemplaza la vigilancia cuando hay poco trabajo.",
        "B": "Ordena el tiempo libre y sostiene la convivencia.",
        "C": "Permite calcular la profundidad sin usar instrumentos.",
        "D": "Entrena la memoria para las tareas de navegación.",
    }),
    "FH-13": ("A", {
        "A": "Porque la comida da bienestar en la rutina diaria.",
        "B": "Porque controla el reparto de las guardias a bordo.",
        "C": "Porque decide la ruta que sigue la travesía.",
        "D": "Porque administra el agua dulce de todo el buque.",
    }),
    "FH-14": ("B", {
        "A": "Indica el cambio de guardia de la mañana siguiente.",
        "B": "Marca una pausa que ordena el día y reúne al grupo.",
        "C": "Sirve para calentar el motor antes de la inmersión.",
        "D": "Reemplaza el desayuno cuando hay muy poco espacio.",
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
    start = text.find(f"### {fid} ·")
    q = text.find(MARK_Q, start)
    f = text.find(MARK_F, q)
    if start < 0 or q < 0 or f < 0:
        raise SystemExit(f"Marcadores incompletos en {fid}")
    first_line = text[q:f].splitlines()[0]
    new_lines = [first_line]
    for letter in "ABCD":
        tick = " ✅" if letter == key else ""
        new_lines.append(f"  - **{letter})** {options[letter]}{tick}")
    text = text[:q] + "\n".join(new_lines) + "\n" + text[f:]

P.write_text(text, encoding="utf-8")
print("Preguntas ajustadas:", len(OPTIONS))
