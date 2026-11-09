# -*- coding: utf-8 -*-
"""Genera salidas/guias_temas.md: 35 guías (20 celdas STEM + 15 temas FH)."""

from __future__ import annotations

import csv
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
SALIDAS = BASE / "salidas"
CSV = SALIDAS / "banco_cobre.csv"
DOC04 = SALIDAS / "04_factor_humano_temas.md"
STAGING = BASE / "herramientas" / "staging"

DISC_ES = {"SCI": "Ciencias", "TEC": "Tecnología", "ING": "Ingeniería", "MAT": "Matemática"}
ESP_ES = {"MAQ": "Maquinista", "ELE": "Electricista", "ELN": "Electrónico", "NAV": "Ingeniero Naval", "LOG": "Logístico"}

HOOKS = {
    "CU-SCI-MAQ": ("¿Qué hace falta para que el gasóleo arda dentro del cilindro?", "What does the fuel oil need to burn inside the cylinder?"),
    "CU-TEC-MAQ": ("¿Dónde se guarda la presión cuando la bomba se detiene?", "Where is pressure stored when the pump stops?"),
    "CU-ING-MAQ": ("¿Cuánta agua puede sacar una bomba en un minuto?", "How much water can a pump remove in a minute?"),
    "CU-MAT-MAQ": ("¿Qué dice una gota de aceite sobre el desgaste?", "What does a drop of oil say about wear?"),
    "CU-SCI-ELE": ("¿Qué química guarda la energía en una batería?", "What chemistry stores energy in a battery?"),
    "CU-TEC-ELE": ("¿Qué se pierde cuando se convierte la energía?", "What is lost when energy is converted?"),
    "CU-ING-ELE": ("¿Cómo se evita que el hidrógeno se acumule?", "How is hydrogen kept from building up?"),
    "CU-MAT-ELE": ("¿Cuántas horas dura la energía que queda?", "How many hours does the remaining energy last?"),
    "CU-SCI-ELN": ("¿Cómo se escucha el mar?", "How do you listen to the sea?"),
    "CU-TEC-ELN": ("¿Cómo se ve sin ventanas?", "How do you see without windows?"),
    "CU-ING-ELN": ("¿Cómo viaja un mensaje desde el fondo?", "How does a message travel from the depths?"),
    "CU-MAT-ELN": ("¿Dónde estoy y a qué profundidad?", "Where am I and how deep?"),
    "CU-SCI-NAV": ("¿Por qué el casco aguanta la presión?", "Why does the hull withstand pressure?"),
    "CU-TEC-NAV": ("¿Cómo se hunde y se nivela un submarino?", "How does a submarine dive and level off?"),
    "CU-ING-NAV": ("¿Por qué una hélice silenciosa cuesta más?", "Why does a quiet propeller cost more?"),
    "CU-MAT-NAV": ("¿Qué profundidad marca la carta?", "What depth does the chart show?"),
    "CU-SCI-LOG": ("¿De dónde sale el aire que respira la tripulación?", "Where does the air the crew breathes come from?"),
    "CU-TEC-LOG": ("¿Cómo se controla la humedad a bordo?", "How is humidity controlled on board?"),
    "CU-ING-LOG": ("¿Cómo se obtiene agua potable en el mar?", "How is drinking water obtained at sea?"),
    "CU-MAT-LOG": ("¿Alcanzan los víveres para toda la travesía?", "Will the provisions last the whole voyage?"),
}

