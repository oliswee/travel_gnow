'use client'

import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useRouteStore } from '@/lib/store/routeStore'
import { api } from '@/lib/api'

export default function GenerateButton() {
  const { queue, isGenerating, setGenerating, setGeneratedPlans, setActivePlanKey } = useRouteStore()

  const handleGenerate = async () => {
    if (queue.length < 2 || isGenerating) return
    setGenerating(true)
    try {
      const query = queue.map((p) => p.name).join('、')
      const data = await api.post<{ plans: any; comparison: any }>('/api/drift/plan-abc', {
        query: `杭州1天，去${query}`,
        user_id: 'foodie',
      })
      setGeneratedPlans(data.plans)
      setActivePlanKey('A')
    } catch (e: any) {
      // Silently fail, user can retry
    }
    setGenerating(false)
  }

  if (queue.length < 2) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleGenerate}
      disabled={isGenerating}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isGenerating ? (
        <><Loader2 size={16} className="animate-spin" />生成路线中...</>
      ) : (
        <><Sparkles size={16} />生成路线 ({queue.length}个地点)</>
      )}
    </motion.button>
  )
}
