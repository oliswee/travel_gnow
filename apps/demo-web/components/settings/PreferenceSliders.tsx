'use client'

import { useSettingsStore } from '@/lib/store/settingsStore'

export default function PreferenceSliders() {
  const { settings, setPreferenceWeight, saveSettings, loading } = useSettingsStore()
  const weights = settings.preferenceWeights

  return (
    <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 space-y-4">
      {Object.entries(weights).map(([name, weight]) => (
        <div key={name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">{name}</span>
            <span className="text-gray-400 font-mono">{weight}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={weight}
            onChange={(e) => setPreferenceWeight(name, Number(e.target.value))}
            className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer
                       accent-brand-primary
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary
                       [&::-webkit-slider-thumb]:shadow-sm"
          />
        </div>
      ))}
      <button
        onClick={() => saveSettings()}
        disabled={loading}
        className="btn-primary w-full text-sm disabled:opacity-50"
      >
        {loading ? '保存中...' : '保存偏好'}
      </button>
    </div>
  )
}
