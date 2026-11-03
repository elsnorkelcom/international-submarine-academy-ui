import { allMissions, type Mission } from './missions'

export type ProgressSummary = {
  total: number
  completed: number
  percent: number
  earnedBadges: Mission[]
}

/** Resumen derivado del estado demo estático de las misiones. */
export function getProgressSummary(): ProgressSummary {
  const total = allMissions.length
  const earnedBadges = allMissions.filter((mission) => mission.status === 'completed')
  const completed = earnedBadges.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { total, completed, percent, earnedBadges }
}
