'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import type { Museum } from '@/lib/domain/types';
import { localize } from '@/lib/domain/types';

type SortKey = 'name' | 'launch-desc' | 'launch-asc' | 'country';

export function MuseumRegister() {
  const { database, ready, language, t } = useApp();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [propulsion, setPropulsion] = useState('all');
  const [situation, setSituation] = useState('all');
  const [sort, setSort] = useState<SortKey>('name');

  const load = useCallback(async () => {
    if (!database) {
      return;
    }

    try {
      const result = await database
        .repository('museums')
        .list({ pageSize: 0, includeDeleted: false });

      setMuseums(result.items);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [database]);

  useEffect(() => {
    void load();
  }, [load]);

  const countries = useMemo(
    () => Array.from(new Set(museums.map((museum) => museum.country).filter(Boolean))).sort(),
    [museums],
  );

  const propulsions = useMemo(
    () => Array.from(new Set(museums.map((museum) => museum.propulsion).filter(Boolean))).sort(),
    [museums],
  );

  const situations = useMemo(
    () => Array.from(new Set(museums.map((museum) => museum.situation).filter(Boolean))).sort(),
    [museums],
  );

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();

    const filtered = museums.filter((museum) => {
      if (country !== 'all' && museum.country !== country) return false;
      if (propulsion !== 'all' && museum.propulsion !== propulsion) return false;
      if (situation !== 'all' && museum.situation !== situation) return false;
      if (!needle) return true;

      return [museum.name.en, museum.museumName.en, museum.city, museum.country, museum.vesselType]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });

    return [...filtered].sort((left, right) => {
      if (sort === 'launch-desc') return (right.launchYear ?? 0) - (left.launchYear ?? 0);
      if (sort === 'launch-asc') return (left.launchYear ?? 9999) - (right.launchYear ?? 9999);
      if (sort === 'country') return left.country.localeCompare(right.country);
      return left.name.en.localeCompare(right.name.en);
    });
  }, [museums, search, country, propulsion, situation, sort]);

  return (
    <div>
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.register.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {t.register.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.register.subtitle}</p>
      </header>

      <section
        aria-label={t.register.search}
        className="mt-8 grid gap-3 border-y border-white/10 py-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
            {t.register.search}
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.register.searchPlaceholder}
            className="h-10 rounded-sm border border-white/15 bg-white/5 px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </label>

        <SelectField
          label={t.register.country}
          value={country}
          onChange={setCountry}
          options={countries.map((value) => ({ value, label: value }))}
          allLabel={t.register.allCountries}
        />

        <SelectField
          label={t.register.propulsion}
          value={propulsion}
          onChange={setPropulsion}
          options={propulsions.map((value) => ({ value, label: value }))}
          allLabel={t.register.allPropulsion}
        />

        <SelectField
          label={t.register.situation}
          value={situation}
          onChange={setSituation}
          options={situations.map((value) => ({
            value,
            label: t.situation[value as keyof typeof t.situation] ?? value,
          }))}
          allLabel={t.register.allSituations}
        />

        <SelectField
          label={t.register.sort}
          value={sort}
          onChange={(value) => setSort(value as SortKey)}
          options={[
            { value: 'name', label: t.register.sortName },
            { value: 'launch-desc', label: t.register.sortLaunchNewest },
            { value: 'launch-asc', label: t.register.sortLaunchOldest },
            { value: 'country', label: t.register.sortCountry },
          ]}
        />
      </section>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{String(visible.length).padStart(3, '0')}</span>{' '}
        {t.register.contacts}
      </p>

      {!ready ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t.common.loading}
        </p>
      ) : failed ? (
        <div className="mt-8 border border-red-500/30 bg-red-500/5 p-5">
          <p className="text-sm text-red-200">{t.common.error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary"
          >
            {t.common.retry}
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-8 border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm text-foreground">{t.register.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.register.emptyHint}</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-white/5 border-y border-white/10">
          {visible.map((museum) => (
            <li key={museum.id}>
              <Link
                href={`/museums/${museum.id}`}
                className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 px-1 py-3 transition hover:bg-white/[0.03] sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
                  {museum.dossier || museum.id.replace('MUS-', '')}
                </span>

                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    {localize(museum.name, language)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {localize(museum.museumName, language)}
                  </span>
                </span>

                <span className="col-span-2 text-xs text-muted-foreground sm:col-span-1">
                  {[museum.city, museum.country].filter(Boolean).join(', ')}
                </span>

                <span className="col-span-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-metal sm:col-span-1 sm:justify-end">
                  {museum.propulsion ? <span>{museum.propulsion}</span> : null}
                  {museum.launchYear ? <span>{museum.launchYear}</span> : null}
                  {museum.mediaUrl ? <span className="text-primary">{t.register.film}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-sm border border-white/15 bg-white/5 px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
      >
        {allLabel ? <option value="all">{allLabel}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
