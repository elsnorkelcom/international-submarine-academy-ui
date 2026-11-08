/**
 * Application configuration.
 *
 * The configuration tables are maintained outside the app (Google Sheet /
 * AppSheet) and synchronised into `lib/data/datasets/isa-config.json` by
 * `scripts/sync_config.py`. Sections are optional and applied non-destructively.
 */

import type { LocalDatabase } from './repository';
import type { Badge, BadgeRuleType, BadgeType, SeasonName, TimssDomain } from '../domain/types';
import config from './datasets/isa-config.json';

export interface EpisodeConfigEntry {
  id: string;
  titleEn: string;
  titleEs: string;
  seasonId: string;
  museumId: string;
  compartmentId: string;
  equipmentId: string;
  mediaUrl: string;
  durationSeconds: number | null;
  descriptionEn: string;
  descriptionEs: string;
  narrativeEn: string;
  narrativeEs: string;
  order: number;
  status: string;
}

export interface QuestionConfigEntry {
  id: string;
  textEn: string;
  textEs: string;
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
  options: Record<string, { en: string; es: string }>;
  correctOptionId: string;
  feedbackEn: string;
  feedbackEs: string;
  civilEn: string;
  civilEs: string;
  source: string;
  status: string;
  notes: string;
}

export interface AwardConfigEntry {
  badgeId: string;
  nameEn: string;
  nameEs: string;
  type: BadgeType;
  seasonId: string;
  missionId: string;
  criteriaEn: string;
  criteriaEs: string;
  ruleType: BadgeRuleType;
  ruleCount: number;
  color: string;
  status: string;
  icon?: string;
}

export interface SeasonConfigEntry {
  id: string;
  name: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  order: number;
  colorTheme: string;
  timssDomain: TimssDomain;
  gsaEn: string;
  gsaEs: string;
  status: string;
}

export interface MissionConfigEntry {
  id: string;
  titleEn: string;
  titleEs: string;
  episodeId: string;
  seasonId: string;
  museumId: string;
  compartmentId: string;
  equipmentId: string;
  descriptionEn: string;
  descriptionEs: string;
  objectiveEn: string;
  objectiveEs: string;
  timssDomain: TimssDomain;
  gsaCompetency: string;
  civilEn: string;
  civilEs: string;
  order: number;
  status: string;
}

export interface InstitutionConfigEntry {
  id: string;
  nameEn: string;
  nameEs: string;
  type: string;
  country: string;
  city: string;
  website: string;
  contactName: string;
  contactEmail: string;
  status: string;
  notes: string;
}

export interface RoleConfigEntry {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  status: string;
}

export interface DisciplineConfigEntry {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  color: string;
  status: string;
}

export interface CompartmentConfigEntry {
  id: string;
  nameEn: string;
  nameEs: string;
  museumId: string;
  descriptionEn: string;
  descriptionEs: string;
  systemIds: string[];
  status: string;
}

export interface SystemConfigEntry {
  id: string;
  nameEn: string;
  nameEs: string;
  category: string;
  descriptionEn: string;
  descriptionEs: string;
  compartmentId: string;
  museumId: string;
  topics: string[];
  status: string;
}

export interface GridCellConfigEntry {
  id: string;
  specialtyId: string;
  disciplineId: string;
  missionId: string;
  order: number;
  notes: string;
  status: string;
}

export interface IsaConfigFile {
  version: number;
  generatedAt?: string;
  seasons?: SeasonConfigEntry[];
  episodes?: EpisodeConfigEntry[];
  missions?: MissionConfigEntry[];
  questions?: QuestionConfigEntry[];
  awards?: AwardConfigEntry[];
  institutions?: InstitutionConfigEntry[];
  roles?: RoleConfigEntry[];
  disciplines?: DisciplineConfigEntry[];
  compartments?: CompartmentConfigEntry[];
  systems?: SystemConfigEntry[];
  gridCells?: GridCellConfigEntry[];
  settings?: Record<string, string>;
}

function file(): IsaConfigFile {
  return config as unknown as IsaConfigFile;
}

export function seasonsConfig(): SeasonConfigEntry[] {
  return Array.isArray(file().seasons) ? file().seasons! : [];
}

export function episodesConfig(): EpisodeConfigEntry[] {
  return Array.isArray(file().episodes) ? file().episodes! : [];
}

export function questionsConfig(): QuestionConfigEntry[] {
  return Array.isArray(file().questions) ? file().questions! : [];
}

export function missionsConfig(): MissionConfigEntry[] {
  return Array.isArray(file().missions) ? file().missions! : [];
}

