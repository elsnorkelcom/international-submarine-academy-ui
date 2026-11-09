# -*- coding: utf-8 -*-
"""Genera salidas/matriz_celdas.md y salidas/uso_referencias.md.

Requiere: salidas/banco_cobre.csv (75 filas) o el provisional de 60.
"""

from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
SALIDAS = BASE / "salidas"
POOL = BASE / "insumos" / "01_pool_timss_67.csv"
STAGING = BASE / "herramientas" / "staging"

CSV_CANDIDATES = [SALIDAS / "banco_cobre.csv", SALIDAS / "banco_cobre_stem_provisional.csv"]

DISC_ES = {"SCI": "Ciencias", "TEC": "Tecnología", "ING": "Ingeniería", "MAT": "Matemática"}
ESP_ES = {"MAQ": "Maquinista", "ELE": "Electricista", "ELN": "Electrónico", "NAV": "Ingeniero Naval", "LOG": "Logístico"}


def load_csv() -> tuple[Path, list[dict]]:
    for path in CSV_CANDIDATES:
        if path.exists():
            with path.open(encoding="utf-8-sig", newline="") as handle:
                return path, list(csv.DictReader(handle))
    raise SystemExit("No hay CSV del banco todavía.")


def load_pool() -> dict[str, dict]:
    with POOL.open(encoding="utf-8-sig", newline="") as handle:
        return {r["timss_item_id"]: r for r in csv.DictReader(handle)}


def parse_assignment_topics() -> dict[str, dict]:
    meta: dict[str, dict] = {}
    header_re = re.compile(r"^## (CU-[A-Z]{3}-[A-Z]{3}) · cell_index (\d+) · disciplina ([A-Z]{3}) · tema: (.+)$")
    comp_re = re.compile(r"^- Compartimento: `([A-Z\-]+)` · Sistemas: (.+)$")
    current = None
    for path in sorted(STAGING.glob("asignacion_*.md")):
        for line in path.read_text(encoding="utf-8").splitlines():
            m = header_re.match(line)
            if m:
                current = m.group(1)
                meta[current] = {
                    "cell_index": int(m.group(2)),
                    "discipline": m.group(3),
                    "topic": m.group(4),
                    "specialty": current.split("-")[2],
                }
                continue
            m = comp_re.match(line)
            if m and current:
                meta[current]["compartment"] = m.group(1)
                meta[current]["systems"] = m.group(2)
    return meta


def write_matriz(rows: list[dict], meta: dict[str, dict]) -> None:
    stem = [r for r in rows if r["kind"] == "STEM"]
    by_cell: dict[str, list[dict]] = defaultdict(list)
    for r in stem:
        by_cell[r["cell_code"]].append(r)

    lines = [
        "# Matriz de las 20 celdas de Cobre (STEM)",
        "",
        "**Proyecto:** International Submarine Academy · **Temporada:** Cobre (Nivel 1) · **Dominio cognitivo:** Knowing",
        "**Fecha:** 9 de noviembre de 2026 · **Estado:** propuesta para producción",
        "",
        "Cada celda es una experiencia: un episodio de guía + 3 variantes de pregunta. La variante se sortea por día",
        "(ALFA/BRAVO/CHARLY) en la implementación; el banco solo la etiqueta `variant_index` 1–3.",
        "",
        "El código de sistema (`SYS-<código del CSV>`) remite al catálogo de sistemas por compartimentos; el CSV original",
        "no se editó. La rama `1.2` del catálogo está excluida y no se usa.",
        "",
        "| # | Celda | Especialidad | Disciplina | Episodio (tema) | Sistemas ancla | Compartimento |",
        "|---:|---|---|---|---|---|---|",
    ]
    for cell in sorted(by_cell, key=lambda c: int(by_cell[c][0]["cell_index"])):
        m = meta.get(cell, {})
        systems = m.get("systems", "")
        systems = "; ".join(part.strip() for part in systems.split(";") if part.strip())
        lines.append(
            f"| {by_cell[cell][0]['cell_index']} | `{cell}` | {ESP_ES.get(m.get('specialty',''), '')} "
            f"| {DISC_ES.get(m.get('discipline',''), '')} | {m.get('topic','')} | {systems} "
            f"| `{m.get('compartment','')}` |"
        )

    lines += ["", "## Variantes por celda", ""]
    for cell in sorted(by_cell, key=lambda c: int(by_cell[c][0]["cell_index"])):
        m = meta.get(cell, {})
        lines.append(f"### {cell} · {m.get('topic','')}")
        lines.append("")
        lines.append("| Var. | Pregunta | Referencia TIMSS | Concepto adaptado | Clave |")
        lines.append("|---:|---|---|---|---|")
        for r in sorted(by_cell[cell], key=lambda x: int(x["variant_index"])):
            q = r["question_es"].replace("|", "/")
            lines.append(
                f"| {r['variant_index']} | {q} | `{r['timss_item_id']}` | {r['reference_relation'].replace('|','/')} "
                f"| {r['correct_option_id']} |"
            )
        lines.append("")

    lines += [
        "## Cobertura",
        "",
        f"- Celdas: {len(by_cell)} · preguntas STEM: {len(stem)}",
        "- Una experiencia = una celda (episodio + 1 variante sorteada por día).",
        "- Factor Humano no forma parte de la grilla: son 15 temas libres, con una pregunta cada uno, documentados en `04_factor_humano_temas.md` y en el banco.",
        "",
    ]
    (SALIDAS / "matriz_celdas.md").write_text("\n".join(lines), encoding="utf-8")
    print("Escrito: matriz_celdas.md")


