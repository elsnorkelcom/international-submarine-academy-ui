import type { Episode, LanguageCode, Mission } from '@/lib/domain/types';
import { localize } from '@/lib/domain/types';
import type { AppStrings } from '@/lib/i18n/app';

interface EpisodeMediaProps {
  episode: Episode | null;
  mission: Mission;
  language: LanguageCode;
  t: AppStrings['learn']['episode'];
  children?: React.ReactNode;
}

const POSTERS: Record<string, string> = {
  SCI: '/images/m-hull.png',
  TEC: '/images/m-engine.png',
  ING: '/images/m-control.png',
  MAT: '/images/m-sonar.png',
  HUM: '/images/m-periscope.png',
};

function posterFor(mission: Mission): string {
  return POSTERS[mission.disciplineId ?? ''] ?? '/images/m-control.png';
}

function youtubeEmbed(url: string): string | null {
  // Supports watch?v=, youtu.be/, embed/ and shorts/
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

/** Card de miniatura del video del episodio. Si no hay media, muestra el estado de producción. */
export function EpisodeMedia({ episode, mission, language, t, children }: EpisodeMediaProps) {
  const mediaUrl = episode?.mediaUrl?.trim() ?? '';
  const poster = episode?.posterUrl?.trim() || posterFor(mission);
  const youtube = mediaUrl ? youtubeEmbed(mediaUrl) : null;
  const title = episode ? localize(episode.title, language) : localize(mission.title, language);

  return (
    <figure className="mt-6">
      <div className="relative w-full overflow-hidden border border-white/10 bg-black/40" style={{ aspectRatio: '9/16' }}>
        {youtube ? (
          <iframe
            src={youtube}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : mediaUrl ? (
          <video controls playsInline poster={poster} className="absolute inset-0 w-full h-full object-cover">
            <source src={mediaUrl} />
          </video>
        ) : (
          <>
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full border border-white/40 bg-black/40"
              >
                <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-white/80" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/85">
                {t.videoSoon}
              </span>
            </div>
            <span className="absolute left-3 top-3 border border-white/25 bg-black/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80">
              {t.videoLabel}
            </span>
          </>
        )}

        {/* Overlay slot for HUD (ribbon, brief question) */}
        {children ? (
          <div className="absolute left-0 top-0 z-20 flex w-full justify-between p-3 pointer-events-none">
            <div className="pointer-events-auto">{children}</div>
          </div>
        ) : null}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {mediaUrl ? title : t.videoHint}
        </span>
        {episode?.durationSeconds ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {Math.floor(episode.durationSeconds / 60)}:{String(episode.durationSeconds % 60).padStart(2, '0')}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
