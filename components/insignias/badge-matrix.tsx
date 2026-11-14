'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useApp } from '@/components/app/data-provider'
import { useProgress } from '@/components/learn/progress-provider'
import { formatMessage, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { localize, type Badge, type LanguageCode } from '@/lib/domain/types'
import { BadgePopup } from '@/components/insignias/badge-popup'
/** Galería real de reconocimientos de Cobre, leída de la base local. */
export function BadgeMatrix({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.badges
  const { database, ready } = useApp()
  const { progress } = useProgress()
  const [badges, setBadges] = useState<Badge[]>([])
  const [seasons, setSeasons] = useState<{ id: string; title: any; colorTheme?: string }[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!database) return
      const [result, seasonsRes] = await Promise.all([
        database.repository('badges').list({ pageSize: 0 }),
        database.repository('seasons').list({ pageSize: 0 }),
      ])
      if (cancelled) return
      setBadges(result.items.filter((item) => item.status === 'published'))
      setSeasons(seasonsRes.items.filter((s) => s.status === 'published'))
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [database])

  const language = locale as LanguageCode
  const earned = useMemo(() => new Set(progress.badges), [progress.badges])
  const [selected, setSelected] = useState<Badge | null>(null)

  const stem = useMemo(
    () =>
      [...badges]
        .filter((badge) => !badge.icon.includes('-HUM-'))
        .sort((a, b) => a.icon.localeCompare(b.icon)),
    [badges],
  )
  const human = useMemo(
    () =>
      [...badges]
        .filter((badge) => badge.icon.includes('-HUM-'))
        .sort((a, b) => localize(a.name, language).localeCompare(localize(b.name, language))),
    [badges, language],
  )

  const earnedCount = badges.filter((badge) => earned.has(badge.id)).length

  if (!ready) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{messages.empty}</p>
  }

  if (badges.length === 0) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm text-foreground">{messages.empty}</p>
        <Link href="/profile" className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {messages.profileLink}
        </Link>
      </div>
    )
  }

  return (
    <section aria-labelledby="badge-matrix-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.matrixEyebrow}</p>
          <h2 id="badge-matrix-title" className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            {messages.matrixTitle}
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {formatMessage(messages.progressLabel, { earned: earnedCount, total: badges.length })}
          </p>
          <Link href="/profile" className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary">
            {messages.profileLink}
          </Link>
        </div>
      </div>

      <p className="mb-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">{messages.pendingNotice}</p>

      {/* Group badges by season and show only ribbon image + tooltip; click opens popup */}
      {seasons.length > 0 && (() => {
        const bySeason = seasons.map((s) => ({ season: s, items: badges.filter((b) => b.seasonId === s.id) }));
        return bySeason.map(({ season, items }) =>
          items.length > 0 ? (
          <div key={season.id} className="mb-8">
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">{localize(season.title, language)}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {items.filter((badge) => earned.has(badge.id)).length}/{items.length}
              </span>
            </div>

            <ul aria-label={localize(season.title, language)} className="grid grid-cols-6 gap-3">
              {items.map((badge) => {
                const isEarned = earned.has(badge.id);
                return (
                  <li key={badge.id} className="flex items-center justify-center">
                    <button title={localize(badge.name, language)} onClick={() => setSelected(badge)} className={`rounded p-1 ${isEarned ? '' : 'opacity-60'}`}>
                      <img src={badge.icon} alt={localize(badge.name, language)} className="size-12 object-contain" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null,
        )
      })()}
      {selected ? <BadgePopup badge={selected} language={language} /> : null}
    </section>
  )
}
