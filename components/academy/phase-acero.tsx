import { aceroMissions } from '@/lib/missions'
import { MissionCard } from './mission-card'
import { SectionHeading } from './section-heading'

export function PhaseAcero() {
  const completed = aceroMissions.filter((m) => m.status === 'completed').length

  return (
    <section id="fase-acero" aria-labelledby="fase-acero-title" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 md:px-10">
      <SectionHeading id="fase-acero-title" eyebrow="Fase 01 · 6 misiones" title="Fase Acero" meta={`${completed} / ${aceroMissions.length}`} />

      <div className="-mx-4 md:-mx-10">
        <ul className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-2 md:gap-4 md:px-10 xl:grid xl:grid-cols-6 xl:overflow-visible">
          {aceroMissions.map((mission) => (
            <li key={mission.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[22%] xl:w-auto">
              <MissionCard mission={mission} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