DEBRIEFS = {
    "CU-SCI-MAQ": ("¿Qué pasaría si el motor no tuviera aire?", "What would happen if the engine had no air?"),
    "CU-TEC-MAQ": ("¿Qué ventaja da un acumulador durante una maniobra?", "What advantage does an accumulator give during a manoeuvre?"),
    "CU-ING-MAQ": ("¿Cómo se comprueba que el achique alcanza?", "How do you check that bilge pumping is enough?"),
    "CU-MAT-MAQ": ("¿Por qué se mide más de una muestra?", "Why measure more than one sample?"),
    "CU-SCI-ELE": ("¿Por qué una batería se calienta al cargarse?", "Why does a battery warm up while charging?"),
    "CU-TEC-ELE": ("¿Dónde termina el calor que no se usa?", "Where does the unused heat end up?"),
    "CU-ING-ELE": ("¿Qué señal avisaría un problema de ventilación?", "What signal would warn of a ventilation problem?"),
    "CU-MAT-ELE": ("¿Cómo se estima la autonomía con dos consumos?", "How do you estimate autonomy with two loads?"),
    "CU-SCI-ELN": ("¿Por qué el sonido llega más rápido en el agua?", "Why does sound arrive faster in water?"),
    "CU-TEC-ELN": ("¿Por qué la imagen del periscopio no se invierte?", "Why is the periscope image not inverted?"),
    "CU-ING-ELN": ("¿Qué limita la comunicación sumergida?", "What limits underwater communication?"),
    "CU-MAT-ELN": ("¿Cómo se lee una escala graduada?", "How do you read a graduated scale?"),
    "CU-SCI-NAV": ("¿Qué pasa con el aire al calentarse en un recinto cerrado?", "What happens to air as it warms in a closed space?"),
    "CU-TEC-NAV": ("¿Por qué el lastre se reparte entre proa y popa?", "Why is ballast split between bow and stern?"),
    "CU-ING-NAV": ("¿Cómo influye la forma en el movimiento?", "How does shape affect movement?"),
    "CU-MAT-NAV": ("¿Por qué la carta usa un nivel de referencia?", "Why does the chart use a datum?"),
    "CU-SCI-LOG": ("¿Qué dos gases hay que vigilar?", "Which two gases must be monitored?"),
    "CU-TEC-LOG": ("¿Qué pasa con el agua que condensa?", "What happens to the water that condenses?"),
    "CU-ING-LOG": ("¿Qué se hace con los residuos?", "What is done with the waste?"),
    "CU-MAT-LOG": ("¿Cómo se reparte una ración en partes iguales?", "How do you split a ration into equal parts?"),
}

ACTIVITY = {
    "SCI": (
        "Pedí al grupo que observe {systems} y registre qué cambia (temperatura, sonido, color o presión).",
        "Ask the group to observe the cell's systems and record what changes (temperature, sound, colour or pressure).",
    ),
    "TEC": (
        "Pedí que sigan la cadena de energía o de señal en {systems} y marquen dónde se pierde eficiencia.",
        "Ask them to trace the energy or signal chain through the cell's systems and mark where efficiency is lost.",
    ),
    "ING": (
        "Pedí que estimen una magnitud de {systems} (caudal, volumen o presión) y la comparen con el orden de magnitud esperado.",
        "Ask them to estimate a quantity of the cell's systems (flow, volume or pressure) and compare it with the expected order of magnitude.",
    ),
    "MAT": (
        "Pedí que midan o calculen con los datos de {systems} y expliquen el resultado en una frase.",
        "Ask them to measure or calculate with the cell's data and explain the result in one sentence.",
    ),
}

FH_EN = {
    "FH-01": "Hook: the bunk is still warm when the shift changes. Context: limited space and rotating watches. Observe: fit a 6-hour watch roster to 40 people and 25 bunks. Guiding question: how is rest shared when space is short? Debrief: rest is a collective system, not an individual matter.",
    "FH-02": "Hook: the smell travels home in your clothes. Context: oil, fuel, kitchen, sweat and salt in a closed space. Observe: why the crew stops noticing it. Guiding question: what do our senses filter out? Debrief: smell perception adapts to constant stimuli, but the air still needs technical management.",
    "FH-03": "Hook: under water, you learn to listen first. Context: no windows and limited sight; sound carries. Observe: compare sounds and ask what each one reveals. Guiding question: what can we learn when one sense is limited? Debrief: senses reorganise with the environment and sound becomes technical information.",
    "FH-04": "Hook: a windowless tube still needs a sunrise. Context: light intensity and tone mark activity and rest. Observe: compare a cool light with a warm one. Guiding question: what signals order our day? Debrief: light is a signal for the body clock, and confined habitats can imitate natural signals.",
    "FH-05": "Hook: dessert hundreds of metres below the surface. Context: an electric galley and a cooling system. Observe: where would a litre of ice cream be stored? Guiding question: how much of what we eat depends on energy and space? Debrief: keeping food cold depends on energy and on a system, not on the sea.",
    "FH-06": "Hook: a deck of cards against watch boredom. Context: waiting time and shared routine. Observe: play a short round and see how it orders time. Guiding question: when does leisure become a tool for living together? Debrief: organised leisure supports group life in isolated spaces.",
    "FH-07": "Hook: one eye in the dark to see the outside light. Context: adapting from a lit interior to a bright or dim outside image. Observe: look at a light and then at a dark area. Guiding question: why do eyes need time to adapt? Debrief: dark adaptation takes time and a covered eye keeps it ready.",
    "FH-08": "Hook: forty words that are worth a week. Context: brief, one-way messages with no immediate reply. Observe: write a forty-word message and compare what each person chose to say. Guiding question: what do you say when you can only say forty words? Debrief: limited communication forces us to choose the essential.",
    "FH-09": "Hook: a chalk drawing that became the vessel's emblem. Context: an informal mark adopted by the person in charge. Observe: design a group emblem for the visit. Guiding question: what stories make a group recognise itself? Debrief: symbols of belonging are also built from below. Testimony, to be verified.",
    "FH-10": "Hook: the word privacy is not in the manual. Context: narrow corridors and almost no place to be alone. Observe: cross a half-metre corridor without touching. Guiding question: what rules do we invent when there is no room to be alone? Debrief: living together in minimal space depends on agreements and care.",
    "FH-11": "Hook: four shoeboxes for a whole voyage. Context: minimal personal storage. Observe: choose five objects for a two-week voyage. Guiding question: what is truly essential? Debrief: available space orders priorities between the necessary and the superfluous.",
    "FH-12": "Hook: habitability was the argument; professionalism was the answer. Context: the first woman submarine officer in Argentina graduated in December 2012. Observe: propose design adjustments for a shared cabin. Guiding question: what changes when a workspace is designed for everyone? Debrief: barriers of design and culture can be solved with adjustments and respect.",
    "FH-13": "Hook: the menu is also emotional infrastructure. Context: a small electric galley and the daily meals. Observe: build a three-day menu with a closed list of ingredients. Guiding question: why does food matter beyond nutrition? Debrief: food has a social and emotional role, and provisions condition what can be cooked.",
    "FH-14": "Hook: at eleven, the galley becomes a meeting point. Context: a shared broth that marks a pause. Observe: rebuild a day on board and locate the meeting moments. Guiding question: which moments order our day without feeling like obligations? Debrief: small daily rituals structure time and sustain bonds.",
    "FH-15": "Hook: three minutes of water and a logbook of shifts. Context: fresh water is limited and has priority uses. Observe: distribute one day's water among different uses. Guiding question: how do you share a scarce resource without leaving anyone out? Debrief: a scarce resource is managed with explicit rules, and hygiene is part of health and living together.",
}


