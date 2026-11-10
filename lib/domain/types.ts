/**
 * ISA domain model.
 *
 * Content-bearing text is always bilingual from day one (`LocalizedText`) so a
 * language selector can be added without touching the data layer later.
 *
 * Every record carries audit fields and supports soft deletion. Nothing in this
 * file defines UI, storage or transport concerns.
 */

export type IsoDateString = string;

export type LanguageCode = 'en' | 'es';

/** Bilingual text. English is the reference value; Spanish is required too. */
export interface LocalizedText {
  en: string;
  es: string;
}

/** Audit trail required by the specification. */
export interface AuditFields {
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  createdBy: string;
  updatedBy: string;
}

/** Soft deletion marker. `null` means the record is live. */
export interface SoftDeleteFields {
  deletedAt: IsoDateString | null;
}

export interface EntityBase extends AuditFields, SoftDeleteFields {
  id: string;
}

/* -------------------------------------------------------------------------- */
/* Enumerations                                                                */
/* -------------------------------------------------------------------------- */

export type InstitutionType = 'museum' | 'association' | 'partner' | 'school' | 'other';

export type InstitutionStatus = 'active' | 'inactive';

export type AccessKeyStatus = 'active' | 'suspended' | 'revoked';

export type AccessKeyScope = 'mvp' | 'pilot' | 'demo' | 'internal';

/** Editorial status for museums, compartments, systems, episodes and missions. */
export type PublicationStatus = 'draft' | 'review' | 'published' | 'archived';

/** Editorial status for questions. */
export type QuestionStatus =
  | 'idea'
  | 'proposal'
  | 'review'
  | 'validated'
  | 'published'
  | 'archived';

/** Knowledge domain used by TIMSS. */
export type TimssDomain = 'knowing' | 'applying' | 'reasoning' | 'integrated';

export type SeasonName = 'steel' | 'copper' | 'bronze' | 'silver' | 'gold';

export type BadgeType = 'credential' | 'coin' | 'badge';

export type BadgeStatus = 'draft' | 'published' | 'archived';

/**
 * How a badge is awarded.
 * - `mission`: completing the linked mission.
 * - `season-count`: completing N missions of the linked season (end of season).
 */
export type BadgeRuleType = 'mission' | 'season-count';

/**
 * Whether the historical or museum information is backed by a reviewed source.
 * The learner UI must show "Information to be validated." while it is pending.
 */
export type ValidationStatus = 'validated' | 'pending';

/* -------------------------------------------------------------------------- */
/* 1. Institutions                                                            */
/* -------------------------------------------------------------------------- */

