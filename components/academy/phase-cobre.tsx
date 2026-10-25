'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Atom, Cog, Cpu, Palette, Pi, type LucideIcon } from 'lucide-react'
import {
  cobreMissions,
  DISCIPLINE_META,
  DISCIPLINES,
  SPECIALTIES,
  type Discipline,
  type Specialty,
} from '@/lib/missions'
import { cn } from '@/lib/utils'
import { MissionCard } from './mission-card'
import { SectionHeading } from './section-heading'

const DISCIPLINE_ICON: Record<Discipline, LucideIcon> = {
  Ciencias: Atom,
  Tecnología: Cpu,
  Ingeniería: Cog,
  Matemática: Pi,
  'Humanidades y Artes': Palette,
}

export function PhaseCobre() {
  const [specialty, setSpecialty] = useState<Specialty | null>(null)
  const [discipline, setDiscipline] = useState<Discipline | null>(null)

  const completed = cobreMissions.filter((m) => m.status === 'completed').length
  const isDimmed = (s?: Specialty, d?: Discipline) =>
    (specialty !== null && s !== specialty) || (discipline !== null && d !== discipline)

  return (
    <section id="fase-cobre" aria-labelledby="fase-cobre-title" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 md:px-10">
      <SectionHeading id="fase-cobre-title" eyebrow="Fase 02 · Matriz 5×5" title="Fase Cobre" meta={`${completed} / ${cobreMissions.length}`} />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <p className="text-sm text-muted-foreground">
          Filas: <span className="text-foreground">especialidad</span> · Columnas: <span className="text-foreground">disciplina STEAM</span>
        </p>
        {(specialty || discipline) && (
          <button
            type="button"
            onClick={() => {
              setSpecialty(null)
              setDiscipline(null)
            }}
            className="rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition hover:border-white/25 hover:text-foreground"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="scrollbar-none -mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        <div
          role="table"
          aria-label="Matriz de misiones Fase Cobre"
          className="grid min-w-[860px] grid-cols-[7.5rem_repeat(5,minmax(0,1fr))] gap-2 md:gap-3 xl:grid-cols-[9rem_repeat(5,minmax(0,1fr))]"
        >
          <div role="row" className="contents">
            <div role="columnheader" className="sticky left-0 z-10 flex items-center justify-center bg-background">
              <Image src="/images/academy-logo.png" alt="International Submarine Academy" width={72} height={72} className="size-16 xl:size-[72px]" />
            </div>
            {DISCIPLINES.map((d) => {
              const { letter, color } = DISCIPLINE_META[d]
              const Icon = DISCIPLINE_ICON[d]
              const active = discipline === d
              return (
                <div role="columnheader" key={d}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDiscipline(active ? null : d)}
                    style={{ '--col': color } as React.CSSProperties}
                    className={cn(
                      'flex h-full w-full items-center gap-3 rounded-md border bg-card/60 p-3 text-left transition',
                      'border-t-4 border-x-white/5 border-b-white/5 border-t-[var(--col)]',
                      'hover:bg-[color-mix(in_oklab,var(--col)_12%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--col)]',
                      active && 'bg-[color-mix(in_oklab,var(--col)_18%,transparent)]',
                      discipline && !active && 'opacity-40',
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--col)] text-black">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-2xl font-bold leading-none text-[var(--col)]">{letter}</span>
                      <span className="block truncate text-xs font-medium text-foreground">{d}</span>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          {SPECIALTIES.map((s, row) => {
            const active = specialty === s
            const missions = cobreMissions.filter((m) => m.specialty === s)
            const done = missions.filter((m) => m.status === 'completed').length
            return (
              <div role="row" key={s} className="contents">
                <div role="rowheader" className="sticky left-0 z-10 bg-background">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSpecialty(active ? null : s)}
                    className={cn(
                      'flex h-full w-full flex-col justify-center rounded-md border border-white/5 border-l-4 border-l-metal/40 bg-card/60 p-3 text-left transition',
                      'hover:border-l-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      active && 'border-l-primary bg-primary/10',
                      specialty && !active && 'opacity-40',
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{`Fila ${String.fromCharCode(65 + row)}`}</span>
                    <span className="mt-1 font-display text-lg font-bold uppercase leading-tight">{s}</span>
                    <span className="mt-2 font-mono text-[10px] text-muted-foreground">{`${done} / ${missions.length}`}</span>
                  </button>
                </div>
                {missions.map((mission) => (
                  <div
                    role="cell"
                    key={mission.id}
                    className={cn('transition-opacity duration-300', isDimmed(mission.specialty, mission.discipline) && 'opacity-25')}
                  >
                    <MissionCard
                      mission={mission}
                      variant="tile"
                      accent={mission.discipline ? DISCIPLINE_META[mission.discipline].color : undefined}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
