# -*- coding: utf-8 -*-
"""Ajustes finos al documento 04 (coherencia de estados y registro civil)."""

from pathlib import Path

P = Path(__file__).resolve().parents[1] / "salidas" / "04_factor_humano_temas.md"
text = P.read_text(encoding="utf-8")

patches = [
    (
        "- Datos biográficos de FH-12 (año de egreso, destino y formulación exacta del hito).",
        "- FH-12: confirmar la formulación exacta del hito y el destino (el egreso en diciembre de 2012 está verificado).",
    ),
    (
        "| 8 | Racionamiento de agua dulce a bordo de submarinos convencionales | RN Subs, \"Submarine Living\" (Forbes Guild, 1961) — https://rnsubs.co.uk/index.php?PageID=articles/service/sub-living.html | **verificado** |",
        "| 8 | Racionamiento de agua dulce a bordo de submarinos convencionales | RN Subs, \"Submarine Living\" (Forbes Guild, 1961) — https://rnsubs.co.uk/index.php?PageID=articles/service/sub-living.html | **verificado en submarinos convencionales; no generalizar** |",
    ),
    (
        "- el informe crudo tiene 10 ejes, 30 candidatos y 15 temas desarrollados; el encabezado y el registro militar eran reales y quedaron corregidos;",
        "- el informe crudo tiene 10 ejes, 30 candidatos y 15 temas desarrollados; su encabezado y su registro institucional quedaron corregidos;",
    ),
]

for old, new in patches:
    assert text.count(old) == 1, old[:60]
    text = text.replace(old, new)

P.write_text(text, encoding="utf-8")
print("Ajustes aplicados:", len(patches))
