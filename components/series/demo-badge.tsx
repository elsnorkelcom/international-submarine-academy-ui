import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DemoBadge({ code, label, className }: { code: string; label?: string | null; className?: string }) {
  return (
    <span
      title={label ?? code}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary',
        className,
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      <span>{label ?? code}</span>
    </span>
  )
}
