'use client'

import type { Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n'
import { useDemoEpisode } from './demo-episode-context'

export function DemoLauncher({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.demo
  const { completedCount, openDemo, restartDemo } = useDemoEpisode()

  return (
    <section className="mx-auto mt-8 max-w-[1600px] px-4 md:px-10" aria-labelledby="demo-launcher-title">
      <div className="flex flex-col gap-4 rounded-md border border-white/10 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="demo-launcher-title" className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">
            {messages.launcher.title}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{messages.launcher.description}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-primary">
            {messages.launcher.progress.replace('{completed}', String(completedCount))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openDemo()}
            className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {messages.launcher.open}
          </button>
          <button
            type="button"
            onClick={restartDemo}
            className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {messages.launcher.reset}
          </button>
        </div>
      </div>
    </section>
  )
}
