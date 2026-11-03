import type { DemoEpisode, DemoEpisodeId, DemoProgress } from './types'

export const DEMO_EPISODE_ORDER: readonly DemoEpisodeId[] = ['acero', 'cobre']

export const DEMO_EPISODES: Record<DemoEpisodeId, DemoEpisode> = {
  acero: {
    id: 'acero',
    level: 0,
    unlockAfter: null,
    title: 'Acero 04 · Comando del Submarino',
    summary: 'Objetivo: reconocimiento · Personaje: Pez Luna',
    setting: {
      vesselName: 'U-995',
    },
    equipment: {
      name: 'Periscopio',
      purpose: 'Reconocimiento',
      principle: null,
    },
    civilScenario: null,
    video: null,
    question: null,
    badge: {
      code: 'demo-acero',
      name: 'Expedición Submarina',
      description: 'Credencial simulada',
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
    summary: 'Periscopio y observación astronómica · Aplicación TIMSS Knowing: pendiente',
    setting: {
      vesselName: null,
    },
    equipment: {
      name: 'Periscopio',
      purpose: 'Observación astronómica',
      principle: null,
    },
    civilScenario: null,
    video: null,
    question: null,
    badge: {
      code: 'demo-cobre',
      name: 'Coin Cobre',
      description: 'Rutas de cierre pendientes',
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
