import { create } from 'zustand'
import type { MockUserId, UserProfile, SessionAction } from '@gonow/shared-types'

interface UserState {
  activeUserId: MockUserId
  profiles: Record<MockUserId, UserProfile | null>
  sessionActions: SessionAction[]
  alpha: number
  alphaReason: string

  setActiveUser: (id: MockUserId) => void
  setProfile: (id: MockUserId, profile: UserProfile) => void
  addSessionAction: (action: SessionAction) => void
  setAlpha: (alpha: number, reason: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  activeUserId: 'foodie',
  profiles: { foodie: null, museum: null, family: null },
  sessionActions: [],
  alpha: 0.7,
  alphaReason: '多日深度游 → 偏长期',

  setActiveUser: (activeUserId) => set({ activeUserId }),
  setProfile: (id, profile) => set((s) => ({ profiles: { ...s.profiles, [id]: profile } })),
  addSessionAction: (action) =>
    set((s) => ({ sessionActions: [...s.sessionActions.slice(-49), action] })),
  setAlpha: (alpha, alphaReason) => set({ alpha, alphaReason }),
}))
