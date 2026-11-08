'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Play } from 'lucide-react';

import { AcademyCoin } from '@/components/series/academy-coin';
import { TrailerModal } from '@/components/home/trailer-modal';

/**
 * Netflix-style presentation hero: sonar backdrop, logo entrance effect and
 * trailer playback. Spanish copy — the Home is the brand-facing surface.
 */
export function PresentationHero() {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden"
    >
      {/* Fondo sonar: anillos, barrido y blips, todo CSS */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-tech opacity-30" />
        <div className="absolute left-1/2 top-1/2 size-[150vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute left-1/2 top-1/2 size-[105vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
        <div className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[150vmin] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-[sonar-sweep_16s_linear_infinite]"
          style={{ background: 'conic-gradient(from 0deg, rgba(0,224,138,0.14), transparent 16%)' }}
        />
        <span className="absolute left-[22%] top-[30%] size-1.5 rounded-full bg-primary/70 motion-safe:animate-[sonar-ping_5s_ease-out_infinite]" />
        <span className="absolute left-[68%] top-[22%] size-1 rounded-full bg-primary/60 motion-safe:animate-[sonar-ping_7s_ease-out_1.5s_infinite]" />
        <span className="absolute left-[78%] top-[62%] size-1.5 rounded-full bg-primary/50 motion-safe:animate-[sonar-ping_9s_ease-out_3s_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/75" />
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-4 py-24 md:grid-cols-[1.15fr_auto] md:px-10">
        <div className="order-2 md:order-1">
          <p className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500">
            <span className="rounded-sm bg-primary px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground">
              ISA
            </span>
            <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.25em] text-metal">
              Serie vertical original
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-5 text-balance font-display text-5xl font-extrabold uppercase leading-[0.88] tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 sm:text-6xl lg:text-7xl"
          >
            International Submarine Academy
          </h1>

          <p
            className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 [animation-delay:150ms] md:text-base"
          >
            Todo lo que ves es ficción. Pero hay mucho por descubrir.
          </p>

          <div
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-metal animate-in fade-in fill-mode-both duration-700 [animation-delay:250ms]"
          >
            <span className="text-primary">Temporada 1 · Steel</span>
            <span aria-hidden="true">·</span>
            <span>5 misiones</span>
            <span aria-hidden="true">·</span>
            <span className="rounded-sm border border-white/20 px-1.5 py-0.5">9:16</span>
            <span aria-hidden="true">·</span>
            <span>STEM+A</span>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-700 [animation-delay:350ms]"
          >
            <Link
              href="/episodes?id=MIS-STEEL-04"
              className="inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-3 text-sm font-bold uppercase tracking-wider text-background transition hover:bg-foreground/85"
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              Comenzar
            </Link>
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur transition hover:bg-white/20"
            >
              Ver tráiler
            </button>
          </div>
        </div>

        <div className="order-1 justify-self-center md:order-2 md:mr-[3%]">
          <div className="motion-safe:animate-[coin-enter_1.4s_ease-out_both]">
            <AcademyCoin
              glow="#00E08A"
              seasonLabel="Temporada 1 · Steel"
              className="w-44 md:w-72 lg:w-80"
            />
          </div>
        </div>
      </div>

      {trailerOpen ? <TrailerModal onClose={() => setTrailerOpen(false)} /> : null}
    </section>
  );
}
