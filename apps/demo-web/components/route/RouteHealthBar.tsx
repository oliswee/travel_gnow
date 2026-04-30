'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import type { RouteValidation } from '@gonow/shared-types'

const checks: { key: keyof RouteValidation; label: string }[] = [
  { key: 'openHoursPass', label: '营业时间' },
  { key: 'reachablePass', label: '可达性' },
  { key: 'noOverlapPass', label: '时间不冲突' },
  { key: 'mealCoveragePass', label: '用餐覆盖' },
  { key: 'pacePass', label: '节奏合理' },
]

export default function RouteHealthBar({ validation }: { validation?: RouteValidation | null }) {
  if (!validation) return null

  const failed = checks.filter((c) => !validation[c.key])

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-card border border-gray-100 px-4 py-2.5"
    >
      <div className="flex items-center gap-2">
        {failed.length === 0 ? (
          <CheckCircle2 size={14} className="text-local-green shrink-0" />
        ) : (
          <AlertCircle size={14} className="text-hype-amber shrink-0" />
        )}
        <span className="text-xs font-medium text-gray-700">
          {failed.length === 0 ? '路线校验通过' : `${failed.length} 项建议优化`}
        </span>
        <div className="flex gap-1.5 ml-auto">
          {checks.map((c) => (
            <motion.span
              key={c.key}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05 * checks.indexOf(c) }}
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                validation[c.key]
                  ? 'bg-green-50 text-local-green'
                  : 'bg-amber-50 text-hype-amber'
              }`}
            >
              {c.label}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
