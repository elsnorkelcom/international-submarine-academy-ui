import { continueWatching, seasons } from '@/lib/seasons'
import { EpisodeCard } from './episode-card'
import { EpisodeRail } from './episode-rail'

export function SeasonRails() {
  return (
    <div className="relative z-10 -mt-16 space-y-12 md:-mt-20">
      <EpisodeRail id="seguir-viendo" title="Seguir viendo" eyebrow="Tu progreso" meta={`${continueWatching.length} episodios`}>
        {continueWatching.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} showSeason />
        ))}
      </EpisodeRail>

      <div id="temporadas" className="scroll-mt-20 space-y-12">
        {seasons.map((season) => {
          const done = season.episodes.filter((e) => e.status === 'completed').length
          return (
            <EpisodeRail
              key={season.id}
              id={`temporada-${season.number}`}
              title={season.title}
              eyebrow={`Temporada ${season.number} · ${season.tagline}`}
              color={season.color}
              meta={`${done} / ${season.episodes.length} vistos`}
            >
              {season.episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </EpisodeRail>
          )
        })}
      </div>
    </div>
  )
}
