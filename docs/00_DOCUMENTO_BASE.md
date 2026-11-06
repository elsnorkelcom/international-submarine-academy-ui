# ISA — DOCUMENTO BASE DEL PROYECTO
## Plataforma International Submarine Academy
### Versión 1.1 reconciliada — referencia canónica de producto

**Fecha:** 5 de noviembre de 2026  
**Audiencia:** equipo de desarrollo, agentes IA, colaboradores y stakeholders  
**Estado:** documento base de producto. No autoriza por sí solo cambios de arquitectura, autenticación, despliegue ni contenido educativo.

---

## 0. Cómo leer este documento

Este documento ordena la intención del proyecto y la contrasta con el estado verificable del repositorio.

Los estados se interpretan así:

- **Vigente:** comprobado en el código, la configuración o los archivos actuales.
- **Objetivo:** decisión o dirección de producto expresada por el equipo; todavía puede requerir implementación.
- **Propuesta pendiente:** requiere fuentes, responsables, autorización o una decisión técnica adicional.
- **Fixture/demo:** contenido local de evaluación que no debe presentarse como dato institucional, histórico o educativo aprobado.
- **Conflicto a resolver:** la intención del documento y el sistema actual no coinciden; no se debe ocultar ni resolver por iniciativa propia.

### Jerarquía de referencia

1. Las instrucciones directas y decisiones explícitas del usuario.
2. Este documento para la intención y el alcance de producto.
3. `AGENTS.md` para las reglas operativas de los agentes y el estado técnico comprobado.
4. El código y los datos actuales para determinar qué está realmente implementado.
5. Las propuestas y decisiones pendientes, que no deben describirse como implementadas.

Este documento complementa, pero no reemplaza, la documentación técnica, de datos, de propiedad intelectual ni de gobernanza que el proyecto deberá incorporar.

---

## 1. Propósito

ISA debe convertirse progresivamente en una plataforma educativa con formato de serie transmedia que conecte patrimonio submarino, museos, veteranos, ciencia, tecnología, ingeniería, matemática, artes y humanidades.

El documento sirve para:

- orientar el desarrollo y la curaduría;
- preservar la continuidad de lo ya construido;
- distinguir intención, implementación y deuda pendiente;
- permitir que nuevos colaboradores y agentes IA trabajen con el mismo contexto;
- evaluar si cada cambio aumenta claridad, trazabilidad, accesibilidad y confianza.

---

## 2. Qué es ISA

ISA — *International Submarine Academy* — es una plataforma educativa transmedia que organiza recorridos breves, narrativos y verificables alrededor de submarinos museo, sistemas submarinos, historia naval y aprendizaje STEM+A.

La experiencia puede combinar:

- episodios y temporadas;
- objetos, compartimentos y sistemas submarinos;
- misiones y reactivos educativos;
- cápsulas históricas;
- vínculos con museos y contextos reales;
- propuestas de contenidos o alianzas;
- credenciales visuales o Coins como mecanismo de avance.

La ficción narrativa puede inspirarse en lugares, objetos, personas y conocimientos reales, pero cada pieza debe indicar qué es ficción, qué es contexto histórico y qué fue verificado. La narrativa no constituye por sí sola aval de un museo, asociación, veterano, institución educativa ni organismo internacional.

La premisa narrativa propuesta es:

> “Todo lo que ves es ficción. Pero hay mucho por descubrir.”

Esta premisa requiere un sistema editorial claro para evitar que una dramatización se confunda con un hecho documentado.

---

## 3. Decisión estratégica: continuidad progresiva

ISA no se reconstruye desde cero descartando lo existente.

La dirección de producto es:

- conservar la continuidad de contenidos, rutas, episodios, museos, reactivos y aprendizajes que estén validados;
- reorganizar la arquitectura para hacerla más clara, segura, escalable y sostenible;
- migrar los contenidos de forma gradual;
- no arrastrar limitaciones técnicas innecesarias;
- mantener separados los fixtures de evaluación de los contenidos aprobados.

Principio de trabajo:

> “Conservamos el conocimiento acumulado, no las limitaciones del prototipo.”

La migración no convierte automáticamente contenido previo en contenido aprobado. Cada registro debe conservar origen, estado, responsable y autorización.

---

