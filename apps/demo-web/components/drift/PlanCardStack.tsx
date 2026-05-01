'use client'

import { motion } from 'framer-motion'
import { useDriftStore } from '@/lib/store/driftStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cardDefs: Record<string, { ring: string; badge: string; dot: string }> = {
  A: { ring: 'from-blue-400/40 via-brand-primary/20 to-cyan-400/40', badge: 'bg-blue-500', dot: 'bg-blue-500' },
  B: { ring: 'from-amber-400/40 via-amber-500/20 to-orange-400/40', badge: 'bg-amber-500', dot: 'bg-amber-500' },
  C: { ring: 'from-emerald-400/40 via-emerald-500/20 to-teal-400/40', badge: 'bg-emerald-500', dot: 'bg-emerald-500' },
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
      {/* Gradient ring wrapper */}
      <div className={`relative rounded-2xl p-[1.5px] bg-gradient-to-br ${def.ring}`}>
        <motion.div
          key={activePlanKey}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="glass-card rounded-[14px] p-5"
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
                <span key={id} className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-full text-gray-500 border border-gray-100">
                  {id}
                </span>
              ))}
              {plan.uniquePois.length > 5 && (
                <span className="text-[10px] text-gray-400">+{plan.uniquePois.length - 5}</span>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Nav controls */}
      <div className="flex items-center justify-between mt-3">
        <button onClick={() => goTo(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {keys.map((key, i) => (
            <button
              key={key}
              onClick={() => setActivePlan(key)}
              className={`transition-all rounded-full ${
                i === activeIdx ? `w-6 h-2 ${cardDefs[key].dot}` : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        <button onClick={() => goTo(1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
