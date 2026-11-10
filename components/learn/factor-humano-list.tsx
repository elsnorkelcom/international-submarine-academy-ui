import Link from 'next/link';

import palette from '@/lib/data/datasets/palette.json';
import type { AppStrings } from '@/lib/i18n/app';
import type { LanguageCode, Mission } from '@/lib/domain/types';

interface FactorHumanoListProps {
  language: LanguageCode;
  t: AppStrings['learn']['series'];
  missions: Mission[];
  completedMissionIds: Set<string>;
}

const SPECIALTY_NAMES: Record<string, { es: string; en: string }> = {
  MAQ: { es: 'Maquinista', en: 'Machinist' },
  ELE: { es: 'Electricista', en: 'Electrician' },
  ELN: { es: 'Electrónico', en: 'Electronics' },
  NAV: { es: 'Ingeniero Naval', en: 'Naval Engineer' },
  LOG: { es: 'Logístico', en: 'Logistics' },
};

/** Columna libre de Factor Humano: 15 temas de vida a bordo, fuera de la grilla STEM. */
export function FactorHumanoList({ language, t, missions, completedMissionIds }: FactorHumanoListProps) {
  const color = (palette as { seasons: Record<string, { disciplines: Record<string, string> }> })
    .seasons.COPPER.disciplines.HUM;

  const topics = missions
    .filter((mission) => mission.cellCode?.startsWith('FH-'))
    .sort((a, b) => (a.cellIndex ?? 0) - (b.cellIndex ?? 0));

  if (topics.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="factor-humano-title" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{t.fhKicker}</p>
          <h2
            id="factor-humano-title"
            className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide"
          >
            {t.fhTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.fhHint}</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-primary">{topics.length}</span> {t.fhCount}
        </p>
      </div>

      <ul className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((mission) => {
          const done = completedMissionIds.has(mission.id);
          const specialty = mission.specialtyId ? SPECIALTY_NAMES[mission.specialtyId] : undefined;

          return (
            <li key={mission.id}>
              <Link
                href={`/episodes?id=${encodeURIComponent(mission.id)}`}
                className={`flex h-full items-start gap-3 rounded-md border border-white/10 bg-card/40 p-3 transition hover:border-white/25 hover:bg-white/[0.04] ${
                  done ? 'ring-1 ring-primary/40' : ''
                }`}
                style={{ borderTopColor: color, borderTopWidth: 3 }}
              >
                <span
                  className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color }}
                >
                  {mission.cellCode}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-bold uppercase tracking-wide text-foreground">
                    {mission.title[language]}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    {specialty ? `${specialty[language]} · ` : ''}
                    {done ? t.completed : t.available}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