## 4. Usuarios prioritarios

El primer público del MVP no es el público general. La prioridad es que organizaciones e individuos con conocimiento situado comprendan el proyecto, evalúen la experiencia y decidan si desean participar.

Públicos prioritarios:

- asociaciones de submarinistas;
- Submarinos Museos y museos navales o científicos;
- veteranos y familias;
- docentes y educadores;
- aliados tecnológicos, culturales y educativos.

El acceso del público general es una etapa posterior y requiere una decisión de publicación, gobernanza, derechos y soporte.

---

## 5. Objetivos del MVP

La experiencia debe permitir que una persona invitada:

1. comprenda qué es ISA en menos de cinco minutos;
2. vea el trial de la serie;
3. explore la relación entre ISA, Submarinos Museos y congresos submarinistas;
4. pruebe una demo educativa funcional;
5. comprenda el vínculo propuesto con museos reales sin confundirlo con una alianza confirmada;
6. conozca cómo proponer un museo, reactivo, contenido o colaboración;
7. participe sin conocimientos técnicos previos;
8. identifique con claridad qué está listo, qué es propuesta y qué requiere revisión.

### Estado actual comprobado

La Home actual presenta una serie vertical con acceso de evaluación, temporadas, episodios, progreso de catálogo y una experiencia Acero/Cobre local. La demo y su progreso son fixtures de evaluación; no representan todavía una plataforma multiinstitución ni un sistema de métricas institucionales.

---

## 6. Principios de diseño y gobernanza

| Principio | Aplicación | Estado |
|---|---|---|
| Continuidad | Conservar contenidos, rutas y aprendizajes validados. | Objetivo vigente |
| Simplicidad | Priorizar claridad antes que complejidad técnica. | Objetivo vigente |
| Mobile first | Diseñar primero para pantalla vertical y móvil. | Objetivo vigente; UI responsive existente |
| Accesibilidad | Textos legibles, foco, navegación simple y contraste adecuado. | Objetivo; revisar continuamente |
| Transparencia | Diferenciar ficción, historia, propuesta y conocimiento validado. | Regla obligatoria |
| Respeto | Proteger memoria, veteranos, museos y comunidades. | Regla obligatoria |
| Ampliabilidad | Sumar museos, episodios y reactivos sin rediseñar todo. | Objetivo |
| Trazabilidad | Registrar origen, autorización, estado y cambios. | Objetivo; curaduría parcial existente |
| Privacidad | No recolectar datos personales sin requisitos, base legal y revisión. | Regla obligatoria |
| No equivalencia automática | No presentar contenidos como TIMSS oficial, acreditación o aval sin validación. | Regla obligatoria |

---

## 7. Experiencia central

Cada episodio debe ser una puerta de entrada autónoma. No debe existir un recorrido lineal obligatorio para comprender la propuesta.

Un episodio puede cerrar con dos o tres rutas, según el contenido:

- seguir al personaje;
- conocer el museo o contexto real;
- realizar una misión;
- obtener una credencial o Coin visual;
- descubrir una cápsula histórica;
- proponer un contenido o museo.

Las rutas son una decisión de experiencia, no una promesa de que todos los contenidos o museos ya estén disponibles.

---

## 8. Demo prioritaria

La demo prioritaria conserva el universo Acero/Cobre existente, pero debe mantenerse identificada como experiencia de evaluación hasta que el contenido sea revisado.

### Acero 04 — Comando del Submarino

- **Escenario narrativo:** sala de mando del U-995.
- **Equipo:** periscopio.
- **Objetivo propuesto:** reconocer la función del periscopio.
- **Personaje:** Pez Luna.
- **Resultado visual propuesto:** Credencial de Expedición Submarina.
- **Estado técnico:** fixture/demo local implementado parcialmente.
- **Estado editorial:** requiere verificación de fuentes, contexto y permisos.

### Cobre — Periscopio y observación astronómica

- **Escenario narrativo:** activación de la credencial.
- **Objetivo propuesto:** aplicar el periscopio a una observación astronómica.
- **Desafío:** reactivo educativo de dominio *Knowing* propuesto.
- **Resultado visual propuesto:** Coin Cobre.
- **Estado técnico:** estructura local preparada.
- **Estado editorial:** pendiente de revisión pedagógica, fuente y relación con TIMSS.

