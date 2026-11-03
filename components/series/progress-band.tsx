'use client'

import { MissionBadge } from '@/components/academy/mission-badge'
import { formatMessage, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { getProgressSummary } from '@/lib/progress'

const BADGE_SAMPLE_SIZE = 5

export function ProgressBand({ locale }: { locale: Locale }) {
  const messages = getMessages(locale)
  const progress = messages.series.progress
  const { total, completed, earnedBadges } = getProgressSummary()
  const sample = earnedBadges.slice(0, BADGE_SAMPLE_SIZE)
  const displayCompleted = completed
  const displayBadges = earnedBadges.length
  const displayPercent = total === 0 ? 0 : Math.round((displayCompleted / total) * 100)

  return (
    <section
      id="mi-progreso"
      aria-labelledby="mi-progreso-title"
      className="mx-auto max-w-[1600px] scroll-mt-24 px-4 md:px-10"
    >
      <div className="rounded-md border border-white/10 bg-gradient-to-r from-white/[0.04] via-card/60 to-transparent px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[auto_1fr] md:items-center md:gap-x-5 md:gap-y-3 lg:flex lg:flex-row lg:justify-between lg:gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p id="mi-progreso-title" className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">
                {progress.title}
              </p>
              <span
                className="rounded-sm border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-widest text-primary"
                title={progress.demoNotice}
              >
                {messages.common.demo}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display text-4xl font-extrabold leading-none text-foreground">
                {displayPercent}
                <span className="text-xl text-primary">%</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {formatMessage(progress.missionsCount, { completed: displayCompleted, total })}
                <span aria-hidden="true"> · </span>
                {formatMessage(progress.badgesCount, { earned: displayBadges, total })}
              </p>
            </div>
          </div>

          <div className="min-w-0 md:order-3 md:col-span-2 lg:order-none lg:mx-2 lg:max-w-xl lg:flex-1 xl:mx-6">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={displayPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={progress.progressBarAria}
            >
              <div className="h-full bg-primary" style={{ width: `${displayPercent}%` }} />
            </div>
            <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-wide text-muted-foreground">
              {progress.demoNotice}
            </p>
          </div>

          <div className="md:justify-self-end lg:ml-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
              {progress.badgeSample}
            </p>
            {sample.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={progress.badgeSample}>
                {sample.map((mission) => (
                  <li key={mission.id}>
                    <MissionBadge code={mission.code} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">{progress.noBadges}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
