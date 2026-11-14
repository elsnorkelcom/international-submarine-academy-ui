# ISA — Historia real dentro de la web

Documento de trabajo. Fecha: 10/11/2026. **No implementado.**

## 1. Qué es este material

`C:\Users\MDQdam\Proyectos\snk\ISC - Historia\Historia.txt` es un informe sobre la
**International Submariners Association (ISA/ISAGB)**, la fraternidad real de
submarinistas, y sus Congresos Internacionales (1962–2027). Cubre:

1. Filosofía: aconfesional, apolítica, amistad, paz, “diplomacia desde la base”.
2. Orígenes: contactos Aufray–Schnee (1960-61), VDU, 1.º Congreso en París (1962).
3. Mística y ritos: identidad submarinista, Cruce de la Línea, Bautismo de Profundidad,
   supersticiones.
4. “Eterna Patrulla”: ceremonia del recuerdo y caídos.
5. Memorándum de Atenas (2014): protección de pecios y tumbas de guerra.
6. Crónica de congresos: Bendor 1970, Taranto 2001, Mar del Plata 2005, Moscú 2006,
   San Petersburgo 2017, Dublín 2024, Edimburgo 2026, Gimhae 2027.
7. Detalles de ceremonial, trofeo “Stella”, interrupciones históricas.

**Advertencia:** el informe no trae bibliografía. Antes de publicar hay que verificar
fechas, cifras, nombres y citas contra fuentes primarias (sitio oficial de la
asociación, programas de congresos, prensa y museos). Todo dato sin fuente se publica
como “en revisión” o no se publica.

## 2. Dónde ubicarlo

**Propuesta:** una sección nueva **“Historia”** (`/historia`), separada de la ficción
de la academia, accesible desde:

- el encabezado principal (junto a Series / Museos / Insignias / Mi progreso);
- un bloque “La historia real” en la Home;
- el pie de página;
- fichas de museos y episodios, como enlace contextual.

**Nombre visible recomendado:** “Historia real · International Submariners Association
(ISAGB)”, con una nota fija: *“La International Submarine Academy es ficción. Esta
sección documenta la historia real de la fraternidad de submarinistas.”*

> El acrónimo ISA se repite (Academy vs Association). La página debe aclararlo desde el
> título y en la primera línea, para no confundir ficción con historia.

## 3. Estructura de la página (MVP)

Una sola página larga con índice pegajoso y secciones ancla:

1. **Portada:** imagen de archivo, título, bajada, aviso ficción/realidad, tiempo de lectura.
2. **Orígenes (1960–1962):** contacto epistolar, VDU, París 1962.
3. **Filosofía:** aconfesionalidad, amistad, paz, “diplomacia desde la base”.
4. **Mística y ritos:** identidad, Cruce de la Línea, Bautismo de Profundidad,
   supersticiones (redactado con respeto y sin detalles escatológicos).
5. **Eterna Patrulla:** concepto, lista de unidades recordadas, ceremonia floral.
6. **Memorándum de Atenas (2014):** tres pilares de protección del patrimonio.
7. **Congresos:** línea de tiempo + tabla por año/sede/país.
8. **Futuro:** Dublín 2024, Edimburgo 2026, Gimhae 2027.
9. **Fuentes y estado de verificación:** lista por sección, con “verificado / en revisión”.
10. **Aviso legal y de sensibilidad:** contenido conmemorativo, no bélico; no glorifica
    conflictos; cifras a confirmar.

## 4. Piezas interactivas

- **Línea de tiempo** 1960 → 2027 con hitos y filtros por década.
- **Mapa de congresos** (Leaflet ya está en el proyecto) con sedes y año.
- **Placa “En Eterna Patrulla”** con las unidades y fecha, en estilo de bronce.
- **Tarjetas de citas** con atribución y fuente.
- **Índice lateral** con progreso de lectura.
- **Buscador simple** por texto (fase 2).

## 5. Modelo de datos (estático, sin base)

El contenido cambia poco: conviene un archivo tipado, no la base IndexedDB.

```ts
type HistoryChapter = {
  id: string; slug: string;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  body: { es: string[]; en: string[] }; // párrafos
  period?: string;
  sources: { label: string; url?: string; note?: string }[];
  status: 'verified' | 'review';
};

type TimelineEvent = {
  id: string; date: string; year: number;
  title: { es: string; en: string };
  detail: { es: string; en: string };
  location?: string; source?: string; status: 'verified' | 'review';
};

type Congress = {
  id: string; edition: number; year: number;
  city: string; country: string;
  coords?: [number, number];
  note?: { es: string; en: string };
  status: 'verified' | 'review';
};

type Memorial = {
  id: string; vessel: string; country: string; date: string;
  losses?: number; note?: string; status: 'verified' | 'review';
};
```

Archivo: `lib/content/historia.ts`. Componentes: `components/history/*`. Página:
`app/historia/page.tsx`. Sin nuevas dependencias.

## 6. Reglas editoriales (importante)

- **No es una sección bélica.** Se habla de memoria, paz, diplomacia y patrimonio; no
  de operaciones, tácticas ni armamento.
- Los conflictos se mencionan solo como contexto histórico indispensable, sin
  glorificación ni detalles de combate.
- Las listas de caídos y pecios se tratan como memorial: respeto, sin morbo, sin
  imágenes de restos humanos.
- Contenido para todo público: evitar descripciones escatológicas de los ritos y
  cualquier detalle que no aporte.
- Citas breves con atribución; no reproducir discursos extensos sin permiso.
- Toda cifra con fuente y fecha de consulta.
- Etiqueta de estado: “verificado” o “en revisión”.

## 7. Relación con la ficción

- Banner fijo: *“Esto es historia real. La serie ISA es ficción.”*
- Enlaces cruzados: la academia ficcional “inspirada en” la fraternidad real, sin
  presentar la ficción como parte de la asociación.
- En el perfil y en `/about` (si existe) explicar la diferencia Academy/Association.

## 8. Plan por etapas

**Etapa 1 (MVP, 1–2 días):**
- `lib/content/historia.ts` con las 8 secciones, timeline y congresos.
- Página `/historia` con índice, timeline, tabla de congresos, memorial y fuentes.
- Enlace en header, footer y Home.
- ES/EN, responsive, accesible.

**Etapa 2:**
- Mapa de congresos.
- Páginas por capítulo (`/historia/[slug]`) y por congreso.
- Buscador y filtros.
- Audios narrados (voz IA) y modo lectura.

**Etapa 3:**
- Panel de administración para editar capítulos, fuentes y estados.
- Vínculo con museos: cada museo puede enlazar su historia local.

## 9. Verificación pendiente antes de publicar

- Nombre y sitio oficial de la asociación; confirmar “ISA/ISAGB”.
- Fechas y sedes de los congresos 1962–2027.
- Cifras de caídos (1.600+ en paz; listas de unidades).
- Citas de Schnee, Jarama, Earls, Weber, Fabre: texto exacto y fuente.
- Datos del Memorándum de Atenas y su estado legal.
- Trofeo “Stella” y títulos honoríficos.
- Derechos de las imágenes que se usen.

## 10. Decisión

Crear `/historia` como sección **real** separada de la ficción, con el MVP estático y
las fuentes visibles. Antes de cargar el texto completo, hacer la pasada de verificación
y marcar cada dato.
