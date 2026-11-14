'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { useProgress } from '@/components/learn/progress-provider';
import { localize, type LanguageCode, type Mission } from '@/lib/domain/types';
import type { AppStrings } from '@/lib/i18n/app';

interface NextEpisodesProps {
  currentMissionId: string;
  seasonId: string;
  language: LanguageCode;
  t: AppStrings['learn']['episode'];
}

/** Feed vertical de episodios sugeridos después de completar una experiencia. */
export function NextEpisodes({ currentMissionId, seasonId, language, t }: NextEpisodesProps) {
  const { database, ready } = useApp();
  const { progress } = useProgress();
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) return;
      const result = await database.repository('missions').list({ pageSize: 0, sortBy: 'order' });
      if (cancelled) return;
      setMissions(result.items.filter((mission) => mission.status === 'published'));
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [database]);

  const suggestions = useMemo(() => {
    return [...missions]
      .filter((mission) => mission.id !== currentMissionId)
      .sort((a, b) => {
        const aSame = a.seasonId === seasonId ? 0 : 1;
        const bSame = b.seasonId === seasonId ? 0 : 1;
        if (aSame !== bSame) return aSame - bSame;
        return (a.order ?? 0) - (b.order ?? 0);
      })
      .slice(0, 6);
  }, [missions, currentMissionId, seasonId]);

  if (!ready || suggestions.length === 0) {
    return null;
  }

  const next = suggestions[0];
  const isDone = (missionId: string) => Boolean(progress.missions[missionId]?.correct);

  return (
    <section aria-labelledby="next-episodes-title" className="mt-8 border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{t.suggested}</p>
          <h2 id="next-episodes-title" className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-foreground">
            {t.nextEpisode}
          </h2>
        </div>
        <Link
          href={`/episodes?id=${encodeURIComponent(next.id)}`}
          className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
        >
          {t.nextEpisode} →
        </Link>
      </div>

      <ul className="mt-4 max-h-[68vh] snap-y snap-mandatory space-y-2 overflow-y-auto pr-1">
        {suggestions.map((mission) => (
          <li key={mission.id} className="snap-start">
            <Link
              href={`/episodes?id=${encodeURIComponent(mission.id)}`}
              className={`flex items-center justify-between gap-4 rounded-md border bg-card/40 p-3 transition hover:border-primary/40 hover:bg-white/[0.04] ${
                isDone(mission.id) ? 'border-primary/30' : 'border-white/10'
              }`}
            >
              <span className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-metal">
                  {mission.cellCode ?? mission.id}
                </span>
                <span className="mt-1 block truncate font-display text-sm font-bold uppercase tracking-wide text-foreground">
                  {localize(mission.title, language)}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {isDone(mission.id) ? '✓' : '→'}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {t.feedEnd}
      </p>
    </section>
  );
}
