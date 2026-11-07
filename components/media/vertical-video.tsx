'use client';

interface VerticalVideoProps {
  videoId: string;
  title: string;
  /** Shows the sample badge when the video is not the museum's own material. */
  sample?: boolean;
  credit?: { author: string; url: string };
  sampleLabel: string;
  creditLabel: string;
}

/** 9:16 player, the same frame the learner experience uses on mobile. */
export function VerticalVideo({ videoId, title, sample, credit, sampleLabel, creditLabel }: VerticalVideoProps) {
  return (
    <figure className="w-full">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-md border border-white/10 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <figcaption className="mt-2 space-y-1 text-center">
        {sample ? (
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200">{sampleLabel}</p>
        ) : null}
        {credit ? (
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {creditLabel}{' '}
            <a href={credit.url} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
              {credit.author}
            </a>
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
