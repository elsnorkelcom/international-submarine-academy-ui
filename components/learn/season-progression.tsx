'use client';

import type { Mission, Season } from '@/lib/domain/types';
import { localize, type LanguageCode } from '@/lib/domain/types';
import type { AppStrings } from '@/lib/i18n/app';

interface SeasonProgressionProps {
  seasons: Season[];
  missions: Mission[];
  completedMissionIds: Set<string>;
  unlockedSeasonIds: Set<string>;
  language: LanguageCode;
  t: AppStrings['learn']['series'];
}

/** Row of season cards showing colour, progress and lock state. */
export function SeasonProgression({
  seasons,
  missions,
  completedMissionIds,
  unlockedSeasonIds,
  language,
  t,
}: SeasonProgressionProps) {
  if (seasons.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="season-progression-title" className="mt-8">
      <h2
        id="season-progression-title"
        className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal"
      >
        {t.progression}
      </h2>

      <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:snap-none md:overflow-visible md:pb-0">
        {seasons.map((season, index) => {
          const own = missions.filter((mission) => mission.seasonId === season.id);
          const done = own.filter((mission) => completedMissionIds.has(mission.id)).length;
          const total = own.length;
          const unlocked = unlockedSeasonIds.has(season.id);
          const complete = total > 0 && done === total;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <li
              key={season.id}
              className={`min-w-[9.5rem] flex-1 snap-start rounded-md border bg-card/40 p-3 transition ${
                unlocked ? '' : 'opacity-45'
              }`}
              style={{ borderColor: unlocked ? `${season.colorTheme}80` : undefined }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: season.colorTheme }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"
                  aria-hidden="true"
                >
                  {total === 0 ? '—' : `${done}/${total}`}
                </span>
              </div>

              <p className="mt-1 font-display text-sm font-bold uppercase leading-tight tracking-wide text-foreground">
                {localize(season.title, language)}
              </p>

              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${localize(season.title, language)}: ${done} / ${total}`}
              >
                <div
                  className="h-full transition-all"
                  style={{ width: `${percent}%`, backgroundColor: season.colorTheme }}
                />
              </div>

              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em]">
                {!unlocked ? (
                  <span className="text-muted-foreground">{t.locked}</span>
                ) : total === 0 ? (
                  <span className="text-muted-foreground">{t.soon}</span>
                ) : complete ? (
                  <span className="text-primary">{t.completed}</span>
                ) : (
                  <span className="text-muted-foreground">{t.available}</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
