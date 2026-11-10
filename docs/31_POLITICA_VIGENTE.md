# Política vigente de ISA · contenidos, TIMSS y narrativa

**Estado:** vigente desde el 9/11/2026. Consolida los Documentos Maestros V1.1
(`TIMSS/Insumos/Proyecto Inicial/`) y las decisiones tomadas después, cuando esas
versiones quedaron desactualizadas. Ante contradicción con los V1.1, vale este documento.

## 1. Naturaleza de ISA

ISA es una plataforma comunitaria, abierta y no formal de exploración de patrimonio
submarino y desafíos STEM. No es escuela, institución acreditada, entidad certificadora,
empleador ni autoridad científica. No expide títulos, créditos, homologaciones ni
certificaciones profesionales.

ISA es **apta para todo público**. La referencia de 8.º grado indica únicamente el
conocimiento escolar necesario para responder las preguntas STEM (Ciencias y Matemática,
TIMSS 2011 grado 8); no es una restricción de edad ni define un público destinatario.

## 2. Narrativa no bélica (regla dura)

Se excluyen armamento, explosivos, munición, torpedos, lanzatorpedos, balística, tácticas
ofensivas, identificación de objetivos, combate, enemigos, entrenamiento militar y
glorificación del conflicto. Tampoco se admiten eufemismos.

**La exclusión alcanza a la guerra como contenido.** Aunque ISA hable de tripulantes de
submarinos, no se presentan hechos, operaciones, anécdotas ni historias de guerra —ni
siquiera como contexto histórico— para que no se interprete adhesión a esos temas. La
historia que se cuenta es civil, técnica, patrimonial o de vida a bordo.

Sustituciones aprobadas:

| En lugar de | Se usa |
|---|---|
| Combate, batalla, enemigo, actor hostil | Exploración, contingencia técnica, anomalía, condición ambiental, señal desconocida, desafío de seguridad |
| Vida o muerte, reactor colapsa | Continuidad segura de un sistema, lectura anómala, aumento de temperatura, pérdida de eficiencia, mantenimiento |
| Manual de combate | Guía de sistemas, códex de exploración, cuaderno técnico |
| Jefe de batalla | Coordinador de misión, responsable técnico, guía de museo, facilitador |
| Firma de combate | Huella física, comportamiento del sistema, ruido, vibración, temperatura, energía, señal |
| Sala de torpedos como contenido técnico | Compartimento histórico tratado desde patrimonio, seguridad y contexto, sin describir armamento |

## 3. Política de uso de TIMSS / IEA

- TIMSS es referencia curricular principal de Ciencias y Matemática de 8.º grado.
- Los ítems liberados de TIMSS 2011 se usan con fines educativos, no comerciales y de
  investigación, con reconocimiento de IEA (año y nombre de la publicación/ítem).
- Las actividades ISA son **originales** y se declaran "diseñadas con referencia a" un
  ítem TIMSS, nunca como ítems oficiales ni instrumentos equivalentes.
- No se reproduce el ítem ni se lo traduce literalmente; se adapta el concepto.
- Un ítem TIMSS no se relicencia como contenido ISA (no CC).
- Traducir o adaptar material de IEA requiere verificación de condiciones o autorización
  de IEA antes de publicar.
- ISA no administra TIMSS ni produce resultados psicométricamente equivalentes.

## 4. Temporadas y dominios cognitivos

| Temporada | Contenido | TIMSS |
|---|---|---|
| Acero | Recorrido patrimonial por compartimentos y sistemas | **No lleva preguntas TIMSS ni cita ítems** |
| Cobre | Grilla 5×5 de experiencias | **Sí: dominio cognitivo Knowing**, 60 preguntas sobre 67 referencias de TIMSS 2011 |
| Bronce | Futura, visible y bloqueada | Reserva ítems Applying de TIMSS 2011 |
| Plata | Futura, visible y bloqueada | Reserva ítems Reasoning de TIMSS 2011 |
| Oro | Futura, visible y bloqueada | Sin contenido definido |

Bronce, Plata y Oro no tienen actividades, matrícula ni acreditación hasta decisión
explícita. Los 111 ítems de TIMSS 2011 de dominio Applying/Reasoning quedan reservados.

**Estado del contenido (9/11/2026):** la plataforma parte sin contenido de ejemplo. Se
retiró el submarino-museo U-995 usado como muestra, junto con su episodio, sus misiones,
sus preguntas, sus insignias y su institución. La app arranca con temporadas,
disciplinas y roles, y el archivo de museos reales (159 fichas) para construir Acero y
Cobre desde los insumos aprobados.

## 5. Temporada Acero

Visita por compartimentos y sistemas. Cada episodio presenta un sistema real con
explicación funcional del guía/veterano. No hay pregunta TIMSS ni cita de ítem. El
objetivo es patrimonio, observación y orientación hacia Cobre.

## 6. Temporada Cobre

- Grilla 5×5: 5 especialidades × 5 dimensiones.
- Especialidades: MAQ Maquinista · ELE Electricista · ELN Electrónico · NAV Ingeniero
  Naval · LOG Logístico.
- Dimensiones: CIENCIA (SCI) · TECNOLOGÍA (TEC) · INGENIERÍA (ING) · MATEMÁTICA (MAT) ·
  **FACTOR HUMANO (HUM)**. La etiqueta "Humanidades y Artes" queda reemplazada por
  "Factor Humano".
