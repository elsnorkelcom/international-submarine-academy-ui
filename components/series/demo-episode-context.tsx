'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { createInitialDemoProgress, getDemoEpisode, getDemoProgressCount } from '@/lib/demo/source'
import type { DemoAnswerState, DemoEpisodeId, DemoProgress, DemoStep } from '@/lib/demo/types'
import { DemoEpisodeModal } from './demo-episode-modal'

type DemoEpisodeState = {
  isOpen: boolean
  activeEpisodeId: DemoEpisodeId
  step: DemoStep
  selectedOptionId: string | null
  answerState: DemoAnswerState
  progress: DemoProgress
  completedCount: number
  badgeEarned: boolean
  openDemo: (target?: DemoEpisodeId | { id?: string } | null) => void
  closeDemo: () => void
  restartDemo: () => void
  selectEpisode: (episodeId: DemoEpisodeId) => void
  backToSelector: () => void
  markVideoCompleted: () => void
  skipVideo: () => void
  selectOption: (optionId: string) => void
  submitAnswer: () => void
  awardBadge: () => void
}

const DemoEpisodeContext = createContext<DemoEpisodeState | null>(null)

const INITIAL_EPISODE: DemoEpisodeId = 'acero'

function resolveEpisodeId(target?: DemoEpisodeId | { id?: string } | null): DemoEpisodeId {
  if (typeof target === 'string' && (target === 'acero' || target === 'cobre')) return target
  if (target && typeof target === 'object' && (target.id === 'acero' || target.id === 'cobre')) return target.id
  return INITIAL_EPISODE
}

export function DemoEpisodeProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeEpisodeId, setActiveEpisodeId] = useState<DemoEpisodeId>(INITIAL_EPISODE)
  const [step, setStep] = useState<DemoStep>('selector')
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<DemoAnswerState>('idle')
  const [progress, setProgress] = useState<DemoProgress>(createInitialDemoProgress)

  const openDemo = useCallback((target?: DemoEpisodeId | { id?: string } | null) => {
    setActiveEpisodeId(resolveEpisodeId(target))
    setIsOpen(true)
    setStep('selector')
  }, [])

  const closeDemo = useCallback(() => setIsOpen(false), [])

  const restartDemo = useCallback(() => {
    setActiveEpisodeId(INITIAL_EPISODE)
    setStep('selector')
    setSelectedOptionId(null)
    setAnswerState('idle')
    setProgress(createInitialDemoProgress())
  }, [])

  const selectEpisode = useCallback((episodeId: DemoEpisodeId) => {
    if (episodeId === 'cobre' && !progress.acero.badgeEarned) return
    setActiveEpisodeId(episodeId)
    setStep('video')
    setSelectedOptionId(null)
    setAnswerState('idle')
  }, [progress.acero.badgeEarned])

  const backToSelector = useCallback(() => {
    setStep('selector')
    setSelectedOptionId(null)
    setAnswerState('idle')
  }, [])

  const markVideoCompleted = useCallback(() => {
    setProgress((current) => ({
      ...current,
      [activeEpisodeId]: {
        ...current[activeEpisodeId],
        videoCompleted: true,
      },
    }))
    setStep('question')
  }, [activeEpisodeId])

  const skipVideo = useCallback(() => {
    setStep('question')
  }, [])

  const selectOption = useCallback((optionId: string) => {
    setSelectedOptionId(optionId)
    setAnswerState('idle')
  }, [])

  const submitAnswer = useCallback(() => {
    const episode = getDemoEpisode(activeEpisodeId)
    const correctOptionId = episode.question?.correctOptionId
    if (!selectedOptionId || !correctOptionId) return

    if (selectedOptionId === correctOptionId) {
      setAnswerState('correct')
      setProgress((current) => ({
        ...current,
        [activeEpisodeId]: {
          ...current[activeEpisodeId],
          answerCorrect: true,
        },
      }))
      return
    }

    setAnswerState('incorrect')
  }, [activeEpisodeId, selectedOptionId])

  const awardBadge = useCallback(() => {
    const episodeProgress = progress[activeEpisodeId]
    if (!episodeProgress.answerCorrect || episodeProgress.badgeEarned) return

    setProgress((current) => ({
      ...current,
      [activeEpisodeId]: {
        ...current[activeEpisodeId],
        badgeEarned: true,
      },
    }))
    setStep('badge')
  }, [activeEpisodeId, progress])

  const value = useMemo(
    () => ({
      isOpen,
      activeEpisodeId,
      step,
      selectedOptionId,
      answerState,
      progress,
      completedCount: getDemoProgressCount(progress),
      badgeEarned: Object.values(progress).some((item) => item.badgeEarned),
      openDemo,
      closeDemo,
      restartDemo,
      selectEpisode,
      backToSelector,
      markVideoCompleted,
      skipVideo,
      selectOption,
      submitAnswer,
      awardBadge,
    }),
    [
      isOpen,
      activeEpisodeId,
      step,
      selectedOptionId,
      answerState,
      progress,
      openDemo,
      closeDemo,
      restartDemo,
      selectEpisode,
      backToSelector,
      markVideoCompleted,
      skipVideo,
      selectOption,
      submitAnswer,
      awardBadge,
    ],
  )

  return (
    <DemoEpisodeContext.Provider value={value}>
      {children}
      <DemoEpisodeModal
        isOpen={isOpen}
        activeEpisodeId={activeEpisodeId}
        step={step}
        selectedOptionId={selectedOptionId}
        answerState={answerState}
        progress={progress}
        completedCount={getDemoProgressCount(progress)}
        locale={locale}
        onClose={closeDemo}
        onRestart={restartDemo}
        onBackToSelector={backToSelector}
        onSelectEpisode={selectEpisode}
        onVideoCompleted={markVideoCompleted}
        onSkipVideo={skipVideo}
        onSelectOption={selectOption}
        onSubmitAnswer={submitAnswer}
        onAward={awardBadge}
      />
    </DemoEpisodeContext.Provider>
  )
}

export function useDemoEpisode() {
  const context = useContext(DemoEpisodeContext)
  if (!context) throw new Error('useDemoEpisode must be used inside DemoEpisodeProvider')
  return context
}
