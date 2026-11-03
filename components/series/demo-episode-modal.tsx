'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Play, X } from 'lucide-react'
import { getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { getDemoEpisode } from '@/lib/demo/source'
import type { DemoAnswerState, DemoEpisodeId, DemoProgress, DemoStep } from '@/lib/demo/types'
import { DemoBadge } from './demo-badge'

type DemoEpisodeModalProps = {
  isOpen: boolean
  activeEpisodeId: DemoEpisodeId
  step: DemoStep
  selectedOptionId: string | null
  answerState: DemoAnswerState
  progress: DemoProgress
  completedCount: number
  locale: Locale
  onClose: () => void
  onRestart: () => void
  onBackToSelector: () => void
  onSelectEpisode: (episodeId: DemoEpisodeId) => void
  onVideoCompleted: () => void
  onSkipVideo: () => void
  onSelectOption: (optionId: string) => void
  onSubmitAnswer: () => void
  onAward: () => void
}

export function DemoEpisodeModal({
  isOpen,
  activeEpisodeId,
  step,
  selectedOptionId,
  answerState,
  progress,
  completedCount,
  locale,
  onClose,
  onRestart,
  onBackToSelector,
  onSelectEpisode,
  onVideoCompleted,
  onSkipVideo,
  onSelectOption,
  onSubmitAnswer,
  onAward,
}: DemoEpisodeModalProps) {
  const messages = getMessages(locale).series.demo
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const firstOptionRef = useRef<HTMLInputElement>(null)
  const badgeHeadingRef = useRef<HTMLHeadingElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const episode = getDemoEpisode(activeEpisodeId)
  const episodeProgress = progress[activeEpisodeId]
  const canUnlockCobre = progress.acero.badgeEarned
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const question = episode.question

  useEffect(() => {
    if (!isOpen) return

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    if (step === 'question' && question && answerState !== 'correct') {
      firstOptionRef.current?.focus()
    }

    if (step === 'badge') {
      badgeHeadingRef.current?.focus()
    }
  }, [isOpen, step, question, answerState])

  const close = () => {
    onClose()
    window.requestAnimationFrame(() => {
      if (lastFocusedRef.current?.isConnected) lastFocusedRef.current.focus()
    })
  }

  const handleTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    if (!focusable || focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || !dialogRef.current?.contains(active)) {
        event.preventDefault()
        last.focus()
      }
    } else if (active === last || !dialogRef.current?.contains(active)) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!isOpen) return null

  const episodeLabel = `${episode.title ?? episode.id} · Nivel ${episode.level}`
  const selectorItems = [
    {
      id: 'acero' as const,
      label: messages.selector.acero,
      status: progress.acero.badgeEarned ? messages.selector.completed : messages.selector.available,
      disabled: false,
    },
    {
      id: 'cobre' as const,
      label: messages.selector.cobre,
      status: progress.cobre.badgeEarned
        ? messages.selector.completed
        : canUnlockCobre
          ? messages.selector.available
          : messages.selector.locked,
      disabled: !canUnlockCobre,
    },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-dialog-title"
        onKeyDown={handleTab}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-background p-5 shadow-2xl md:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.launcher.title}</p>
            <h2 id="demo-dialog-title" className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              {episodeLabel}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{messages.launcher.description}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={messages.episode.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.selector.progress.replace('{completed}', String(completedCount))}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-md border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {messages.episode.restart}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { label: messages.episode.videoLabel, value: episodeProgress.videoCompleted },
            { label: messages.episode.answerLabel, value: episodeProgress.answerCorrect },
            { label: messages.episode.badgeLabel, value: episodeProgress.badgeEarned },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-white/10 bg-card/30 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{item.label}</p>
              <p className={`mt-1 text-sm font-medium ${item.value ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.value ? messages.selector.completed : messages.selector.pending}
              </p>
            </div>
          ))}
        </div>

        {step === 'selector' && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.selector.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{messages.selector.intro}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {selectorItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => onSelectEpisode(item.id)}
                  className="rounded-md border border-white/10 bg-card/40 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.status}</p>
                    </div>
                    <span className="rounded-sm border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {item.id === 'acero' ? '0' : '1'}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
                    {item.disabled ? messages.selector.pending : item.id === 'cobre' ? messages.selector.locked : messages.selector.available}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'video' && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.episode.videoPending}</p>
            <div className="mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent">
              {episode.video ? (
                <video
                  src={episode.video.src}
                  poster={episode.video.poster}
                  controls
                  playsInline
                  preload="metadata"
                  onEnded={onVideoCompleted}
                  className="size-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Play className="mx-auto size-10 text-primary" aria-hidden="true" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{messages.episode.placeholder}</p>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {episode.video ? messages.episode.openVideo : messages.episode.videoPending}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {isDevelopment && (
                <button
                  type="button"
                  onClick={onSkipVideo}
                  className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {messages.episode.skipVideo}
                </button>
              )}
              <button
                type="button"
                onClick={onBackToSelector}
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {messages.episode.back}
              </button>
            </div>
          </div>
        )}

        {step === 'question' && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-metal">{messages.episode.activityPending}</p>
            {question ? (
              <form
                className="mt-3 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  onSubmitAnswer()
                }}
              >
                <fieldset>
                  <legend className="font-display text-lg font-semibold leading-snug text-foreground">{question.prompt}</legend>
                  <div className="mt-3 space-y-2" role="group" aria-label={messages.selector.title}>
                    {question.options.map((option, index) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                          selectedOptionId === option.id
                            ? 'border-primary/50 bg-primary/5 text-foreground'
                            : 'border-white/10 text-muted-foreground hover:border-white/20'
                        }`}
                      >
                        <input
                          ref={index === 0 ? firstOptionRef : undefined}
                          type="radio"
                          name="demo-answer"
                          value={option.id}
                          checked={selectedOptionId === option.id}
                          onChange={() => onSelectOption(option.id)}
                          className="mt-0.5 size-4 accent-[#00ff88]"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={!selectedOptionId}
                    className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-muted-foreground"
                  >
                    {messages.episode.submit}
                  </button>
                  <button
                    type="button"
                    onClick={onBackToSelector}
                    className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {messages.episode.back}
                  </button>
                </div>

                {answerState === 'incorrect' && (
                  <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
                    {question.incorrectFeedback}
                  </p>
                )}
                {answerState === 'correct' && (
                  <div className="flex flex-wrap items-center gap-3">
                    <p role="status" aria-live="polite" className="text-sm text-primary">
                      {question.correctFeedback}
                    </p>
                    <button
                      type="button"
                      onClick={onAward}
                      className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {messages.episode.getBadge}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{messages.episode.activityPending}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  La actividad todavía depende de contenido aprobado.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {isDevelopment && (
                    <button
                      type="button"
                      onClick={onSkipVideo}
                      className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {messages.episode.skipVideo}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onBackToSelector}
                    className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {messages.episode.back}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'badge' && (
          <div className="mt-5 rounded-md border border-primary/30 bg-primary/5 p-5">
            <DemoBadge code={episode.badge.code} label={episode.badge.name ?? messages.episode.badgeTitle} />
            <div role="status" aria-live="polite">
              <h3 ref={badgeHeadingRef} tabIndex={-1} className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {messages.episode.badgeTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{messages.episode.badgeNotice}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {messages.episode.close}
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {messages.episode.restart}
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-metal">
          {episodeProgress.badgeEarned ? messages.episode.badgeStatus : messages.episode.placeholder}
        </p>
      </div>
    </div>
  )
}