Una Coin o credencial no debe presentarse como certificación, acreditación ni reconocimiento institucional hasta que exista una decisión formal de gobernanza.

---

## 9. Modelo educativo y de contenido

Cada contenido candidato debe poder vincularse, cuando corresponda, con:

- un compartimento;
- un equipo o sistema submarino;
- un área curricular;
- un dominio TIMSS;
- una competencia GSA, si existe una fuente y criterio aprobados;
- un vínculo comprensible con la sociedad civil;
- un museo o contexto real;
- una fuente, autorización, responsable y estado editorial.

Estos campos son un modelo de trabajo. No prueban por sí solos equivalencia curricular, pertenencia a TIMSS, validación GSA, aval UNESCO ni autorización de un museo.

### Progresión propuesta

| Nivel | Énfasis | TIMSS propuesto | GSA propuesto | Estado |
|---|---|---|---|---|
| Acero | Descubrir | Knowing | Curiosidad y observación | Propuesta de producto |
| Cobre | Comprender | Knowing | Pensamiento crítico inicial | Propuesta de producto |
| Bronce | Aplicar | Applying | Resolución de problemas y creatividad | Futuro / pendiente |
| Plata | Colaborar y decidir | Reasoning | Colaboración y comunicación | Futuro / pendiente |
| Oro | Proponer y transformar | Integración | Ciudadanía global y proyecto comunitario | Futuro / pendiente |

No se deben construir afirmaciones de equivalencia o certificación basadas únicamente en esta tabla.

### Vínculo con la sociedad civil

Cada principio técnico debería conectarse con la vida cotidiana cuando exista un vínculo pedagógico claro. Ejemplos propuestos:

- periscopio: cámaras de inspección, endoscopios y visión en esquinas;
- flotabilidad: salvavidas y sistemas de flotación;
- presión del aire: infladores, neumáticos y herramientas;
- energía y baterías: paneles solares, almacenamiento y respaldo eléctrico;
- sonar: ecógrafos, sensores de estacionamiento y ultrasonido médico;
- comunicaciones: radios comunitarias y comunicaciones de emergencia.

Estos ejemplos son propuestas didácticas y requieren revisión de exactitud, edad, contexto y fuente.

---

## 10. Acceso institucional

### Objetivo de producto

La plataforma debería evolucionar desde un acceso de evaluación hacia claves institucionales diferenciadas para museos o asociaciones. Ese objetivo permitiría, en una futura arquitectura autorizada:

- identificar la institución que accede;
- generar métricas agregadas por institución;
- habilitar o suspender accesos sin afectar a otras instituciones;
- mantener trazabilidad de participación sin crear cuentas individuales necesariamente.

### Estado actual y conflicto técnico

La implementación actual no realiza verificación server-side. `components/series/access-gate.tsx` es un componente cliente que compara el código en el navegador, usa `sessionStorage` y tiene un fallback `ISA-DEMO`. La variable `NEXT_PUBLIC_ISA_EVALUATION_CODE` también se incorpora al bundle cliente.

Por lo tanto, el gate actual es un **filtro de evaluación**, no autenticación ni control de seguridad. No debe describirse como protección de claves institucionales.

### Decisión adoptada — 5 de noviembre de 2026

Se adopta el camino **B · GitHub Pages + Apps Script como endpoint controlado**:

- el sitio sigue siendo una exportación estática desplegada en GitHub Pages;
- la Google Sheet permanece privada;
- un Web App de Apps Script, administrado por el equipo del proyecto, actúa como único intermediario autorizado;
- el navegador envía la clave institucional al endpoint; el endpoint la compara contra la hoja privada y responde con un token de sesión y los datos de la institución;
- el frontend nunca contiene claves ni credenciales;
- las claves se almacenan como hash, no en texto plano;
- los datos se sirven sólo con token válido y sólo para hojas autorizadas.

Alcance y límites de esta decisión:

- no reemplaza autenticación individual ni cuentas de usuario;
- no habilita métricas institucionales hasta definir privacidad y retención;
- no elimina el gate de evaluación existente hasta que el endpoint esté desplegado y probado;
- el endpoint es público en su dirección, por lo que su seguridad depende del secreto del token, del hash de claves y de la lista de hojas expuestas;
- el despliegue del Web App es una acción manual del responsable del proyecto.

