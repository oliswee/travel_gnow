import { create } from 'zustand'
import type { PlanSet } from '@gonow/shared-types'

interface DriftState {
  query: string
  plans: PlanSet | null
  activePlanKey: 'A' | 'B' | 'C'
  isGenerating: boolean
  error: string | null

  setQuery: (query: string) => void
  setPlans: (plans: PlanSet) => void
  setActivePlan: (key: 'A' | 'B' | 'C') => void
  setGenerating: (generating: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useDriftStore = create<DriftState>((set) => ({
  query: '',
  plans: null,
  activePlanKey: 'A',
  isGenerating: false,
  error: null,

  setQuery: (query) => set({ query }),
  setPlans: (plans) => set({ plans }),
  setActivePlan: (activePlanKey) => set({ activePlanKey }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ query: '', plans: null, activePlanKey: 'A', isGenerating: false, error: null }),
}))
