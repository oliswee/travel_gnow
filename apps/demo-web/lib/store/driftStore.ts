import { create } from 'zustand'
import type { PlanSet } from '@gonow/shared-types'

export interface PlanComparisonMatrix {
  dimensions: Array<{
    name: string
    values: [number, number, number]
    best: 0 | 1 | 2
  }>
}

interface DriftState {
  query: string
  plans: PlanSet | null
  activePlanKey: 'A' | 'B' | 'C'
  comparison: PlanComparisonMatrix | null
  isGenerating: boolean
  error: string | null

  setQuery: (query: string) => void
  setPlans: (plans: PlanSet) => void
  setActivePlan: (key: 'A' | 'B' | 'C') => void
  setComparison: (matrix: PlanComparisonMatrix) => void
  setGenerating: (generating: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useDriftStore = create<DriftState>((set) => ({
  query: '',
  plans: null,
  activePlanKey: 'A',
  comparison: null,
  isGenerating: false,
  error: null,

  setQuery: (query) => set({ query }),
  setPlans: (plans) => set({ plans }),
  setActivePlan: (activePlanKey) => set({ activePlanKey }),
  setComparison: (comparison) => set({ comparison }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ query: '', plans: null, activePlanKey: 'A', comparison: null, isGenerating: false, error: null }),
}))