El contrato y la implementación de referencia están en `docs/07_ENDPOINT_APPS_SCRIPT.md` y `apps-script/`.

### Reglas objetivo para una futura implementación

- no exponer claves en código fuente ni bundles del navegador;
- almacenar secretos en un mecanismo seguro;
- verificar en servidor o servicio confiable;
- responder con mensajes genéricos ante claves incorrectas;
- separar clave institucional de cuenta de usuario;
- definir rotación, suspensión, auditoría, responsables y tratamiento de datos.

---

## 11. Progreso del usuario

### Decisión vigente para el MVP

El progreso se guarda localmente en el navegador. Esto implica:

- no solicitar datos personales;
- no crear cuentas de usuario;
- aceptar que el progreso puede perderse al cambiar de dispositivo o borrar datos;
- mantener una experiencia simple y privada.

El progreso puede incluir:

- episodios vistos;
- misiones completadas;
- credenciales obtenidas;
- Coins obtenidas;
- rutas exploradas.

La implementación actual mantiene el progreso del catálogo separado del progreso de la demo. No existe actualmente un sistema institucional de métricas, logs de usuarios ni sincronización multi-dispositivo.

---

## 12. Datos y Google Sheets

### Decisión adoptada — 5 de noviembre de 2026

La Google Sheet permanece **privada**. El acceso desde la web se realiza exclusivamente a través de un Web App de Apps Script que actúa como endpoint controlado:

1. el cliente envía la clave institucional por `POST` con `text/plain`;
2. el Apps Script calcula el hash de la clave y lo compara con la hoja `Claves`;
3. si la clave es válida y la institución está activa, responde con un token firmado y de corta duración;
4. el cliente solicita los datos con `GET` y ese token;
5. el endpoint devuelve sólo las hojas autorizadas y omite siempre `Claves`, `Logs`, `Metricas`, `Instituciones` y `Propiedad_Intelectual`.

El endpoint no crea, modifica ni elimina filas: es **read-only**. Las altas y cambios de contenido siguen siendo una tarea humana en la Sheet.

La UI actual es una exportación estática de Next.js (`output: 'export'`) desplegada mediante GitHub Pages. Esta decisión mantiene ese despliegue y agrega el Web App como única superficie dinámica. El código de referencia y el contrato están en `apps-script/` y `docs/07_ENDPOINT_APPS_SCRIPT.md`.

### Estado de implementación

- Endpoint de Apps Script: implementado como referencia, **pendiente de despliegue y de conectar**.
- Adaptador en la web: **pendiente**; hoy la Home no consume el endpoint.
- Fixtures locales: siguen siendo la fuente efectiva de la demo.
- El gate cliente actual se mantiene como filtro de evaluación hasta que la verificación remota esté operativa.

### Decisiones todavía abiertas sobre datos

- quién administra el Apps Script, la Sheet y el secreto del token;
- política de rotación y suspensión de claves institucionales;
- si se habilitan métricas agregadas y con qué base legal;
- qué hojas se exponen al navegador y con qué granularidad;
- cuándo se retira el gate de evaluación;
- cómo se migrará si Sheets deja de ser suficiente.

### Hojas base propuestas

| Hoja | Función | Estado |
|---|---|---|
| `Config` | Parámetros, versiones y textos editables. | Propuesta |
| `Instituciones` | Museos, asociaciones y aliados. | Propuesta |
| `Claves` | Claves institucionales y estado. | Propuesta; requiere seguridad |
| `Museos` | Fichas y catálogo de Submarinos Museos. | Propuesta |
| `Episodios` | Episodios, rutas y estados. | Propuesta |
| `Misiones` | Misiones, compartimentos y equipos. | Propuesta |
| `Reactivos` | Banco y desafíos educativos. | Propuesta; requiere revisión de derechos |
| `Contenidos` | Videos, audios, imágenes y recursos. | Propuesta |
| `Propuestas` | Propuestas de museos, reactivos y contenidos. | Propuesta |
| `Metricas` | Indicadores agregados. | Propuesta; requiere definición de privacidad |
| `Propiedad_Intelectual` | Autorías, licencias y autorizaciones. | Propuesta |
| `Logs` | Registro técnico de eventos. | Propuesta; requiere política de datos |

