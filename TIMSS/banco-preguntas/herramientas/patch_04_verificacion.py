# -*- coding: utf-8 -*-
"""Aplica las correcciones de verificación al documento 04_factor_humano_temas.md.

Cada parche exige que el texto original aparezca exactamente una vez.
"""

from pathlib import Path

P = Path(__file__).resolve().parents[1] / "salidas" / "04_factor_humano_temas.md"
text = P.read_text(encoding="utf-8")

patches = [
    (
        "Se descarta **como tema** por la regla de exclusión: el hecho ocurrió en el marco de una travesía de conflicto y presentarlo como anécdota introduce ese marco. **Corrección de exactitud:** el informe original lo clasifica como \"Ficción / Historia (basado en hechos reales)\" y eso es un error. Es un hecho histórico documentado: la intervención se realizó a bordo del USS Seadragon en 1942 y el sanitario Wheeler B. Lipes realizó la operación con recursos improvisados.",
        "Se descarta **como tema** por la regla de exclusión: el hecho ocurrió en un contexto que ISA no trata y presentarlo como anécdota lo reintroduce. **Corrección de exactitud:** el informe original lo clasifica como \"Ficción / Historia (basado en hechos reales)\" y eso es un error. Es un hecho histórico documentado: la intervención se realizó a bordo del USS Seadragon el 11 de septiembre de 1942 y el sanitario Wheeler B. Lipes la condujo con recursos improvisados (ver §8.3, fuente 9).",
    ),
    (
        "Se descarta el término y el tema. El término se documenta asociado a tripulaciones de submarinos durante la Segunda Guerra Mundial; sin ese marco, usarlo sería una referencia encubierta al conflicto. El concepto subyacente (adaptación psicológica al confinamiento prolongado) se conserva como **tema general de FH-06**, sin el término y con analogías civiles (estaciones de investigación polar, misiones espaciales, confinamiento doméstico), sujetas a fuente. No se reemplaza por otro término de jerga: se describe el fenómeno.",
        "Se descarta el término y el tema. La verificación (§8.3, fuente 7) no encontró documentación histórica que lo respalde como término técnico: aparece como recurso de ficción en una novela gráfica de 2014. No se sostiene como hecho y su marco narrativo es el contenido que ISA excluye. El concepto subyacente (adaptación psicológica al confinamiento prolongado) se conserva como **tema general de FH-06**, sin el término y con analogías civiles verificadas (estación polar Concordia, hábitats espaciales). No se reemplaza por otra jerga: se describe el fenómeno.",
    ),
    (
        "- **Especialidad sugerida:** MAQ · **Eje:** 2 y 3 · **Tipo:** hecho documentado · **Fuente:** blog 2005/2011/2019 · **Estado:** por verificar (se publica como práctica documentada si se consigue fuente externa; si no, como testimonio).",
        "- **Especialidad sugerida:** MAQ · **Eje:** 2 y 3 · **Tipo:** hecho documentado · **Fuente:** blog 2005/2011/2019 · **Estado:** verificado como práctica documentada (§8.3, fuente 3).",
    ),
    (
        "- **Especialidad sugerida:** ELE · **Eje:** 5 · **Tipo:** hecho documentado · **Fuente:** blog 2002 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELE · **Eje:** 5 · **Tipo:** hecho documentado (principio) / testimonio (práctica a bordo) · **Fuente:** blog 2002 · **Estado:** parcial: el principio está verificado en hábitats espaciales (§8.3, fuente 10); la práctica en submarinos queda por verificar.",
    ),
    (
        "- **Contexto:** durante una travesía prolongada no se ve el sol. Para sostener el ritmo de la jornada, la iluminación interior cambia de intensidad y de tono: más luz en las horas de actividad y una luz más cálida y tenue en las horas de descanso.",
        "- **Contexto:** durante una travesía prolongada no se ve el sol. Para sostener el ritmo de la jornada, se cambia la intensidad y el tono de la luz interior: más luz en las horas de actividad y una luz más cálida y tenue en las horas de descanso. El principio está documentado en hábitats espaciales; la práctica concreta a bordo se recoge como testimonio y queda por verificar.",
    ),
    (
        "- **Especialidad sugerida:** ELE · **Eje:** 4 · **Tipo:** testimonio / curiosidad · **Fuente:** blog 2009 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELE · **Eje:** 4 · **Tipo:** testimonio / curiosidad · **Fuente:** blog 2009 · **Estado:** por verificar; el caso de la máquina de helados está documentado en una crónica de un buque (§8.3, fuente 14), no como práctica general.",
    ),
    (
        "el helado se convierte en un pequeño premio cotidiano.",
        "en algunos casos, el helado se vuelve un pequeño premio cotidiano.",
    ),
    (
        "- **Especialidad sugerida:** ELE · **Eje:** 7 · **Tipo:** hecho documentado (origen del juego) / testimonio (práctica a bordo) · **Fuente:** blog 2024 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELE · **Eje:** 7 · **Tipo:** hecho documentado (origen del juego) / testimonio (práctica a bordo) · **Fuente:** blog 2024 · **Estado:** verificado el origen del juego (§8.3, fuente 5); la práctica a bordo es testimonio y queda por verificar.",
    ),
    (
        "- **Especialidad sugerida:** ELN · **Eje:** 5 · **Tipo:** hecho documentado (fisiología de la visión) · **Fuente:** blog 2015 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELN · **Eje:** 5 · **Tipo:** hecho documentado (fisiología de la visión) · **Fuente:** blog 2015 · **Estado:** verificado (adaptación del ojo a la oscuridad; §8.3, fuente 8).",
    ),
    (
        "- **Especialidad sugerida:** ELN · **Eje:** 9 · **Tipo:** hecho documentado · **Fuente:** blog 2025 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELN · **Eje:** 9 · **Tipo:** hecho documentado · **Fuente:** blog 2025 · **Estado:** verificado el límite y la recepción de los mensajes (§8.3, fuente 6); el origen histórico no está verificado.",
    ),
    (
        "- **Especialidad sugerida:** ELN · **Eje:** 1 y 10 · **Tipo:** testimonio histórico · **Fuente:** blog 2003 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** ELN · **Eje:** 1 y 10 · **Tipo:** testimonio histórico · **Fuente:** blog 2003 · **Estado:** por verificar. No se encontró fuente externa del dibujo; se publica como testimonio y no como hecho (§8.3, fuente 2).",
    ),
    (
        "- **Especialidad sugerida:** NAV · **Eje:** 8 · **Tipo:** hecho documentado · **Fuente:** blog 2013 + prensa (ver §8) · **Estado:** a verificar en §8.",
        "- **Especialidad sugerida:** NAV · **Eje:** 8 · **Tipo:** hecho documentado · **Fuente:** blog 2013 + prensa (§8.3, fuente 1) · **Estado:** verificado: egresó en diciembre de 2012 como la primera oficial submarinista de Argentina.",
    ),
    (
        "Eliana Krawczyk se convirtió en la primera mujer oficial submarinista de Argentina y su experiencia mostró que, con ajustes de habitabilidad y una cultura de respeto profesional, la convivencia funciona.",
        "Eliana Krawczyk egresó en diciembre de 2012 como la primera mujer oficial submarinista de Argentina; su experiencia mostró que, con ajustes de habitabilidad y una cultura de respeto profesional, la convivencia funciona.",
    ),
    (
        "- **Especialidad sugerida:** LOG · **Eje:** 6 · **Tipo:** hecho / testimonio · **Fuente:** blog 2003/2013 · **Estado:** por verificar.",
        "- **Especialidad sugerida:** LOG · **Eje:** 6 · **Tipo:** hecho / testimonio · **Fuente:** blog 2003/2013 · **Estado:** parcial: el racionamiento está documentado en submarinos convencionales (§8.3, fuente 11); no se generaliza a todos los buques.",
    ),
    (
        "el agua dulce a bordo es un recurso limitado: se prioriza para la cocina y la refrigeración.",
        "el agua dulce a bordo es un recurso limitado: se prioriza para la cocina y los usos esenciales.",
    ),
    (
        "**C)** Porque se reserva para la cocina y la refrigeración, que son prioritarias. ✅",
        "**C)** Porque se administra como recurso escaso y hay usos prioritarios, como la cocina. ✅",
    ),
    (
        "| 1 | Eliana Krawczyk, primera mujer oficial submarinista de Argentina | *pendiente de completar en esta fase* | por verificar |",
        "| 1 | Eliana Krawczyk, primera mujer oficial submarinista de Argentina; egreso en diciembre de 2012 | El Litoral, \"La historia de la primera oficial submarinista del país\" (2017/2022) — https://www.ellitoral.com/nacionales/historia-primera-oficial-submarinista-pais_0_980DTqaAM3.html | **verificado** |",
    ),
    (
        "| 2 | Caso del emblema pintado en el domo del submarino Tonina | *pendiente de completar en esta fase* | por verificar |",
        "| 2 | Caso del emblema pintado en el domo del submarino Tonina | Buque y museo: Ministerio de Defensa de España (2005) — https://www.defensa.gob.es/gabinete/notasPrensa/2005/05/notaPrensa_10567.html; Murcia Plaza (2025) — https://murciaplaza.com/murciaplaza/cartagena/el-submarino-tonina-ya-es-oficialmente-del-ayuntamiento-de-cartagena. El dibujo \"Popeye\": **NO ENCONTRADO** | embarcación verificada; el emblema, **por verificar** |",
    ),
    (
        "| 3 | Práctica de literas compartidas por turnos | *pendiente de completar en esta fase* | por verificar |",
        "| 3 | Práctica de literas compartidas por turnos | Wikipedia EN, \"Hot racking\" — https://en.wikipedia.org/wiki/Hot_racking; RN Subs, \"Submarine Living\" (Forbes Guild, 1961) — https://rnsubs.co.uk/index.php?PageID=articles/service/sub-living.html | **verificado** |",
    ),
    (
        "| 4 | Origen del cribbage | *pendiente de completar en esta fase* | por verificar |",
        "| 4 | Origen del cribbage (siglo XVII, John Suckling) y difusión a bordo | National Endowment for the Humanities, \"Scrimshaw cribbage board offers glimpse of mariners' life\" (2018) — https://www.neh.gov/article/scrimshaw-cribbage-board-offers-glimpse-mariners-life | **verificado** |",
    ),
    (
        "| 5 | Mensajes familiares breves a submarinos | *pendiente de completar en esta fase* | por verificar |",
        "| 5 | Mensajes familiares breves a submarinos: 40 palabras por semana, recepción | Hansard (Reino Unido), 21/10/2003 — https://api.parliament.uk/historic-hansard/written-answers/2003/oct/21/royal-naval-personnel-family-contact | **verificado el límite; origen no encontrado** |",
    ),
    (
        "| 6 | Adaptación del ojo a la oscuridad | *pendiente de completar en esta fase* | por verificar |",
        "| 6 | Adaptación del ojo a la oscuridad: 20–30 minutos y rodopsina | American Academy of Ophthalmology, \"Night Vision\" — https://www.aao.org/eye-health/anatomy/night-vision | **verificado** |",
    ),
    (
        "| 7 | Iluminación para marcar el ciclo diario en espacios confinados | *pendiente de completar en esta fase* | por verificar |",
        "| 7 | Iluminación para marcar el ciclo diario en hábitats confinados | NASA Human Research Roadmap — https://humanresearchroadmap.nasa.gov/Tasks/task.aspx?i=823 | **verificado en hábitat espacial; en submarinos, por verificar** |",
    ),
    (
        "| 8 | Racionamiento de agua dulce a bordo | *pendiente de completar en esta fase* | por verificar |",
        "| 8 | Racionamiento de agua dulce a bordo de submarinos convencionales | RN Subs, \"Submarine Living\" (Forbes Guild, 1961) — https://rnsubs.co.uk/index.php?PageID=articles/service/sub-living.html | **verificado** |",
    ),
    (
        "| 9 | Intervención de 1942 en el USS Seadragon (solo para la corrección de §5.2) | *pendiente de completar en esta fase* | por verificar |",
        "| 9 | Intervención de 1942 en el USS Seadragon (solo para la corrección de §5.2) | Naval History (USNI), \"Operating Under Pressure\" (1996) — https://www.usni.org/magazines/naval-history-magazine/1996/august/operating-under-pressure | **verificado** |",
    ),
    (
        "> El relevamiento externo se completó con búsqueda y lectura de páginas públicas; cuando una fuente no pudo abrirse o no existía, se marca \"NO ENCONTRADO\" y la afirmación queda como testimonio. Esta tabla se cierra antes de la Fase B.",
        "> El relevamiento externo se hizo con búsqueda y lectura de páginas públicas; cuando una fuente no pudo abrirse o no existía, se marca \"NO ENCONTRADO\" y la afirmación queda como testimonio. Todas las fuentes de esta tabla se abrieron con `web_fetch`; las que no pudieron abrirse (PDF con 403, sitios con bloqueo anti-bot) no se citan. **Dos correcciones de alcance:** el caso del emblema del Tonina no tiene fuente externa, y el racionamiento de agua no debe extrapolarse a todos los buques.",
    ),
    (
        "**No comprobado en esta fase:**\n\n- las fuentes externas de §8.3 (se completan antes de la Fase B);\n- la exactitud de los datos biográficos e históricos que dependen del blog;",
        "**No comprobado en esta fase:**\n\n- el emblema del Tonina (FH-09): no hay fuente externa, se publica como testimonio;\n- la práctica de iluminación en submarinos (FH-04) y la de los helados (FH-05): el principio o el caso están documentados, la generalización no;\n- los datos que dependen solo del blog (olores, maleta, cocinero, caldito): quedan como testimonio por verificar;",
    ),
    (
        "4. **FH-09 (emblema del buque):** si no se consigue fuente externa, ¿se publica como \"relato recogido en la comunidad\" o se reemplaza por otro tema del eje 10 (mascotas de proa o amuleto)? La propuesta es publicarlo como testimonio, nunca como hecho.",
        "4. **FH-09 (emblema del buque):** la verificación no encontró fuente externa del dibujo. La propuesta es publicarlo como \"relato recogido en la comunidad\", marcado **por verificar**, nunca como hecho. Alternativa: reemplazarlo por otro tema del eje 10 (mascotas de proa o amuleto), que también son testimoniales. Decidir en el checkpoint 1.",
    ),
]

for old, new in patches:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"PARCHE FALLIDO ({count} ocurrencias): {old[:90]}...")
    text = text.replace(old, new)

P.write_text(text, encoding="utf-8")
print(f"Parches aplicados: {len(patches)}")
print(f"Archivo: {P}")
