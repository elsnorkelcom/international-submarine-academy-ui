# ISA · Guía de uso y QA de reconocimientos

**Estado:** PROPUESTA pendiente de revisión del usuario.
**Fecha:** 10/11/2026.
**Insumos:** todos los documentos de la sesión de arte (`docs/33` a `docs/38`).

---

## 1. Dónde se usa cada badge

| Pieza | Uso principal | Pantalla | Tamaño |
|---|---|---|---|
| Ribbon de celda STEM | Logro de una celda completada | `/series` (grilla), `/profile` | 128 / 256 px |
| Ribbon de Factor Humano | Logro de un tema completado | `/series` (lista FH), `/profile` | 128 / 256 px |
| Coin de especialidad | Ruta de especialidad completa | `/profile` | 256 px |
| Coin STEM | Trayectoria STEM completa | `/profile` | 256 px |
| Coin integral | Temporada completa | `/profile`, Home | 512 px |
| Coin de patrimonio | Recorrido patrimonial | `/profile` | 256 px |
| Coin comunitaria | Aporte a la comunidad | `/profile` | 256 px |
| Credencial | Recorrido completo | `/profile` | 512 px |
| Momento de desbloqueo | Animación al ganar | `/episodes` | 512 px |

**Regla:** el asset de interfaz es el **`small`** (128/256). El **`full`** (1024) se usa
solo en el momento de desbloqueo y en la vista de detalle.

---

## 2. Fondos permitidos

| Fondo | Estado | Motivo |
|---|---|---|
| Oscuro neutro `#0A0A0A` | ✅ **Preferido** | Único con AA en los 20 pares |
| Oscuro cálido `#141210` | ✅ | Alternativa para Cobre/Bronce |
| Metal de la temporada | ⚠️ Solo con contorno | Contraste 1,01–2,20 con la disciplina |
| Blanco `#FFFFFF` | ❌ **Prohibido** | Ningún metal pasa 4,5:1 |
| Claro `#F5F5F5` | ❌ **Prohibido** | Ídem |
| Fotográfico / texturado | ❌ | Rompe la consistencia |

**Consecuencia práctica:** la app tiene fondo oscuro. **El badge nunca se coloca sobre
una tarjeta clara.** Si en el futuro se agrega modo claro, **hay que rediseñar la relación
color/fondo**, no solo invertir.

---

## 3. Tamaños y reglas de reducción

| Tamaño | Uso | Sobrevive | Se simplifica |
|---:|---|---|---|
| 1024 | Master | Todo | — |
| 512 | Detalle / desbloqueo | Todo | — |
| 256 | Perfil | Símbolo, código, muesca | Textura |
| 128 | Grilla de colección | Símbolo, código | Textura, puntos de temporada |
| 64 | Listas | Símbolo, color | Código → tooltip |
| 32 | Inline | Silueta del símbolo | Todo lo demás |

**Regla dura:** si el símbolo no se reconoce **en negro puro a 32 px**, el símbolo se
rediseña. No se "simplifica" agregando elementos.

---

## 4. Sistema de alt-text

Regla completa en `docs/33_BRIEF_DIRECCION_ARTE.md` §8. Resumen operativo:

**Estructura:** `[Tipo] de [contenido] · [temporada]` + qué muestra el símbolo.

| Pieza | Alt-text (es) | Alt-text (en) |
|---|---|---|
| Ribbon SCI×MAQ | `Ribbon circular de cobre con gota esmaltada en cian y engranaje` | `Copper circular ribbon with a cyan-enamelled drop and a gear` |
| Ribbon TEC×LOG | `Ribbon de cobre con nodo verde esmaltado y rosa de los vientos` | `Copper ribbon with a green-enamelled node and a compass rose` |
| Coin integral | `Moneda de cobre patinado con retícula 5×5 y onda perimetral` | `Patina copper coin with a 5×5 grid and a perimeter wave` |
| Coin Acero | `Moneda de acero satinado sin color de disciplina` | `Satin steel coin with no discipline colour` |

**Prohibido en el alt:** las palabras *medalla, condecoración, insignia, certificado,
oficial, premio*, y verbos de felicitación.

**Verificación:** el alt debe permitir entender la pieza **sin verla y sin leer el
nombre**. Si no, está mal escrito.

---

## 5. Checklist de QA

### 5.1 Por pieza (antes de publicar)

