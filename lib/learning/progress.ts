/**
 * Local learning progress.
 *
 * Stored in localStorage: no accounts, no personal data, no server. A different
 * device starts from zero, which is an accepted MVP limitation.
 */

export interface MissionResult {
  missionId: string;
  episodeId: string;
  seasonId: string;
  badgeId: string | null;
  correct: boolean;
  attempts: number;
  points: number;
  completedAt: string;
}

export interface LearningProgress {
  version: 1;
  points: number;
  streak: number;
  bestStreak: number;
  missions: Record<string, MissionResult>;
  badges: string[];
}

const STORAGE_KEY = 'isa-progress-v1';

export function emptyProgress(): LearningProgress {
  return { version: 1, points: 0, streak: 0, bestStreak: 0, missions: {}, badges: [] };
}

export function readProgress(): LearningProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptyProgress();
    }

    const parsed = JSON.parse(raw) as LearningProgress;

    if (parsed?.version !== 1 || typeof parsed.missions !== 'object') {
      return emptyProgress();
    }

    return {
      version: 1,
      points: Number(parsed.points) || 0,
      streak: Number(parsed.streak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      missions: parsed.missions ?? {},
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(progress: LearningProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Progress stays in memory for this session.
  }
}

export interface AnswerSummary {
  correct: boolean;
  attempts: number;
  secondsLeft: number | null;
}

/** Records a finished mission and returns the updated progress plus rewards. */
export function completeMission(
  progress: LearningProgress,
  input: {
    missionId: string;
    episodeId: string;
    seasonId: string;
    badgeId: string | null;
  },
  answer: AnswerSummary,
): { progress: LearningProgress; pointsEarned: number; newBadge: string | null } {
  const alreadyDone = Boolean(progress.missions[input.missionId]);
  const base = answer.correct ? 100 : 25;
  const attemptPenalty = Math.max(0, answer.attempts - 1) * 20;
  const pointsEarned = alreadyDone ? 0 : Math.max(25, base - attemptPenalty);
  const streak = answer.correct ? progress.streak + 1 : 0;
  const newBadge =
    answer.correct && input.badgeId && !progress.badges.includes(input.badgeId) ? input.badgeId : null;

  const next: LearningProgress = {
    version: 1,
    points: progress.points + pointsEarned,
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
    missions: {
      ...progress.missions,
      [input.missionId]: {
        missionId: input.missionId,
        episodeId: input.episodeId,
        seasonId: input.seasonId,
        badgeId: input.badgeId,
        correct: answer.correct,
        attempts: answer.attempts,
        points: (progress.missions[input.missionId]?.points ?? 0) + pointsEarned,
        completedAt: new Date().toISOString(),
      },
    },
    badges: newBadge ? [...progress.badges, newBadge] : progress.badges,
  };

  writeProgress(next);

  return { progress: next, pointsEarned, newBadge };
}

/** Adds badges that were awarded by rules outside the mission itself. */
export function addBadges(progress: LearningProgress, badgeIds: string[]): LearningProgress {
  const missing = badgeIds.filter((id) => !progress.badges.includes(id));

  if (missing.length === 0) {
    return progress;
  }

  const next: LearningProgress = { ...progress, badges: [...progress.badges, ...missing] };
  writeProgress(next);
  return next;
}

export function resetProgress(): LearningProgress {
  const empty = emptyProgress();
  writeProgress(empty);
  return empty;
}
