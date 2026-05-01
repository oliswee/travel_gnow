'use client'

import { motion } from 'framer-motion'
import { useSettingsStore } from '@/lib/store/settingsStore'
import { showToast } from '@/components/shared/Toast'

const emoji: Record<string, string> = {
  '美食': '🍜',
  '博物馆': '🏛️',
  '少步行': '🚶',
  '小众': '💎',
}

export default function PreferenceSliders() {
  const { settings, setPreferenceWeight, saveSettings, loading } = useSettingsStore()
  const weights = settings.preferenceWeights

  const handleSave = async () => {
    await saveSettings()
    showToast('success', '偏好已保存')
  }

  return (
    <div className="glass-card p-5 space-y-5">
      {Object.entries(weights).map(([name, weight]) => (
        <div key={name}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-700 flex items-center gap-1.5">
              <span>{emoji[name] || ''}</span>
              {name}
            </span>
            <span className="text-gray-400 font-mono text-xs">{weight}/5</span>
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
                       [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary
                       [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2
                       [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
      ))}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={loading}
        className="btn-primary w-full text-sm disabled:opacity-50"
      >
        {loading ? '保存中...' : '保存偏好'}
      </motion.button>
    </div>
  )
}
