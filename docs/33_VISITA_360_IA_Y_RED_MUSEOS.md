# ISA — Visita 360 con IA y red de museos colaboradores

Documento de trabajo. **No implementado.** Fecha: 10/11/2026.

## 1. Idea

Llevar Acero y Cobre a una experiencia inmersiva: **recorridos 360°** con un
**guía veterano generado con IA** que explica cada espacio, mientras el visitante
suma piezas a su submarino. Mientras no haya museos colaboradores, Acero y Cobre se
producen con **IA a partir de imágenes reales** de submarinos museo.

## 2. Pipeline recomendado (híbrido, no “todo IA”)

La generación 100% texto→video 360 todavía tiene problemas de costuras, coherencia
temporal y exactitud histórica. Para un producto educativo conviene un híbrido:

1. **Captura real:** fotos 360° (equirectangulares) o fotos comunes de cada
   compartimento, del museo o del video de la playlist (con permiso).
2. **Reconstrucción:** fotogrametría / gaussian splatting (Polycam, Luma,
   RealityCapture) o limpieza y outpainting 360° con IA (Stable Diffusion 360,
   Blockade Labs/Skybox) para completar lo que falta.
3. **Movimiento:** cámara virtual con recorrido suave sobre la escena reconstruida
   (o video 360 renderizado). Evitar paneos rápidos: producen mareo.
4. **Guion:** se escribe desde las fichas de estaciones y las preguntas ya aprobadas.
5. **Voz IA:** TTS con voz sintética (ElevenLabs u otra) o clonación **solo con
   consentimiento escrito** de un veterano real.
6. **Guía IA:** avatar 2D/3D superpuesto como ventana de video o solo voz +
   subtítulos. Etiquetado visible: **“Guía generado con IA · recreación”**.
7. **Post:** montaje, subtítulos ES/EN, transcripción, audio espacial, exportación
   4K equirectangular.
8. **QA:** exactitud histórica, ausencia de contenido bélico, accesibilidad,
   artefactos visuales, peso y tiempos de carga.

### Reglas de la guía IA

- Personaje **ficticio compuesto** (no la cara ni la voz de un veterano real sin
  consentimiento).
- Si un veterano real quiere participar: guion propio, consentimiento de imagen y
  voz, derecho a retirar el material.
- Nunca presentar la recreación como registro documental. La distinción
  ficción/historia de ISA se mantiene.
- Sin explicaciones de armas, explosivos ni intención bélica.

## 3. Integración técnica

| Opción | Qué permite | Costo / riesgo |
|---|---|---|
| **A. 360° como imagen + hotspots** | MVP rápido: Pannellum o visor propio, sin dependencias pesadas | Menos inmersivo |
| **B. Video 360 propio** | `three.js` con `VideoTexture` o A-Frame; control total y sin YouTube | Dependencia nueva y assets pesados (4K 360 ≈ 200–400 MB/min) |
| **C. YouTube 360 embebido** | Video 360 sin alojar; reproductor conocido | Depende de YouTube, cookies y disponibilidad |

Recomendación: **A para el MVP**, **B cuando haya presupuesto de media**, C solo
para prototipos internos. Requiere autorización de dependencia para B.

Accesibilidad: subtítulos, transcripción, versión 2D con stills, navegación por
teclado, opción “reducir movimiento”, aviso de vértigo.

## 4. Mínimo viable (sin museos colaboradores)

- **2 pilotos IA:** una estación de Acero (Puesto central) y un sistema de Cobre
  (periscopio o sonar).
- Formato: 360° **imagen** con hotspots + guía IA en audio/subtítulos, 60–90 s.
- Etiquetado “recreación digital con IA”.
- Medir: tiempo de carga, abandono, comprensión, opinión de betatesters.
- Si funciona: producir las 7 estaciones de Acero y los 20 sistemas de Cobre.

## 5. Estructura de máxima: todos los museos quieren colaborar

Modelo **federado**: ISA centraliza estándares, plataforma y credenciales; cada museo
aporta su submarino, su material y su validación.

### Capas

1. **Contenido:** Institution → Museum → Vessel → Compartment/System → Station/Episode.
2. **Derechos:** acuerdo marco (MoU) con licencia de uso de imágenes, video, 360,
   textos y datos; crédito obligatorio; vigencia y revocación.
3. **Kit de captura:** guía de fotos/video/360, checklist de iluminación, audio,
   metadata mínima y formulario de consentimiento para veteranos.
4. **Producción:** dos carriles: museo con material propio (curado por ISA) e ISA
   con IA a partir de material autorizado.
5. **QA editorial:** revisión del museo + comité ISA (rigor histórico, regla no
   bélica, accesibilidad, exactitud de sistemas).
6. **Plataforma:** administración multi-museo, carga de assets, estados de
   publicación, versiones, analítica y API pública de catálogo.
7. **Credenciales:** badges y credenciales Open Badges 3.0 firmadas; validación
   académica y registro.
8. **Gobernanza:** consejo de museos (prioridades y cupos), comité editorial,
   registro de consentimientos, política de IA y de derechos.
9. **Crecimiento:** catálogo público de museos, buscador por país/tipo de casco,
   programa de voluntarios, métricas de impacto.

### Roles mínimos cuando escala

| Rol | Función |
|---|---|
| Enlace de museo | Aporta material, valida contenido, firma derechos |
| Editor de contenido | Adapta a la política ISA y al formato de estación |
| Verificador histórico | Contrasta fuentes y fechas |
| Productor de media | Captura, reconstruye, edita 360/video/audio |
| Localización | ES/EN y subtítulos |
| QA técnico | Peso, reproductor, dispositivos, accesibilidad |
| Operaciones de plataforma | Publicación, catálogo, incidentes |
| Comité editorial | Aprueba, prioriza y resuelve conflictos |

### Embudo de incorporación de un museo

1. Expresión de interés → 2. Acuerdo y derechos → 3. Kit de captura → 4. Ingesta de
material → 5. Adaptación editorial → 6. QA del museo + ISA → 7. Publicación y crédito
→ 8. Métricas y actualizaciones.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| IA históricamente incorrecta | Fuente real + QA humano + etiqueta de recreación |
| Costuras y artefactos 360 | Híbrido con fotos reales; planos largos y estables |
| Peso y rendimiento | 4K adaptativo, streaming, fallback 2D, precarga por estación |
| Mareo | Movimiento lento, sin giros bruscos, botón de pausa, opción 2D |
| Derechos de imagen/voz | MoU, consentimientos, crédito, revocación |
| Suplantación de veteranos | Guía ficticio; real solo con consentimiento explícito |
| Contenido bélico | Regla editorial + QA + lista de términos prohibidos |
| Dependencia de terceros | Preferir assets propios; YouTube solo para prototipo |

## 7. Decisiones pendientes

- ¿Aprobamos el MVP de 2 pilotos 360 con IA (imagen + guía IA) antes de los videos?
- ¿La guía es un personaje ficticio o buscamos un veterano real con consentimiento?
- ¿Autorizamos la dependencia de un visor 360 (Pannellum o three.js) cuando toque?
- ¿Qué museo será el primero en el acuerdo marco?
