import { AccreditationPath } from '@/components/series/accreditation-path'
import { AccessGate } from '@/components/series/access-gate'
import { SeriesHeader } from '@/components/series/series-header'
import { HomeExperience } from '@/components/home/home-experience'
import { TEMPORARY_VISIBLE_HOME_LOCALE } from '@/lib/i18n/config'

export default function HomePage() {
  const locale = TEMPORARY_VISIBLE_HOME_LOCALE

  return (
    <AccessGate>
      <SeriesHeader locale={locale} />
      <main className="pb-20">
        <HomeExperience />
        <AccreditationPath locale={locale} />
      </main>
      <footer className="border-t border-white/5 py-8">
        <p className="mx-auto max-w-[1600px] px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-10">
          International Submarine Academy · Serie vertical original
        </p>
      </footer>
    </AccessGate>
  )
}
