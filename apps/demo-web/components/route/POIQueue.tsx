'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, X, MapPin } from 'lucide-react'
import type { POI } from '@gonow/shared-types'

export default function POIQueue({
  pois,
  onRemove,
  onReorder,
}: {
  pois: POI[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
  return (
    <AnimatePresence>
      {pois.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-3 left-3 right-3 z-10"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-float border border-gray-100 p-3 max-h-56 overflow-y-auto">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 px-1">
              已选 {pois.length} 个地点
            </p>
            <AnimatePresence>
              {pois.map((poi, i) => (
                <motion.div
                  key={poi.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-2 py-2 group border-b border-gray-50 last:border-0"
                >
                  <button className="cursor-grab text-gray-300 hover:text-gray-500">
                    <GripVertical size={14} />
                  </button>
                  <span className="text-[10px] font-mono text-gray-400 w-4">{i + 1}</span>
                  <MapPin size={12} className="text-brand-primary/50 shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{poi.name}</span>
                  <span className="text-[10px] text-gray-400">{poi.visitDuration}分</span>
                  <button
                    onClick={() => onRemove(poi.id)}
                    className="text-gray-300 hover:text-risk-red opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
