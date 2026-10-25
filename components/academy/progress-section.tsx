import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { aceroMissions, allMissions, cobreMissions } from '@/lib/missions'
import { MissionBadge } from './mission-badge'
import { SectionHeading } from './section-heading'

function countCompleted(list: typeof allMissions) {
  return list.filter((m) => m.status === 'completed').length
}

export function ProgressSection() {
  const total = allMissions.length
  const done = countCompleted(allMissions)
  const percent = Math.round((done / total) * 100)
  const phases = [
    { name: 'Fase Acero', done: countCompleted(aceroMissions), total: aceroMissions.length },
    { name: 'Fase Cobre', done: countCompleted(cobreMissions), total: cobreMissions.length },
  ]
  const earned = allMissions.filter((m) => m.status === 'completed')

  return (
    <section id="mi-progreso" aria-labelledby="mi-progreso-title" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 md:px-10">
      <SectionHeading id="mi-progreso-title" eyebrow="Bitácora del cadete" title="Mi Progreso" />

      <div className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-zinc-900 via-card to-background">
        <div className="bg-grid-tech absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative grid gap-8 p-5 md:grid-cols-[1.4fr_1fr] md:p-8">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-metal">Progreso general</p>
                <p className="mt-1 font-display text-6xl font-extrabold leading-none text-foreground">
                  {percent}
                  <span className="text-3xl text-primary">%</span>
                </p>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {done} / {total} misiones
              </p>
            </div>

            <div
              className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso general"
            >
              <div className="h-full bg-primary shadow-[0_0_16px_#00ff88]" style={{ width: `${percent}%` }} />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {phases.map((phase) => (
                <div key={phase.name} className="rounded-sm border border-white/5 bg-black/30 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{phase.name}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-foreground">
                    {phase.done}
                    <span className="text-base text-muted-foreground"> / {phase.total}</span>
                  </dd>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-primary/80" style={{ width: `${(phase.done / phase.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-sm border border-primary/20 bg-black/40 p-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-metal">Badges obtenidos</p>
              <p className="mt-1 font-display text-4xl font-extrabold text-foreground">
                <span className="text-primary">{earned.length}</span> / {total} badges
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Badges obtenidos">
                {earned.map((m) => (
                  <li key={m.id}>
                    <MissionBadge code={m.code} />
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Ir a Mi Colección
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