- 20 celdas STEM (5 especialidades × 4 disciplinas) con **3 variantes de pregunta cada
  una** = 60 preguntas. Una pregunta por episodio; la variante se elige de forma
  determinista según el día (bucket ALFA/BRAVO/CHARLY). El banco solo etiqueta la
  variante; la asignación es implementación aparte.
- **Ribbon por celda**, no por pregunta. Completar la celda otorga el reconocimiento.
- **Cargado en la app (9/11/2026):** 20 experiencias (una por celda `MIS-COB-<DISC>-<ESP>`),
  60 preguntas (3 variantes por celda) y 20 ribbons con iconos provisorios en
  `public/images/badges/cobre/ribbons/`. La variante del episodio se elige por día con
  `lib/learning/variant.ts`: `bucket = dayNumber % 3` y
  `variante = (dayNumber + cellIndex) % 3`, con zona fija UTC-3. Sin azar en el cliente.
- Las preguntas son originales ISA, ancladas de forma no literal a una de las 67
  referencias. Una misma referencia puede inspirar preguntas de celdas distintas; una
  pregunta no se repite entre celdas.

## 7. Factor Humano

Es la definición civil de la vida a bordo: habilidades blandas, convivencia,
comunicación, descanso, inclusión, cuidado de la tripulación, y temas no STEM como
historia y patrimonio (por ejemplo, mujeres en submarinos), siempre **sin contenido
bélico**. Es una columna **libre de la grilla**, no una intersección especialidad ×
disciplina. Son **15 temas**, un episodio y una pregunta por tema, sin variantes y sin
ancla TIMSS. Cada afirmación histórica o patrimonial necesita fuente; lo que no tiene
fuente se marca como propuesta a revisar.

**Cargado en la app (10/11/2026):** 8 experiencias `MIS-AC-01`…`MIS-AC-07` y `MIS-AC-ESP`
(7 estaciones patrimoniales + episodio especial de propulsión nuclear), con 3 variantes de
pregunta de observación cada una y su ribbon de acero. No llevan TIMSS y no se usan nombres
de submarinos ni museos reales: la selección se hará con los museos voluntarios.

**Cargado en la app (9/11/2026):** 15 experiencias `MIS-FH-01`…`MIS-FH-15` con su
pregunta y su ribbon (iconos `ribbon-HUM-<especialidad>.png`), agrupadas en el episodio
`EPI-COB-FH`. Se listan en `/series` debajo de la grilla STEM.

## 8. Idioma, nivel y accesibilidad

- Español neutro e inglés en todo el contenido publicado (enunciados, opciones,
  feedback, guías). La localización adapta, no traduce literalmente.
- El contenido es **para todo público**. No se usa el campo "nivel"; lo que se declara es
  el **conocimiento previo requerido** para responder (Ciencias y Matemática de 8.º
  grado, TIMSS 2011), no una edad ni un público destinatario.
- Subtítulos, transcripción, contraste, alternativas textuales y reducción de movimiento
  son requisitos desde el MVP, no tareas diferidas.
- Privacidad: datos mínimos, sin biometría, sin perfilado comercial, sin proctoring.

## 9. Guion de episodio

El guion es una **guía de temas para el guía/veterano**, no un guion de respuestas: qué
sistema mostrar, qué contar, qué concepto tocar, qué observar y cómo cerrar el debrief.
Es única por celda o tema y sirve para cualquiera de las variantes de pregunta. Secuencia
de referencia: gancho 3–8 s · contexto patrimonial 15–60 s · decisión 5–15 s · explicación
del guía · actividad · debrief 15–45 s · reconocimiento simbólico.

## 10. Distinción de fuentes

Todo material debe diferenciar: hecho histórico documentado · testimonio · modelo o
simulación simplificada · actividad original ISA · material de terceros (incluido TIMSS).
La ficción del universo SNK se identifica como ficción y nunca se presenta como historia
ni como conocimiento validado.

## 11. Qué queda reemplazado de los documentos V1.1

- Acero ya no incluye pregunta STEM ni cita TIMSS.
- Cobre ya no es "25 experiencias con pregunta" sin estructura de variantes: son 20 celdas
  STEM × 3 variantes + 15 temas FH.
- "Humanidades y Artes" pasa a "Factor Humano".
- La secuencia de episodio se mantiene, pero el guion es guía de temas, no guion de
  respuestas.

## 12. Documentos de referencia

- `TIMSS/02.1.1_Banco_Reactivos_TIMSS_Conocimiento - Conocimiento.csv` (67 referencias,
  fuente de verdad).
- `TIMSS/Insumos/TIMSS2011_G8_Science.pdf` y `TIMSS2011_G8_Math.pdf` (ítems liberados).
- `TIMSS/Insumos/Sistemas Submarinos por Compartimentos…csv` (44 sistemas).
- `TIMSS/banco-preguntas/insumos/03_especialidades_sistemas.md` (mapa neutralizado).
- `docs/24_RECORRIDO_NIVELES.md`, `docs/25_CATALOGO_RECONOCIMIENTOS.md`,
  `docs/22_MODELO_DATOS_SHEET.md`, `docs/15_CONFIG_SHEET.md`.
