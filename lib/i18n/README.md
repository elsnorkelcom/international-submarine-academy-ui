# Internacionalización (etapa 1)

- Idioma base de los diccionarios: `en`.
- Idioma visible temporal de la Home: `es`.
- No hay rutas por idioma, selector de idioma ni dependencias nuevas en esta etapa.
- La Home recibe el idioma de forma explícita desde `app/page.tsx`; no se usan variables globales mutables.

## Contrato de claves

`lib/i18n/messages/en.ts` define la forma. `es.ts` debe cumplirla con `satisfies Messages`, por lo que `pnpm exec tsc --noEmit` falla si falta una clave o se agrega una clave no prevista.

`getMessages(locale)` devuelve el diccionario correspondiente y usa `en` como respaldo en tiempo de ejecución. `formatMessage()` conserva el marcador si falta un valor.

## Separación de responsabilidades

- **Interfaz:** claves de `lib/i18n/messages/*.ts`.
- **Contenido educativo:** títulos, descripciones y textos de las misiones no se traducen en esta etapa.
- **Medios:** audio y subtítulos no se modelan ni se muestran como disponibles en esta etapa.
- **Demo Acero/Cobre:** la interfaz vive en `lib/i18n/messages/*.ts`, pero el contenido educativo, la validación y el progreso se separan en `lib/demo/*`. La fuente local queda reemplazable más adelante.

Las claves `series.episode.viewStatus.*` (estado de visualización) y `series.episode.badge.earned` (obtención de insignia) son independientes. No se agregan equivalencias pedagógicas entre ambas.

## Pendiente fuera de alcance

`components/academy/mission-badge.tsx` conserva textos internos en español (`Badge ... obtenido`). Sigue compartido con la Home, junto con `components/academy/hero-backdrop.tsx`. La variante `/v1` fue eliminada y ya no forma parte del producto.

La demo Acero/Cobre no usa datos del catálogo ni atribuciones reales; su contenido sigue pendiente hasta que se aprueben materiales definitivos.
