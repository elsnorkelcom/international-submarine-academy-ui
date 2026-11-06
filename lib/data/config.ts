/**
 * Accreditation configuration.
 *
 * The awards table is maintained outside the app (Google Sheet / AppSheet) and
 * synchronised into `lib/data/datasets/isa-config.json` by
 * `scripts/sync_config.py`. This module applies that configuration to the
 * badges stored in the browser database.
 */

import type { LocalDatabase } from './repository';
import type { Badge, BadgeRuleType, BadgeType } from '../domain/types';
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

export interface IsaConfigFile {
  version: number;
  generatedAt?: string;
  awards: AwardConfigEntry[];
}

export function awardsConfig(): AwardConfigEntry[] {
  const file = config as unknown as IsaConfigFile;
  return Array.isArray(file.awards) ? file.awards : [];
}

export interface ApplyConfigResult {
  created: number;
  updated: number;
  total: number;
}

/**
 * Creates missing badges and updates the rule of existing ones.
 * Nothing is deleted: a badge that disappears from the table stays in place.
 */
export async function applyAwardsConfig(database: LocalDatabase): Promise<ApplyConfigResult> {
  const list = awardsConfig();
  const repository = database.repository('badges');
  const existing = await repository.list({ pageSize: 0, includeDeleted: true });
  const byId = new Map(existing.items.map((badge) => [badge.id, badge]));

  let created = 0;
  let updated = 0;

  for (const entry of list) {
    const current = byId.get(entry.badgeId);

    if (current) {
      await repository.update(current.id, {
        ruleType: entry.ruleType,
        ruleCount: entry.ruleCount,
        seasonId: entry.seasonId || current.seasonId,
        missionId: entry.ruleType === 'mission' ? entry.missionId || current.missionId : '',
        status: entry.status as Badge['status'],
      });

      updated += 1;
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

    created += 1;
  }

  return { created, updated, total: list.length };
}
