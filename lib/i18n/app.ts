/**
 * UI strings for the museum area.
 *
 * Both languages are declared together so a missing translation fails at
 * compile time instead of showing English inside a Spanish screen.
 */

export type AppLanguage = 'en' | 'es';

export const APP_LANGUAGES: AppLanguage[] = ['en', 'es'];

const en = {
  nav: {
    home: 'Home',
    register: 'Register',
    map: 'Plot',
  },
  common: {
    loading: 'Loading archive…',
    error: 'The archive could not be loaded.',
    retry: 'Retry',
    validated: 'Validated',
    pending: 'Pending',
    notAvailable: '—',
    back: 'Back',
  },
  register: {
    eyebrow: 'SNK // Naval Archive',
    title: 'Every hull on record',
    subtitle:
      'Filter the archive by country or propulsion, then open the file of any preserved submarine.',
    search: 'Search',
    searchPlaceholder: 'Hull, museum or city',
    country: 'Country',
    allCountries: 'All countries',
    propulsion: 'Propulsion',
    allPropulsion: 'All propulsion',
    sort: 'Sort',
    sortName: 'Name A–Z',
    sortLaunchNewest: 'Launch ↓',
    sortLaunchOldest: 'Launch ↑',
    sortCountry: 'Country A–Z',
    contacts: 'contacts on record',
    empty: 'No contact matches the current filters.',
    emptyHint: 'Clear the filters and try again.',
    openFile: 'Open file',
    film: 'On film',
  },
  file: {
    eyebrow: 'Museum file',
    museum: 'Museum',
    location: 'Location',
    vessel: 'Vessel',
    propulsion: 'Propulsion',
    origin: 'Origin',
    launched: 'Launched',
    description: 'Description',
    related: 'In the ISA series',
    compartments: 'Compartments',
    episodes: 'Episodes',
    missions: 'Missions',
    questions: 'Questions',
    external: 'Museum website',
    film: 'Watch the film',
    noFilm: 'No film registered for this hull.',
    disclaimer: 'The ISA narrative is fictional. The museum and its historical context are real.',
    pendingInfo: 'Information to be validated.',
    source: 'Source',
    notes: 'Archive note',
    notFound: 'This file does not exist in the archive.',
    notFoundHint: 'Return to the register to pick another hull.',
  },
  map: {
    eyebrow: 'SNK // Plot',
    title: 'Submarine museums of the world',
    subtitle: 'Each marker is a preserved hull. Clusters group close contacts.',
    country: 'Country',
    propulsion: 'Propulsion',
    allCountries: 'All countries',
    allPropulsion: 'All propulsion',
    showing: 'visible contacts',
    reset: 'Reset view',
    markerHint: 'Select a marker to open its file.',
  },
};

const es: typeof en = {
  nav: {
    home: 'Inicio',
    register: 'Registro',
    map: 'Mapa',
  },
  common: {
    loading: 'Cargando archivo…',
    error: 'No se pudo cargar el archivo.',
    retry: 'Reintentar',
    validated: 'Validado',
    pending: 'Pendiente',
    notAvailable: '—',
    back: 'Volver',
  },
  register: {
    eyebrow: 'SNK // Archivo Naval',
    title: 'Todos los cascos registrados',
    subtitle:
      'Filtrá el archivo por país o propulsión y abrí la ficha de cualquier submarino preservado.',
    search: 'Buscar',
    searchPlaceholder: 'Casco, museo o ciudad',
    country: 'País',
    allCountries: 'Todos los países',
    propulsion: 'Propulsión',
    allPropulsion: 'Todas las propulsiones',
    sort: 'Orden',
    sortName: 'Nombre A–Z',
    sortLaunchNewest: 'Botadura ↓',
    sortLaunchOldest: 'Botadura ↑',
    sortCountry: 'País A–Z',
    contacts: 'contactos registrados',
    empty: 'Ningún contacto coincide con los filtros actuales.',
    emptyHint: 'Quitá los filtros e intentá de nuevo.',
    openFile: 'Abrir ficha',
    film: 'En video',
  },
  file: {
    eyebrow: 'Ficha de museo',
    museum: 'Museo',
    location: 'Ubicación',
    vessel: 'Buque',
    propulsion: 'Propulsión',
    origin: 'Origen',
    launched: 'Botadura',
    description: 'Descripción',
    related: 'En la serie ISA',
    compartments: 'Compartimentos',
    episodes: 'Episodios',
    missions: 'Misiones',
    questions: 'Reactivos',
    external: 'Sitio del museo',
    film: 'Ver el video',
    noFilm: 'No hay video registrado para este casco.',
    disclaimer: 'La narrativa de ISA es ficción. El museo y su contexto histórico son reales.',
    pendingInfo: 'Información a validar.',
    source: 'Fuente',
    notes: 'Nota de archivo',
    notFound: 'Esta ficha no existe en el archivo.',
    notFoundHint: 'Volvé al registro para elegir otro casco.',
  },
  map: {
    eyebrow: 'SNK // Mapa',
    title: 'Submarinos museo del mundo',
    subtitle: 'Cada marcador es un casco preservado. Los grupos reúnen contactos cercanos.',
    country: 'País',
    propulsion: 'Propulsión',
    allCountries: 'Todos los países',
    allPropulsion: 'Todas las propulsiones',
    showing: 'contactos visibles',
    reset: 'Centrar mapa',
    markerHint: 'Elegí un marcador para abrir su ficha.',
  },
};

export const appStrings: Record<AppLanguage, typeof en> = { en, es };

export type AppStrings = typeof en;

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'en' || value === 'es';
}
