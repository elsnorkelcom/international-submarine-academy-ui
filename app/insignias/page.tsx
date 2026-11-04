import { AccessGate } from '@/components/series/access-gate'
import { SeriesHeader } from '@/components/series/series-header'
import { BadgeMatrix } from '@/components/insignias/badge-matrix'
import { getMessages } from '@/lib/i18n'
import { TEMPORARY_VISIBLE_HOME_LOCALE } from '@/lib/i18n/config'

export default function BadgesPage() {
  const locale = TEMPORARY_VISIBLE_HOME_LOCALE
  const messages = getMessages(locale).series.badges

  return (
    <AccessGate>
      <SeriesHeader locale={locale} activeHref="/insignias" />
      <main className="min-h-svh px-4 pb-20 pt-24 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <section aria-labelledby="badges-page-title" className="mb-10 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">{messages.eyebrow}</p>
            <h1 id="badges-page-title" className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
              {messages.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{messages.intro}</p>
          </section>
          <BadgeMatrix locale={locale} />
        </div>
      </main>
    </AccessGate>
  )
}