export function institutionsConfig(): InstitutionConfigEntry[] {
  return Array.isArray(file().institutions) ? file().institutions! : [];
}

export function rolesConfig(): RoleConfigEntry[] {
  return Array.isArray(file().roles) ? file().roles! : [];
}

export function disciplinesConfig(): DisciplineConfigEntry[] {
  return Array.isArray(file().disciplines) ? file().disciplines! : [];
}

export function compartmentsConfig(): CompartmentConfigEntry[] {
  return Array.isArray(file().compartments) ? file().compartments! : [];
}

export function systemsConfig(): SystemConfigEntry[] {
  return Array.isArray(file().systems) ? file().systems! : [];
}

export function gridCellsConfig(): GridCellConfigEntry[] {
  return Array.isArray(file().gridCells) ? file().gridCells! : [];
}

export function awardsConfig(): AwardConfigEntry[] {
  return Array.isArray(file().awards) ? file().awards! : [];
}

export function settingsConfig(): Record<string, string> {
  return file().settings ?? {};
}

export interface SectionResult {
  created: number;
  updated: number;
  total: number;
}

export type ApplyResult = Record<
  | 'settings'
  | 'seasons'
  | 'episodes'
  | 'missions'
  | 'questions'
  | 'awards'
  | 'institutions'
  | 'roles'
  | 'disciplines'
  | 'compartments'
  | 'systems'
  | 'gridCells',
  SectionResult
>;

function emptyResult(): SectionResult {
  return { created: 0, updated: 0, total: 0 };
}

const SETTINGS_MAP = {
  app_name: 'appName',
  default_language: 'defaultLanguage',
  max_attempts: 'maxAttempts',
  timer_seconds: 'timerSeconds',
  welcome_en: 'welcomeEn',
  welcome_es: 'welcomeEs',
  access_en: 'accessEn',
  access_es: 'accessEs',
  fiction_en: 'fictionEn',
  fiction_es: 'fictionEs',
} as const;

async function applySettings(database: LocalDatabase): Promise<SectionResult> {
  const values = settingsConfig();
  const keys = Object.keys(values);

  if (keys.length === 0) {
    return emptyResult();
  }

  const current = await database.settings().get();

  if (!current) {
    return emptyResult();
  }

  const next = { ...current };

  for (const [key, value] of Object.entries(values)) {
    const mapped = SETTINGS_MAP[key as keyof typeof SETTINGS_MAP];

    if (!mapped) continue;

    if (mapped === 'appName') next.appName = value;
    else if (mapped === 'defaultLanguage') next.defaultLanguage = value === 'es' ? 'es' : 'en';
    else if (mapped === 'maxAttempts') next.maxAttempts = Number(value) || next.maxAttempts;
    else if (mapped === 'timerSeconds') next.timerSeconds = Number(value) || next.timerSeconds;
    else if (mapped === 'welcomeEn') next.welcomeMessage = { ...next.welcomeMessage, en: value };
    else if (mapped === 'welcomeEs') next.welcomeMessage = { ...next.welcomeMessage, es: value };
    else if (mapped === 'accessEn') next.accessScreenText = { ...next.accessScreenText, en: value };
    else if (mapped === 'accessEs') next.accessScreenText = { ...next.accessScreenText, es: value };
    else if (mapped === 'fictionEn') next.fictionNotice = { ...next.fictionNotice, en: value };
    else if (mapped === 'fictionEs') next.fictionNotice = { ...next.fictionNotice, es: value };
  }

  await database.settings().save(next);

  return { created: 0, updated: 1, total: keys.length };
}

async function applySeasons(database: LocalDatabase): Promise<SectionResult> {
  const entries = seasonsConfig();
  const result = emptyResult();
  result.total = entries.length;
  const repository = database.repository('seasons');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((item) => [item.id, item]));

  for (const entry of entries) {
    const payload = {
      name: (entry.name || 'steel') as SeasonName,
      title: { en: entry.titleEn || entry.id, es: entry.titleEs || entry.titleEn || entry.id },
      description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
      order: entry.order,
      colorTheme: entry.colorTheme || byId.get(entry.id)?.colorTheme || '#8FA3B0',
      timssDomain: entry.timssDomain,
      gsaEmphasis: { en: entry.gsaEn, es: entry.gsaEs || entry.gsaEn },
      status: entry.status as never,
    };

    if (byId.has(entry.id)) {
      await repository.update(entry.id, payload as never);
      result.updated += 1;
    } else {
      await repository.create({ id: entry.id, ...payload } as never);
      result.created += 1;
    }
  }

  return result;
}

