'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { credentialBundle, listCredentials, revokeCredential } from '@/lib/badges/registry';
import { applyAwardsConfig, awardsConfig } from '@/lib/data/config';
import { localize, type Badge, type CredentialRecord, type Mission, type Season } from '@/lib/domain/types';

export function AccreditationPanel() {
  const { database } = useApp();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const config = useMemo(() => awardsConfig(), []);

  const refresh = useCallback(async () => {
    if (!database) {
      return;
    }

    setLoading(true);

    try {
      const [badgeList, missionList, seasonList, registry] = await Promise.all([
        database.repository('badges').list({ pageSize: 0 }),
        database.repository('missions').list({ pageSize: 0 }),
        database.repository('seasons').list({ pageSize: 0, sortBy: 'order' }),
        listCredentials(database),
      ]);

      setBadges(badgeList.items);
      setMissions(missionList.items);
      setSeasons(seasonList.items);
      setCredentials(registry);
    } finally {
      setLoading(false);
    }
  }, [database]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const missionsBySeason = useMemo(() => {
    const map = new Map<string, number>();

    for (const mission of missions) {
      if (mission.status !== 'published') continue;
      map.set(mission.seasonId, (map.get(mission.seasonId) ?? 0) + 1);
    }

    return map;
  }, [missions]);

  async function handleApplyConfig() {
    if (!database) {
      return;
    }

    try {
      const result = await applyAwardsConfig(database);
      setMessage(
        `Configuration applied: ${result.created} created, ${result.updated} updated (${result.total} rules).`,
      );
      await refresh();
    } catch {
      setMessage('The configuration could not be applied.');
    }
  }

  function handleExportBundle() {
    const blob = new Blob([credentialBundle(credentials)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'isa-credentials-bundle.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleRevoke(record: CredentialRecord) {
    if (!database) {
      return;
    }

    await revokeCredential(database, record.id, 'Revoked from the accreditation panel.');
    setMessage(`Credential ${record.registryNo} revoked.`);
    await refresh();
  }

  const issued = credentials.filter((record) => record.credentialStatus === 'issued').length;
  const revoked = credentials.length - issued;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Admin // Accreditation</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight">
            Accreditation rules
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Rules, thresholds and the credential registry. The rules table comes from the configuration
            sheet ({config.length} rows in the current build).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleApplyConfig()}
            className="border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
          >
            Apply config ({config.length})
          </button>
          <button
            type="button"
            onClick={handleExportBundle}
            className="border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Export bundle
          </button>
          <Link
            href="/admin/badges"
            className="border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Edit badges
          </Link>
        </div>
      </header>

      {message ? (
        <p className="mt-4 border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/90">{message}</p>
      ) : null}

      <dl className="mt-6 grid gap-3 sm:grid-cols-4">
        <Metric label="Rules" value={badges.length} />
        <Metric label="Issued" value={issued} tone="good" />
        <Metric label="Revoked" value={revoked} tone={revoked > 0 ? 'bad' : undefined} />
        <Metric label="Unsigned" value={credentials.filter((r) => r.proofStatus === 'unsigned').length} />
      </dl>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Award rules</h2>

        {loading ? (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
        ) : (
          <div className="mt-3 overflow-x-auto border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
                <tr>
                  <th className="px-3 py-2">Badge</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Season</th>
                  <th className="px-3 py-2">Rule</th>
                  <th className="px-3 py-2">Threshold</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {badges.map((badge) => {
                  const season = seasons.find((item) => item.id === badge.seasonId);
                  const available = missionsBySeason.get(badge.seasonId) ?? 0;
                  const unreachable =
                    badge.ruleType === 'season-count' && badge.status === 'published' && available < badge.ruleCount;

                  return (
                    <tr key={badge.id} className="border-t border-white/5">
                      <td className="px-3 py-2">
                        <span className="block truncate">{localize(badge.name, 'en')}</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-metal">{badge.id}</span>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{badge.type}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {season ? localize(season.title, 'en') : badge.seasonId || '—'}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {badge.ruleType === 'season-count' ? 'Season missions' : 'Mission'}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {badge.ruleType === 'season-count' ? badge.ruleCount : '—'}
                      </td>
                      <td className="px-3 py-2">
                        <span className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          {badge.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {badge.ruleType === 'season-count' ? (
                          unreachable ? (
                            <span className="text-amber-200">
                              {available}/{badge.ruleCount} — cannot trigger
                            </span>
                          ) : (
                            <span className="text-primary">
                              {available}/{badge.ruleCount} missions
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Credential registry</h2>

        {credentials.length === 0 ? (
          <p className="mt-3 border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground">
            No credential has been issued in this browser yet.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
                <tr>
                  <th className="px-3 py-2">Registry</th>
                  <th className="px-3 py-2">Credential</th>
                  <th className="px-3 py-2">Issued</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Proof</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map((record) => (
                  <tr key={record.id} className="border-t border-white/5">
                    <td className="px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-metal">{record.registryNo}</td>
                    <td className="max-w-72 truncate px-3 py-2">
                      {String((record.document as { name?: string }).name ?? record.badgeId)}
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
                      {String(record.createdAt).slice(0, 10)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                          record.credentialStatus === 'issued'
                            ? 'border-primary/40 text-primary'
                            : 'border-red-500/40 text-red-300'
                        }`}
                      >
                        {record.credentialStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-200">
                      {record.proofStatus}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {record.credentialStatus === 'issued' ? (
                        <button
                          type="button"
                          onClick={() => void handleRevoke(record)}
                          className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-300 hover:underline"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 border border-white/10 bg-white/[0.02] p-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Configuration flow</h2>
        <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>1. The awards table lives in a Google Sheet (editable with AppSheet).</li>
          <li>
            2. <code className="text-foreground/90">python3 scripts/sync_config.py --awards &lt;csv|url&gt;</code>{' '}
            writes <code className="text-foreground/90">lib/data/datasets/isa-config.json</code>.
          </li>
          <li>3. On first load, rules are applied to the local database.</li>
          <li>4. “Apply config” re-applies the file to an existing database without deleting badges.</li>
        </ol>
      </section>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: 'good' | 'bad' }) {
  const color = tone === 'good' ? 'text-primary' : tone === 'bad' ? 'text-red-300' : 'text-foreground';

  return (
    <div className="border border-white/10 px-3 py-2">
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-metal">{label}</dt>
      <dd className={`mt-1 font-display text-2xl font-extrabold ${color}`}>{value}</dd>
    </div>
  );
}
