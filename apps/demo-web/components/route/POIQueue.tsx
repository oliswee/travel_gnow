'use client'

import { GripVertical, X } from 'lucide-react'
import type { POI } from '@gonow/shared-types'

export default function POIQueue({
  pois,
  onRemove,
}: {
  pois: POI[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
  if (pois.length === 0) return null

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-h-48 overflow-y-auto">
        <p className="text-xs text-gray-400 mb-2">已选 {pois.length} 个地点</p>
        {pois.map((poi, i) => (
          <div key={poi.id} className="flex items-center gap-2 py-1.5 group">
            <button className="cursor-grab text-gray-300 hover:text-gray-500">
              <GripVertical size={14} />
            </button>
            <span className="text-xs text-gray-400 w-4">{i + 1}</span>
            <span className="text-sm text-gray-700 flex-1 truncate">{poi.name}</span>
            <span className="text-xs text-gray-400">{poi.visitDuration}分</span>
            <button
              onClick={() => onRemove(poi.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
