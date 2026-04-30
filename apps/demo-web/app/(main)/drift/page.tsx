'use client'

import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass } from 'lucide-react'
import DriftInputBar from '@/components/drift/DriftInputBar'
import { useDriftStore } from '@/lib/store/driftStore'

const PlanCardStack = dynamic(() => import('@/components/drift/PlanCardStack'), { ssr: false })
const PlanComparisonTable = dynamic(() => import('@/components/drift/PlanComparisonTable'), { ssr: false })

export default function DriftPage() {
  const { plans, isGenerating, error } = useDriftStore()

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-brand-primary/5 via-brand-primary/[0.02] to-transparent px-4 pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-[28px] font-bold text-brand-primary flex items-center gap-2">
            <Compass size={28} className="text-drift-coral" />
            现在就出发
          </h1>
          <p className="text-gray-500 mt-1 mb-4">说一句话，8 秒出草案</p>
        </motion.div>
      </div>

      <div className="px-4 flex-1">
        <DriftInputBar />

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 overflow-hidden"
            >
              <p className="text-sm text-risk-red">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generating skeleton */}
        {isGenerating && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative h-[320px] mb-4">
              {['A', 'B', 'C'].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 skeleton rounded-xl"
                  style={{
                    transform: `translateY(${i * 8}px) scale(${1 - i * 0.05})`,
                    opacity: 1 - i * 0.3,
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">正在为你规划路线...</p>
                  <p className="text-xs text-gray-300 mt-1">分析偏好 → 检索 POI → 求解最优路线</p>
                </div>
              </div>
            </div>
            <div className="skeleton h-32 rounded-xl" />
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {!isGenerating && plans && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PlanCardStack />
              <PlanComparisonTable />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!plans && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 flex items-center justify-center py-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Compass size={28} className="text-brand-primary/30" />
              </div>
              <p className="text-gray-400 text-sm">输入出行需求</p>
              <p className="text-xs text-gray-300 mt-1">AI 将为你生成 3 套差异化方案</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
