# ISA · Catálogo de reconocimientos (Acero y Cobre)

**Sesión:** S · Infraestructura de datos (continuación).
**Estado:** propuesta de catálogo. **No implementado.**
**Fecha:** 6 de noviembre de 2026.
**Alcance:** IDs, nombres en/es, assets, criterios y reglas de los reconocimientos de los Niveles 0 (Acero) y 1 (Cobre).
**Insumos:** `docs/24_RECORRIDO_NIVELES.md`, `TIMSS/curated/grid_mapping.csv`, `TIMSS/curated/GRID_MAPPING_REPORT.md`, `docs/22_MODELO_DATOS_SHEET.md`.

---

## 1. Principios

1. **Badges planos**: un `Badge` por reconocimiento. No hay jerarquía ni `parent_badge_id`.
2. **Una sola entidad** con `kind`: `ribbon`, `diploma` o `coin`.
3. **Persistidos vs. visuales**:
   - Persistidos con ID: 6 ribbons de Acero, 25 ribbons de Cobre y el Diploma de Acero.
   - Visuales/derivados: Coin Cobre, Coin de trayectoria STEM, Coin de trayectoria de especialidad y las coins por especialidad (opcionales).
   - Si una coin se quiere exportar o vender, se promueve a badge con ID propio en una fase posterior; no cambia el modelo.
4. **Sin texto en los assets**: los nombres van en los datos (en/es) para no regenerar imágenes al traducir.
5. **Un ribbon por celda**, no por reactivo: el banco de reactivos rota; el logro es de la celda.
6. **Acero no tiene rigor TIMSS**: sus preguntas son sobre el episodio y el compartimento.

---

## 2. Acero (Nivel 0)

**Assets:** `public/images/badges/acero/`

| ID | Nombre es | Nombre en | Asset | Motivo | Criterio |
|---|---|---|---|---|---|
| `RIB-AC-CONTROL` | `Visitante · Control y Comando` | `Visitor · Control and Command` | `ribbons/ribbon-AC-CONTROL.png` | Periscopio | Correcto en la pregunta del video de Control y Comando |
| `RIB-AC-MAQUINAS` | `Visitante · Sala de Máquinas` | `Visitor · Engine Room` | `ribbons/ribbon-AC-MAQUINAS.png` | Engranaje | Correcto en la pregunta de Sala de Máquinas |
| `RIB-AC-BATERIAS` | `Visitante · Baterías` | `Visitor · Batteries` | `ribbons/ribbon-AC-BATERIAS.png` | Batería | Correcto en la pregunta de Baterías |
| `RIB-AC-PROA` | `Visitante · Proa` | `Visitor · Bow` | `ribbons/ribbon-AC-PROA.png` | Proa/torpedo | Correcto en la pregunta de Proa |
| `RIB-AC-POPA` | `Visitante · Popa` | `Visitor · Stern` | `ribbons/ribbon-AC-POPA.png` | Hélice | Correcto en la pregunta de Popa |
| `RIB-AC-REACTOR` | `Visitante · Reactor Nuclear` | `Visitor · Nuclear Reactor` | `ribbons/ribbon-AC-REACTOR.png` | Radiación | Correcto en la pregunta del Reactor |
| `BADGE-ACERO-DIPLOMA` | `Diploma de Visitante Submarino` | `Submarine Visitor Diploma` | `badge-acero-diploma.png` | Diploma con 6 emblemas | 6/6 ribbons de Acero |

**Reglas de Acero:**

- Cada compartimento tiene un video; si hay banco, se elige **1 video al azar por compartimento**.
- La pregunta se responde al final del video; **no hay ítem TIMSS**.
- El Diploma se gana con **6/6**.
- La imagen compartible se compone después con nombre/apellido, nick de pez, fecha y el asset del Diploma; el asset no contiene datos personales.

---

## 3. Cobre (Nivel 1)

**Assets:** `public/images/badges/cobre/ribbons/` y `public/images/badges/cobre/coins/`
**Banco:** 100 reactivos mapeados en 25 celdas (ver `grid_mapping.csv`). Los 25 ribbons se ganan respondiendo **cualquier reactivo de la celda**; el reactivo se elige al azar y queda registrado como snapshot.

### 3.1 Ribbons de celda (25)

