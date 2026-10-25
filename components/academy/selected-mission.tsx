'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { featuredMission, type Mission } from '@/lib/missions'

type SelectedMissionContextValue = {
  mission: Mission
  selectMission: (mission: Mission) => void
}

const SelectedMissionContext = createContext<SelectedMissionContextValue | null>(null)

export function SelectedMissionProvider({ children }: { children: ReactNode }) {
  const [mission, setMission] = useState<Mission>(featuredMission)

  const selectMission = useCallback((next: Mission) => {
    setMission(next)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [])

  const value = useMemo(() => ({ mission, selectMission }), [mission, selectMission])

  return <SelectedMissionContext.Provider value={value}>{children}</SelectedMissionContext.Provider>
}

export function useSelectedMission() {
  const context = useContext(SelectedMissionContext)
  if (!context) throw new Error('useSelectedMission must be used within SelectedMissionProvider')
  return context
}
