'use client'

import { useRef, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type EpisodeRailProps = {
  id: string
  title: string
  eyebrow?: string
  color?: string
  meta?: string
  children: ReactNode
}

export function EpisodeRail({ id, title, eyebrow, color, meta, children }: EpisodeRailProps) {
  const scroller = useRef<HTMLUListElement>(null)

  const scroll = (direction: 1 | -1) =>
    scroller.current?.scrollBy({ left: direction * scroller.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section aria-labelledby={`${id}-title`} className="group/rail relative scroll-mt-20" id={id}>
      <div className="mx-auto mb-3 flex max-w-[1600px] items-end justify-between gap-4 px-4 md:px-10">
        <div>
          {eyebrow && (
            <p className="mb-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {color && <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />}
              {eyebrow}
            </p>
          )}
          <h2 id={`${id}-title`} className="font-display text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            {title}
          </h2>
        </div>
        {meta && <p className="font-mono text-[10px] uppercase tracking-widest text-metal">{meta}</p>}
      </div>

      <div className="relative">
        <ul
          ref={scroller}
          className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 pt-2 md:scroll-px-10 md:px-10"
        >
          {children}
        </ul>
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Desplazar ${title} a la izquierda`}
          className="absolute inset-y-2 left-0 hidden w-10 items-center justify-center bg-gradient-to-r from-background to-transparent text-foreground opacity-0 transition group-hover/rail:opacity-100 focus-visible:opacity-100 md:flex"
        >
          <ChevronLeft className="size-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Desplazar ${title} a la derecha`}
          className="absolute inset-y-2 right-0 hidden w-10 items-center justify-center bg-gradient-to-l from-background to-transparent text-foreground opacity-0 transition group-hover/rail:opacity-100 focus-visible:opacity-100 md:flex"
        >
          <ChevronRight className="size-7" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
