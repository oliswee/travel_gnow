import { create } from 'zustand'
import type { UserSettings } from '@gonow/shared-types'
import { api } from '@/lib/api'

interface SettingsState {
  settings: UserSettings
  loading: boolean
  error: string | null
  updateBackgroundPrompt: (prompt: string) => void
  toggleMemory: (key: keyof UserSettings['memoryEnabled']) => void
  setPreferenceWeight: (name: string, weight: number) => void
  togglePrivacy: () => void
  fetchSettings: (userId?: string) => Promise<void>
  saveSettings: (userId?: string) => Promise<void>
  reset: () => void
}

const defaultSettings: UserSettings = {
  backgroundPrompt: '我喜欢小众、人少、步行不要太多；不喜欢网红店。',
  memoryEnabled: { searchHistory: true, tripHistory: true, favorites: true },
  preferenceWeights: { 美食: 3, 博物馆: 3, 少步行: 3, 小众: 3 },
  privacyMode: false,
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loading: false,
  error: null,

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

  togglePrivacy: () =>
    set((s) => ({ settings: { ...s.settings, privacyMode: !s.settings.privacyMode } })),

  fetchSettings: async (userId = 'foodie') => {
    set({ loading: true, error: null })
    try {
      const data = await api.get<any>(`/api/me/settings?user_id=${userId}`)
      set({
        settings: {
          backgroundPrompt: data.background_prompt || '',
          memoryEnabled: data.memory_enabled || defaultSettings.memoryEnabled,
          preferenceWeights: data.preference_weights || defaultSettings.preferenceWeights,
          privacyMode: data.privacy_mode || false,
        },
        loading: false,
      })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  saveSettings: async (userId = 'foodie') => {
    const { settings } = get()
    set({ loading: true, error: null })
    try {
      await api.put('/api/me/settings', {
        user_id: userId,
        background_prompt: settings.backgroundPrompt,
        memory_enabled: settings.memoryEnabled,
        preference_weights: settings.preferenceWeights,
        privacy_mode: settings.privacyMode,
      })
      set({ loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  reset: () => set({ settings: defaultSettings }),
}))
