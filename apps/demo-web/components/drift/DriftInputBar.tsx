'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useDriftStore } from '@/lib/store/driftStore'
import { api } from '@/lib/api'

export default function DriftInputBar() {
  const { setQuery, setPlans, setComparison, setGenerating, isGenerating, setError } = useDriftStore()
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return
    setQuery(input)
    setGenerating(true)
    setError(null)
    try {
      const data = await api.post<{ plans: any; comparison: any }>(
        '/api/drift/plan-abc',
        { query: input, user_id: 'foodie' },
      )
      setPlans(data.plans)
      setComparison(data.comparison)
    } catch (e: any) {
      setError(e.message || '生成失败')
    }
    setGenerating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`glass-card p-4 mb-4 transition-shadow duration-300 ${focused ? 'shadow-float' : ''}`}
    >
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="杭州 2 天，想吃好但别太累"
          className="w-full bg-gray-50/80 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isGenerating || !input.trim()}
        className="btn-primary w-full mt-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            生成 3 套方案
          </>
        )}
      </motion.button>
    </motion.div>
  )
}
