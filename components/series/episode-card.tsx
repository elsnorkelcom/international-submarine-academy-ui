'use client'

import Image from 'next/image'
import { Check, Lock } from 'lucide-react'
import { getSeason, type Episode } from '@/lib/seasons'
import { useSeries } from './series-context'

export function EpisodeCard({ episode, showSeason = false }: { episode: Episode; showSeason?: boolean }) {
  const { episode: selected, selectEpisode } = useSeries()
  const season = getSeason(episode.seasonId)
  const isSelected = selected.id === episode.id
  const locked = episode.status === 'locked'
  const completed = episode.status === 'completed'
  const tag = `T${season.number}:E${episode.number}`

  return (
    <li className="w-[40vw] max-w-[210px] shrink-0 snap-start sm:w-44 md:w-48">
      <button
        type="button"
        onClick={() => selectEpisode(episode)}
        aria-pressed={isSelected}
        aria-label={`${tag}, ${episode.specialty ?? episode.node}, ${locked ? 'bloqueado' : completed ? 'visto' : 'disponible'}`}
        className="group block w-full text-left focus-visible:outline-none"
      >
        <div
          className={`relative aspect-[9/16] overflow-hidden rounded-md bg-card ring-1 transition duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary ${
            isSelected ? 'ring-2' : 'ring-white/10 group-hover:ring-white/30'
          }`}
          style={isSelected ? { ['--tw-ring-color' as string]: season.color, boxShadow: `0 0 28px ${season.color}55` } : undefined}
        >
          <Image
            src={episode.image}
            alt=""
            fill
            sizes="(min-width: 768px) 192px, 40vw"
            className={`object-cover transition duration-500 group-hover:scale-105 ${locked ? 'grayscale brightness-50' : ''}`}
          />
          <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: season.color }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" aria-hidden="true" />

          <div className="absolute left-2 top-3 flex items-center gap-1.5">
            <span className="rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground backdrop-blur">
              {showSeason ? tag : `E${episode.number}`}
            </span>
          </div>

          {(locked || completed) && (
            <span
              className={`absolute right-2 top-3 flex size-6 items-center justify-center rounded-full ${completed ? 'bg-primary text-primary-foreground' : 'bg-black/60 text-muted-foreground'}`}
              aria-hidden="true"
            >
              {completed ? <Check className="size-3.5" /> : <Lock className="size-3" />}
            </span>
          )}

          <span
            aria-hidden="true"
            className="absolute -bottom-3 right-1 font-display text-8xl font-extrabold leading-none text-white/10"
          >
            {episode.number}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="font-display text-base font-bold uppercase leading-tight text-foreground">
              {episode.specialty ?? episode.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-widest text-metal">{episode.node}</p>
            {episode.progress ? (
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-primary" style={{ width: `${episode.progress}%` }} />
              </div>
            ) : null}
          </div>
        </div>
      </button>
    </li>
  )
}