| ID | Nombre es | Nombre en | Disciplina | Especialidad | Ítem base (ejemplo) | Asset |
|---|---|---|---|---|---|---|
| `RIB-CU-SCI-MAQ` | `Ciencias · Termodinámica` | `Science · Thermodynamics` | Ciencias | Maquinista | `ISA-KNOW-011` | `ribbon-SCI-MAQ.png` |
| `RIB-CU-TEC-MAQ` | `Tecnología · Propulsión` | `Technology · Propulsion` | Tecnología | Maquinista | `ISA-KNOW-003` | `ribbon-TEC-MAQ.png` |
| `RIB-CU-ING-MAQ` | `Ingeniería · Sensores` | `Engineering · Sensors` | Ingeniería | Maquinista | `ISA-KNOW-012` | `ribbon-ING-MAQ.png` |
| `RIB-CU-MAT-MAQ` | `Matemática · Ecuaciones` | `Mathematics · Equations` | Matemática | Maquinista | `ISA-KNOW-013` | `ribbon-MAT-MAQ.png` |
| `RIB-CU-HUM-MAQ` | `Humanidades · Evolución` | `Humanities · Evolution` | Humanidades y Artes | Maquinista | `ISA-KNOW-014` | `ribbon-HUM-MAQ.png` |
| `RIB-CU-SCI-ELE` | `Ciencias · Baterías` | `Science · Batteries` | Ciencias | Electricista | `ISA-KNOW-007` | `ribbon-SCI-ELE.png` |
| `RIB-CU-TEC-ELE` | `Tecnología · Conductores` | `Technology · Conductors` | Tecnología | Electricista | `ISA-KNOW-015` | `ribbon-TEC-ELE.png` |
| `RIB-CU-ING-ELE` | `Ingeniería · Circuitos` | `Engineering · Circuits` | Ingeniería | Electricista | `ISA-KNOW-016` | `ribbon-ING-ELE.png` |
| `RIB-CU-MAT-ELE` | `Matemática · Álgebra` | `Mathematics · Algebra` | Matemática | Electricista | `ISA-KNOW-017` | `ribbon-MAT-ELE.png` |
| `RIB-CU-HUM-ELE` | `Humanidades · Física Nuclear` | `Humanities · Nuclear Physics` | Humanidades y Artes | Electricista | `ISA-KNOW-018` | `ribbon-HUM-ELE.png` |
| `RIB-CU-SCI-ELN` | `Ciencias · Sonar` | `Science · Sonar` | Ciencias | Electrónico | `ISA-KNOW-002` | `ribbon-SCI-ELN.png` |
| `RIB-CU-TEC-ELN` | `Tecnología · Óptica` | `Technology · Optics` | Tecnología | Electrónico | `ISA-KNOW-001` | `ribbon-TEC-ELN.png` |
| `RIB-CU-ING-ELN` | `Ingeniería · Corrosión` | `Engineering · Corrosion` | Ingeniería | Electrónico | `ISA-KNOW-020` | `ribbon-ING-ELN.png` |
| `RIB-CU-MAT-ELN` | `Matemática · Factores` | `Mathematics · Factors` | Matemática | Electrónico | `ISA-KNOW-021` | `ribbon-MAT-ELN.png` |
| `RIB-CU-HUM-ELN` | `Humanidades · Criptografía` | `Humanities · Cryptography` | Humanidades y Artes | Electrónico | `ISA-KNOW-022` | `ribbon-HUM-ELN.png` |
| `RIB-CU-SCI-NAV` | `Ciencias · Flotabilidad` | `Science · Buoyancy` | Ciencias | Naval | `ISA-KNOW-008` | `ribbon-SCI-NAV.png` |
| `RIB-CU-TEC-NAV` | `Tecnología · Firma Acústica` | `Technology · Acoustic Signature` | Tecnología | Naval | `ISA-KNOW-009` | `ribbon-TEC-NAV.png` |
| `RIB-CU-ING-NAV` | `Ingeniería · Presión` | `Engineering · Pressure` | Ingeniería | Naval | `ISA-KNOW-004` | `ribbon-ING-NAV.png` |
| `RIB-CU-MAT-NAV` | `Matemática · Medición` | `Mathematics · Measurement` | Matemática | Naval | `ISA-KNOW-005` | `ribbon-MAT-NAV.png` |
| `RIB-CU-HUM-NAV` | `Humanidades · Hidrodinámica` | `Humanities · Hydrodynamics` | Humanidades y Artes | Naval | `ISA-KNOW-023` | `ribbon-HUM-NAV.png` |
| `RIB-CU-SCI-LOG` | `Ciencias · Soporte Vital` | `Science · Life Support` | Ciencias | Logístico | `ISA-KNOW-024` | `ribbon-SCI-LOG.png` |
| `RIB-CU-TEC-LOG` | `Tecnología · Atmósfera` | `Technology · Atmosphere` | Tecnología | Logístico | `ISA-KNOW-006` | `ribbon-TEC-LOG.png` |
| `RIB-CU-ING-LOG` | `Ingeniería · Incendios` | `Engineering · Fire Safety` | Ingeniería | Logístico | `ISA-KNOW-010` | `ribbon-ING-LOG.png` |
| `RIB-CU-MAT-LOG` | `Matemática · Fracciones` | `Mathematics · Fractions` | Matemática | Logístico | `ISA-KNOW-049` | `ribbon-MAT-LOG.png` |
| `RIB-CU-HUM-LOG` | `Humanidades · Salud a Bordo` | `Humanities · Health on Board` | Humanidades y Artes | Logístico | `ISA-KNOW-025` | `ribbon-HUM-LOG.png` |

