'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, MapPin } from 'lucide-react'
import { api } from '@/lib/api'

interface SearchResult {
  id: string
  name: string
  category: string
  address: string
  lat: number
  lng: number
  visit_duration: number
  price: number
  rating: number
}

export default function BottomSearchBar({ onSelect }: { onSelect?: (poi: SearchResult) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q)
    if (q.length < 1) { setResults([]); return }
    setLoading(true)
    try {
      const data = await api.get<SearchResult[]>(`/api/poi/search?q=${encodeURIComponent(q)}&city=杭州`)
      setResults(data)
    } catch { setResults([]) }
    setLoading(false)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-xl px-4 py-3 border-t border-gray-100">
      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100/80 rounded-xl px-4 py-3 ring-brand-primary/20 focus-within:ring-2 transition-all">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-gray-400 shrink-0" />
          ) : (
            <Search size={16} className="text-gray-400 shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="想去哪里？输入景点 / 店名"
            className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              className="absolute bottom-full left-0 right-0 mb-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-float border border-gray-100 max-h-52 overflow-y-auto"
            >
              {results.map((poi) => (
                <motion.button
                  key={poi.id}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  onClick={() => { onSelect?.(poi); setResults([]); setQuery(poi.name) }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50/80 text-sm flex items-center gap-2.5"
                >
                  <MapPin size={12} className="text-brand-primary/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-700 truncate block">{poi.name}</span>
                    <span className="text-[10px] text-gray-400">{poi.category}</span>
                  </div>
                  <span className="text-xs text-gray-300">{poi.rating}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