async function applyMissions(database: LocalDatabase): Promise<SectionResult> {
  const entries = missionsConfig();
  const result = emptyResult();
  result.total = entries.length;
  const repository = database.repository('missions');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((item) => [item.id, item]));

  for (const entry of entries) {
    const payload = {
      title: { en: entry.titleEn || entry.id, es: entry.titleEs || entry.titleEn || entry.id },
      episodeId: entry.episodeId,
      seasonId: entry.seasonId,
      museumId: entry.museumId,
      compartmentId: entry.compartmentId,
      equipmentId: entry.equipmentId,
      description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
      learningObjective: { en: entry.objectiveEn, es: entry.objectiveEs || entry.objectiveEn },
      timssDomain: entry.timssDomain,
      gsaCompetency: entry.gsaCompetency,
      civilSocietyConnection: { en: entry.civilEn, es: entry.civilEs || entry.civilEn },
      order: entry.order,
      status: entry.status as never,
    };

    if (byId.has(entry.id)) {
      await repository.update(entry.id, payload as never);
      result.updated += 1;
    } else {
      await repository.create({ id: entry.id, ...payload } as never);
      result.created += 1;
    }
  }

  return result;
}

async function applyEpisodes(database: LocalDatabase): Promise<SectionResult> {
  const entries = episodesConfig();
  const result = emptyResult();
  result.total = entries.length;
  const repository = database.repository('episodes');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((item) => [item.id, item]));

  for (const entry of entries) {
    const payload = {
      title: { en: entry.titleEn || entry.id, es: entry.titleEs || entry.titleEn || entry.id },
      seasonId: entry.seasonId,
      museumId: entry.museumId,
      compartmentId: entry.compartmentId,
      equipmentId: entry.equipmentId,
      mediaUrl: entry.mediaUrl,
      durationSeconds: entry.durationSeconds,
      description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
      narrative: { en: entry.narrativeEn, es: entry.narrativeEs || entry.narrativeEn },
      order: entry.order,
      status: entry.status as never,
    };

    if (byId.has(entry.id)) {
      await repository.update(entry.id, payload as never);
      result.updated += 1;
    } else {
      await repository.create({ id: entry.id, ...payload } as never);
      result.created += 1;
    }
  }

  return result;
}

async function applyQuestions(database: LocalDatabase): Promise<SectionResult> {
  const entries = questionsConfig();
  const result = emptyResult();
  result.total = entries.length;
  const repository = database.repository('questions');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((item) => [item.id, item]));

  for (const entry of entries) {
    const options = ['A', 'B', 'C', 'D'].map((letter) => ({
      id: letter as 'A' | 'B' | 'C' | 'D',
      text: entry.options[letter] ?? { en: '', es: '' },
    }));

    const payload = {
      missionId: entry.missionId,
      episodeId: entry.episodeId,
      museumId: entry.museumId,
      compartmentId: entry.compartmentId,
      equipmentId: entry.equipmentId,
      area: entry.area,
      timssDomain: entry.timssDomain,
      gsaCompetency: entry.gsaCompetency,
      topic: entry.topic,
      level: entry.level,
      text: { en: entry.textEn, es: entry.textEs || entry.textEn },
      options,
      correctOptionId: entry.correctOptionId as 'A' | 'B' | 'C' | 'D',
      feedback: { en: entry.feedbackEn, es: entry.feedbackEs || entry.feedbackEn },
      civilSocietyConnection: { en: entry.civilEn, es: entry.civilEs || entry.civilEn },
      source: entry.source,
      status: entry.status as never,
      notes: entry.notes,
    };

    if (byId.has(entry.id)) {
      await repository.update(entry.id, payload as never);
      result.updated += 1;
    } else {
      await repository.create({ id: entry.id, ...payload } as never);
      result.created += 1;
    }
  }

  return result;
}

type ConfigCollection = 'institutions' | 'roles' | 'disciplines' | 'compartments' | 'systems' | 'gridCells';

/** Upserts a whole section by id, without deleting rows that left the table. */
async function applySection(
  database: LocalDatabase,
  collection: ConfigCollection,
  entries: { id: string }[],
  toPayload: (entry: never) => Record<string, unknown>,
): Promise<SectionResult> {
  const result = emptyResult();
  result.total = entries.length;

  if (entries.length === 0) {
    return result;
  }

  const repository = database.repository(collection) as unknown as {
    list(options: Record<string, unknown>): Promise<{ items: { id: string }[] }>;
    update(id: string, patch: Record<string, unknown>): Promise<unknown>;
    create(input: Record<string, unknown>): Promise<unknown>;
  };

  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const known = new Set(existing.items.map((item) => item.id));

  for (const entry of entries) {
    const payload = toPayload(entry as never);

    if (known.has(entry.id)) {
      await repository.update(entry.id, payload);
      result.updated += 1;
    } else {
      await repository.create({ id: entry.id, ...payload });
      result.created += 1;
    }
  }

  return result;
}

