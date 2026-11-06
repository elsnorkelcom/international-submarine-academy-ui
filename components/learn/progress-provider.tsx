'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  addBadges,
  completeMission,
  emptyProgress,
  readProgress,
  resetProgress,
  type AnswerSummary,
  type LearningProgress,
} from '@/lib/learning/progress';

interface ProgressContextValue {
  progress: LearningProgress;
  ready: boolean;
  record: (
    input: { missionId: string; episodeId: string; seasonId: string; badgeId: string | null },
    answer: AnswerSummary,
  ) => { pointsEarned: number; newBadge: string | null };
  grantBadges: (badgeIds: string[]) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  const record = useCallback<ProgressContextValue['record']>((input, answer) => {
    let outcome = { pointsEarned: 0, newBadge: null as string | null };

    setProgress((current) => {
      const result = completeMission(current, input, answer);
      outcome = { pointsEarned: result.pointsEarned, newBadge: result.newBadge };
      return result.progress;
    });

    return outcome;
  }, []);

  const grantBadges = useCallback((badgeIds: string[]) => {
    setProgress((current) => addBadges(current, badgeIds));
  }, []);

  const reset = useCallback(() => {
    setProgress(resetProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ progress, ready, record, grantBadges, reset }),
    [progress, ready, record, grantBadges, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used inside <ProgressProvider>.');
  }

  return context;
}
