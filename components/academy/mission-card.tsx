'use client'

import Image from 'next/image'
import { Check, Lock, Play } from 'lucide-react'
import type { Mission, MissionStatus } from '@/lib/missions'
import { cn } from '@/lib/utils'
import { MissionBadge } from './mission-badge'
import { useSelectedMission } from './selected-mission'

const STATUS_LABEL: Record<MissionStatus, string> = {
  locked: 'Bloqueada',
  available: 'Disponible',
  completed: 'Completada',
}

export function MissionCard({
  mission,
  className,
  variant = 'poster',
  accent,
}: {
  mission: Mission
  className?: string
  variant?: 'poster' | 'tile'
  accent?: string
}) {
  const tile = variant === 'tile'
  const locked = mission.status === 'locked'
  const completed = mission.status === 'completed'
  const { mission: selected, selectMission } = useSelectedMission()
  const isSelected = selected.id === mission.id

  return (
    <article className={cn('group/card relative', className)}>
      <a
        href="#hero-title"
        onClick={(event) => {
          event.preventDefault()
          if (!locked) selectMission(mission)
        }}
        aria-disabled={locked || undefined}
        aria-current={isSelected || undefined}
        aria-label={`${mission.title}, ${mission.node}, ${STATUS_LABEL[mission.status]}`}
        className={cn(
          'block rounded-md outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-primary',
          !locked && 'hover:-translate-y-1.5',
          locked && 'cursor-not-allowed',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-md border border-white/10 bg-card transition duration-300',
            tile ? 'aspect-[4/5]' : 'aspect-[9/16]',
            'group-hover/card:border-primary group-hover/card:shadow-[0_0_0_1px_#00ff88,0_12px_32px_-8px_rgba(0,255,136,0.35)]',
            isSelected && 'border-primary shadow-[0_0_0_1px_#00ff88,0_12px_32px_-8px_rgba(0,255,136,0.35)]',
          )}
        >
          <Image
            src={mission.image}
            alt=""
            fill
            sizes={tile ? '(min-width: 1280px) 16vw, 200px' : '(min-width: 1280px) 18vw, (min-width: 768px) 25vw, 50vw'}
            className={cn(
              'object-cover transition duration-500 group-hover/card:scale-105',
              locked && 'opacity-40 grayscale',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <span className="absolute left-2.5 top-2.5 rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-metal backdrop-blur">
            {mission.code}
          </span>

          {completed && (
            <div className="absolute right-2 top-2">
              <MissionBadge code={mission.code} />
            </div>
          )}

          {locked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/70 text-metal backdrop-blur">
                <Lock className="size-5" aria-hidden="true" />
              </span>
            </div>
          )}

          {mission.status === 'available' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover/card:opacity-100">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_rgba(0,255,136,0.5)]">
                <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
              </span>
            </div>
          )}

          {accent && (
            <div
              className={cn('absolute inset-x-0 top-0 h-1', locked && 'opacity-50')}
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3
              className={cn(
                'font-display font-bold uppercase leading-tight tracking-wide',
                tile ? 'text-base md:text-lg' : 'text-lg md:text-xl',
                locked ? 'text-muted-foreground' : 'text-foreground',
              )}
            >
              {mission.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-metal">{mission.node}</p>
            <StatusPill status={mission.status} />
          </div>

          {completed && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
        </div>
      </a>
    </article>
  )
}

function StatusPill({ status }: { status: MissionStatus }) {
  return (
    <span
      className={cn(
        'mt-2 inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
        status === 'completed' && 'bg-primary/15 text-primary',
        status === 'available' && 'border border-primary/40 text-primary',
        status === 'locked' && 'bg-white/5 text-muted-foreground',
      )}
    >
      {status === 'completed' && <Check className="size-3" aria-hidden="true" />}
      {status === 'locked' && <Lock className="size-3" aria-hidden="true" />}
      {status === 'available' && <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />}
      {STATUS_LABEL[status]}
    </span>
  )
}