### Reglas de datos objetivo

- encabezados estables;
- ID único y legible por registro;
- trazabilidad de origen y cambios;
- ningún secreto o credencial en la Sheet;
- estados editoriales explícitos;
- documentación de cambios estructurales en el repositorio.

IDs sugeridos: `INS-001`, `MUS-U995`, `EPI-ACERO-04`, `MIS-COBRE-01`, `REA-TIMSS-001`.

### Fuentes revisadas

- La pestaña pública `Conocimiento` del banco TIMSS consultado contiene 67 filas de referencia y campos útiles en A:G, sin encabezados formales completos.
- La fuente pública de sistemas y compartimentos aporta vocabulario técnico, descripciones y desafíos, sujetos a revisión de procedencia y permisos.
- La pestaña `Cobre_TIMSS_Submarino` prevista como tabla puente no estaba confirmada/importada al momento de la revisión.
- La carpeta `TIMSS/` contiene cinco CSV con 225 filas y 100 IDs únicos después de deduplicación. El conjunto curado queda en estado `curated_pending_human_review`.

---

## 13. Tecnología y estado técnico

### Estado vigente del repositorio

- Next.js 16.4.3, React 19 y TypeScript.
- Exportación estática (`output: 'export'`).
- GitHub Pages mediante GitHub Actions.
- Producción actual: `https://academy.elsnorkel.com`.
- Home en `/`; `/v1` fue desestimada y responde 404.
- Datos de Home en `lib/missions.ts`, `lib/seasons.ts` y `lib/progress.ts`.
- Fixtures de demo en `lib/demo/*` y `components/series/demo-*`.
- Internacionalización estructurada en `lib/i18n/`; español visible de forma provisoria y diccionario inglés preparado.
- Existe un Apps Script de referencia en `apps-script/`, todavía sin desplegar ni consumir desde la web.
- La web no consume Google Sheets: no hay `fetch`, `gviz` ni cliente de Google en el código de aplicación.
- No hay scripts de lint o test en `package.json`.

### Objetivo técnico

La arquitectura futura debe ser modular, mantenible y migrable, con separación clara entre contenido, lógica y presentación. El stack actual es una base implementada, no una prohibición de evolucionar; cualquier cambio que agregue backend, autenticación o dependencia debe aprobarse y documentarse por separado.

### Criterios de evolución

- simplicidad y mantenibilidad;
- trazabilidad de datos;
- accesibilidad y mobile first;
- capacidad de integrar una fuente privada sin exponer secretos;
- claridad para agentes IA y nuevos desarrolladores;
- posibilidad de migrar desde Sheets a otro backend;
- validación independiente de tipo y build cuando corresponda.

---

## 14. Idiomas

### Decisión de producto

El MVP se redacta en español y la estructura debe poder incorporar inglés en el futuro.

### Estado actual

- existe una base de internacionalización en `lib/i18n/`;
- la Home mantiene el español como idioma visible provisoriamente;
- el inglés existe como base de diccionario, pero no hay selector ni rutas por idioma;
- no se debe activar el inglés en la interfaz sin una decisión explícita.

Reglas objetivo:

- no hardcodear textos nuevos cuando formen parte de la experiencia traducible;
- mantener IDs estables;
- evitar que el modelo de datos dependa de un solo idioma;
- revisar traducciones antes de publicarlas.

---

## 15. Estructura del repositorio

La estructura siguiente es orientativa, no un contrato que obligue a reorganizar ahora:

```text
isa-platform/
├── docs/
│   ├── 00_DOCUMENTO_BASE.md
│   ├── ISA_documento_para_stakeholders.docx
│   ├── 01_BRIEF_EJECUTIVO.md
│   ├── 02_ESPECIFICACION_TECNICA.md
│   ├── 03_MODELO_DATOS_GOOGLE_SHEETS.md
│   ├── 04_FLUJOS_Y_RUTAS.md
│   ├── 05_CONTENIDOS_Y_PI.md
│   └── 06_ROADMAP.md
├── app/
├── components/
├── lib/
├── public/
├── TIMSS/
├── tests/                 # futuro; hoy no hay suite
├── .env.example
├── README.md
└── AGENTS.md
```

