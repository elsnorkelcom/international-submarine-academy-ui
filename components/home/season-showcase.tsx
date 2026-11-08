'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { useProgress } from '@/components/learn/progress-provider';
import { localize, type Badge, type Mission, type Season } from '@/lib/domain/types';

interface SeasonSection {
  season: Season;
  missions: Mission[];
}

/** Real seasons from the local database, Netflix-row style. */
export function SeasonShowcase() {
  const { database, ready, language } = useApp();
  const { progress } = useProgress();
  const [sections, setSections] = useState<SeasonSection[] | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) return;

      const [seasons, missions] = await Promise.all([
        database.repository('seasons').list({ pageSize: 0, sortBy: 'order' }),
        database.repository('missions').list({ pageSize: 0, sortBy: 'order' }),
      ]);

      const publishedSeasons = seasons.items.filter((item) => item.status === 'published');
      const grouped = publishedSeasons
        .map((season) => ({
          season,
          missions: missions.items.filter(
            (item) => item.seasonId === season.id && item.status === 'published',
          ),
        }))
        .filter((entry) => entry.missions.length > 0);

      if (!cancelled) setSections(grouped);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [database]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) return;
      const result = await database.repository('badges').list({ pageSize: 0 });
      if (!cancelled) setBadges(result.items);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [database]);

  if (!ready || sections === null) {
    return (
      <p className="mt-14 px-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:px-10">
        Cargando temporadas…
      </p>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="mx-auto mt-14 max-w-[1600px] px-4 md:px-10">
        <p className="border border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-muted-foreground">
          Todavía no hay misiones publicadas. Cargá contenido desde el panel de administración.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-[1600px] px-4 md:px-10">
      <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
        Temporadas
      </h2>

      <div className="mt-6 space-y-12">
        {sections.map(({ season, missions }) => {
          const completed = missions.filter(
            (mission) => progress.missions[mission.id]?.correct,
          ).length;

          return (
            <section key={season.id} aria-labelledby={`home-season-${season.id}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: season.colorTheme }}
                  >
                    {localize(season.description, language)} · TIMSS {season.timssDomain}
                  </p>
                  <h3
                    id={`home-season-${season.id}`}
                    className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide"
                  >
                    {localize(season.title, language)}
                  </h3>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-primary">
                    {String(completed).padStart(2, '0')}/{String(missions.length).padStart(2, '0')}
                  </span>{' '}
                  completadas
                </p>
              </div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {missions.map((mission) => {
                  const done = Boolean(progress.missions[mission.id]?.correct);
                  const badge = badges.find((item) => item.missionId === mission.id);

                  return (
                    <li key={mission.id}>
                      <Link
                        href={`/episodes?id=${encodeURIComponent(mission.id)}`}
                        className="group flex h-full flex-col justify-between border border-white/10 bg-card/40 p-4 transition hover:border-primary/40"
                      >
                        <div>
                          {badge?.icon.startsWith('/') ? (
                            <img
                              src={badge.icon}
                              alt=""
                              className={`mb-3 size-12 object-contain transition ${done ? '' : 'opacity-25 grayscale'}`}
                            />
                          ) : null}
                          <p className="font-display text-base font-bold uppercase leading-snug tracking-wide text-foreground group-hover:text-primary">
                            {localize(mission.title, language)}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {localize(mission.learningObjective, language)}
                          </p>
                        </div>
                        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em]">
                          <span className={done ? 'text-primary' : 'text-muted-foreground'}>
                            {done ? 'Completada' : 'Disponible'}
                          </span>
                          <span className="text-metal"> · {mission.id}</span>
                        </p>
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
