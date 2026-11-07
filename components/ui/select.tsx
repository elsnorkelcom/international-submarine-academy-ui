import * as React from 'react'

import { cn } from '@/lib/utils'

/** Native select with the same visual language as the rest of the UI kit. */
function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'flex h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Select }
