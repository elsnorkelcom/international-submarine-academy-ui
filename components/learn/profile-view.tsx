'use client';

import { useEffect, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { useProgress } from '@/components/learn/progress-provider';
import { buildUnsignedCredential, type IsaBadgeSource } from '@/lib/badges/openbadge';
import { listCredentials } from '@/lib/badges/registry';
import { localize, type Badge, type CredentialRecord } from '@/lib/domain/types';

export function ProfileView() {
  const { database, language, t } = useApp();
  const { progress, ready, reset } = useProgress();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) {
        return;
      }

      const [result, registry] = await Promise.all([
        database.repository('badges').list({ pageSize: 0 }),
        listCredentials(database),
      ]);

      if (!cancelled) {
        setBadges(result.items);
        setCredentials(registry);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database]);

  const completed = Object.values(progress.missions).filter((mission) => mission.correct).length;
  const earned = badges.filter((badge) => progress.badges.includes(badge.id));

  async function exportBadge(badge: Badge) {
    if (!database) {
      return;
    }

    const record = Object.values(progress.missions).find((mission) => mission.badgeId === badge.id);
    const mission = record ? await database.repository('missions').get(record.missionId) : null;
    const season = mission ? await database.repository('seasons').get(mission.seasonId) : null;
    const museum = mission ? await database.repository('museums').get(mission.museumId) : null;

    const source: IsaBadgeSource = {
      badgeId: badge.id,
      badgeName: localize(badge.name, 'en'),
      badgeDescription: localize(badge.description, 'en'),
      badgeType: badge.type,
      seasonTitle: season ? localize(season.title, 'en') : '',
      missionTitle: mission ? localize(mission.title, 'en') : '',
      institutionName: museum ? localize(museum.museumName, 'en') : '',
      institutionCity: museum?.city ?? '',
      institutionCountry: museum?.country ?? '',
      criteria: localize(badge.criteria, 'en'),
      color: badge.color,
      gsaCompetency: mission?.gsaCompetency,
      timssDomain: mission?.timssDomain,
      earnedAt: record ? new Date(record.completedAt).toISOString() : undefined,
    };

    const credential = buildUnsignedCredential(window.location.origin, source);
    const blob = new Blob([JSON.stringify(credential, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${badge.id}.openbadge.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportMessage(t.learn.profile.unsignedNote);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.learn.profile.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-tight">
          {t.learn.profile.title}
        </h1>
      </header>

      <dl className="mt-7 grid gap-3 sm:grid-cols-4">
        <Metric label={t.learn.profile.points} value={progress.points} />
        <Metric label={t.learn.profile.streak} value={progress.streak} />
        <Metric label={t.learn.profile.bestStreak} value={progress.bestStreak} />
        <Metric label={t.learn.profile.missions} value={completed} />
      </dl>

      <section className="mt-9">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">{t.learn.profile.badges}</h2>

        {!ready ? (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>
        ) : earned.length === 0 ? (
          <div className="mt-3 border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm text-foreground">{t.learn.profile.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.learn.profile.emptyHint}</p>
          </div>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {earned.map((badge) => (
              <li key={badge.id} className="flex items-center gap-3 border border-primary/30 bg-primary/5 px-3 py-2">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase text-background"
                  style={{ backgroundColor: badge.color || '#00e08a', borderColor: badge.color || '#00e08a' }}
                  aria-hidden="true"
                >
                  {badge.type === 'coin' ? '◎' : badge.type === 'credential' ? '⚓' : '★'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-bold uppercase tracking-wide">
                    {localize(badge.name, language)}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {badge.type}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => void exportBadge(badge)}
                  title={t.learn.profile.exportHint}
                  className="shrink-0 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  OB 3.0
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-9">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">{t.learn.profile.registry}</h2>

        {credentials.length === 0 ? (
          <p className="mt-3 border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground">
            {t.learn.profile.registryEmpty}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5 border-y border-white/10">
            {credentials.map((record) => (
              <li key={record.id} className="flex flex-wrap items-center gap-3 px-1 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
                  {record.registryNo}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {String((record.document as { name?: string }).name ?? record.badgeId)}
                </span>
                <span
                  className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                    record.credentialStatus === 'issued'
                      ? 'border-primary/40 text-primary'
                      : 'border-red-500/40 text-red-300'
                  }`}
                >
                  {record.credentialStatus === 'issued'
                    ? t.learn.profile.registryIssued
                    : t.learn.profile.registryRevoked}
                </span>
                <span className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-200">
                  {record.proofStatus === 'unsigned'
                    ? t.learn.profile.registryUnsigned
                    : 'Signed'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(record.document, null, 2)], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${record.registryNo}.openbadge.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    setExportMessage(t.learn.profile.unsignedNote);
                  }}
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                >
                  {t.learn.profile.registryExport}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {exportMessage ? (
        <p className="mt-3 border border-amber-300/40 bg-amber-300/5 px-3 py-2 text-[11px] text-amber-200">
          {exportMessage}
        </p>
      ) : null}

      <p className="mt-8 text-[10px] leading-relaxed text-muted-foreground">{t.learn.profile.disclaimer}</p>

      <section className="mt-8 border-t border-white/10 pt-5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-muted-foreground">{t.learn.profile.resetConfirm}</p>
            <button
              type="button"
              onClick={() => {
                reset();
                setConfirming(false);
              }}
              className="border border-red-500/40 bg-red-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-red-200"
            >
              {t.learn.profile.reset}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              {t.learn.reward.close}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            {t.learn.profile.reset}
          </button>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 px-3 py-2">
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-metal">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-extrabold text-foreground">{value}</dd>
    </div>
  );
}
