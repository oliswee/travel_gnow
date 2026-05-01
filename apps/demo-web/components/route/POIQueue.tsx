'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, X, MapPin } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { POI } from '@gonow/shared-types'

function SortableItem({ poi, index, onRemove, onClick }: {
  poi: POI; index: number; onRemove: (id: string) => void; onClick: (poi: POI) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: poi.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      className="flex items-center gap-2 py-2 group border-b border-gray-50 last:border-0 cursor-pointer"
      onClick={() => onClick(poi)}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-500 touch-none">
        <GripVertical size={14} />
      </button>
      <span className="text-[10px] font-mono text-gray-400 w-4">{index + 1}</span>
      <MapPin size={12} className="text-brand-primary/50 shrink-0" />
      <span className="text-sm text-gray-700 flex-1 truncate">{poi.name}</span>
      <span className="text-[10px] text-gray-400">{poi.visitDuration}分</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(poi.id) }}
        className="text-gray-300 hover:text-risk-red opacity-0 group-hover:opacity-100 transition-all"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function POIQueue({
  pois, onRemove, onReorder, onPoiClick,
}: {
  pois: POI[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  onPoiClick?: (poi: POI) => void
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = pois.findIndex((p) => p.id === active.id)
      const newIndex = pois.findIndex((p) => p.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  return (
    <AnimatePresence>
      {pois.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-3 left-3 right-3 z-10"
        >
          <div className="glass-card-heavy p-3 max-h-56 overflow-y-auto">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 px-1">
              已选 {pois.length} 个地点
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={pois.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                  {pois.map((poi, i) => (
                    <SortableItem
                      key={poi.id}
                      poi={poi}
                      index={i}
                      onRemove={onRemove}
                      onClick={(p) => onPoiClick?.(p)}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
