/**
 * Credential registry (Open Badges 3.0).
 *
 * Every award produces a record with a stable registry number and the full
 * credential document. Documents stay unsigned until an issuer service signs
 * them; the registry keeps them so signing is a later, non-destructive step.
 */

import type { LocalDatabase } from '../data/repository';
import type { Badge, CredentialRecord, Mission, Museum, Season } from '../domain/types';
import { buildUnsignedCredential, type IsaBadgeSource } from './openbadge';

export interface IssueInput {
  database: LocalDatabase;
  badge: Badge;
  mission: Mission;
  season: Season | null;
  museum: Museum | null;
  baseUrl: string;
}

function english(value: { en: string; es: string } | undefined): string {
  return value?.en ?? '';
}

export async function listCredentials(database: LocalDatabase): Promise<CredentialRecord[]> {
  const result = await database.repository('credentials').list({ pageSize: 0, sortBy: 'createdAt' });
  return result.items.reverse();
}

export async function findCredential(
  database: LocalDatabase,
  badgeId: string,
  missionId: string,
): Promise<CredentialRecord | null> {
  const result = await database.repository('credentials').list({ pageSize: 0 });
  return (
    result.items.find(
      (item) => item.badgeId === badgeId && item.missionId === missionId && item.credentialStatus === 'issued',
    ) ?? null
  );
}

/** Issues a credential once per badge + mission. Returns null when it exists. */
export async function issueCredential(input: IssueInput): Promise<CredentialRecord | null> {
  const { database, badge, mission, season, museum, baseUrl } = input;

  const existing = await findCredential(database, badge.id, mission.id);

  if (existing) {
    return null;
  }

  const source: IsaBadgeSource = {
    badgeId: badge.id,
    badgeName: english(badge.name),
    badgeDescription: english(badge.description),
    badgeType: badge.type,
    seasonTitle: season ? english(season.title) : '',
    missionTitle: english(mission.title),
    institutionName: museum ? english(museum.museumName) : '',
    institutionCity: museum?.city ?? '',
    institutionCountry: museum?.country ?? '',
    criteria: english(badge.criteria),
    color: badge.color,
    gsaCompetency: mission.gsaCompetency,
    timssDomain: mission.timssDomain,
  };

  const document = buildUnsignedCredential(baseUrl, source);
  const issued = await database.repository('credentials').list({ pageSize: 0 });
  const sequence = String(issued.items.length + 1).padStart(4, '0');
  const year = new Date().getUTCFullYear();

  return database.repository('credentials').create({
    badgeId: badge.id,
    missionId: mission.id,
    seasonId: season?.id ?? mission.seasonId,
    institutionId: museum?.id ?? '',
    registryNo: `ISA-${year}-${sequence}`,
    criteriaSnapshot: source.criteria,
    document: document as unknown as Record<string, unknown>,
    credentialStatus: 'issued',
    proofStatus: 'unsigned',
    subject: 'anonymous',
  } as never);
}

export async function revokeCredential(
  database: LocalDatabase,
  id: string,
  reason: string,
): Promise<void> {
  await database.repository('credentials').update(id, {
    credentialStatus: 'revoked',
    criteriaSnapshot: reason,
  } as never);
}

/** Bundle used for backup and for a future signing service. */
export function credentialBundle(records: CredentialRecord[]): string {
  return JSON.stringify(
    {
      type: 'IsaCredentialBundle',
      version: 1,
      generatedAt: new Date().toISOString(),
      count: records.length,
      credentials: records,
    },
    null,
    2,
  );
}
