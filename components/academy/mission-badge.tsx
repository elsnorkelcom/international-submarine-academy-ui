import { Anchor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MissionBadge({ code, className }: { code: string; className?: string }) {
  return (
    <span
      title={`Badge ${code} obtenido`}
      className={cn(
        'relative flex size-9 items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 p-[2px] shadow-[0_0_14px_rgba(0,255,136,0.45)] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]',
        className,
      )}
    >
      <span className="flex size-full items-center justify-center bg-[#0d1f16] text-primary [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
        <Anchor className="size-3.5" aria-hidden="true" />
      </span>
      <span className="sr-only">Badge obtenido</span>
    </span>
  )
}
