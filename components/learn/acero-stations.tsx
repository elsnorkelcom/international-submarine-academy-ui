import Link from 'next/link';

import type { AppStrings } from '@/lib/i18n/app';
import type { LanguageCode, Mission } from '@/lib/domain/types';

interface AceroStationsProps {
  language: LanguageCode;
  t: AppStrings['learn']['series'];
  missions: Mission[];
  completedMissionIds: Set<string>;
}

const STATION_IMAGES: Record<string, string> = {
  'AC-01': '/images/m-hull.png',
  'AC-02': '/images/m-sonar.png',
  'AC-03': '/images/m-periscope.png',
  'AC-04': '/images/m-hull.png',
  'AC-05': '/images/m-engine.png',
  'AC-06': '/images/m-engine.png',
  'AC-07': '/images/m-hull.png',
  'AC-ESP': '/images/m-control.png',
};

const STEEL = '#8FA3B0';

/** Recorrido de Acero: 7 estaciones patrimoniales + episodio especial. */
export function AceroStations({ language, t, missions, completedMissionIds }: AceroStationsProps) {
  const stations = missions
    .filter((mission) => mission.seasonId === 'SEA-STEEL' && mission.cellCode?.startsWith('AC-'))
    .sort((a, b) => (a.cellIndex ?? 0) - (b.cellIndex ?? 0));

  if (stations.length === 0) {
    return null;
  }

  const regular = stations.filter((mission) => mission.cellCode !== 'AC-ESP');
  const special = stations.find((mission) => mission.cellCode === 'AC-ESP');

  const card = (mission: Mission, variant: 'station' | 'special') => {
    const done = completedMissionIds.has(mission.id);
    const code = mission.cellCode ?? '';
    const image = STATION_IMAGES[code] ?? '/images/m-control.png';

    return (
      <Link
        key={mission.id}
        href={`/episodes?id=${encodeURIComponent(mission.id)}`}
        className={`group flex h-full flex-col overflow-hidden rounded-md border bg-card/40 transition hover:border-white/30 ${
          done ? 'border-primary/40 ring-1 ring-primary/30' : 'border-white/10'
        }`}
        style={{ borderTopColor: STEEL, borderTopWidth: 3 }}
        aria-label={`${mission.title[language]}: ${done ? t.completed : t.available}`}
      >
        <span className="relative block aspect-video w-full overflow-hidden bg-black/40">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="size-full object-cover opacity-70 grayscale transition group-hover:opacity-90"
          />
          <span className="absolute left-2 top-2 border border-white/25 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80">
            {variant === 'special' ? t.aceroSpecial : code}
          </span>
          {done ? (
            <span className="absolute right-2 top-2 bg-primary px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary-foreground">
              {t.completed}
            </span>
          ) : null}
        </span>
        <span className="flex flex-1 flex-col p-3">
          <span className="font-display text-sm font-bold uppercase leading-tight tracking-wide text-foreground">
            {mission.title[language]}
          </span>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {variant === 'special' ? t.aceroSpecial : t.aceroStation}
          </span>
        </span>
      </Link>
    );
  };

  return (
    <section aria-labelledby="acero-stations-title" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{t.aceroKicker}</p>
          <h2
            id="acero-stations-title"
            className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide"
          >
            {t.aceroTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.aceroHint}</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-primary">{regular.length}</span> {t.aceroStations}
        </p>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {regular.map((mission) => (
          <li key={mission.id}>{card(mission, 'station')}</li>
        ))}
        {special ? <li className="sm:col-span-2 lg:col-span-4">{card(special, 'special')}</li> : null}
      </ul>
    </section>
  );
}