export interface Institution extends EntityBase {
  name: LocalizedText;
  type: InstitutionType;
  country: string;
  city: string;
  website: string;
  contactName: string;
  contactEmail: string;
  status: InstitutionStatus;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/* 2. Access keys                                                             */
/* -------------------------------------------------------------------------- */

export interface AccessKey extends EntityBase {
  institutionId: string;
  /** Human label used in the admin panel, never the secret itself. */
  label: string;
  /** SHA-256 hash of the institutional key. Plain keys are never stored. */
  keyHash: string;
  status: AccessKeyStatus;
  validFrom: IsoDateString | null;
  validUntil: IsoDateString | null;
  scope: AccessKeyScope;
  notes: string;
}

/* -------------------------------------------------------------------------- */
/* 3. Museums                                                                 */
/* -------------------------------------------------------------------------- */

export interface Museum extends EntityBase {
  name: LocalizedText;
  museumName: LocalizedText;
  country: string;
  city: string;
  website: string;
  vesselType: string;
  propulsion: string;
  origin: string;
  description: LocalizedText;
  compartmentIds: string[];
  episodeIds: string[];
  status: PublicationStatus;
  source: string;
  notes: string;
  /** Optional geographic and archival data coming from reference datasets. */
  latitude: number | null;
  longitude: number | null;
  launchYear: number | null;
  address: string;
  mediaUrl: string;
  validation: ValidationStatus;
  /** Archive code from the reference dataset, e.g. SNK-012. */
  dossier: string;
  /** Museum situation key: flote, agua, tierra, cerrado, monumento. */
  situation: string;
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/* 4. Compartments                                                            */
/* -------------------------------------------------------------------------- */

export interface Compartment extends EntityBase {
  name: LocalizedText;
  museumId: string;
  description: LocalizedText;
  systemIds: string[];
  status: PublicationStatus;
}

/* -------------------------------------------------------------------------- */
/* 5. Systems and equipment                                                   */
/* -------------------------------------------------------------------------- */

export interface SubmarineSystem extends EntityBase {
  name: LocalizedText;
  category: string;
  description: LocalizedText;
  compartmentId: string;
  museumId: string;
  topics: string[];
  status: PublicationStatus;
}

/* -------------------------------------------------------------------------- */
/* 6. Seasons                                                                 */
/* -------------------------------------------------------------------------- */

export interface Season extends EntityBase {
  name: SeasonName;
  title: LocalizedText;
  description: LocalizedText;
  order: number;
  colorTheme: string;
  timssDomain: TimssDomain;
  gsaEmphasis: LocalizedText;
  status: BadgeStatus;
}

/* -------------------------------------------------------------------------- */
/* 7. Episodes                                                                */
/* -------------------------------------------------------------------------- */

export interface Episode extends EntityBase {
  title: LocalizedText;
  seasonId: string;
  museumId: string;
  compartmentId: string;
  equipmentId: string;
  mediaUrl: string;
  /** Miniatura 16:9 provista por el equipo de arte; si falta se usa el poster por disciplina. */
  posterUrl?: string;
  durationSeconds: number | null;
  description: LocalizedText;
  narrative: LocalizedText;
  status: PublicationStatus;
  order: number;
}

/* -------------------------------------------------------------------------- */
/* 8. Missions                                                                */
/* -------------------------------------------------------------------------- */

export interface Mission extends EntityBase {
  title: LocalizedText;
  episodeId: string;
  seasonId: string;
  museumId: string;
  compartmentId: string;
  equipmentId: string;
  description: LocalizedText;
  learningObjective: LocalizedText;
  timssDomain: TimssDomain;
  gsaCompetency: string;
  civilSocietyConnection: LocalizedText;
  status: PublicationStatus;
  order: number;
  /** Cobre: celda de la grilla (especialidad × disciplina) y su índice 1-20. */
  cellCode?: string;
  cellIndex?: number;
  specialtyId?: string;
  disciplineId?: string;
}

/* -------------------------------------------------------------------------- */
/* 9. Questions                                                               */
/* -------------------------------------------------------------------------- */

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  id: OptionId;
  text: LocalizedText;
}

export interface Question extends EntityBase {
  missionId: string;
  episodeId: string;
  museumId: string;
  compartmentId: string;
  equipmentId: string;
  area: string;
  timssDomain: TimssDomain;
  gsaCompetency: string;
  topic: string;
  level: string;
  text: LocalizedText;
  options: QuestionOption[];
  correctOptionId: OptionId;
  feedback: LocalizedText;
  civilSocietyConnection: LocalizedText;
  source: string;
  status: QuestionStatus;
  notes: string;
  /** Cobre: variante de la celda (1-3) y trazabilidad TIMSS. */
  cellCode?: string;
  variantIndex?: number;
  timssCycle?: string;
  timssItemId?: string;
  timssContentDomain?: string;
  referenceRelation?: string;
}

/* -------------------------------------------------------------------------- */
/* 10. Badges                                                                 */
/* -------------------------------------------------------------------------- */

export interface Badge extends EntityBase {
  name: LocalizedText;
  type: BadgeType;
  seasonId: string;
  missionId: string;
  description: LocalizedText;
  icon: string;
  color: string;
  criteria: LocalizedText;
  status: BadgeStatus;
  ruleType: BadgeRuleType;
  /** Missions required when `ruleType` is `season-count`. */
  ruleCount: number;
}

/* -------------------------------------------------------------------------- */
/* 11. Roles                                                                  */
/* -------------------------------------------------------------------------- */

export interface Role extends EntityBase {
  name: LocalizedText;
  description: LocalizedText;
  equipmentIds: string[];
  status: BadgeStatus;
}

/* -------------------------------------------------------------------------- */
/* 12. Disciplines                                                            */
/* -------------------------------------------------------------------------- */

export interface Discipline extends EntityBase {
  name: LocalizedText;
  description: LocalizedText;
  color: string;
  status: BadgeStatus;
}

/* -------------------------------------------------------------------------- */
/* 13. Settings                                                               */
/* -------------------------------------------------------------------------- */

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  copper: string;
  text: string;
}

