'use client'

import { MapPin } from 'lucide-react'

export default function RouteMap() {
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
      <div className="text-center text-gray-400">
        <MapPin size={32} className="mx-auto mb-2" />
        <p className="text-sm">地图区域</p>
        <p className="text-xs text-gray-300 mt-1">搜索地点后显示标记</p>
      </div>
    </div>
  )
}
