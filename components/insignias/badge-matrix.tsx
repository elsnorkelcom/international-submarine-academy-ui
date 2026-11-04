import { getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { cobreMissions, DISCIPLINES, DISCIPLINE_META, SPECIALTIES, type Mission } from '@/lib/missions'
import { MissionBadge } from '@/components/academy/mission-badge'

function getMission(specialty: Mission['specialty'], discipline: Mission['discipline']) {
  return cobreMissions.find((mission) => mission.specialty === specialty && mission.discipline === discipline)
}

export function BadgeMatrix({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.badges

  return (
    <section aria-labelledby="badge-matrix-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.matrixEyebrow}</p>
          <h2 id="badge-matrix-title" className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            {messages.matrixTitle}
          </h2>
        </div>
        <p className="max-w-sm text-right text-xs leading-relaxed text-muted-foreground">{messages.pendingNotice}</p>
      </div>

      <ul aria-label={messages.matrixLabel} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SPECIALTIES.flatMap((specialty) =>
          DISCIPLINES.map((discipline) => {
            const mission = getMission(specialty, discipline)
            if (!mission) return null

            const color = DISCIPLINE_META[discipline].color
            const earned = mission.status === 'completed'
            const status = messages.status[mission.status]

            return (
              <li key={mission.id}>
                <article
                  aria-labelledby={`${mission.code}-title`}
                  className="flex h-full min-h-64 flex-col rounded-md border border-white/10 bg-card/40 p-3 transition-colors hover:border-white/25"
                  style={{ borderTopColor: color, borderTopWidth: '2px' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <MissionBadge code={mission.code} color={color} earned={earned} className="size-10 shrink-0" />
                    <code className="rounded-sm border border-white/10 px-1.5 py-1 font-mono text-[10px] tracking-widest text-metal">
                      {mission.code}
                    </code>
                  </div>

                  <h3 id={`${mission.code}-title`} className="mt-4 font-display text-lg font-bold uppercase leading-tight text-foreground">
                    {specialty}
                  </h3>

                  <dl className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9px] uppercase tracking-widest text-metal">{messages.roleLabel}</dt>
                      <dd className="text-right text-foreground">{specialty}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9px] uppercase tracking-widest text-metal">{messages.disciplineLabel}</dt>
                      <dd className="text-right" style={{ color }}>{discipline}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9px] uppercase tracking-widest text-metal">{messages.statusLabel}</dt>
                      <dd className={earned ? 'text-primary' : 'text-muted-foreground'}>{status}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9px] uppercase tracking-widest text-metal">{messages.badgeLabel}</dt>
                      <dd className="text-right text-foreground">{messages.cssBadge}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[9px] uppercase tracking-widest text-metal">{messages.sheetLabel}</dt>
                      <dd className="text-right text-muted-foreground">{messages.pendingSheet}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            )
          }),
        )}
      </ul>
    </section>
  )
}
