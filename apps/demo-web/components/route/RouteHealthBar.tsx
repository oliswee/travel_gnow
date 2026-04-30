'use client'

import type { RouteValidation } from '@gonow/shared-types'

const checks = [
  { key: 'openHoursPass' as const, label: '营业时间' },
  { key: 'reachablePass' as const, label: '可达性' },
  { key: 'noOverlapPass' as const, label: '时间不冲突' },
  { key: 'mealCoveragePass' as const, label: '用餐覆盖' },
  { key: 'pacePass' as const, label: '节奏合理' },
]

export default function RouteHealthBar({ validation }: { validation?: RouteValidation | null }) {
  if (!validation) return null

  const failed = checks.filter((c) => !validation[c.key])

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">
          {failed.length === 0 ? '✅ 路线校验通过' : `⚠️ ${failed.length} 项需注意`}
        </span>
        <div className="flex gap-1 ml-auto">
          {checks.map((c) => (
            <span
              key={c.key}
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                validation[c.key] ? 'bg-green-50 text-local-green' : 'bg-red-50 text-risk-red'
              }`}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
