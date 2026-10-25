'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { getSeason, nextEpisode, seasons, type Episode, type Season } from '@/lib/seasons'

type SeriesState = {
  season: Season
  episode: Episode
  selectSeason: (seasonId: string) => void
  selectEpisode: (episode: Episode) => void
}

const SeriesContext = createContext<SeriesState | null>(null)

function scrollToHero() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

export function SeriesProvider({ children }: { children: ReactNode }) {
  const [episode, setEpisode] = useState<Episode>(() => nextEpisode(seasons[0]))
  const season = getSeason(episode.seasonId)

  const value: SeriesState = {
    season,
    episode,
    selectSeason: (seasonId) => setEpisode(nextEpisode(getSeason(seasonId))),
    selectEpisode: (next) => {
      setEpisode(next)
      scrollToHero()
    },
  }

  return <SeriesContext.Provider value={value}>{children}</SeriesContext.Provider>
}

export function useSeries() {
  const context = useContext(SeriesContext)
  if (!context) throw new Error('useSeries must be used inside SeriesProvider')
  return context
}
