'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { useProgress } from '@/components/learn/progress-provider';
import { CopperGrid } from '@/components/learn/copper-grid';
import { SeasonProgression } from '@/components/learn/season-progression';
import { localize, type Episode, type Mission, type Museum, type Season } from '@/lib/domain/types';

interface LearnData {
  seasons: Season[];
  episodes: Episode[];
  missions: Mission[];
  museums: Museum[];
}

export function SeriesView() {
  const { database, ready, language, t } = useApp();
  const { progress } = useProgress();
  const [data, setData] = useState<LearnData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) {
        return;
      }

      const [seasons, episodes, missions, museums] = await Promise.all([
        database.repository('seasons').list({ pageSize: 0, sortBy: 'order' }),
        database.repository('episodes').list({ pageSize: 0 }),
        database.repository('missions').list({ pageSize: 0, sortBy: 'order' }),
        database.repository('museums').list({ pageSize: 0 }),
      ]);

      if (cancelled) {
        return;
      }

      setData({
        seasons: seasons.items.filter((item) => item.status === 'published'),
        episodes: episodes.items.filter((item) => item.status === 'published'),
        missions: missions.items.filter((item) => item.status === 'published'),
        museums: museums.items,
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database]);

  const grouped = useMemo(() => {
    if (!data) {
      return [];
    }

    const bySeason = new Map<string, { season: Season; missions: Mission[] }>();

    for (const mission of data.missions) {
      const season = data.seasons.find((item) => item.id === mission.seasonId);

      if (!season) {
        continue;
      }

      const entry = bySeason.get(season.id) ?? { season, missions: [] };
      entry.missions.push(mission);
      bySeason.set(season.id, entry);
    }

    return data.seasons
      .filter((season) => bySeason.has(season.id))
      .map((season) => bySeason.get(season.id) as { season: Season; missions: Mission[] });
  }, [data]);

  const completedBySeason = useMemo(() => {
    const map = new Map<string, number>();

    for (const result of Object.values(progress.missions)) {
      if (!result.correct) continue;
      map.set(result.seasonId, (map.get(result.seasonId) ?? 0) + 1);
    }

    return map;
  }, [progress.missions]);

  const completedMissionIds = useMemo(() => {
    const set = new Set<string>();

    for (const [missionId, result] of Object.entries(progress.missions)) {
      if (result.correct) {
        set.add(missionId);
      }
    }

    return set;
  }, [progress.missions]);

  // Una temporada abre cuando la anterior (con misiones publicadas) tiene al menos una misión
  // completada. Las temporadas sin misiones publicadas heredan el estado del tramo anterior.
  const unlockedSeasonIds = useMemo(() => {
    const set = new Set<string>();

    if (!data) {
      return set;
    }

    let previousSeasonId: string | null = null;
    let previousDone = 0;

    for (const season of data.seasons) {
      const own = data.missions.filter((mission) => mission.seasonId === season.id);
      const unlocked = previousSeasonId === null || previousDone > 0;

      if (unlocked) {
        set.add(season.id);
      }

      if (own.length > 0) {
        previousSeasonId = season.id;
        previousDone = own.filter((mission) => completedMissionIds.has(mission.id)).length;
      }
    }

    return set;
  }, [data, completedMissionIds]);

  const header = (
    <header className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.learn.series.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
        {t.learn.series.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.learn.series.subtitle}</p>
    </header>
  );

  if (!ready || !data) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>;
  }

  if (grouped.length === 0) {
    return (
      <div>
        {header}

        <SeasonProgression
          seasons={data.seasons}
          missions={data.missions}
          completedMissionIds={completedMissionIds}
          unlockedSeasonIds={unlockedSeasonIds}
          language={language}
          t={t.learn.series}
        />

        <CopperGrid
          language={language}
          t={t.learn.series}
          missions={data.missions}
          completedMissionIds={completedMissionIds}
        />

        <div className="mt-8 border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm text-foreground">{t.learn.series.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.learn.series.emptyHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}

      <SeasonProgression
        seasons={data.seasons}
        missions={data.missions}
        completedMissionIds={completedMissionIds}
        unlockedSeasonIds={unlockedSeasonIds}
        language={language}
        t={t.learn.series}
      />

      <CopperGrid
        language={language}
        t={t.learn.series}
        missions={data.missions}
        completedMissionIds={completedMissionIds}
      />

      <div className="mt-8 space-y-10">
        {/* Cobre se navega desde la grilla; el listado queda para las demás temporadas. */}
        {grouped
          .filter(({ season }) => season.id !== 'SEA-COPPER')
          .map(({ season, missions }, seasonIndex) => {
          const completed = completedBySeason.get(season.id) ?? 0;
          const unlocked = unlockedSeasonIds.has(season.id);

          return (
            <section key={season.id} aria-labelledby={`season-${season.id}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: season.colorTheme }}>
                    {seasonIndex + 1} · {localize(season.description, language)}
                  </p>
                  <h2
                    id={`season-${season.id}`}
                    className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide"
                  >
                    {localize(season.title, language)}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {localize(season.gsaEmphasis, language)} · TIMSS {season.timssDomain}
                  </p>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-primary">
                    {String(completed).padStart(2, '0')}/{String(missions.length).padStart(2, '0')}
                  </span>{' '}
                  {t.learn.series.completed}
                </p>
              </div>

              <ul className="mt-3 divide-y divide-white/5 border-b border-white/10">
                {missions.map((mission) => {
                  const result = progress.missions[mission.id];
                  const done = Boolean(result?.correct);
                  const museum = data.museums.find((item) => item.id === mission.museumId);

                  return (
                    <li key={mission.id}>
                      <Link
                        href={`/episodes?id=${encodeURIComponent(mission.id)}`}
                        aria-disabled={!unlocked}
                        className={`group grid grid-cols-[1fr_auto] items-center gap-4 px-1 py-3 transition hover:bg-white/[0.03] ${
                          unlocked ? '' : 'pointer-events-none opacity-40'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-display text-base font-bold uppercase tracking-wide group-hover:text-primary">
                            {localize(mission.title, language)}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[museum ? localize(museum.name, language) : null, localize(mission.learningObjective, language)]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>

                        <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                          {done ? (
                            <span className="border border-primary/40 px-2 py-0.5 text-primary">
                              {t.learn.series.completed}
                            </span>
                          ) : (
                            <span className="border border-white/15 px-2 py-0.5 text-muted-foreground">
                              {unlocked ? t.learn.series.available : t.learn.series.locked}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
