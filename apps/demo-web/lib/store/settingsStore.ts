import { create } from 'zustand'
import type { UserSettings } from '@gonow/shared-types'

interface SettingsState {
  settings: UserSettings
  updateBackgroundPrompt: (prompt: string) => void
  toggleMemory: (key: keyof UserSettings['memoryEnabled']) => void
  setPreferenceWeight: (name: string, weight: number) => void
  togglePrivacy: () => void
  reset: () => void
}

const defaultSettings: UserSettings = {
  backgroundPrompt: '我喜欢小众、人少、步行不要太多；不喜欢网红店。',
  memoryEnabled: { searchHistory: true, tripHistory: true, favorites: true },
  preferenceWeights: { 美食: 3, 博物馆: 3, 少步行: 3, 小众: 3, 预算敏感: 2 },
  privacyMode: false,
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  updateBackgroundPrompt: (backgroundPrompt) =>
    set((s) => ({ settings: { ...s.settings, backgroundPrompt } })),
  toggleMemory: (key) =>
    set((s) => ({
      settings: {
        ...s.settings,
        memoryEnabled: { ...s.settings.memoryEnabled, [key]: !s.settings.memoryEnabled[key] },
      },
    })),
  setPreferenceWeight: (name, weight) =>
    set((s) => ({
      settings: {
        ...s.settings,
        preferenceWeights: { ...s.settings.preferenceWeights, [name]: weight },
      },
    })),
  togglePrivacy: () => set((s) => ({ settings: { ...s.settings, privacyMode: !s.settings.privacyMode } })),
  reset: () => set({ settings: defaultSettings }),
}))
