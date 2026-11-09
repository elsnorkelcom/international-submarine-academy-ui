# -*- coding: utf-8 -*-
"""Genera staging/FH.json para las 15 preguntas de Factor Humano.

Toma los enunciados, opciones y feedback en español desde
salidas/04_factor_humano_temas.md (fuente de verdad ya revisada), agrega la
versión en inglés y los metadatos de la Fase B.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
DOC = BASE / "salidas" / "04_factor_humano_temas.md"
OUT = BASE / "herramientas" / "staging" / "FH.json"

EN = {
    "FH-01": {
        "q": "Why are the bunks on a submarine shared in shifts?",
        "a": "Because space is limited and watches alternate.",
        "b": "Because a bunk wears out if the same person always uses it.",
        "c": "Because less energy is needed for heating that way.",
        "d": "Because each crew member must change cabins every week.",
        "fb": "The cause is the combination of minimal space and rotating watches. Options B and C mix side effects with the cause; D confuses sharing a bunk with changing cabins.",
    },
    "FH-02": {
        "q": "The crew stops noticing the submarine's smell after a few days. What best explains that change?",
        "a": "The ventilation system removes every odour particle.",
        "b": "Smell perception adapts to constant stimuli.",
        "c": "The hull materials absorb all the odours.",
        "d": "The crew uses products that neutralise each odour.",
        "fb": "The sense of smell habituates: the odour is still there, but it stops drawing attention. A confuses reducing with eliminating; C and D credit the hull and products with an effect that does not occur.",
    },
    "FH-03": {
        "q": "Why does hearing become more important when the submarine is submerged?",
        "a": "Because artificial light damages eyesight during the dive.",
        "b": "Because the hull amplifies only the lowest sounds.",
        "c": "Because sound travels well in water and sight loses range.",
        "d": "Because all navigation instruments are sound-based.",
        "fb": "The reason is twofold: water carries sound and the lack of windows limits sight. A and B are false statements; D overgeneralises.",
    },
    "FH-04": {
        "q": "Why are the intensity and tone of the light on board changed according to the time?",
        "a": "To save batteries during rest hours.",
        "b": "To tell the watch shifts apart by colour.",
        "c": "To signal the depth at which the vessel is sailing.",
        "d": "To tell the body when it is day and when it is night.",
        "fb": "The change in light works as a signal of the daily cycle. Saving energy (A), rotating watches (B) and depth (C) are other systems and other signals.",
    },
    "FH-05": {
        "q": "What makes it possible to serve ice cream during a long voyage?",
        "a": "A cooling system that runs on the vessel's energy.",
        "b": "A thermal container that is only refilled on the surface.",
        "c": "The naturally low temperature of seawater.",
        "d": "A convection oven that cools the food.",
        "fb": "Cold is produced and kept by a system powered by the vessel's energy. B and C depend on conditions that are not available while submerged; D describes the opposite of an oven.",
    },
    "FH-06": {
        "q": "What does a card game such as cribbage contribute during the watch?",
        "a": "It replaces lookout duties when there is little work.",
        "b": "It structures free time and sustains group life.",
        "c": "It allows depth to be calculated without instruments.",
        "d": "It trains memory for navigation tasks.",
        "fb": "The game does not replace duties or measure depth: it structures free time and creates a shared space. C and D confuse leisure with a technical instrument.",
    },
    "FH-07": {
        "q": "Why does the person about to look through the periscope cover one eye beforehand?",
        "a": "To protect the eye from the strong outside light.",
        "b": "To keep both eyes from seeing a double image.",
        "c": "To keep one eye already adapted to the dark.",
        "d": "To rest the eyes after reading cards.",
        "fb": "The covered eye keeps adapting to the dark and is ready to observe. A and B do not explain the practice; D confuses rest with adaptation.",
    },
    "FH-08": {
        "q": "What characterises the family messages the crew receives?",
        "a": "They are live calls of a few minutes each day.",
        "b": "They are recorded videos sent every day.",
        "c": "They are long letters read aloud to the group.",
        "d": "They are brief, limited and one-way.",
        "fb": "The limit is the central condition: brevity, a quota and no immediate reply. A, B and C describe media that are not available while submerged.",
    },
    "FH-09": {
        "q": "What does the episode of the drawing painted on the dome show?",
        "a": "That an informal drawing can become the vessel's emblem.",
        "b": "That rules on board forbid any artistic expression.",
        "c": "That art on board is used to signal depth.",
        "d": "That emblems are chosen ashore before departure.",
        "fb": "What the case shows is the shift from an informal intervention to an adopted symbol. B contradicts the account; C and D credit art and emblems with functions they do not have.",
    },
    "FH-10": {
        "q": "What makes living together sustainable when there is no privacy on board?",
        "a": "Assigning an individual cabin to every person.",
        "b": "Rules of respect, self-control and care for shared space.",
        "c": "Banning talking during watch hours.",
        "d": "Using headphones to isolate from the rest of the group.",
        "fb": "In a minimal space, living together is sustained by agreements and mutual care. A is not possible in the available space; C and D solve the tension by isolating people instead of agreeing.",
    },
    "FH-11": {
        "q": "What criterion guides the luggage of someone going on board?",
        "a": "Taking clothes for every season of the year.",
        "b": "Taking gifts to hand out at every port.",
        "c": "Taking only what is functional and fits the space.",
        "d": "Taking a different uniform for every day of the week.",
        "fb": "The criterion is functionality and space. A, B and D assume volume and quantities that the available space cannot hold.",
    },
    "FH-12": {
        "q": "What does the inclusion of women in crews show?",
        "a": "That women can only work on deck.",
        "b": "That the experience changed no routine on board.",
        "c": "That individual cabins are needed for everyone.",
        "d": "That habitability was solved with adjustments and respect.",
        "fb": "The case shows that the barrier was one of design and culture and was solved with adjustments and professional respect. A is a prejudice; B denies the change; C is not the real solution.",
    },
    "FH-13": {
        "q": "Why does the person who cooks influence the crew's mood?",
        "a": "Because food is an anchor of well-being in the routine.",
        "b": "Because they control how watches are assigned.",
        "c": "Because they decide the route the voyage follows.",
        "d": "Because they manage the fresh water for the whole vessel.",
        "fb": "The effect on mood comes from the symbolic and social value of food. B, C and D confuse the kitchen role with other responsibilities.",
    },
    "FH-14": {
        "q": "What is the role of the 'eleven o'clock broth' in the day?",
        "a": "It marks the change of the morning watch.",
        "b": "It marks a pause that orders the day and brings the group together.",
        "c": "It is used to warm up the engine before diving.",
        "d": "It replaces breakfast when there is little space.",
        "fb": "Its role is the shared pause that structures the day. A, C and D credit the broth with signal, machine and ration functions it does not have.",
    },
    "FH-15": {
        "q": "Why is fresh water rationed on board?",
        "a": "Because fresh water damages the hull pipes.",
        "b": "Because its taste changes while it is moving.",
        "c": "Because it is scarce and there are priority uses, such as cooking.",
        "d": "Because water freezes at shallow depth.",
        "fb": "Water is managed because it is scarce and because there are priority uses. A, B and D are false statements about water and the hull.",
    },
}

META = {
    "FH-01": ("MAQ", "CMP-MAQUINAS", "2, 3", "Informe crudo Vida submarina.txt (blog 2005/2011/2019); práctica documentada (04 §8.3, fuente 3).", "alta",
              "Convivencia y descanso en espacio mínimo; no depende de ninguna institución de fuerza."),
    "FH-02": ("MAQ", "CMP-MAQUINAS", "6", "Informe crudo Vida submarina.txt (blog 2013); testimonio por verificar.", "media",
              "Atmósfera y percepción; se presenta como testimonio, sin datos sensibles."),
    "FH-03": ("MAQ", "CMP-MAQUINAS", "5", "Informe crudo Vida submarina.txt (blog 2002); testimonio por verificar.", "media",
              "Percepción acústica y trabajo a bordo; sin contenido bélico."),
    "FH-04": ("ELE", "CMP-BATERIAS-LOGISTICA", "5", "Informe crudo (blog 2002) + NASA HRR (04 §8.3, fuente 7); principio verificado en hábitat espacial, práctica a bordo por verificar.", "media",
              "Diseño de iluminación y ritmo biológico; sin contenido bélico."),
    "FH-05": ("ELE", "CMP-BATERIAS-LOGISTICA", "4", "Informe crudo (blog 2009) + crónica de un buque (04 §8.3, fuente 14); caso puntual.", "media",
              "Alimentación y energía a bordo; caso puntual documentado, sin generalizar."),
    "FH-06": ("ELE", "CMP-BATERIAS-LOGISTICA", "7", "Informe crudo (blog 2024) + NEH 2018 (04 §8.3, fuente 4); origen del juego verificado.", "alta",
              "Rutina y entretenimiento en espacios aislados; sin contenido bélico."),
    "FH-07": ("ELN", "CMP-CONTROL", "5", "Informe crudo (blog 2015) + AAO (04 §8.3, fuente 6); fisiología de la visión verificada.", "alta",
              "Fisiología de la visión aplicada a la observación; sin contenido bélico."),
    "FH-08": ("ELN", "CMP-CONTROL", "9", "Informe crudo (blog 2025) + Hansard 2003 (04 §8.3, fuente 5); límite y recepción verificados.", "alta",
              "Comunicación limitada y vínculo familiar; sin contenido bélico."),
    "FH-09": ("ELN", "CMP-CONTROL", "1, 10", "Informe crudo (blog 2003); testimonio por verificar, sin fuente externa del emblema.", "revisar",
              "Identidad y patrimonio; se publica como testimonio por verificar, nunca como hecho."),
    "FH-10": ("NAV", "CMP-POPA", "2", "Informe crudo (blog 2002); análisis/opinión, no requiere verificación de hecho.", "media",
              "Análisis de convivencia en espacio mínimo; se presenta como opinión."),
    "FH-11": ("NAV", "CMP-POPA", "2", "Informe crudo (blog 2014); testimonio por verificar.", "media",
              "Logística personal y espacio disponible; testimonio, sin generalizar."),
    "FH-12": ("NAV", "CMP-POPA", "8", "Informe crudo (blog 2013) + El Litoral (04 §8.3, fuente 1); egreso en diciembre de 2012 verificado.", "alta",
              "Incorporación de mujeres y habitabilidad; hito verificado, sin datos personales sensibles."),
    "FH-13": ("LOG", "CMP-BATERIAS-LOGISTICA", "4", "Informe crudo (blog 2015); testimonio por verificar.", "media",
              "Alimentación y bienestar; se presenta como testimonio."),
    "FH-14": ("LOG", "CMP-BATERIAS-LOGISTICA", "1, 4", "Informe crudo (blog 2021); testimonio por verificar.", "media",
              "Ritual cotidiano y organización del día; se presenta como testimonio."),
    "FH-15": ("LOG", "CMP-BATERIAS-LOGISTICA", "6", "Informe crudo (blog 2003/2013) + RN Subs 1961 (04 §8.3, fuente 8); racionamiento verificado en submarinos convencionales.", "media",
              "Higiene y gestión del agua; práctica documentada sin generalizar a todos los buques."),
}


def parse_es() -> dict[str, dict]:
    text = DOC.read_text(encoding="utf-8")
    blocks = re.split(r"^### (FH-\d\d) ·", text, flags=re.M)[1:]
    result: dict[str, dict] = {}
    for index in range(0, len(blocks), 2):
        fid, body = blocks[index], blocks[index + 1]
        question = re.search(r"\*\*Pregunta de banco:\*\* (.+)", body).group(1).strip()
        options = {}
        for match in re.finditer(r"^\s*-\s*\*\*([ABCD])\)\*\* (.+)$", body, re.M):
            value = match.group(2).strip()
            value = value.replace("✅", "").strip()
            options[match.group(1)] = value
        feedback = re.search(r"\*\*Feedback:\*\* (.+)", body).group(1).strip()
        key = re.search(r"^\s*-\s*\*\*([ABCD])\)\*\* .*✅", body, re.M).group(1)
        assert len(options) == 4, (fid, options)
        result[fid] = {"question": question, "options": options, "feedback": feedback, "key": key}
    return result


def main() -> None:
    es = parse_es()
    items = []
    for number, fid in enumerate(sorted(es), start=1):
        es_item = es[fid]
        en_item = EN[fid]
        feedback_es = es_item["feedback"]
        if feedback_es:
            feedback_es = feedback_es[0].upper() + feedback_es[1:]
        specialty, compartment, axis, source, confidence, justification = META[fid]
        items.append(
            {
                "id": f"COB-FH-{number:02d}",
                "kind": "FH",
                "season_id": "SEA-COPPER",
                "specialty_id": specialty,
                "discipline_id": "HUM",
                "cell_code": f"FH-{number:02d}",
                "cell_index": number,
                "variant_index": 1,
                "question_es": es_item["question"],
                "question_en": en_item["q"],
                "option_a_es": es_item["options"]["A"],
                "option_a_en": en_item["a"],
                "option_b_es": es_item["options"]["B"],
                "option_b_en": en_item["b"],
                "option_c_es": es_item["options"]["C"],
                "option_c_en": en_item["c"],
                "option_d_es": es_item["options"]["D"],
                "option_d_en": en_item["d"],
                "correct_option_id": es_item["key"],
                "feedback_es": feedback_es,
                "feedback_en": en_item["fb"],
                "compartment_id": compartment,
                "system_ids": "",
                "timss_cycle": "",
                "timss_item_id": "",
                "timss_item_title": "",
                "timss_content_domain": "",
                "timss_cognitive_domain": "",
                "reference_relation": f"sin ancla TIMSS · Factor Humano, eje(s) {axis}",
                "source_basis": source,
                "reuse_group": "",
                "justification_es": justification,
                "confidence": confidence,
                "status": "propuesta",
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    from collections import Counter

    print(f"Escrito: {OUT}")
    print(f"Filas: {len(items)} · claves: {dict(Counter(i['correct_option_id'] for i in items))}")
    print(f"Especialidades: {dict(Counter(i['specialty_id'] for i in items))}")


if __name__ == "__main__":
    main()
