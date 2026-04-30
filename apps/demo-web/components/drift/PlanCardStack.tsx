'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useDriftStore } from '@/lib/store/driftStore'

const cardColors: Record<string, { bg: string; border: string; badge: string }> = {
  A: {
    bg: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    badge: 'bg-blue-500',
  },
  B: {
    bg: 'from-amber-50 to-amber-100/50',
    border: 'border-amber-200',
    badge: 'bg-amber-500',
  },
  C: {
    bg: 'from-emerald-50 to-emerald-100/50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-500',
  },
}

export default function PlanCardStack() {
  const { plans, activePlanKey, setActivePlan } = useDriftStore()

  if (!plans) return null

  const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C']

  return (
    <div className="relative h-[320px] mb-4">
      <AnimatePresence>
        {keys.map((key, i) => {
          const plan = plans[key]
          const colors = cardColors[key]
          const isActive = key === activePlanKey
          const activeIdx = keys.indexOf(activePlanKey)

          return (
            <motion.div
              key={key}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: isActive ? 1 : 0.92,
                opacity: isActive ? 1 : 0.6,
                y: isActive ? 0 : 8 + Math.abs(i - activeIdx) * 4,
                zIndex: isActive ? 10 : 10 - Math.abs(i - activeIdx),
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => setActivePlan(key)}
              className={`absolute inset-0 bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`${colors.badge} text-white text-xs px-2 py-0.5 rounded-full`}
                >
                  Plan {key}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {plan.preferenceMatch
                    ? `${Math.round(plan.preferenceMatch * 100)}%`
                    : ''}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{plan.label}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{plan.description}</p>
              {plan.uniquePois && plan.uniquePois.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  特色: {plan.uniquePois.length} 个地点
                </p>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