async function applyInstitutions(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'institutions', institutionsConfig(), (entry: InstitutionConfigEntry) => ({
    name: { en: entry.nameEn || entry.id, es: entry.nameEs || entry.nameEn || entry.id },
    type: entry.type as never,
    country: entry.country,
    city: entry.city,
    website: entry.website,
    contactName: entry.contactName,
    contactEmail: entry.contactEmail,
    status: entry.status as never,
    notes: entry.notes,
  }));
}

async function applyRoles(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'roles', rolesConfig(), (entry: RoleConfigEntry) => ({
    name: { en: entry.nameEn || entry.id, es: entry.nameEs || entry.nameEn || entry.id },
    description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
    status: entry.status as never,
  }));
}

async function applyDisciplines(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'disciplines', disciplinesConfig(), (entry: DisciplineConfigEntry) => ({
    name: { en: entry.nameEn || entry.id, es: entry.nameEs || entry.nameEn || entry.id },
    description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
    color: entry.color || '#8FA3B0',
    status: entry.status as never,
  }));
}

async function applyCompartments(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'compartments', compartmentsConfig(), (entry: CompartmentConfigEntry) => ({
    name: { en: entry.nameEn || entry.id, es: entry.nameEs || entry.nameEn || entry.id },
    museumId: entry.museumId,
    description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
    systemIds: entry.systemIds,
    status: entry.status as never,
  }));
}

async function applySystems(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'systems', systemsConfig(), (entry: SystemConfigEntry) => ({
    name: { en: entry.nameEn || entry.id, es: entry.nameEs || entry.nameEn || entry.id },
    category: entry.category,
    description: { en: entry.descriptionEn, es: entry.descriptionEs || entry.descriptionEn },
    compartmentId: entry.compartmentId,
    museumId: entry.museumId,
    topics: entry.topics,
    status: entry.status as never,
  }));
}

async function applyGridCells(database: LocalDatabase): Promise<SectionResult> {
  return applySection(database, 'gridCells', gridCellsConfig(), (entry: GridCellConfigEntry) => ({
    specialtyId: entry.specialtyId,
    disciplineId: entry.disciplineId,
    missionId: entry.missionId,
    order: entry.order,
    notes: entry.notes,
    status: entry.status as never,
  }));
}

async function applyAwards(database: LocalDatabase): Promise<SectionResult> {
  const entries = awardsConfig();
  const result = emptyResult();
  result.total = entries.length;
  const repository = database.repository('badges');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((item) => [item.id, item]));

  for (const entry of entries) {
    const current = byId.get(entry.badgeId);

    if (current) {
      await repository.update(current.id, {
        ruleType: entry.ruleType,
        ruleCount: entry.ruleCount,
        seasonId: entry.seasonId || current.seasonId,
        missionId: entry.ruleType === 'mission' ? entry.missionId || current.missionId : '',
        status: entry.status as Badge['status'],
      } as never);
      result.updated += 1;
      continue;
    }

    await repository.create({
      id: entry.badgeId,
      name: { en: entry.nameEn, es: entry.nameEs },
      type: entry.type,
      seasonId: entry.seasonId,
      missionId: entry.ruleType === 'mission' ? entry.missionId : '',
      description: { en: entry.nameEn, es: entry.nameEs },
      icon: entry.icon || 'season',
      color: entry.color || '#8FA3B0',
      criteria: { en: entry.criteriaEn, es: entry.criteriaEs },
      status: entry.status as Badge['status'],
      ruleType: entry.ruleType,
      ruleCount: entry.ruleCount,
    } as never);
    result.created += 1;
  }

  return result;
}

/**
 * Applies every configured section. Nothing is deleted: a row removed from a
 * table leaves the record in place.
 */
export async function applyConfig(database: LocalDatabase): Promise<ApplyResult> {
  return {
    settings: await applySettings(database),
    seasons: await applySeasons(database),
    episodes: await applyEpisodes(database),
    missions: await applyMissions(database),
    questions: await applyQuestions(database),
    awards: await applyAwards(database),
    institutions: await applyInstitutions(database),
    roles: await applyRoles(database),
    disciplines: await applyDisciplines(database),
    compartments: await applyCompartments(database),
    systems: await applySystems(database),
    gridCells: await applyGridCells(database),
  };
}

/** Backwards-compatible single-section entry point. */
export async function applyAwardsConfig(database: LocalDatabase): Promise<SectionResult> {
  return applyAwards(database);
}
