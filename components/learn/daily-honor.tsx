'use client';

import { useEffect, useState } from 'react';

import { getFishNick } from '@/lib/learning/fish';
import { getDaily } from '@/lib/learning/daily';
import { useApp } from '@/components/app/data-provider';
import type { AppStrings } from '@/lib/i18n/app';

/** Cuadro de honor diario: local, simbólico, se reinicia cada 24 h. */
export function DailyHonor() {
  const { language, t } = useApp();
  const [nick, setNick] = useState<string | null>(null);
  const [daily, setDaily] = useState<{ points: number; missions: number; bestStreak: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const messages = t.learn.honor;

  useEffect(() => {
    setNick(language === 'es' ? getFishNick().es : getFishNick().en);
    setDaily(getDaily());
  }, [language]);

  async function share() {
    if (!daily) return;

    const text = language === 'es'
      ? `ISA · Cuadro de honor del día · ${nick}: ${daily.points} pts · ${daily.missions} ${messages.missionsWord} · racha ${daily.bestStreak}`
      : `ISA · Daily honor roll · ${nick}: ${daily.points} pts · ${daily.missions} ${messages.missionsWord} · streak ${daily.bestStreak}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-labelledby="daily-honor-title" className="mt-10 border border-white/10 bg-white/[0.02] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{messages.eyebrow}</p>
      <h2 id="daily-honor-title" className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-foreground">
        {messages.title}
      </h2>

      {daily ? (
        <>
          <p className="mt-3 font-display text-3xl font-extrabold uppercase tracking-wide text-primary">
            {nick} · {daily.points} <span className="text-base text-muted-foreground">pts</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.missionsWord}: {daily.missions} · {t.learn.profile.bestStreak}: {daily.bestStreak}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void share()}
              className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
            >
              {copied ? messages.copied : messages.share}
            </button>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{messages.reset}</p>
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{messages.empty}</p>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">{messages.hint}</p>
    </section>
  );
}
