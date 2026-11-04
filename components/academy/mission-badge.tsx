import { Anchor, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

type MissionBadgeProps = {
  code: string
  className?: string
  color?: string
  earned?: boolean
}

export function MissionBadge({ code, className, color, earned = true }: MissionBadgeProps) {
  const label = earned ? `Insignia ${code} obtenida` : `Insignia ${code} pendiente`

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        'relative flex size-9 items-center justify-center border-2 p-[2px] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]',
        earned
          ? 'bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[0_0_14px_rgba(0,255,136,0.45)]'
          : 'border-dashed border-white/25 bg-black/50 opacity-80',
        className,
      )}
      style={color ? { borderColor: color, boxShadow: earned ? `0 0 14px ${color}66` : undefined } : undefined}
    >
      <span
        className={cn(
          'flex size-full items-center justify-center [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]',
          earned ? 'bg-[#0d1f16]' : 'bg-black/70',
        )}
        style={color ? { color } : undefined}
      >
        {earned ? <Anchor className="size-3.5" aria-hidden="true" /> : <Lock className="size-3.5" aria-hidden="true" />}
      </span>
      <span className="sr-only">{label}. Código {code}.</span>
    </span>
  )
}
