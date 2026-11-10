'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useApp } from '@/components/app/data-provider'
import { useProgress } from '@/components/learn/progress-provider'
import { formatMessage, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { localize, type Badge, type LanguageCode } from '@/lib/domain/types'

/** Galería real de reconocimientos de Cobre, leída de la base local. */
export function BadgeMatrix({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.badges
  const { database, ready } = useApp()
  const { progress } = useProgress()
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!database) return
      const result = await database.repository('badges').list({ pageSize: 0 })
      if (cancelled) return
      setBadges(result.items.filter((item) => item.status === 'published'))
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [database])

  const language = locale as LanguageCode
  const earned = useMemo(() => new Set(progress.badges), [progress.badges])

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

      {[{ title: messages.stemTitle, items: stem }, { title: messages.fhTitle, items: human }].map((group) =>
        group.items.length > 0 ? (
          <div key={group.title} className="mb-8">
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">{group.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {group.items.filter((badge) => earned.has(badge.id)).length}/{group.items.length}
              </span>
            </div>
            <ul aria-label={group.title} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {group.items.map((badge) => {
                const isEarned = earned.has(badge.id)
                return (
                  <li key={badge.id}>
                    <article
                      className={`flex h-full flex-col rounded-md border bg-card/40 p-3 transition-colors ${
                        isEarned ? 'border-primary/40' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                      style={{ borderTopColor: badge.color, borderTopWidth: '2px' }}
                      aria-label={`${localize(badge.name, language)}: ${isEarned ? messages.earnedLabel : messages.lockedLabel}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {badge.icon.startsWith('/') ? (
                          <img src={badge.icon} alt="" className="size-12 object-contain" loading="lazy" />
                        ) : null}
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          {isEarned ? messages.earnedLabel : messages.lockedLabel}
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-sm font-bold uppercase leading-tight tracking-wide text-foreground">
                        {localize(badge.name, language)}
                      </h4>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {localize(badge.criteria, language)}
                      </p>
                      <code className="mt-auto pt-3 font-mono text-[9px] tracking-widest text-white/25">{badge.id}</code>
                    </article>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null,
      )}
    </section>
  )
}