def write_uso(rows: list[dict], pool: dict[str, dict]) -> None:
    stem = [r for r in rows if r["kind"] == "STEM"]
    uses: dict[str, list[dict]] = defaultdict(list)
    for r in stem:
        uses[r["timss_item_id"]].append(r)

    lines = [
        "# Uso de las 67 referencias TIMSS",
        "",
        "**Proyecto:** International Submarine Academy · **Temporada:** Cobre (Nivel 1) · **Referencias:** pool TIMSS 2011 G8, dominio Knowing",
        "**Fecha:** 9 de noviembre de 2026 · **Estado:** propuesta para producción",
        "",
        "Las preguntas son originales de ISA y están ancladas **de forma no literal** a una referencia del pool: se adapta el",
        "concepto, no se reproduce ni se traduce el ítem. Una misma pregunta no se repite entre celdas; una referencia puede",
        "sostener más de una pregunta si se justifica.",
        "",
        "## Resumen",
        "",
        f"- Referencias del pool: **{len(pool)}**",
        f"- Referencias usadas: **{len(uses)}** en {len(stem)} preguntas",
        f"- Referencias con más de un uso: **{sum(1 for v in uses.values() if len(v) > 1)}**",
        f"- Referencias sin uso: **{len(pool) - len(uses)}**",
        "",
        "## Referencias usadas",
        "",
        "| ID | Título (pool) | Dominio | Celda(s) | Pregunta(s) | Relación |",
        "|---|---|---|---|---|---|",
    ]
    for ref in sorted(uses):
        item = pool.get(ref, {})
        cells = ", ".join(f"`{r['cell_code']}`" for r in uses[ref])
        ids = ", ".join(f"`{r['id']}`" for r in uses[ref])
        relation = uses[ref][0]["reference_relation"].replace("|", "/")
        lines.append(
            f"| `{ref}` | {item.get('timss_item_title_original','').replace('|','/')} "
            f"| {item.get('content_domain_en','')} | {cells} | {ids} | {relation} |"
        )

    repeats = {ref: v for ref, v in uses.items() if len(v) > 1}
    lines += ["", "## Repeticiones y su justificación", ""]
    if repeats:
        for ref, items in repeats.items():
            lines.append(f"### `{ref}` — usada en {len(items)} celdas")
            for r in items:
                lines.append(f"- `{r['cell_code']}` variante {r['variant_index']}: {r['justification_es']}")
            lines.append("")
    else:
        lines += ["Sin repeticiones en esta entrega.", ""]

    unused = sorted(set(pool) - set(uses))
    lines += ["## Referencias sin uso", ""]
    if unused:
        lines.append("| ID | Título (pool) | Dominio | Motivo |")
        lines.append("|---|---|---|---|")
        reasons = {
            "S032007": "Anatomía reproductiva; ningún sistema del catálogo la contextualiza sin forzar y el contenido no corresponde a esta temporada.",
            "S052080": "Condición médica individual; sin sistema ancla y con riesgo de estigmatización.",
            "S032465": "Inmunología; no hay sistema del catálogo que la ancore sin forzar.",
            "S032087": "Salud pública y vacunas; mismo problema de anclaje.",
            "S032640": "Hábito de salud individual; no corresponde a ningún sistema.",
            "S042038": "Origen de la vida en el agua; contexto evolutivo sin anclaje técnico.",
            "S032126": "Geología externa; el único puente posible exigiría reescribir el ítem.",
            "M042260": "Probabilidad de intención de voto; sin anclaje técnico en los sistemas de la temporada.",
        }
        for ref in unused:
            item = pool.get(ref, {})
            lines.append(
                f"| `{ref}` | {item.get('timss_item_title_original','').replace('|','/')} "
                f"| {item.get('content_domain_en','')} | {reasons.get(ref, 'Sin anclaje razonable en los sistemas del catálogo.')} |"
            )
        lines.append("")
        lines.append("**Propuesta:** estas referencias quedan reservadas para futuras temporadas (Bronce/Plata) o para ampliar el banco de Cobre con nuevos sistemas; no se descartan del pool.")
    else:
        lines.append("Todas las referencias del pool tienen al menos un uso.")
    lines.append("")

    (SALIDAS / "uso_referencias.md").write_text("\n".join(lines), encoding="utf-8")
    print("Escrito: uso_referencias.md")


def main() -> None:
    path, rows = load_csv()
    pool = load_pool()
    meta = parse_assignment_topics()
    print(f"CSV: {path.name} · filas: {len(rows)}")
    write_matriz(rows, meta)
    write_uso(rows, pool)


if __name__ == "__main__":
    main()