La estructura actual usa `app/`, `components/`, `lib/` y `public/` de Next.js. No se debe crear una segunda aplicación paralela ni agregar rutas como `/v1` sin autorización.

---

## 16. Continuidad con lo existente

| Elemento | Tratamiento | Estado actual |
|---|---|---|
| Universo narrativo ISA | Conservar y separar ficción de hechos. | Fixture/demo |
| Personaje Pez Luna | Conservar en la demo. | Fixture/demo |
| Episodio Acero 04 | Migrar y revisar. | Fixture/demo local |
| Episodio Cobre | Migrar y revisar. | Fixture/demo local |
| Credencial de Expedición Submarina | Conservar como resultado visual propuesto. | Fixture/demo |
| Coin Cobre | Conservar como avance visual propuesto. | Fixture/demo |
| Ficha del U-995 | Revisar fuentes, derechos y contexto. | Parcial/pendiente |
| Banco de reactivos TIMSS | Conservar, deduplicar y revisar derechos. | CSV curado pendiente |
| Matriz 5×5 | Conservar como insumo curricular de producto. | Estructura local |
| Sistemas por compartimentos | Conservar como vocabulario y fuente candidata. | Fuente pendiente de validación |
| Vínculo con El Snorkel | Mantener como contexto del proyecto. | Debe documentarse su alcance |
| Congresos submarinistas | Mantener como posible relación. | Propuesta; no alianza confirmada |
| TIMSS, GSA, UNESCO y STEM+A | Tratar como marcos o referencias propuestas. | No aval ni equivalencia automática |
| Sociedad civil | Incorporar como campo o ruta cuando exista criterio. | Objetivo |

---

## 17. Qué se reformula y qué se pospone

### Reformulaciones

| Aspecto | Dirección reconciliada |
|---|---|
| Acceso | Del filtro de evaluación actual hacia claves institucionales seguras en una futura arquitectura. |
| Backend | De la UI estática actual hacia una eventual fuente privada con componente intermedio autorizado. |
| Progreso | Mantener local en el MVP; no introducir cuentas sin requisitos. |
| Arquitectura | Evolucionar de fixtures locales a módulos y fuentes trazables, sin reconstruir todo de cero. |
| Idiomas | Mantener español visible y estructura preparada para inglés. |
| Contenidos | Pasar de producción aislada a registros con estado, fuente, derechos y responsable. |
| Propiedad intelectual | Incorporar registro estructurado antes de ampliar publicación. |

### Pospuesto

- despliegue público abierto como producto validado;
- cuentas de usuario;
- autenticación individual;
- selector de idioma activo;
- aplicaciones móviles nativas;
- cartas postales físicas;
- carga masiva de museos;
- monetización;
- métricas institucionales y logs de usuarios;
- despliegue del endpoint y retiro del gate de evaluación hasta completar la integración.

### Conflictos que requieren decisión

| Tema | Intención del documento | Estado real | Decisión requerida |
|---|---|---|---|
| Claves | Claves institucionales privadas y server-side. | Gate cliente con código de evaluación. | **Resuelto en dirección:** Apps Script como verificador. Falta despliegue y conexión. |
| Sheets | Sheet privada como backend inicial. | Sin adaptador; Apps Script de referencia sin desplegar. | **Resuelto en dirección:** Sheet privada + endpoint read-only. Falta despliegue, responsables y adaptador web. |
| Despliegue | Sin despliegue público en esta etapa. | Existe GitHub Pages y dominio de producción con protección `noindex`. | Mantener como evaluación restringida; definir cuándo se comunica. |
| Datos | Instituciones, métricas y logs. | Sin backend activo ni datos institucionales. | Definir privacidad, retención y base legal antes de habilitar métricas. |
| Marcos | TIMSS/GSA/UNESCO como vínculos. | No hay validación o aval documentado. | Confirmar fuentes, lenguaje y responsables. |
| Credenciales | Credencial/Coin como resultado. | Insignia visual de demo. | Definir si será sólo avance o acreditación formal. |

No se debe resolver ninguno de estos conflictos modificando código sin una decisión explícita.

---

## 18. Documentación requerida

El proyecto debe mantener, progresivamente:

