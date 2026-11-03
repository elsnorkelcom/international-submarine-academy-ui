export type DemoEpisodeId = 'acero' | 'cobre'

export type DemoLevel = 0 | 1

export type DemoMaterialStatus = 'pending' | 'available'

export type DemoVideo = {
  src: string
  poster?: string
  type?: 'video/mp4' | 'video/webm'
}

export type DemoOption = {
  id: string
  text: string
}

export type DemoQuestionKind = 'identification' | 'function' | 'application'

export type DemoQuestion = {
  kind: DemoQuestionKind
  prompt: string
  options: DemoOption[]
  correctOptionId: string
  correctFeedback: string
  incorrectFeedback: string
}

export type DemoBadgeData = {
  code: string
  name: string | null
  description: string | null
}

export type DemoMaterials = {
  presentation: DemoMaterialStatus
  video: DemoMaterialStatus
  activity: DemoMaterialStatus
}

export type DemoEpisode = {
  id: DemoEpisodeId
  level: DemoLevel
  unlockAfter: DemoEpisodeId | null
  title: string | null
  summary: string | null
  setting: {
    /** Nombre ficticio pendiente de aprobación. Nunca debe ser un buque real. */
    vesselName: string | null
  }
  equipment: {
    name: string | null
    purpose: string | null
    principle: string | null
  }
  civilScenario: string | null
  video: DemoVideo | null
  question: DemoQuestion | null
  badge: DemoBadgeData
  materials: DemoMaterials
}

export type DemoEpisodeProgress = {
  videoCompleted: boolean
  answerCorrect: boolean
  badgeEarned: boolean
}

export type DemoProgress = Record<DemoEpisodeId, DemoEpisodeProgress>

export type DemoStep = 'selector' | 'video' | 'question' | 'badge'

export type DemoAnswerState = 'idle' | 'incorrect' | 'correct'
