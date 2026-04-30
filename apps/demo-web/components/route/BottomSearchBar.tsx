'use client'

import { useState, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
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
    <div className="bg-white px-4 py-3 border-t border-gray-200">
      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <Search size={16} className="text-gray-400" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="想去哪里？输入景点 / 店名"
            className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
        {results.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
            {results.map((poi) => (
              <button
                key={poi.id}
                onClick={() => { onSelect?.(poi); setResults([]); setQuery(poi.name) }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span className="text-gray-400 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {poi.category}
                </span>
                <span className="text-gray-700">{poi.name}</span>
                <span className="ml-auto text-xs text-gray-300">{poi.rating}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