| Documento | Función | Estado |
|---|---|---|
| `docs/00_DOCUMENTO_BASE.md` | Visión, alcance, estados y decisiones. | Vigente |
| `docs/07_ENDPOINT_APPS_SCRIPT.md` | Contrato del endpoint, seguridad y despliegue. | Vigente |
| Brief ejecutivo | Resumen para instituciones y aliados. | Pendiente o derivado |
| Especificación técnica | Stack, arquitectura y decisiones. | Pendiente |
| Modelo de datos | Estructura de Google Sheets o backend. | Pendiente |
| Flujos y rutas | Mapa de experiencia y navegación. | Pendiente |
| Contenidos y PI | Producción, autorizaciones y créditos. | Pendiente |
| Roadmap | Fases, prioridades y criterios de avance. | Pendiente |
| `AGENTS.md` | Reglas operativas para agentes IA. | Vigente |
| QA de TIMSS | Curaduría, duplicados y revisión editorial. | Parcial; disponible en `TIMSS/curated/` |

---

## 19. Reglas para agentes IA

- Leer este documento y `AGENTS.md` antes de proponer cambios.
- Respetar las decisiones vigentes y distinguirlas de los objetivos pendientes.
- No proponer ni implementar despliegue público abierto, cuentas de usuario, monetización o autenticación real sin autorización.
- No exponer claves, secretos ni credenciales.
- No presentar el gate cliente como seguridad.
- No inventar datos históricos, técnicos, navales, museísticos o educativos.
- Diferenciar siempre ficción, historia, propuesta y validación.
- No afirmar equivalencia TIMSS, GSA, UNESCO, acreditación o aval institucional sin una fuente y autorización correspondiente.
- Conservar la continuidad de contenidos existentes sin elevar automáticamente su estado editorial.
- Mantener fixtures de demo separados de datos reales.
- Proponer cambios incrementales, pequeños y verificables.
- Documentar decisiones relevantes y los límites de cada comprobación.
- No agregar dependencias sin justificar su finalidad, impacto y alternativa.
- No realizar commit, push, tag ni despliegue sin autorización explícita.

---

## 20. Criterio de éxito

El MVP será exitoso si una asociación submarinista o un Submarino Museo puede:

- comprender qué es ISA;
- ingresar a una evaluación institucional de forma clara y segura cuando la arquitectura lo permita;
- ver una demo funcional sin confundir ficción con hecho validado;
- reconocer el valor educativo y patrimonial propuesto;
- identificar cómo podría participar;
- proponer una colaboración concreta;
- saber qué información todavía falta para aprobar contenidos o alianzas.

El objetivo inicial no es tener muchos usuarios. El objetivo es generar confianza, curiosidad y alianzas reales, con una base técnica y editorial que pueda crecer sin perder trazabilidad.

---

## 21. Registro de reconciliación

Esta versión incorpora el documento proporcionado por el equipo y agrega una capa de estado para evitar contradicciones con el repositorio actual.

Comprobado para esta reconciliación:

- `next.config.mjs` mantiene `output: 'export'`.
- `AccessGate` es cliente, usa `sessionStorage` y el código de evaluación se compara en el navegador.
- `app/page.tsx` compone la Home mediante `AccessGate`, serie, temporadas, demo y progreso.
- No se detectaron `fetch`, `gviz`, `googleapis` ni Apps Script en los archivos de aplicación revisados.
- `AGENTS.md` registra GitHub Pages, la producción actual, el i18n existente y la ausencia de integración Sheets.

No se implementó backend, autenticación, conexión privada a Sheets ni migración de contenidos como parte de esta reconciliación.

### Decisión posterior — 5 de noviembre de 2026

Se adoptó el camino **B · GitHub Pages + Apps Script como endpoint controlado**: la Sheet permanece privada y un Web App de Apps Script actúa como intermediario read-only con verificación de claves por hash y token firmado.

Consecuencias registradas:

- se agregó `apps-script/` con la implementación de referencia;
- se agregó `docs/07_ENDPOINT_APPS_SCRIPT.md` con el contrato;
- el despliegue del Web App, la creación de las hojas `Claves` e `Instituciones` y la conexión del adaptador web quedan pendientes y requieren autorización;
- el gate cliente actual no se retira todavía.
