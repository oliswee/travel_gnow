'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Star, Clock, Tag, TrendingUp, Plus } from 'lucide-react'
import type { POI } from '@gonow/shared-types'
import { useRouteStore } from '@/lib/store/routeStore'
import { showToast } from '@/components/shared/Toast'

interface Props {
  poi: POI | null
  onClose: () => void
}

export default function POIInsightDrawer({ poi, onClose }: Props) {
  const { queue, addPoi } = useRouteStore()

  const handleAdd = () => {
    if (!poi) return
    const exists = queue.find((q) => q.id === poi.id)
    if (exists) {
      showToast('error', `"${poi.name}" 已在行程中`)
      return
    }
    addPoi(poi)
    showToast('success', `已添加 "${poi.name}"`)
    onClose()
  }

  return (
    <AnimatePresence>
      {poi && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-[150]"
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[160] max-w-md mx-auto"
          >
            <div className="glass-card-heavy p-5 pb-8 max-h-[70vh] overflow-y-auto rounded-b-none">
              {/* Handle */}
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-medium">
                      {poi.category}
                    </span>
                    {poi.indoor && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">室内</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{poi.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-hype-amber" />
                      {poi.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {poi.visitDuration}分钟
                    </span>
                    {poi.price !== undefined && poi.price > 0 && (
                      <span>¥{poi.price}/人</span>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{poi.address || '杭州市'}</span>
              </div>

              {/* Time Window */}
              {poi.timeWindow && (
                <div className="glass rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <TrendingUp size={12} />
                    <span>最佳游览时间</span>
                    <span className="text-gray-300">· {poi.timeWindow.sampleCount} 人推荐</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {poi.timeWindow.mu} 前后 · 置信度 {Math.round((poi.timeWindow.weight || 0) * 100)}%
                  </p>
                </div>
              )}

              {/* Tags */}
              {poi.ugcStats?.tags && poi.ugcStats.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-4">
                  <Tag size={12} className="text-gray-400" />
                  {poi.ugcStats.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action button */}
              <button
                onClick={handleAdd}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                加入行程
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