def parse_assignments() -> dict[str, dict]:
    meta: dict[str, dict] = {}
    header = re.compile(r"^## (CU-[A-Z]{3}-[A-Z]{3}) · cell_index (\d+) · disciplina ([A-Z]{3}) · tema: (.+)$")
    systems = re.compile(r"^- Compartimento: `([A-Z\-]+)` · Sistemas: (.+)$")
    current = None
    for path in sorted(STAGING.glob("asignacion_*.md")):
        for line in path.read_text(encoding="utf-8").splitlines():
            match = header.match(line)
            if match:
                current = match.group(1)
                meta[current] = {
                    "index": int(match.group(2)),
                    "discipline": match.group(3),
                    "topic": match.group(4),
                    "specialty": current.split("-")[2],
                }
                continue
            match = systems.match(line)
            if match and current:
                meta[current]["compartment"] = match.group(1)
                meta[current]["systems"] = match.group(2)
    return meta


def parse_fh() -> dict[str, dict]:
    text = DOC04.read_text(encoding="utf-8")
    blocks = re.split(r"^### (FH-\d\d) · (.+)$", text, flags=re.M)
    result: dict[str, dict] = {}
    for index in range(1, len(blocks), 3):
        fid, title, body = blocks[index], blocks[index + 1], blocks[index + 2]
        fields = {}
        for label, key in [
            ("Gancho", "hook"), ("Contexto", "context"), ("Qué se aprende", "learn"),
            ("Semilla de episodio", "seed"), ("Pregunta guía", "guide"),
        ]:
            match = re.search(rf"^- \*\*{label}:\*\* (.+)$", body, re.M)
            if match:
                fields[key] = match.group(1).strip()
        specialty_line = re.search(r"^- \*\*Especialidad sugerida:\*\* (.+)$", body, re.M)
        if specialty_line:
            raw = specialty_line.group(1)
            fields["specialty"] = raw.split(" · ")[0].strip()
            axis = re.search(r"\*\*Eje:\*\* (.+?)(?: ·|$)", raw)
            if axis:
                fields["axis"] = axis.group(1).strip()
        result[fid] = {"title": title.strip(), **fields}
    return result


