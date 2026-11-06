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

export const SEED_VERSION = 1;

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

export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'INS-LABOE',
    ...BASE,
    name: { en: 'Laboe Naval Memorial', es: 'Memorial Naval de Laboe' },
    type: 'museum',
    country: 'Germany',
    city: 'Laboe',
    website: '',
    contactName: '',
    contactEmail: '',
    status: 'active',
    notes: 'Museum record imported from the Submarinos Museos reference dataset. Contact data pending.',
  },
];

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
  compartmentIds: record.id === 'MUS-U995' ? ['CMP-U995-CONTROL'] : [],
  episodeIds: record.id === 'MUS-U995' ? ['EPI-STEEL-04'] : [],
  status: 'published',
  source: record.source,
  notes: record.notes,
  latitude: record.latitude,
  longitude: record.longitude,
  launchYear: record.launchYear,
  address: record.address,
  mediaUrl: record.mediaUrl,
  validation: record.validation,
}));

export const SEED_COMPARTMENTS: Compartment[] = [
  {
    id: 'CMP-U995-CONTROL',
    ...BASE,
    name: { en: 'Control Room', es: 'Sala de Control' },
    museumId: 'MUS-U995',
    description: VALIDATION_PLACEHOLDER,
    systemIds: ['SYS-U995-PERISCOPE'],
    status: 'published',
  },
];

export const SEED_SYSTEMS: SubmarineSystem[] = [
  {
    id: 'SYS-U995-PERISCOPE',
    ...BASE,
    name: { en: 'Periscope', es: 'Periscopio' },
    category: 'Observation',
    description: {
      en: 'An optical instrument that lets the crew observe the surface while the submarine remains submerged.',
      es: 'Instrumento óptico que permite a la tripulación observar la superficie mientras el submarino permanece sumergido.',
    },
    compartmentId: 'CMP-U995-CONTROL',
    museumId: 'MUS-U995',
    topics: ['Optics', 'Reflection', 'Observation'],
    status: 'published',
  },
];

/* -------------------------------------------------------------------------- */
/* Episodes and missions                                                      */
/* -------------------------------------------------------------------------- */

export const SEED_EPISODES: Episode[] = [
  {
    id: 'EPI-STEEL-04',
    ...BASE,
    title: { en: 'Steel 04 — Submarine Command', es: 'Acero 04 — Comando del Submarino' },
    seasonId: 'SEA-STEEL',
    museumId: 'MUS-U995',
    compartmentId: 'CMP-U995-CONTROL',
    equipmentId: 'SYS-U995-PERISCOPE',
    mediaUrl: '',
    durationSeconds: null,
    description: {
      en: 'Control room of U-995: a periscope, a dark surface, and a first observation.',
      es: 'Sala de control del U-995: un periscopio, una superficie oscura y una primera observación.',
    },
    narrative: {
      en: 'This story is fiction. The place, the vessel and the museum are real.',
      es: 'Esta historia es ficción. El lugar, el buque y el museo son reales.',
    },
    status: 'published',
    order: 1,
  },
];

export const SEED_MISSIONS: Mission[] = [
  {
    id: 'MIS-STEEL-04',
    ...BASE,
    title: { en: 'Recognize the periscope', es: 'Reconocer el periscopio' },
    episodeId: 'EPI-STEEL-04',
    seasonId: 'SEA-STEEL',
    museumId: 'MUS-U995',
    compartmentId: 'CMP-U995-CONTROL',
    equipmentId: 'SYS-U995-PERISCOPE',
    description: {
      en: 'A first look through the periscope.',
      es: 'Una primera mirada a través del periscopio.',
    },
    learningObjective: {
      en: 'Identify the main function of a periscope in a submarine.',
      es: 'Identificar la función principal de un periscopio en un submarino.',
    },
    timssDomain: 'knowing',
    gsaCompetency: 'Curiosity and observation',
    civilSocietyConnection: { en: '', es: '' },
    status: 'published',
    order: 1,
  },
  {
    id: 'MIS-COPPER-01',
    ...BASE,
    title: {
      en: 'Copper — Periscope and Astronomical Observation',
      es: 'Cobre — Periscopio y observación astronómica',
    },
    episodeId: 'EPI-STEEL-04',
    seasonId: 'SEA-COPPER',
    museumId: 'MUS-U995',
    compartmentId: 'CMP-U995-CONTROL',
    equipmentId: 'SYS-U995-PERISCOPE',
    description: {
      en: 'Use the periscope principle to explain how we see what is not directly in front of us.',
      es: 'Usar el principio del periscopio para explicar cómo vemos lo que no está directamente frente a nosotros.',
    },
    learningObjective: {
      en: 'Apply the periscope principle to astronomical observation.',
      es: 'Aplicar el principio del periscopio a la observación astronómica.',
    },
    timssDomain: 'knowing',
    gsaCompetency: 'Critical thinking',
    civilSocietyConnection: {
      en: 'The periscope principle is also used in inspection cameras, endoscopes and systems for seeing around corners.',
      es: 'El principio del periscopio también se usa en cámaras de inspección, endoscopios y sistemas para ver en las esquinas.',
    },
    status: 'published',
    order: 2,
  },
];

