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
  maxAttempts: number;
  onResolved: (outcome: QuestionOutcome) => void;
}

export function QuestionEngine({
  question,
  language,
  t,
  timerSeconds,
  maxAttempts,
  onResolved,
}: QuestionEngineProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(timerSeconds);
  const resolvedRef = useRef(false);

  function resolve(correct: boolean, usedAttempts: number, remaining: number | null) {
    if (resolvedRef.current) {
      return;
    }

    resolvedRef.current = true;
    setResolved(true);
    onResolved({ correct, attempts: usedAttempts, secondsLeft: remaining });
  }

  useEffect(() => {
    if (timerSeconds === null || resolved) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) return null;
        if (current <= 1) {
          window.clearInterval(interval);
          resolve(false, attempts + 1, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerSeconds, resolved, attempts]);

  function handleOption(optionId: string) {
    if (resolved) {
      return;
    }

    setSelected(optionId);
    const correct = optionId === question.correctOptionId;
    const nextAttempts = attempts + 1;

    if (correct) {
      setAttempts(nextAttempts);
      resolve(true, nextAttempts, timeLeft);
      return;
    }

    setAttempts(nextAttempts);

    if (nextAttempts >= Math.max(1, maxAttempts)) {
      resolve(false, nextAttempts, timeLeft);
      return;
    }

    window.setTimeout(() => setSelected(null), 900);
  }

  const isCorrectSelection = selected === question.correctOptionId;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
          {t.question}
        </p>
        {timeLeft !== null && !resolved ? (
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
          const isWrongPick = resolved && isSelected && !isCorrectSelection;

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => handleOption(option.id)}
                disabled={resolved}
                className={`flex w-full items-center gap-3 border px-3 py-3 text-left text-sm transition ${
                  isRight
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : isWrongPick
                      ? 'border-red-500/50 bg-red-500/10 text-red-200'
                      : 'border-white/15 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06]'
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{option.id}</span>
                <span className="min-w-0">{localize(option.text, language)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {resolved ? (
        <div
          role="status"
          className={`mt-5 border p-4 ${
            isCorrectSelection ? 'border-primary/40 bg-primary/5' : 'border-amber-300/40 bg-amber-300/5'
          }`}
        >
          <p className={`font-display text-lg font-bold uppercase tracking-wide ${isCorrectSelection ? 'text-primary' : 'text-amber-200'}`}>
            {isCorrectSelection ? t.correct : t.incorrect}
          </p>

          {!isCorrectSelection ? (
            <p className="mt-2 text-xs text-foreground/90">
              {t.correctAnswer}: <strong>{question.correctOptionId}</strong>
            </p>
          ) : null}

          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{t.explanation}: </span>
            {localize(question.feedback, language)}
          </p>

          {localize(question.civilSocietyConnection, language).trim() ? (
            <p className="mt-3 border-l border-primary/40 pl-3 text-sm text-foreground/85">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{t.civil}: </span>
              {localize(question.civilSocietyConnection, language)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
