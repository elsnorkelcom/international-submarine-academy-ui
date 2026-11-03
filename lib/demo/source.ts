import type { DemoEpisode, DemoEpisodeId, DemoProgress } from './types'

export const DEMO_EPISODE_ORDER: readonly DemoEpisodeId[] = ['acero', 'cobre']

export const DEMO_EPISODES: Record<DemoEpisodeId, DemoEpisode> = {
  acero: {
    id: 'acero',
    level: 0,
    unlockAfter: null,
    title: 'Acero',
    summary: null,
    setting: {
      vesselName: null,
    },
    equipment: {
      name: null,
      purpose: null,
      principle: null,
    },
    civilScenario: null,
    video: null,
    question: null,
    badge: {
      code: 'demo-acero',
      name: null,
      description: null,
    },
    materials: {
      presentation: 'pending',
      video: 'pending',
      activity: 'pending',
    },
  },
  cobre: {
    id: 'cobre',
    level: 1,
    unlockAfter: 'acero',
    title: 'Cobre',
    summary: null,
    setting: {
      vesselName: null,
    },
    equipment: {
      name: null,
      purpose: null,
      principle: null,
    },
    civilScenario: null,
    video: null,
    question: null,
    badge: {
      code: 'demo-cobre',
      name: null,
      description: null,
    },
    materials: {
      presentation: 'pending',
      video: 'pending',
      activity: 'pending',
    },
  },
}

export function getDemoEpisode(id: DemoEpisodeId) {
  return DEMO_EPISODES[id]
}

export function createInitialDemoProgress(): DemoProgress {
  return {
    acero: { videoCompleted: false, answerCorrect: false, badgeEarned: false },
    cobre: { videoCompleted: false, answerCorrect: false, badgeEarned: false },
  }
}

export function getDemoProgressCount(progress: DemoProgress) {
  return DEMO_EPISODE_ORDER.reduce(
    (count, episodeId) => (progress[episodeId].badgeEarned ? count + 1 : count),
    0,
  )
}
