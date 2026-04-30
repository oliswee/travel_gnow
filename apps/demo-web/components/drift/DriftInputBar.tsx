'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useDriftStore } from '@/lib/store/driftStore'
import { api } from '@/lib/api'

export default function DriftInputBar() {
  const { setQuery, setPlans, setComparison, setGenerating, isGenerating, setError } =
    useDriftStore()
  const [input, setInput] = useState('')

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return
    setQuery(input)
    setGenerating(true)
    setError(null)
    try {
      const data = await api.post<{
        plans: any
        comparison: any
      }>('/api/drift/plan-abc', { query: input, user_id: 'foodie' })
      setPlans(data.plans)
      setComparison(data.comparison)
    } catch (e: any) {
      setError(e.message || '生成失败')
    }
    setGenerating(false)
  }

  return (
    <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        placeholder="杭州 2 天，想吃好但别太累"
        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none"
      />
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !input.trim()}
        className="btn-primary w-full mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {isGenerating ? '生成中...' : '生成 3 套方案'}
      </button>
    </div>
  )
}
