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

export interface IsaConfigFile {
  version: number;
  generatedAt?: string;
  seasons?: SeasonConfigEntry[];
  missions?: MissionConfigEntry[];
  awards?: AwardConfigEntry[];
  settings?: Record<string, string>;
}

function file(): IsaConfigFile {
  return config as unknown as IsaConfigFile;
}

export function seasonsConfig(): SeasonConfigEntry[] {
  return Array.isArray(file().seasons) ? file().seasons! : [];
}

export function missionsConfig(): MissionConfigEntry[] {
  return Array.isArray(file().missions) ? file().missions! : [];
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

export type ApplyResult = Record<'settings' | 'seasons' | 'missions' | 'awards', SectionResult>;

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
      icon: 'season',
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
    missions: await applyMissions(database),
    awards: await applyAwards(database),
  };
}

/** Backwards-compatible single-section entry point. */
export async function applyAwardsConfig(database: LocalDatabase): Promise<SectionResult> {
  return applyAwards(database);
}