def main() -> None:
    meta = parse_assignments()
    fh = parse_fh()
    with CSV.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    stems = [r for r in rows if r["kind"] == "STEM"]

    lines = [
        "# Guías de temas para el guía/veterano",
        "",
        "**Proyecto:** International Submarine Academy (ISA) · **Temporada:** Cobre (Nivel 1)",
        "**Fecha:** 9 de noviembre de 2026 · **Estado:** propuesta para producción",
        "",
        "Una guía por **celda** (20) y por **tema de Factor Humano** (15): 35 guías. La guía no es un guion de respuestas:",
        "es una lista de temas para que el guía o el veterano conduzca el episodio, muestre el sistema, explique el concepto",
        "y cierre con un debrief. Sirve para cualquiera de las 3 variantes de la celda.",
        "",
        "Secuencia de referencia (`docs/31` §9): **gancho 3–8 s · contexto patrimonial 15–60 s · concepto 5–15 s ·",
        "actividad · debrief 15–45 s · reconocimiento simbólico**. Cada guía indica los 6 puntos.",
        "",
        "**Uso:** las guías están en español y en inglés. La pregunta del banco no se lee antes de la actividad: primero se",
        "observa el sistema y se conversa; después se juega la variante del día.",
        "",
        "---",
        "",
        "## Parte 1 · 20 celdas STEM",
        "",
    ]

    for cell in sorted(meta, key=lambda c: meta[c]["index"]):
        m = meta[cell]
        cell_rows = sorted((r for r in stems if r["cell_code"] == cell), key=lambda r: int(r["variant_index"]))
        concepts = " · ".join(
            r["reference_relation"].replace("concepto adaptado:", "").split("→")[-1].strip()
            for r in cell_rows
        )
        hook_es, hook_en = HOOKS[cell]
        deb_es, deb_en = DEBRIEFS[cell]
        act_es, act_en = ACTIVITY[m["discipline"]]
        lines += [
            f"### {cell} · {m['topic']}",
            "",
            f"**{ESP_ES[m['specialty']]} · {DISC_ES[m['discipline']]} · compartimento `{m['compartment']}`**",
            f"**Sistemas:** {m['systems']}",
            "",
            f"1. **Gancho (3–8 s).** ES: «{hook_es}» · EN: “{hook_en}”",
            f"2. **Contexto patrimonial (15–60 s).** ES: mostrá {m['systems']} en el compartimento y explicá qué hace cada uno: {m['topic']}. · EN: show the cell's systems in the compartment and explain what each one does.",
            f"3. **Concepto a tocar (5–15 s).** ES: {concepts}. · EN: follow the three adapted concepts listed for this cell in `matriz_celdas.md`.",
            f"4. **Actividad.** ES: {act_es.format(systems=m['systems'])} · EN: {act_en}",
            f"5. **Debrief (15–45 s).** ES: «{deb_es}» · EN: “{deb_en}”",
            f"6. **Cierre.** ES: reconocimiento de la celda `{cell}` (un ribbon por celda, no por pregunta). · EN: close with the cell recognition `{cell}` (one ribbon per cell, not per question).",
            "",
        ]

    lines += ["---", "", "## Parte 2 · 15 temas de Factor Humano", ""]
    for number, fid in enumerate(sorted(fh), start=1):
        item = fh[fid]
        lines += [
            f"### {fid} · {item['title']}",
            "",
            f"**Especialidad sugerida:** {item.get('specialty', 'sin asignar')} · **Eje:** {item.get('axis', 'ver ficha')}",
            "",
            f"1. **Gancho (3–8 s).** ES: {item.get('hook', '')}",
            f"2. **Contexto patrimonial (15–60 s).** ES: {item.get('context', '')}",
            f"3. **Qué observar / actividad.** ES: {item.get('seed', '')}",
            f"4. **Concepto a tocar.** ES: {item.get('learn', '')}",
            f"5. **Pregunta guía (abierta, para el debrief).** ES: {item.get('guide', '')}",
            "6. **Cierre.** ES: reconocimiento del tema FH (sin variantes; una pregunta por tema).",
            "",
            f"   **EN:** {FH_EN[fid]}",
            "",
        ]

    lines += [
        "---",
        "",
        "## Notas de producción",
        "",
        "- No leer la pregunta del banco antes de la actividad: el valor del episodio está en la observación y el debrief.",
        "- El guía puede adaptar el orden de los 6 puntos, pero no debe convertir la guía en un cuestionario previo.",
        "- Cada celda tiene una guía única para sus 3 variantes; la variante se sortea por día en la implementación.",
        "- FH no tiene variantes: una guía y una pregunta por tema.",
        "- Los términos de sistemas están neutralizados; no se usan las descripciones originales del CSV.",
        "- Accesibilidad: describir en voz alta lo que se muestra y ofrecer la alternativa textual de las imágenes.",
        "",
    ]

    out = SALIDAS / "guias_temas.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Escrito: {out} · guías: {len(meta)} STEM + {len(fh)} FH = {len(meta) + len(fh)}")


if __name__ == "__main__":
    main()
