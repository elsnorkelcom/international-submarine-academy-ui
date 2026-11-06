/**
 * Award rules.
 *
 * - `mission`: the badge is granted when its mission is completed.
 * - `season-count`: the badge is granted when N missions of the season are
 *   completed (end-of-season recognition).
 */

import type { LocalDatabase } from '../data/repository';
import type { Badge, CredentialRecord, Mission } from '../domain/types';
import type { LearningProgress } from '../learning/progress';
import { issueCredential } from './registry';

export interface EvaluateInput {
  database: LocalDatabase;
  mission: Mission;
  completedMissionIds: string[];
  baseUrl: string;
}

export interface AwardResult {
  issued: CredentialRecord[];
  badges: Badge[];
}

export async function evaluateAwards(input: EvaluateInput): Promise<AwardResult> {
  const { database, mission, completedMissionIds, baseUrl } = input;

  const [badges, missions, seasons, museums] = await Promise.all([
    database.repository('badges').list({ pageSize: 0 }),
    database.repository('missions').list({ pageSize: 0 }),
    database.repository('seasons').list({ pageSize: 0 }),
    database.repository('museums').list({ pageSize: 0 }),
  ]);

  const completed = new Set(completedMissionIds);
  const issued: CredentialRecord[] = [];
  const awarded: Badge[] = [];

  for (const badge of badges.items) {
    if (badge.status !== 'published') {
      continue;
    }

    const eligible =
      badge.ruleType === 'season-count'
        ? missions.items.filter(
            (item) => item.seasonId === badge.seasonId && completed.has(item.id),
          ).length >= Math.max(1, badge.ruleCount)
        : badge.missionId === mission.id;

    if (!eligible) {
      continue;
    }

    const record = await issueCredential({
      database,
      badge,
      mission,
      season: seasons.items.find((item) => item.id === badge.seasonId) ?? null,
      museum: museums.items.find((item) => item.id === mission.museumId) ?? null,
      baseUrl,
    });

    if (record) {
      issued.push(record);
      awarded.push(badge);
    }
  }

  return { issued, badges: awarded };
}

/** Helper kept for callers that already hold a progress-like object. */
export function completedMissionIds(progress: LearningProgress): string[] {
  return Object.values(progress.missions)
    .filter((mission) => mission.correct)
    .map((mission) => mission.missionId);
}
