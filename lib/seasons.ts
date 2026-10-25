import { aceroMissions, cobreMissions, DISCIPLINES, DISCIPLINE_META, type Mission } from './missions'

export type Episode = Mission & { number: number; seasonId: string }

export type Season = {
  id: string
  number: number
  title: string
  tagline: string
  color: string
  letter: string
  episodes: Episode[]
}

const toEpisodes = (missions: Mission[], seasonId: string): Episode[] =>
  missions.map((mission, index) => ({
    ...mission,
    number: index + 1,
    seasonId,
    title: `Episodio ${index + 1}`,
  }))

export const seasons: Season[] = [
  {
    id: 't1',
    number: 1,
    title: 'Acero',
    tagline: 'Iniciación a bordo',
    color: '#b8bec4',
    letter: 'Fe',
    episodes: toEpisodes(aceroMissions, 't1'),
  },
  ...DISCIPLINES.map((discipline, index) => {
    const id = `t${index + 2}`
    return {
      id,
      number: index + 2,
      title: discipline,
      tagline: `Disciplina ${DISCIPLINE_META[discipline].letter} · STEM+A`,
      color: DISCIPLINE_META[discipline].color,
      letter: DISCIPLINE_META[discipline].letter,
      episodes: toEpisodes(
        cobreMissions.filter((mission) => mission.discipline === discipline),
        id,
      ),
    }
  }),
]

export function getSeason(id: string) {
  return seasons.find((season) => season.id === id) ?? seasons[0]
}

export function nextEpisode(season: Season) {
  return (
    season.episodes.find((episode) => episode.status === 'available') ??
    season.episodes.find((episode) => episode.status !== 'locked') ??
    season.episodes[0]
  )
}

export const continueWatching = seasons.flatMap((season) =>
  season.episodes.filter((episode) => episode.status === 'available'),
)
