'use client'

import { Lock, Play, Plus, RotateCcw } from 'lucide-react'
import { HeroBackdrop } from '@/components/academy/hero-backdrop'
import { seasons } from '@/lib/seasons'
import { AcademyCoin } from './academy-coin'
import { useSeries } from './series-context'

export function SeriesHero() {
  const { season, episode, selectSeason } = useSeries()
  const completed = episode.status === 'completed'
  const locked = episode.status === 'locked'
  const progress = completed ? 100 : (episode.progress ?? 0)
  const doneCount = season.episodes.filter((e) => e.status === 'completed').length
  const tag = `T${season.number}:E${episode.number}`

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
      <HeroBackdrop mission={episode} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/10 to-background/50" />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-24 pt-24 md:flex-row md:items-center md:justify-between md:px-10 md:pb-28">
        <div key={episode.id} aria-live="polite" className="order-2 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500 md:order-1">
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-metal">
            <span className="rounded-sm bg-primary px-1.5 py-0.5 font-bold text-primary-foreground">ISA</span>
            Serie vertical original
          </p>

          <p className="font-display text-lg font-semibold uppercase tracking-[0.3em]" style={{ color: season.color }}>
            Temporada {season.number}
          </p>
          <h1 id="hero-title" className="text-balance font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-foreground md:text-8xl">
            {season.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-metal">
            <span className="text-primary">{doneCount} / {season.episodes.length} vistos</span>
            <span aria-hidden="true">·</span>
            <span>{season.episodes.length} episodios</span>
            <span aria-hidden="true">·</span>
            <span className="rounded-sm border border-white/20 px-1.5 py-0.5">9:16</span>
            <span aria-hidden="true">·</span>
            <span>{season.tagline}</span>
          </div>

          <p className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
            {tag} · {episode.specialty ?? episode.node}
          </p>
          <p className="mt-1 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Sinopsis del episodio {episode.number} a bordo del {episode.node}. Placeholder para el guion real de la temporada {season.title}.
          </p>

          {progress > 0 && !completed && (
            <div className="mt-4 flex max-w-xs items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso del episodio">
                <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{progress}%</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={locked}
              className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition hover:bg-foreground/85 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-muted-foreground"
            >
              {locked ? <Lock className="size-4" aria-hidden="true" /> : completed ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4 fill-current" aria-hidden="true" />}
              {locked ? 'Bloqueado' : completed ? `Volver a ver ${tag}` : `Ver ${tag}`}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur transition hover:bg-white/20"
            >
              <Plus className="size-4" aria-hidden="true" />
              Mi lista
            </button>
          </div>

          <div className="mt-8" role="group" aria-label="Elegir temporada">
            <ul className="flex flex-wrap gap-2">
              {seasons.map((s) => {
                const active = s.id === season.id
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectSeason(s.id)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                        active ? 'border-transparent bg-foreground text-background' : 'border-white/15 bg-black/30 text-muted-foreground backdrop-blur hover:border-white/40 hover:text-foreground'
                      }`}
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                      T{s.number}
                      <span className="hidden sm:inline">· {s.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <AcademyCoin
          glow={season.color}
          seasonLabel={`Temporada ${season.number}`}
          className="order-1 w-40 self-end md:order-2 md:mr-[4%] md:w-80 md:self-center lg:w-96"
        />
      </div>
    </section>
  )
}
