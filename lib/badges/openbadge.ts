/**
 * Open Badges 3.0 (1EdTech OB v3.0) mapping.
 *
 * This module builds OB-compatible documents from ISA data. It intentionally
 * produces UNSIGNED credentials: without a `proof` a document is not a
 * verifiable credential and must never be presented as one.
 *
 * Full conformance (proof, status list, issuer hosting) requires an issuing
 * service; see docs/14_OPEN_BADGES.md.
 */

export const OB_CONTEXT = [
  'https://www.w3.org/ns/credentials/v2',
  'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
] as const;

export interface ObImage {
  id: string;
  type: 'Image';
  caption?: string;
}

export interface ObProfile {
  id: string;
  type: 'Profile';
  name: string;
  url?: string;
  image?: ObImage;
}

export interface ObCriteria {
  id?: string;
  narrative?: string;
}

export interface ObAlignment {
  type: 'Alignment';
  targetName: string;
  targetUrl?: string;
  targetType?: string;
  targetFramework?: string;
}

export interface ObAchievement {
  id: string;
  type: 'Achievement';
  name: string;
  description: string;
  criteria: ObCriteria;
  image?: ObImage;
  achievementType?: string;
  alignment?: ObAlignment[];
  tag?: string[];
}

export interface ObAchievementSubject {
  type: 'AchievementSubject';
  id?: string;
  achievement: ObAchievement;
  result?: {
    type: 'Result';
    resultStatus?: 'Completed' | 'Failed' | 'InProgress';
    achievedLevel?: string;
    value?: string;
  };
}

export interface ObCredential {
  '@context': typeof OB_CONTEXT;
  id: string;
  type: ['VerifiableCredential', 'OpenBadgeCredential'];
  name: string;
  description?: string;
  issuer: ObProfile;
  validFrom: string;
  credentialSubject: ObAchievementSubject;
  proof?: unknown;
}

export interface IsaBadgeSource {
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  badgeType: 'credential' | 'coin' | 'badge';
  seasonTitle: string;
  missionTitle: string;
  institutionName: string;
  institutionCity: string;
  institutionCountry: string;
  criteria: string;
  color: string;
  gsaCompetency?: string;
  timssDomain?: string;
  earnedAt?: string;
}

const ACHIEVEMENT_TYPE: Record<IsaBadgeSource['badgeType'], string> = {
  credential: 'Certificate',
  coin: 'Badge',
  badge: 'Badge',
};

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function buildIssuer(baseUrl: string, source: IsaBadgeSource): ObProfile {
  const institution = `${source.institutionName} — ${source.institutionCity}, ${source.institutionCountry}`;

  return {
    id: `${baseUrl}/issuer`,
    type: 'Profile',
    name: institution,
    url: baseUrl,
  };
}

export function buildAchievement(baseUrl: string, source: IsaBadgeSource): ObAchievement {
  const alignment: ObAlignment[] = [];

  if (source.gsaCompetency) {
    alignment.push({ type: 'Alignment', targetName: source.gsaCompetency, targetType: 'Competency' });
  }

  if (source.timssDomain) {
    alignment.push({
      type: 'Alignment',
      targetName: `TIMSS ${source.timssDomain}`,
      targetType: 'EducationalSubject',
      targetFramework: 'TIMSS',
    });
  }

  return {
    id: `${baseUrl}/achievements/${slug(source.seasonTitle)}/${slug(source.badgeId)}`,
    type: 'Achievement',
    name: source.badgeName,
    description: source.badgeDescription,
    criteria: { narrative: source.criteria },
    achievementType: ACHIEVEMENT_TYPE[source.badgeType],
    alignment: alignment.length > 0 ? alignment : undefined,
    tag: [source.seasonTitle, source.missionTitle].filter(Boolean),
  };
}

/**
 * Builds an unsigned Open Badge credential document.
 * `credentialSubject.id` is intentionally omitted: ISA does not know who the
 * learner is, and inventing an identifier would misrepresent the credential.
 */
export function buildUnsignedCredential(baseUrl: string, source: IsaBadgeSource): ObCredential {
  const achievement = buildAchievement(baseUrl, source);
  const validFrom = source.earnedAt ?? new Date().toISOString();

  return {
    '@context': OB_CONTEXT,
    id: `${baseUrl}/credentials/${slug(source.badgeId)}-${slug(source.missionTitle)}`,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    name: source.badgeName,
    description: source.badgeDescription,
    issuer: buildIssuer(baseUrl, source),
    validFrom,
    credentialSubject: {
      type: 'AchievementSubject',
      achievement,
      result: { type: 'Result', resultStatus: 'Completed', achievedLevel: source.seasonTitle },
    },
  };
}

export interface CredentialCheck {
  ok: boolean;
  problems: string[];
}

/** Structural check against the mandatory OB 3.0 properties. */
export function checkUnsignedCredential(credential: ObCredential): CredentialCheck {
  const problems: string[] = [];

  if (!credential['@context']?.includes('https://www.w3.org/ns/credentials/v2')) {
    problems.push('Missing Verifiable Credentials v2 context.');
  }

  if (!credential.type?.includes('OpenBadgeCredential')) {
    problems.push('Missing OpenBadgeCredential type.');
  }

  if (!credential.issuer?.id || !credential.issuer?.name) {
    problems.push('Issuer requires id and name.');
  }

  if (!credential.validFrom) {
    problems.push('validFrom is required.');
  }

  const achievement = credential.credentialSubject?.achievement;

  if (!achievement?.id || !achievement?.name || !achievement?.criteria) {
    problems.push('Achievement requires id, name and criteria.');
  }

  if (!credential.proof) {
    problems.push('Unsigned: no proof, so the credential is not verifiable.');
  }

  return { ok: problems.length === 0, problems };
}
