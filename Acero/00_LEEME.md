# Acero — insumos y pool de preguntas (borrador v0.1)

**Estado:** borrador para revisión. **No cargado en la app.**
**Fecha:** 10/11/2026.

## 1. Qué hay acá

| Archivo | Qué es |
|---|---|
| `preguntas_acero.csv` | 21 preguntas de observación/comprensión: 7 estaciones × 3 variantes, ES/EN |
| `preguntas_acero.xlsx` | La misma tabla en planilla, con hoja `LEEME` |
| `estaciones_acero.md` | Fichas de las 7 estaciones: función, artefactos, hotspots, locución semilla ES/EN, pieza asociada y fuente |

## 2. Fuentes

- **Playlist de El Snorkel:** <https://youtube.com/playlist?list=PL472EEE6B920640A5> (61 videos de submarinos museo).
- **Video principal de la visita:** *Submarino Abtao 360°* (`D4-JeWuErfw`), que recorre torpedos, baterías de proa y popa, puesto central, sala de máquinas y motores.
- **Apoyo:** *Museo de Sitio Naval Submarino Abtao* (`Q74oD1WwbWg`) y los dos documentos locales de `Visita Virtual Submarino/` (arquitectura naval y compartimentos).
- **Otros videos de la playlist** (USS Pampanito, U-995, O'Brien, USS Torsk, HMCS Onondaga, etc.) quedan como fuente para enriquecer estaciones y preguntas en una segunda pasada.

> La extracción se hizo desde los documentos derivados de la playlist, no cuadro por cuadro del video. Por eso todas las preguntas quedan en `confidence = revisar` hasta que las valides contra el video.

## 3. Regla aplicada

- Las estaciones se visitan como **espacios patrimoniales**; no se explican explosivos, armamento ni intención bélica.
- La sala de torpedos se trata como espacio de trabajo, almacenamiento y descanso (se duerme debajo de los torpedos, hay escotilla de carga y salida), sin describir el funcionamiento de los tubos.
- Acero **no usa TIMSS**: las preguntas son de observación/comprensión, sin ancla de ítem.

## 4. Las 7 estaciones y su pieza

| ID | Estación | Pieza para "armá tu unidad" | Icono existente |
|---|---|---|---|
| AC-01 | Sala de torpedos de proa | Proa | `ribbon-AC-PROA.png` |
| AC-02 | Baterías de proa, radio y sonar | Baterías de proa | `ribbon-AC-BATERIAS.png` |
| AC-03 | Puesto central y mando | Puesto central | `ribbon-AC-CONTROL.png` |
| AC-04 | Baterías de popa, cocina y comedor | Baterías de popa y cocina | **falta** |
| AC-05 | Sala de motores diésel | Sala de máquinas | `ribbon-AC-MAQUINAS.png` |
| AC-06 | Motores eléctricos y cuadro | Motores eléctricos | **falta** |
| AC-07 | Sala de torpedos de popa y timón | Popa | `ribbon-AC-POPA.png` |

Hoy hay 6 ribbons de Acero; `ribbon-AC-REACTOR.png` no aplica a un diésel-eléctrico. Para el juego de piezas hacen falta **dos iconos nuevos** (baterías de popa/cocina y motores eléctricos) y retirar o reutilizar el de reactor.

## 5. QA de este borrador

- 21 filas, 7 estaciones × 3 variantes, IDs únicos.
- ES/EN completos en enunciado, 4 opciones y feedback.
- Claves balanceadas: A 6 · B 5 · C 5 · D 5.
- Sin términos de armamento, explosivos, guerra ni combate (los “torpedos” aparecen solo como objeto patrimonial en la estación y su pregunta de descanso).
- Sin media todavía: para el MVP se usan stills de los videos o artes provisionales.

## 6. Qué falta antes de cargar Acero

1. **Revisión tuya** de las 21 preguntas contra los videos (marcar corregir/descartar).
2. **Media de ejemplo:** una imagen por estación (still del video o arte).
3. **Dos iconos de pieza** nuevos para el juego de armado.
4. **Decisión de desbloqueo:** si Acero y Cobre quedan abiertas a la vez en la beta.
5. **Derechos:** los videos de la playlist son de distintos canales; para usar frames en la plataforma conviene material propio o permiso. Los documentos derivados sí son propios.

## 7. Siguiente paso propuesto

Con tu revisión, cargar las 7 estaciones como experiencias de Acero (sin TIMSS), con pregunta de observación y ribbon, y mostrar la primera versión de “Tu unidad” con las piezas de Acero.
