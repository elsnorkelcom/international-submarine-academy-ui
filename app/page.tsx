import { SeriesHeader } from '@/components/series/series-header'
import { SeriesHero } from '@/components/series/series-hero'
import { SeriesProvider } from '@/components/series/series-context'
import { SeasonRails } from '@/components/series/season-rails'

export default function HomePage() {
  return (
    <>
      <SeriesHeader />
      <main className="pb-20">
        <SeriesProvider>
          <SeriesHero />
          <SeasonRails />
        </SeriesProvider>
      </main>
      <footer className="border-t border-white/5 py-8">
        <p className="mx-auto max-w-[1600px] px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-10">
          International Submarine Academy · Versión 2 · Serie vertical
        </p>
      </footer>
    </>
  )
}
