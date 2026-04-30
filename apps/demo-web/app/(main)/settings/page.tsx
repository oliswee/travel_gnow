'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSettingsStore } from '@/lib/store/settingsStore'
import ToastContainer from '@/components/shared/Toast'

const PreferenceSliders = dynamic(() => import('@/components/settings/PreferenceSliders'), { ssr: false })

export default function SettingsPage() {
  const { settings, updateBackgroundPrompt, toggleMemory, togglePrivacy, fetchSettings, saveSettings, loading } =
    useSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <div className="flex flex-col p-4 h-full overflow-y-auto">
      <h1 className="text-title font-bold mt-4 mb-6">设置 / Memory Control</h1>

      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">我的出行背景</h2>
        <textarea
          className="w-full bg-white rounded-card shadow-sm border border-gray-100 p-4 text-sm text-gray-700
                     resize-none h-20 outline-none focus:ring-2 focus:ring-brand-primary/20"
          value={settings.backgroundPrompt}
          onChange={(e) => updateBackgroundPrompt(e.target.value)}
          onBlur={() => saveSettings()}
          placeholder="我喜欢小众、人少的地方..."
        />
      </section>

      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">Memory 开关</h2>
        <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 space-y-3">
          {(['searchHistory', 'tripHistory', 'favorites'] as const).map((key) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {{ searchHistory: '搜索历史', tripHistory: '出行记录', favorites: '收藏' }[key]}
              </span>
              <button
                onClick={() => toggleMemory(key)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.memoryEnabled[key] ? 'bg-brand-primary' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5 ${
                    settings.memoryEnabled[key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">偏好权重</h2>
        <PreferenceSliders />
      </section>

      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">隐私</h2>
        <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">隐私模式</span>
            <button
              onClick={togglePrivacy}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.privacyMode ? 'bg-brand-primary' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5 ${
                  settings.privacyMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-400 mt-1">开启后，搜索历史将不会保存在本地</p>
        </div>
      </section>

      <ToastContainer />
    </div>
  )
}
