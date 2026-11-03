import { SeriesHeader } from '@/components/series/series-header'
import { SeriesHero } from '@/components/series/series-hero'
import { SeriesProvider } from '@/components/series/series-context'
import { SeasonRails } from '@/components/series/season-rails'
import { AccreditationPath } from '@/components/series/accreditation-path'
import { DemoEpisodeProvider } from '@/components/series/demo-episode-context'
import { TEMPORARY_VISIBLE_HOME_LOCALE } from '@/lib/i18n/config'

export default function HomePage() {
  const locale = TEMPORARY_VISIBLE_HOME_LOCALE

  return (
    <>
      <SeriesHeader locale={locale} />
      <main className="pb-20">
        <DemoEpisodeProvider locale={locale}>
          <SeriesProvider>
            <SeriesHero />
            <SeasonRails locale={locale} />
          </SeriesProvider>
          <AccreditationPath locale={locale} />
        </DemoEpisodeProvider>
      </main>
      <footer className="border-t border-white/5 py-8">
        <p className="mx-auto max-w-[1600px] px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-10">
          International Submarine Academy · Versión 2 · Serie vertical
        </p>
      </footer>
    </>
  )
}
