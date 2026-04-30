'use client'

import { motion } from 'framer-motion'
import { useDriftStore } from '@/lib/store/driftStore'

const colors = ['#3B5BDB', '#F59F00', '#2FB344']

export default function PlanComparisonTable() {
  const { comparison } = useDriftStore()
  if (!comparison) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-6"
    >
      <h4 className="text-sm font-semibold mb-4 text-gray-700">方案对比</h4>
      {comparison.dimensions.map((dim: any, di: number) => {
        const max = Math.max(...dim.values)
        return (
          <div key={dim.name} className="mb-4 last:mb-0">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span className="font-medium">{dim.name}</span>
              <div className="flex gap-3">
                {dim.values.map((v: number, i: number) => (
                  <span
                    key={i}
                    className={`w-12 text-center text-[11px] ${
                      i === dim.best ? 'font-bold text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {v > 0 && v < 3 ? `${Math.round(v * 100)}%` : v > 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              {dim.values.map((v: number, i: number) => (
                <div key={i} className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${max > 0 ? (v / max) * 100 : 0}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * di + 0.05 * i, ease: 'easeOut' }}
                    className={`h-full rounded-full ${i === dim.best ? 'opacity-100' : 'opacity-35'}`}
                    style={{ backgroundColor: colors[i] }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-0.5">
              {['A', 'B', 'C'].map((label: string, i: number) => (
                <span key={i} className="flex-1 text-center text-[9px] text-gray-400">
                  {i === dim.best ? `★ ${label}` : label}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