/* -------------------------------------------------------------------------- */
/* Questions                                                                  */
/* -------------------------------------------------------------------------- */

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'QST-STEEL-04-01',
    ...BASE,
    missionId: 'MIS-STEEL-04',
    episodeId: 'EPI-STEEL-04',
    museumId: 'MUS-U995',
    compartmentId: 'CMP-U995-CONTROL',
    equipmentId: 'SYS-U995-PERISCOPE',
    area: 'Science — Physics (Optics)',
    timssDomain: 'knowing',
    gsaCompetency: 'Curiosity and observation',
    topic: 'Periscope',
    level: 'Steel (Grade 8 / Secondary)',
    text: {
      en: 'What is the main function of a periscope in a submarine?',
      es: '¿Cuál es la función principal de un periscopio en un submarino?',
    },
    options: [
      { id: 'A', text: { en: "Measure the submarine's depth.", es: 'Medir la profundidad del submarino.' } },
      { id: 'B', text: { en: 'Allow observation from a protected position.', es: 'Permitir la observación desde una posición protegida.' } },
      { id: 'C', text: { en: 'Generate electrical power for the engines.', es: 'Generar energía eléctrica para los motores.' } },
      { id: 'D', text: { en: "Filter the submarine's internal air.", es: 'Filtrar el aire interno del submarino.' } },
    ],
    correctOptionId: 'B',
    feedback: {
      en: 'Correct. A periscope lets the crew observe the surface from a protected position, without exposing the submarine.',
      es: 'Correcto. El periscopio permite a la tripulación observar la superficie desde una posición protegida, sin exponer el submarino.',
    },
    civilSocietyConnection: { en: '', es: '' },
    source: 'ISA pilot specification — Steel 04 episode',
    status: 'review',
    notes: 'Civil society connection not provided by the pilot specification.',
  },
  {
    id: 'QST-COPPER-01-01',
    ...BASE,
    missionId: 'MIS-COPPER-01',
    episodeId: 'EPI-STEEL-04',
    museumId: 'MUS-U995',
    compartmentId: 'CMP-U995-CONTROL',
    equipmentId: 'SYS-U995-PERISCOPE',
    area: 'Science — Physics (Optics)',
    timssDomain: 'knowing',
    gsaCompetency: 'Critical thinking',
    topic: 'Periscope and astronomical observation',
    level: 'Copper (Grade 8 / Secondary)',
    text: {
      en: 'What principle allows a periscope to observe objects that are not directly visible?',
      es: '¿Qué principio permite a un periscopio observar objetos que no son directamente visibles?',
    },
    options: [
      { id: 'A', text: { en: 'Reflection of light through mirrors or prisms.', es: 'Reflexión de la luz mediante espejos o prismas.' } },
      { id: 'B', text: { en: 'Conversion of light into electricity.', es: 'Conversión de la luz en electricidad.' } },
      { id: 'C', text: { en: 'Increase in air pressure.', es: 'Aumento de la presión del aire.' } },
      { id: 'D', text: { en: 'Water filtration.', es: 'Filtración del agua.' } },
    ],
    correctOptionId: 'A',
    feedback: {
      en: 'Correct. Mirrors or prisms reflect light along the tube, so the observer sees outside without being exposed.',
      es: 'Correcto. Los espejos o prismas reflejan la luz a lo largo del tubo, de modo que el observador ve el exterior sin exponerse.',
    },
    civilSocietyConnection: {
      en: 'The periscope principle is also used in inspection cameras, endoscopes and systems for seeing around corners.',
      es: 'El principio del periscopio también se usa en cámaras de inspección, endoscopios y sistemas para ver en las esquinas.',
    },
    source: 'ISA pilot specification — Copper mission',
    status: 'review',
    notes: 'Question text provided by the pilot specification.',
  },
];

/* -------------------------------------------------------------------------- */
/* Badges                                                                     */
/* -------------------------------------------------------------------------- */

export const SEED_BADGES: Badge[] = [
  {
    id: 'BDG-EXPEDITION-CREDENTIAL',
    ...BASE,
    name: { en: 'Submarine Expedition Credential', es: 'Credencial de Expedición Submarina' },
    type: 'credential',
    seasonId: 'SEA-STEEL',
    missionId: 'MIS-STEEL-04',
    description: {
      en: 'A symbolic recognition for completing the first observation.',
      es: 'Un reconocimiento simbólico por completar la primera observación.',
    },
    icon: 'anchor',
    color: '#8FA3B0',
    criteria: { en: 'Complete the Steel 04 mission.', es: 'Completar la misión Acero 04.' },
    status: 'published',
  },
  {
    id: 'BDG-COPPER-COIN',
    ...BASE,
    name: { en: 'Copper Coin', es: 'Coin Cobre' },
    type: 'coin',
    seasonId: 'SEA-COPPER',
    missionId: 'MIS-COPPER-01',
    description: {
      en: 'A symbolic recognition for validating knowledge.',
      es: 'Un reconocimiento simbólico por validar conocimiento.',
    },
    icon: 'coin',
    color: '#B87333',
    criteria: { en: 'Complete the Copper mission.', es: 'Completar la misión Cobre.' },
    status: 'published',
  },
];

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
