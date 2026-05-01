'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, MapPin, Star, Clock, ArrowRight } from 'lucide-react'
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
  const categories = ['全部', '景点', '博物馆', '美食', '购物', '茶馆']
  const [activeCategory, setActiveCategory] = useState('全部')

  // Filter results by category
  const filteredResults = activeCategory === '全部'
    ? results
    : results.filter((r) => r.category === activeCategory || r.category?.includes(activeCategory))

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
      {/* Category filter chips */}
      <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
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
          {filteredResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              className="absolute bottom-full left-0 right-0 mb-1 bg-white/95 backdrop-blur-xl rounded-2xl shadow-float border border-gray-100 max-h-64 overflow-y-auto"
            >
              {filteredResults.map((poi) => (
                <motion.button
                  key={poi.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onSelect?.(poi); setResults([]); setQuery(poi.name) }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50/80 flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10 transition-colors">
                    <MapPin size={14} className="text-brand-primary/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 font-medium truncate">{poi.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">{poi.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Star size={10} className="text-hype-amber/60" />
                        {poi.rating}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock size={10} />
                        {poi.visit_duration}分
                      </span>
                      {poi.price > 0 && (
                        <span className="text-[10px] text-gray-400">¥{poi.price}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-primary/50 shrink-0 transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
