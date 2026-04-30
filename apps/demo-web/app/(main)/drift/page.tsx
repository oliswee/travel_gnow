'use client'

import dynamic from 'next/dynamic'
import DriftInputBar from '@/components/drift/DriftInputBar'
import { useDriftStore } from '@/lib/store/driftStore'

const PlanCardStack = dynamic(() => import('@/components/drift/PlanCardStack'), { ssr: false })
const PlanComparisonTable = dynamic(() => import('@/components/drift/PlanComparisonTable'), { ssr: false })

export default function DriftPage() {
  const { plans, isGenerating, error } = useDriftStore()

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-[28px] font-bold text-brand-primary mt-4">现在就出发</h1>
      <p className="text-gray-500 mb-6">说一句话，8 秒出草案</p>

      <DriftInputBar />

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-risk-red">{error}</p>
        </div>
      )}

      {isGenerating && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-400">正在规划路线...</p>
          </div>
        </div>
      )}

      {!isGenerating && <PlanCardStack />}
      {!isGenerating && <PlanComparisonTable />}

      {!plans && !isGenerating && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-300 text-sm">输入需求，生成 3 套方案</p>
        </div>
      )}
    </div>
  )
}