> Los nombres son **nombres de trabajo**. Los nombres fantasía definitivos se definen más adelante; el `RIB-*` no cambia.
> Las traducciones al inglés son propuestas sujetas a revisión.

### 3.2 Capas de agrupación

| ID | Nombre es | Nombre en | Criterio | Asset | Estado |
|---|---|---|---|---|---|
| `COIN-COBRE` | `Coin Cobre` | `Copper Coin` | 25/25 celdas | `coins/coin-cobre.png` | Visual |
| `COIN-COBRE-STEM` | `Coin Trayectoria STEM` | `STEM Pathway Coin` | 5/5 disciplinas | `coins/coin-trayectoria-stem.png` | Visual |
| `COIN-COBRE-ESPECIALIDAD` | `Coin Trayectoria Especialidad` | `Specialty Pathway Coin` | 5/5 especialidades | `coins/coin-trayectoria-especialidad.png` | Visual |
| `COIN-COBRE-MAQ` | `Coin Cobre · Maquinista` | `Copper Coin · Machinist` | 5/5 celdas de Maquinista | `coins/coin-cobre-maq.png` | Opcional |
| `COIN-COBRE-ELE` | `Coin Cobre · Electricista` | `Copper Coin · Electrician` | 5/5 celdas de Electricista | `coins/coin-cobre-ele.png` | Opcional |
| `COIN-COBRE-ELN` | `Coin Cobre · Electrónico` | `Copper Coin · Electronics Technician` | 5/5 celdas de Electrónico | `coins/coin-cobre-eln.png` | Opcional |
| `COIN-COBRE-NAV` | `Coin Cobre · Naval` | `Copper Coin · Naval Officer` | 5/5 celdas de Naval | `coins/coin-cobre-nav.png` | Opcional |
| `COIN-COBRE-LOG` | `Coin Cobre · Logístico` | `Copper Coin · Logistics` | 5/5 celdas de Logístico | `coins/coin-cobre-log.png` | Opcional |

---

## 4. Reglas de otorgamiento

| Reconocimiento | Regla | Persistido |
|---|---|---|
| Ribbon de compartimento Acero | Responder bien la pregunta del video del compartimento | Sí |
| Diploma Acero | 6/6 ribbons de Acero | Sí |
| Ribbon de celda Cobre | Responder bien cualquier reactivo de la celda | Sí |
| Coin Cobre | 25/25 celdas | Visual |
| Coin Trayectoria STEM | 5/5 disciplinas | Visual |
| Coin Trayectoria Especialidad | 5/5 especialidades | Visual |
| Coin por especialidad (opcional) | 5/5 celdas de esa especialidad | Visual |

### 4.1 Reactivo aleatorio en Cobre

- Cada celda tiene un banco de **1 a 9 reactivos** (100 en total).
- Se elige **1 al azar por aprendiz y celda**; la elección se guarda localmente.
- Si falla, puede reintentar y se **re-sortea** el reactivo.
- Al acertar, se otorga el **ribbon de la celda**; el reactivo usado queda registrado en la credencial como snapshot.
- El banco no se revela.
- No se otorgan ribbons por reactivo individual.

### 4.2 Acero aleatorio

- Cada compartimento puede tener más de un video; se elige **1 al azar** por compartimento.
- La elección se guarda localmente.
- Al responder bien, se otorga el ribbon del compartimento.

---

## 5. Assets

### Cobre

