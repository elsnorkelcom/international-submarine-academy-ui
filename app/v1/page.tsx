import type { Metadata } from 'next'
import { SiteHeader } from '@/components/academy/site-header'
import { Hero } from '@/components/academy/hero'
import { SelectedMissionProvider } from '@/components/academy/selected-mission'
import { PhaseAcero } from '@/components/academy/phase-acero'
import { PhaseCobre } from '@/components/academy/phase-cobre'
import { ProgressSection } from '@/components/academy/progress-section'

export const metadata: Metadata = {
  title: 'Versión 1 · Fases Acero y Cobre | International Submarine Academy',
}

export default function VersionOnePage() {
  return (
    <>
      <SiteHeader />
      <main className="pb-20">
        <SelectedMissionProvider>
          <Hero />
          <div className="relative z-10 -mt-10 space-y-16 md:-mt-16 md:space-y-20">
            <PhaseAcero />
            <PhaseCobre />
            <ProgressSection />
          </div>
        </SelectedMissionProvider>
      </main>
      <footer className="border-t border-white/5 py-8">
        <p className="mx-auto max-w-[1600px] px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-10">
          International Submarine Academy · Versión 1 · Maqueta visual
        </p>
      </footer>
    </>
  )
}
