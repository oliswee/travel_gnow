'use client'

import { useDriftStore } from '@/lib/store/driftStore'

export default function PlanComparisonTable() {
  const { comparison } = useDriftStore()
  if (!comparison) return null

  const bestColors = ['text-blue-600', 'text-amber-600', 'text-emerald-600']
  const barColors = ['#3B5BDB', '#F59F00', '#2FB344']

  return (
    <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4">
      <h4 className="text-sm font-semibold mb-3 text-gray-700">方案对比</h4>
      {comparison.dimensions.map((dim) => {
        const max = Math.max(...dim.values)
        return (
          <div key={dim.name} className="mb-3 last:mb-0">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{dim.name}</span>
              <div className="flex gap-3">
                {dim.values.map((v, i) => (
                  <span
                    key={i}
                    className={`w-12 text-center ${
                      i === dim.best ? `font-semibold ${bestColors[i]}` : ''
                    }`}
                  >
                    {v > 0 && v < 3
                      ? `${Math.round(v * 100)}%`
                      : v > 1000
                        ? `${(v / 1000).toFixed(1)}k`
                        : `${v}`}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 h-1.5">
              {dim.values.map((v, i) => {
                const pct = max > 0 ? (v / max) * 100 : 0
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full ${i === dim.best ? 'opacity-100' : 'opacity-30'}`}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColors[i],
                    }}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