export interface FeatureFlags {
  enableTimer: boolean;
  enableAmbientSound: boolean;
  enableProposals: boolean;
  enableAdminPreview: boolean;
}

export interface Settings extends EntityBase {
  appName: string;
  welcomeMessage: LocalizedText;
  accessScreenText: LocalizedText;
  fictionNotice: LocalizedText;
  theme: ThemeColors;
  defaultLanguage: LanguageCode;
  featureFlags: FeatureFlags;
  maxAttempts: number;
  timerSeconds: number;
  fallbackContentStatus: ValidationStatus;
}

/* -------------------------------------------------------------------------- */
/* Issued credentials (Open Badges 3.0 registry)                              */
/* -------------------------------------------------------------------------- */

export type CredentialStatus = 'issued' | 'revoked';

/**
 * A credential issued to the local learner. Until an issuer service signs it,
 * the document has no proof and stays marked as unsigned.
 */
export interface CredentialRecord extends EntityBase {
  badgeId: string;
  missionId: string;
  seasonId: string;
  institutionId: string;
  registryNo: string;
  criteriaSnapshot: string;
  document: Record<string, unknown>;
  credentialStatus: CredentialStatus;
  proofStatus: 'unsigned' | 'signed';
  /** ISA collects no personal data, so the subject stays anonymous. */
  subject: 'anonymous';
}

/* -------------------------------------------------------------------------- */
/* Grid (specialty x discipline)                                              */
/* -------------------------------------------------------------------------- */

/** One cell of the 5x5 matrix: a mission published for a specialty+discipline. */
export interface GridCell extends EntityBase {
  specialtyId: string;
  disciplineId: string;
  missionId: string;
  order: number;
  notes: string;
  status: BadgeStatus;
}

/* -------------------------------------------------------------------------- */
/* Collections                                                               */
/* -------------------------------------------------------------------------- */

export const COLLECTIONS = [
  'institutions',
  'accessKeys',
  'museums',
  'compartments',
  'systems',
  'seasons',
  'episodes',
  'missions',
  'questions',
  'badges',
  'roles',
  'disciplines',
  'gridCells',
  'credentials',
  'settings',
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

/** Collections that can accumulate many records and support CRUD. */
export type EntityCollectionName = Exclude<CollectionName, 'settings'>;

export type EntityByCollection = {
  institutions: Institution;
  accessKeys: AccessKey;
  museums: Museum;
  compartments: Compartment;
  systems: SubmarineSystem;
  seasons: Season;
  episodes: Episode;
  missions: Mission;
  questions: Question;
  badges: Badge;
  roles: Role;
  disciplines: Discipline;
  gridCells: GridCell;
  credentials: CredentialRecord;
};

export type AnyEntity = EntityByCollection[EntityCollectionName];

export type EntityStatus =
  | InstitutionStatus
  | AccessKeyStatus
  | PublicationStatus
  | QuestionStatus
  | BadgeStatus;

export const READABLE_ID_PREFIX: Record<EntityCollectionName, string> = {
  institutions: 'INS',
  accessKeys: 'KEY',
  museums: 'MUS',
  compartments: 'CMP',
  systems: 'SYS',
  seasons: 'SEA',
  episodes: 'EPI',
  missions: 'MIS',
  questions: 'QST',
  badges: 'BDG',
  roles: 'ROL',
  disciplines: 'DIS',
  gridCells: 'GRD',
  credentials: 'CRD',
};

/** True when the record was soft deleted. */
export function isDeleted(record: SoftDeleteFields): boolean {
  return record.deletedAt !== null;
}

/** Returns the text for a language with a safe fallback to English. */
export function localize(text: LocalizedText, language: LanguageCode): string {
  const value = language === 'es' ? text.es : text.en;
  return value && value.trim().length > 0 ? value : text.en;
}
