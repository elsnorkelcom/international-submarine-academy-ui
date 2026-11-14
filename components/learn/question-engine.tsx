'use client';

import { useEffect, useRef, useState } from 'react';

import { localize, type LanguageCode, type Question } from '@/lib/domain/types';
import type { AppStrings } from '@/lib/i18n/app';

export interface QuestionOutcome {
  correct: boolean;
  attempts: number;
  secondsLeft: number | null;
}

interface QuestionEngineProps {
  question: Question;
  language: LanguageCode;
  t: AppStrings['learn']['episode'];
  timerSeconds: number | null;
  /** Intentos ya consumidos antes de esta pregunta (variantes anteriores). */
  attemptOffset: number;
  hasAlternate: boolean;
  onResolved: (outcome: QuestionOutcome) => void;
  /** Pide cambiar a otra variante y suma los intentos usados acá. */
  onAlternate: (attemptsUsed: number) => void;
}

export function QuestionEngine({
  question,
  language,
  t,
  timerSeconds,
  attemptOffset,
  hasAlternate,
  onResolved,
  onAlternate,
}: QuestionEngineProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(timerSeconds);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (timerSeconds === null || showFeedback || resolved) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => (current === null ? null : Math.max(0, current - 1)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerSeconds, showFeedback, resolved, timerEpoch]);

  useEffect(() => {
    if (timerSeconds === null || showFeedback || resolved || timeLeft !== 0) {
      return;
    }

    setSelected(null);
    setAttempts((current) => current + 1);
    setShowFeedback(true);
  }, [timeLeft, timerSeconds, showFeedback, resolved]);

  function handleOption(optionId: string) {
    if (showFeedback || resolved) {
      return;
    }

    setSelected(optionId);

    if (optionId === question.correctOptionId) {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      setResolved(true);
      onResolved({
        correct: true,
        attempts: attemptOffset + attempts + 1,
        secondsLeft: timeLeft,
      });
      return;
    }

    setAttempts((current) => current + 1);
    setShowFeedback(true);
  }

  function handleRetry() {
    setSelected(null);
    setShowFeedback(false);
    setTimeLeft(timerSeconds);
    setTimerEpoch((current) => current + 1);
  }

  function handleAlternate() {
    setSelected(null);
    setShowFeedback(false);
    onAlternate(attempts);
  }

  const isCorrectSelection = selected === question.correctOptionId;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{t.question}</p>
        {timeLeft !== null && !showFeedback && !resolved ? (
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
              timeLeft <= 5 ? 'text-red-300' : 'text-muted-foreground'
            }`}
            aria-live="polite"
          >
            {t.timer} {timeLeft}s
          </p>
        ) : null}
      </div>

      <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-foreground">
        {localize(question.text, language)}
      </h2>

      <ul className="mt-5 space-y-2">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isRight = resolved && option.id === question.correctOptionId;
          const isWrongPick = showFeedback && isSelected && !isCorrectSelection;

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => handleOption(option.id)}
                disabled={showFeedback || resolved}
                className={`flex w-full items-center gap-3 border px-3 py-3 text-left text-sm transition ${
                  isRight
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : isWrongPick
                      ? 'border-red-500/50 bg-red-500/10 text-red-200'
                      : 'border-white/15 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06] disabled:opacity-60'
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{option.id}</span>
                <span className="min-w-0">{localize(option.text, language)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {showFeedback && !resolved ? (
        <div role="status" className="mt-5 border border-amber-300/40 bg-amber-300/5 p-4">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-amber-200">
            {t.incorrect}
          </p>

          <p className="mt-2 text-xs text-foreground/90">
            {t.correctAnswer}: <strong>{question.correctOptionId}</strong>
          </p>

          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{t.explanation}: </span>
            {localize(question.feedback, language)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition hover:border-primary hover:text-primary"
            >
              {t.retry}
            </button>
            {hasAlternate ? (
              <button
                type="button"
                onClick={handleAlternate}
                className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
              >
                {t.otherQuestion}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {resolved ? (
        <div role="status" className="mt-5 border border-primary/40 bg-primary/5 p-4">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-primary">{t.correct}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{t.explanation}: </span>
            {localize(question.feedback, language)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
