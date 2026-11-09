# -*- coding: utf-8 -*-
"""QC de literalidad y forma del banco STEM de Cobre.

Compara cada pregunta con el título del pool TIMSS para detectar reproducciones
demasiado literales, y revisa longitudes de opciones y pistas de forma.
"""

from __future__ import annotations

import csv
import re
import unicodedata
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
CSV_CANDIDATES = [
    BASE / "salidas" / "banco_cobre.csv",
    BASE / "salidas" / "banco_cobre_stem_provisional.csv",
]
CSV = next((p for p in CSV_CANDIDATES if p.exists()), CSV_CANDIDATES[-1])
POOL = BASE / "insumos" / "01_pool_timss_67.csv"

STOP = set("""a an the of in on for to and or with is are was were what which how
de la el los las un una del al en con por para que se es son como cuál cual
cuántos cuantos qué que the of a an to in on for with and or is are what which how
many much does do""".split())

NUM_RE = re.compile(r"\d+(?:[.,]\d+)?")
FORMULA_RE = re.compile(r"\b(?:[A-Z][a-z]?\d*){2,}\b")


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKD", (text or "").lower())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9 ]", " ", text)


def tokens(text: str) -> set[str]:
    return {t for t in norm(text).split() if t not in STOP and len(t) > 2}


def main() -> None:
    pool = {}
    with POOL.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            pool[row["timss_item_id"]] = row
    with CSV.open(encoding="utf-8-sig", newline="") as handle:
        rows = [r for r in csv.DictReader(handle) if r.get("kind") == "STEM"]

    literal_flags = []
    length_flags = []
    for r in rows:
        item = pool[r["timss_item_id"]]
        title = item["timss_item_title_original"]
        q_es = r["question_es"]
        q_en = r["question_en"]

        # 1) Palabras compartidas con el título (ES+EN)
        shared = tokens(title) & (tokens(q_es) | tokens(q_en))
        # 2) Números y fórmulas compartidos
        nums_title = set(NUM_RE.findall(title))
        nums_q = set(NUM_RE.findall(q_es + " " + q_en))
        shared_nums = {n for n in nums_title & nums_q if len(n) >= 2 and n not in {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"}}
        formulas_title = set(FORMULA_RE.findall(title))
        formulas_q = set(FORMULA_RE.findall(q_es + " " + q_en))
        shared_formulas = formulas_title & formulas_q
        if len(shared) >= 3 or shared_nums or shared_formulas:
            literal_flags.append((r["id"], sorted(shared), sorted(shared_nums), sorted(shared_formulas), title))

        # 3) Longitudes de opciones
        for lang in ("es", "en"):
            lens = [len(r[f"option_{x}_{lang}"].strip()) for x in "abcd"]
            if max(lens) > 0 and min(lens) > 0:
                ratio = max(lens) / min(lens)
                if ratio > 1.6 and max(lens) > 18:
                    length_flags.append((r["id"], lang, lens, round(ratio, 2)))
        es_len = sum(len(r[f"option_{x}_es"]) for x in "abcd")
        en_len = sum(len(r[f"option_{x}_en"]) for x in "abcd")
        if es_len and not (0.7 <= en_len / es_len <= 1.4):
            length_flags.append((r["id"], "EN/ES", es_len, en_len))

    print(f"Preguntas: {len(rows)} · refs únicas: {len({r['timss_item_id'] for r in rows})}")
    print(f"\nPosibles reproducciones literales: {len(literal_flags)}")
    for flag in literal_flags:
        print(f"  {flag[0]} | palabras={flag[1]} | números={flag[2]} | fórmulas={flag[3]}")
        print(f"     título TIMSS: {flag[4]}")

    print(f"\nProblemas de longitud/paridad: {len(length_flags)}")
    for flag in length_flags:
        print("  ", flag)

    # Pista de posición: correcta más larga en preguntas de prosa
    cue = 0
    for r in rows:
        lens = [len(r[f"option_{x}_es"].strip()) for x in "abcd"]
        if max(lens) > 18 and max(lens) / max(1, min(lens)) > 1.3:
            longest = [x.upper() for x, n in zip("abcd", lens) if n == max(lens)]
            if r["correct_option_id"] in longest:
                cue += 1
                print(f"  PISTA: {r['id']} correcta más larga {dict(zip('ABCD', lens))}")
    print(f"\nCorrectas más largas con ratio>1.3: {cue}")


if __name__ == "__main__":
    main()
