/**
 * Initial seed data.
 *
 * Content rule: the seed only contains information explicitly provided by the
 * project specification or by the submarine museums reference dataset.
 * Anything unverified is stored as "Information to be validated." so the UI can
 * show the placeholder instead of inventing history.
 */

import type {
  AccessKey,
  AuditFields,
  Badge,
  Compartment,
  Discipline,
  Episode,
  Institution,
  Mission,
  Museum,
  Question,
  Role,
  Season,
  Settings,
  SoftDeleteFields,
  SubmarineSystem,
} from '../domain/types';
import { SETTINGS_ID } from './repository';
import museumsDataset from './datasets/museums-snk-2025.json';

export const SEED_VERSION = 5;

const SEED_ACTOR = 'seed';
const SEED_TIMESTAMP = '2026-11-05T00:00:00.000Z';

const BASE: AuditFields & SoftDeleteFields = {
  createdAt: SEED_TIMESTAMP,
  updatedAt: SEED_TIMESTAMP,
  createdBy: SEED_ACTOR,
  updatedBy: SEED_ACTOR,
  deletedAt: null,
};

const VALIDATION_PLACEHOLDER = {
  en: 'Information to be validated.',
  es: 'Información a validar.',
};

/* -------------------------------------------------------------------------- */
/* Seasons                                                                    */
/* -------------------------------------------------------------------------- */

export const SEED_SEASONS: Season[] = [
  {
    id: 'SEA-STEEL',
    ...BASE,
    name: 'steel',
    title: { en: 'Steel', es: 'Acero' },
    description: { en: 'Discover', es: 'Descubrir' },
    order: 1,
    colorTheme: '#8FA3B0',
    timssDomain: 'knowing',
    gsaEmphasis: { en: 'Curiosity and observation', es: 'Curiosidad y observación' },
    status: 'published',
  },
  {
    id: 'SEA-COPPER',
    ...BASE,
    name: 'copper',
    title: { en: 'Copper', es: 'Cobre' },
    description: { en: 'Understand', es: 'Comprender' },
    order: 2,
    colorTheme: '#B87333',
    timssDomain: 'knowing',
    gsaEmphasis: { en: 'Critical thinking', es: 'Pensamiento crítico' },
    status: 'published',
  },
  {
    id: 'SEA-BRONZE',
    ...BASE,
    name: 'bronze',
    title: { en: 'Bronze', es: 'Bronce' },
    description: { en: 'Apply', es: 'Aplicar' },
    order: 3,
    colorTheme: '#CD7F32',
    timssDomain: 'applying',
    gsaEmphasis: { en: 'Problem solving and creativity', es: 'Resolución de problemas y creatividad' },
    status: 'published',
  },
  {
    id: 'SEA-SILVER',
    ...BASE,
    name: 'silver',
    title: { en: 'Silver', es: 'Plata' },
    description: { en: 'Collaborate and decide', es: 'Colaborar y decidir' },
    order: 4,
    colorTheme: '#C0C7CE',
    timssDomain: 'reasoning',
    gsaEmphasis: { en: 'Collaboration and communication', es: 'Colaboración y comunicación' },
    status: 'published',
  },
  {
    id: 'SEA-GOLD',
    ...BASE,
    name: 'gold',
    title: { en: 'Gold', es: 'Oro' },
    description: { en: 'Propose and transform', es: 'Proponer y transformar' },
    order: 5,
    colorTheme: '#D4AF37',
    timssDomain: 'integrated',
    gsaEmphasis: { en: 'Global citizenship', es: 'Ciudadanía global' },
    status: 'published',
  },
];

/* -------------------------------------------------------------------------- */
/* Disciplines and roles                                                      */
/* -------------------------------------------------------------------------- */

