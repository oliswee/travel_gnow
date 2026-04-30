import { create } from 'zustand'
import type { POI, CompleteRouteContract, Plan } from '@gonow/shared-types'

interface RouteState {
  pois: POI[]
  queue: POI[]
  activeTripId: string | null
  route: CompleteRouteContract | null
  activePlan: Plan | null
  weatherEvent: 'rain' | 'extreme' | null
  isLoading: boolean
  error: string | null

  addPoi: (poi: POI) => void
  removePoi: (poiId: string) => void
  reorderQueue: (from: number, to: number) => void
  setRoute: (route: CompleteRouteContract) => void
  setWeather: (event: 'rain' | 'extreme' | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useRouteStore = create<RouteState>((set) => ({
  pois: [],
  queue: [],
  activeTripId: null,
  route: null,
  activePlan: null,
  weatherEvent: null,
  isLoading: false,
  error: null,

  addPoi: (poi) => set((s) => ({ queue: [...s.queue, poi] })),
  removePoi: (poiId) => set((s) => ({ queue: s.queue.filter((p) => p.id !== poiId) })),
  reorderQueue: (from, to) =>
    set((s) => {
      const q = [...s.queue]
      const [moved] = q.splice(from, 1)
      q.splice(to, 0, moved)
      return { queue: q }
    }),
  setRoute: (route) => set({ route }),
  setWeather: (weatherEvent) => set({ weatherEvent }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      queue: [],
      activeTripId: null,
      route: null,
      activePlan: null,
      weatherEvent: null,
      isLoading: false,
      error: null,
    }),
}))
