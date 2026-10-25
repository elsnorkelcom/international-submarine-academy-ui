'use client'

import { Info, Play, RotateCcw } from 'lucide-react'
import { HeroBackdrop } from './hero-backdrop'
import { useSelectedMission } from './selected-mission'

export function Hero() {
  const { mission } = useSelectedMission()
  const phase = mission.id.startsWith('acero') ? 'Fase Acero' : 'Fase Cobre'
  const completed = mission.status === 'completed'
  const progress = completed ? 100 : (mission.progress ?? 0)
  const eyebrow = completed ? 'Repasar misión' : progress > 0 ? 'Continuar viendo' : 'Nueva misión'

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[78svh] items-end overflow-hidden md:min-h-[88svh]">
      <HeroBackdrop mission={mission} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/20 to-background/40" />
      <div className="bg-grid-tech absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_right,black,transparent_60%)]" />

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 pt-32 md:px-10 md:pb-24">
        <div key={mission.id} aria-live="polite" className="max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
            {eyebrow}
          </div>

          <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.3em] text-metal">
            Nodo · {mission.node}
          </p>
          <h1 id="hero-title" className="text-balance font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl">
            {mission.title}
          </h1>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Descripción de la misión {mission.code}. Placeholder para el contenido real del módulo de {phase}.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-metal">
            <span className="rounded-sm border border-white/15 px-1.5 py-0.5">{phase}</span>
            <span>{mission.code}</span>
            {mission.specialty && (
              <>
                <span aria-hidden="true">·</span>
                <span>{mission.specialty}</span>
              </>
            )}
            {mission.discipline && (
              <>
                <span aria-hidden="true">·</span>
                <span>{mission.discipline}</span>
              </>
            )}
          </div>

          <div className="mt-6 max-w-sm">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de la misión">
              <div className="h-full bg-primary shadow-[0_0_12px_#00ff88] transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {completed ? 'Misión completada' : progress > 0 ? `${progress}% completado` : 'Sin iniciar'}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#fase-acero"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_24px_rgba(0,255,136,0.35)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {completed ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4 fill-current" aria-hidden="true" />}
              {completed ? 'Repetir misión' : 'Ver misión'}
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur transition hover:bg-white/20"
            >
              <Info className="size-4" aria-hidden="true" />
              Más info
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