export const SEED_DISCIPLINES: Discipline[] = [
  {
    id: 'DIS-SCIENCE',
    ...BASE,
    name: { en: 'Science', es: 'Ciencias' },
    description: { en: 'Physics, chemistry and biology applied to the submarine environment.', es: 'Física, química y biología aplicadas al entorno submarino.' },
    color: '#4CAF93',
    status: 'published',
  },
  {
    id: 'DIS-TECHNOLOGY',
    ...BASE,
    name: { en: 'Technology', es: 'Tecnología' },
    description: { en: 'Sensors, communications and control systems.', es: 'Sensores, comunicaciones y sistemas de control.' },
    color: '#3D8BD9',
    status: 'published',
  },
  {
    id: 'DIS-ENGINEERING',
    ...BASE,
    name: { en: 'Engineering', es: 'Ingeniería' },
    description: { en: 'Hull, propulsion, buoyancy and life support.', es: 'Casco, propulsión, flotabilidad y soporte vital.' },
    color: '#E0A63C',
    status: 'published',
  },
  {
    id: 'DIS-MATHEMATICS',
    ...BASE,
    name: { en: 'Mathematics', es: 'Matemática' },
    description: { en: 'Measurement, proportion and data interpretation.', es: 'Medición, proporción e interpretación de datos.' },
    color: '#A46BD1',
    status: 'published',
  },
  {
    id: 'DIS-HUMANITIES',
    ...BASE,
    name: { en: 'Humanities and Arts', es: 'Humanidades y Artes' },
    description: { en: 'History, memory, narrative and visual culture.', es: 'Historia, memoria, narrativa y cultura visual.' },
    color: '#D96C6C',
    status: 'published',
  },
];

export const SEED_ROLES: Role[] = [
  {
    id: 'ROL-MACHINIST',
    ...BASE,
    name: { en: 'Machinist', es: 'Maquinista' },
    description: { en: 'Propulsion, engines and mechanical systems.', es: 'Propulsión, motores y sistemas mecánicos.' },
    equipmentIds: [],
    status: 'published',
  },
  {
    id: 'ROL-ELECTRICIAN',
    ...BASE,
    name: { en: 'Electrician', es: 'Electricista' },
    description: { en: 'Electrical generation, batteries and distribution.', es: 'Generación eléctrica, baterías y distribución.' },
    equipmentIds: [],
    status: 'published',
  },
  {
    id: 'ROL-ELECTRONICS',
    ...BASE,
    name: { en: 'Electronics Technician', es: 'Técnico Electrónico' },
    description: { en: 'Sensors, sonar and combat information systems.', es: 'Sensores, sonar y sistemas de información de combate.' },
    equipmentIds: ['SYS-U995-PERISCOPE'],
    status: 'published',
  },
  {
    id: 'ROL-NAVAL',
    ...BASE,
    name: { en: 'Naval Officer', es: 'Oficial Naval' },
    description: { en: 'Navigation, manoeuvre and command decisions.', es: 'Navegación, maniobra y decisiones de mando.' },
    equipmentIds: [],
    status: 'published',
  },
  {
    id: 'ROL-LOGISTICS',
    ...BASE,
    name: { en: 'Logistics', es: 'Logística' },
    description: { en: 'Provisions, maintenance and crew support.', es: 'Aprovisionamiento, mantenimiento y apoyo a la tripulación.' },
    equipmentIds: [],
    status: 'published',
  },
];

/* -------------------------------------------------------------------------- */
/* Institutions and museums                                                   */
/* -------------------------------------------------------------------------- */

export const SEED_INSTITUTIONS: Institution[] = [];

interface MuseumDatasetRecord {
  id: string;
  name: string;
  museumName: string;
  country: string;
  city: string;
  vesselType: string;
  propulsion: string;
  origin: string;
  launchYear: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string;
  website: string;
  mediaUrl: string;
  validation: 'validated' | 'pending';
  source: string;
  notes: string;
  description: { en: string; es: string };
  dossier?: string;
  situation?: string;
  featured?: boolean;
}

const MUSEUM_DATASET = museumsDataset as MuseumDatasetRecord[];