| ✔ | Control | Criterio |
|---|---|---|
| ☐ | **No bélico** | Sin armas, torpedos, explosivos, insignias militares, banderas, condecoraciones, ni guerra como contexto |
| ☐ | **No certificación** | Sin sellos, firmas, numeración serial, ni palabras de certificación |
| ☐ | **No copia** | No reproduce ninguna moneda, emblema, logo o medalla existente |
| ☐ | **Legible a 32 px** | Símbolo reconocible en negro puro |
| ☐ | **Legible a 256 px** | Sin detalle que se pierda o ensucie |
| ☐ | **Contraste** | Pares verificados en `docs/35` §2; sin fondo claro |
| ☐ | **No depende del color** | Código + forma + textura presentes |
| ☐ | **Alt-text** | Escrito, correcto y sin palabras prohibidas |
| ☐ | **Sin texto en el asset** | El anillo está vacío; el lettering va aparte |
| ☐ | **Consistencia de temporada** | Mismo acabado que el resto de su temporada |
| ☐ | **Consistencia de caras** | Anverso común idéntico; reverso con el contenido correcto |
| ☐ | **Geometría** | Respetá la retícula de `docs/34` §2; márgenes de seguridad |
| ☐ | **Nomenclatura** | Archivo según convención `badge-<TEMP>-<TIPO>-<CODIGO>` |

### 5.2 Por temporada (antes de cerrar una temporada)

| ✔ | Control |
|---|---|
| ☐ | Las 5 disciplinas se distinguen entre sí **sin color** |
| ☐ | Las 5 especialidades se distinguen entre sí **sin color** |
| ☐ | El anverso es idéntico en estructura en todas las piezas |
| ☐ | Los puntos de temporada son correctos (Acero 1 … Oro 5) |
| ☐ | Acero **no** tiene color de disciplina |
| ☐ | Los acabados son coherentes con la tabla de `docs/35` §6 |

### 5.3 Por familia completa

| ✔ | Control |
|---|---|
| ☐ | 35 ribbons (20 STEM + 15 FH) |
| ☐ | 8 coins de ruta |
| ☐ | 2 coins especiales + 1 credencial |
| ☐ | El lettering está en los 2 idiomas previstos |
| ☐ | Todos los alt-text escritos |

---

## 6. Consistencia entre temporadas

La prueba definitiva: **poner las 5 temporadas lado a lado y ver si parecen una familia.**

| Aspecto | Debe ser igual | Debe cambiar |
|---|---|---|
| Geometría | ✅ Idéntica | — |
| Estructura de anverso | ✅ Idéntica | Solo el metal |
| Posición de símbolo | ✅ Idéntica | — |
| Ángulo de disciplina | ✅ Idéntico | — |
| Familia de forma de icono | ✅ Idéntica por disciplina | — |
| **Metal** | — | ✅ Cambia por temporada |
| **Color de disciplina** | — | ✅ Cambia (mezcla con el metal) |
| **Acabado** | — | ✅ Cambia (según `docs/35` §6) |
| Cantidad de puntos | — | ✅ Cambia (1 a 5) |

**Señal de alarma:** si una pieza de Oro se ve "igual de sobria" que una de Acero, o si
una de Acero tiene color de disciplina, el sistema falló.

---

## 7. Riesgos abiertos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| 1 | **15 temas FH sin definir** | Bloquea 15 de 35 ribbons | Conseguir la lista de temas y fuentes |
| 2 | **Modelo de celdas en conflicto** | Los 25 assets actuales son obsoletos | Confirmar modelo 20+15 y regenerar |
| 3 | **Motivo "Proa/torpedo"** | Viola regla dura | Reemplazar por hidrodinámica |
| 4 | **Rampa de especialidad insuficiente** | Especialidad no identificable | Símbolo + código obligatorios |
| 5 | **Matemática sobre Plata (1,05:1)** | Pieza ilegible | Inversión de campo + contorno |
| 6 | **Hex provisionales** | Todos los contrastes pueden cambiar | Recomputar si cambia `palette.json` |
| 7 | **Titularidad del escudo** | Riesgo de derechos | Confirmar con el usuario |
| 8 | **Prompts sin validar** | Salida real desconocida | Probar y ajustar empíricamente |
| 9 | **Modelos no respetan hex** | Color de imagen ≠ color de sistema | Usar prompts como concepto, no como color final |

---

## 8. Lo que NO debe hacerse

1. **Publicar una imagen generada por IA** como asset final.
2. **Poner el badge sobre fondo claro.**
3. **Pedir texto al modelo de imágenes.**
4. **Usar el paso metálico como único identificador de especialidad.**
5. **Reutilizar los 25 ribbons actuales** sin corregir el modelo de celdas.
6. **Presentar la coin o la credencial como certificación.**
7. **Copiar una moneda o medalla real** como referencia de forma.
8. **Producir físicamente** sin consulta previa a taller.

---

## 9. Verificación y límites

**Comprobado:**

- Los umbrales de contraste citados provienen del cálculo de `docs/35` §2 (script sobre
  `palette.json`).
- La regla de fondos se deriva de los 5 ratios de metal contra blanco (1,71–3,79).
- Los tamaños coinciden con `docs/34` §3.

**No comprobado:**

- Que la app consuma ya badges de ruta: a la fecha solo existen los 35 ribbons de Cobre.
- Que existan pantallas de perfil preparadas para coins de ruta.
- Que el checklist se haya aplicado a algún asset real (no se produjo arte en esta sesión).

**Limitaciones:**

- Guía de **proceso**, no certificación de calidad de piezas producidas.
- No modifica la app, no crea assets, no hace commit.
