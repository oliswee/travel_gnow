'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'

interface ToastMessage {
  id: string
  type: 'success' | 'error'
  text: string
}

let addToastFn: ((t: Omit<ToastMessage, 'id'>) => void) | null = null

export function showToast(type: 'success' | 'error', text: string) {
  addToastFn?.({ type, text })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((m) => m.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((m) => m.id !== id))

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-float"
          >
            {t.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={16} className="text-red-400 shrink-0" />
            )}
            <span className="whitespace-nowrap">{t.text}</span>
            <button onClick={() => dismiss(t.id)} className="ml-1 text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