export const SEED_MUSEUMS: Museum[] = MUSEUM_DATASET.map((record) => ({
  ...BASE,
  id: record.id,
  name: { en: record.name, es: record.name },
  museumName: { en: record.museumName, es: record.museumName },
  country: record.country,
  city: record.city,
  website: record.website,
  vesselType: record.vesselType,
  propulsion: record.propulsion,
  origin: record.origin,
  description: record.description,
  compartmentIds: [],
  episodeIds: [],
  status: 'published',
  source: record.source,
  notes: record.notes,
  latitude: record.latitude,
  longitude: record.longitude,
  launchYear: record.launchYear,
  address: record.address,
  mediaUrl: record.mediaUrl,
  validation: record.validation,
  dossier: record.dossier ?? '',
  situation: record.situation ?? '',
  featured: record.featured ?? false,
}));

export const SEED_COMPARTMENTS: Compartment[] = [];

export const SEED_SYSTEMS: SubmarineSystem[] = [];

/* -------------------------------------------------------------------------- */
/* Episodes and missions                                                      */
/* -------------------------------------------------------------------------- */

export const SEED_EPISODES: Episode[] = [];

export const SEED_MISSIONS: Mission[] = [];

/* -------------------------------------------------------------------------- */
/* Questions                                                                  */
/* -------------------------------------------------------------------------- */

export const SEED_QUESTIONS: Question[] = [];

/* -------------------------------------------------------------------------- */
/* Badges                                                                     */
/* -------------------------------------------------------------------------- */

export const SEED_BADGES: Badge[] = [];

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

export const SEED_SETTINGS: Settings = {
  id: SETTINGS_ID,
  ...BASE,
  appName: 'ISA — International Submarine Academy',
  welcomeMessage: {
    en: 'Everything you see is fiction. But there is much to discover.',
    es: 'Todo lo que ves es ficción. Pero hay mucho por descubrir.',
  },
  accessScreenText: {
    en: 'CLASSIFIED — ENTER ACCESS KEY',
    es: 'CLASIFICADO — INGRESÁ LA CLAVE DE ACCESO',
  },
  fictionNotice: {
    en: 'The ISA narrative is fictional. The museums and their historical context are real.',
    es: 'La narrativa de ISA es ficción. Los museos y su contexto histórico son reales.',
  },
  theme: {
    background: '#050B12',
    surface: '#0B1622',
    primary: '#00E08A',
    accent: '#2F81F7',
    copper: '#B87333',
    text: '#E6EDF3',
  },
  defaultLanguage: 'en',
  featureFlags: {
    enableTimer: true,
    enableAmbientSound: false,
    enableProposals: false,
    enableAdminPreview: true,
  },
  maxAttempts: 2,
  timerSeconds: 20,
  fallbackContentStatus: 'pending',
};

/* -------------------------------------------------------------------------- */
/* Install                                                                    */
/* -------------------------------------------------------------------------- */

export interface SeedCollection {
  name:
    | 'seasons'
    | 'disciplines'
    | 'roles'
    | 'institutions'
    | 'museums'
    | 'compartments'
    | 'systems'
    | 'episodes'
    | 'missions'
    | 'questions'
    | 'badges';
  records: { id: string }[];
}

export function seedCollections(): SeedCollection[] {
  return [
    { name: 'seasons', records: SEED_SEASONS },
    { name: 'disciplines', records: SEED_DISCIPLINES },
    { name: 'roles', records: SEED_ROLES },
    { name: 'institutions', records: SEED_INSTITUTIONS },
    { name: 'museums', records: SEED_MUSEUMS },
    { name: 'compartments', records: SEED_COMPARTMENTS },
    { name: 'systems', records: SEED_SYSTEMS },
    { name: 'episodes', records: SEED_EPISODES },
    { name: 'missions', records: SEED_MISSIONS },
    { name: 'questions', records: SEED_QUESTIONS },
    { name: 'badges', records: SEED_BADGES },
  ];
}

/** Access keys are never seeded: they are generated from the admin panel. */
export const SEED_ACCESS_KEYS: AccessKey[] = [];
