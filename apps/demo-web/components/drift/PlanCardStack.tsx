'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useDriftStore } from '@/lib/store/driftStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cardDefs: Record<string, { gradient: string; border: string; badge: string; dot: string }> = {
  A: { gradient: 'from-blue-500/10 to-cyan-500/5', border: 'border-blue-200/60', badge: 'bg-blue-500', dot: 'bg-blue-500' },
  B: { gradient: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-200/60', badge: 'bg-amber-500', dot: 'bg-amber-500' },
  C: { gradient: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-200/60', badge: 'bg-emerald-500', dot: 'bg-emerald-500' },
}

export default function PlanCardStack() {
  const { plans, activePlanKey, setActivePlan } = useDriftStore()
  if (!plans) return null

  const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C']
  const activeIdx = keys.indexOf(activePlanKey)
  const plan = plans[activePlanKey]
  const def = cardDefs[activePlanKey]

  const goTo = (dir: -1 | 1) => {
    const next = keys[(activeIdx + dir + 3) % 3]
    setActivePlan(next)
  }

  return (
    <div className="mb-4">
      {/* Main card */}
      <motion.div
        key={activePlanKey}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className={`bg-gradient-to-br ${def.gradient} border ${def.border} rounded-2xl p-5 shadow-card`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`${def.badge} text-white text-xs px-2.5 py-1 rounded-full font-medium`}>
            Plan {activePlanKey}
          </span>
          <span className="text-lg font-bold text-gray-800">
            {plan.preferenceMatch ? `${Math.round(plan.preferenceMatch * 100)}%` : ''}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{plan.label}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{plan.description}</p>
        {plan.uniquePois && plan.uniquePois.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {plan.uniquePois.slice(0, 5).map((id: string) => (
              <span key={id} className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full text-gray-500">
                {id}
              </span>
            ))}
            {plan.uniquePois.length > 5 && (
              <span className="text-[10px] text-gray-400">+{plan.uniquePois.length - 5}</span>
            )}
          </div>
        )}
      </motion.div>

      {/* Nav controls */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => goTo(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pagination dots */}
        <div className="flex gap-2">
          {keys.map((key, i) => (
            <button
              key={key}
              onClick={() => setActivePlan(key)}
              className={`transition-all rounded-full ${
                i === activeIdx
                  ? `w-6 h-2 ${cardDefs[key].dot}`
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