| Grupo | Ruta | Cantidad | Formato |
|---|---|---:|---|
| Ribbons | `public/images/badges/cobre/ribbons/ribbon-<DISC>-<ESP>.png` | 25 | PNG 512×512, transparente |
| Coin Cobre | `public/images/badges/cobre/coins/coin-cobre.png` | 1 | PNG 512×512 |
| Coins de trayectoria | `public/images/badges/cobre/coins/coin-trayectoria-*.png` | 2 | PNG 512×512 |
| Coins de especialidad | `public/images/badges/cobre/coins/coin-cobre-<esp>.png` | 5 | PNG 512×512 |
| Manifiesto | `public/images/badges/cobre/manifest.json` | 1 | JSON |

### Acero

| Grupo | Ruta | Cantidad | Formato |
|---|---|---:|---|
| Ribbons | `public/images/badges/acero/ribbons/ribbon-AC-<COMP>.png` | 6 | PNG 512×512, transparente |
| Diploma | `public/images/badges/acero/badge-acero-diploma.png` | 1 | PNG 900×640 |
| Manifiesto | `public/images/badges/acero/manifest.json` | 1 | JSON |

### Vistas previas

- `docs/assets/acero_assets_preview.png`
- `docs/assets/cobre_assets_preview.png`

Los assets **no contienen texto** salvo los emblemas. El nombre, apellido, nick y fecha se componen en la imagen compartible o en el PDF futuro.

---

## 6. Campos propuestos del modelo

```text
Badge
  id                 RIB-AC-… | RIB-CU-… | BADGE-ACERO-DIPLOMA | COIN-…
  kind               ribbon | diploma | coin
  name_es / name_en
  description_es / description_en (opcional)
  season_id          ACERO | COBRE
  level_number       0 | 1
  discipline_id      SCI | TEC | ING | MAT | HUM (Cobre; null en Acero)
  specialty_id       MAQ | ELE | ELN | NAV | LOG (Acero: null)
  topic_id           tema del catálogo (Cobre; null en Acero)
  compartment_id     (Acero)
  item_id            ítem base de referencia (Cobre)
  image              ruta del asset
  criteria_es / criteria_en
  rule_type          compartment-complete | cell-complete | season-complete | grid-complete | discipline-complete | specialty-complete
  rule_count         (cuando aplique)
  status             draft | published | archived
  store_sku          (futuro, solo coins)
```

Sin `parent_badge_id`. Las agrupaciones se calculan por `season_id`, `discipline_id`, `specialty_id` y `rule_type`.

---

## 7. Pendientes antes de publicar

1. **Nombres fantasía** definitivos (los actuales son de trabajo).
2. **Revisión de traducciones** en/es.
3. **Revisión humana del mapeo**: 8 ítems `revisar` y 39 de confianza media (`GRID_MAPPING_REPORT.md`).
4. **Celdas flacas**: `MAT×LOG` (1 ítem) y `HUM×ELE` (1 ítem); sumar al menos 1–2 reactivos a cada una antes de publicar el azar.
5. **Definir si las coins se persisten/exportan** o quedan visuales. Si se venden o guardan en mochila, se promueven a badges con ID.
6. **Definir modo de azar**: fijo por aprendiz/celda vs. re-sorteo por intento (recomendado: fijo, con re-sorteo solo al fallar).
7. **Quinta disciplina**: confirmar si “Humanidades y Artes” se queda o se reemplaza por una STEM pura.
8. **Numeración pública de Acero**: Temporada 0 o “especial”.
9. **Acero sin TIMSS**: confirmar que sus preguntas no llevan dominio TIMSS (el banco actual es todo Cobre/Knowing).
10. **Assets de Acero**: revisar que los 6 motivos (periscopio, engranaje, batería, proa, hélice, radiación) representen bien cada compartimento.

---

## 8. Verificación y límites

**Comprobado:**

- Existen los 25 ribbons de Cobre y los 6 de Acero (33 PNG) en `public/images/badges/`.
- Existen los manifiestos JSON con IDs, colores, iconos y rutas relativas.
- Los IDs de Cobre se corresponden con las 25 celdas del `grid_mapping.csv`.
- Los 25 ítems base elegidos existen en el banco curado (100 filas).
- Las imágenes no contienen datos personales.

**No verificado:**

- Calidad pedagógica de cada ítem y de los distractores.
- Que cada tema sea el definitivo para su celda.
- Que el asset sea el diseño final; son piezas base para iterar.
- Que la app consuma ya estos assets: **no hay integración de código** en esta etapa.

**Este documento no implementa nada**: no modifica la app, no crea pantallas y no hace commit.
