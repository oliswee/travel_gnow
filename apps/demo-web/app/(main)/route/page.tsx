'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BottomSearchBar from '@/components/route/BottomSearchBar'
import POIQueue from '@/components/route/POIQueue'
import GenerateButton from '@/components/route/GenerateButton'
import POIInsightDrawer from '@/components/poi/POIInsightDrawer'
import { useRouteStore } from '@/lib/store/routeStore'
import type { POI } from '@gonow/shared-types'

const RouteMap = dynamic(() => import('@/components/route/RouteMap'), { ssr: false })

export default function RoutePage() {
  const { queue, addPoi, removePoi, reorderQueue } = useRouteStore()
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <POIQueue
          pois={queue}
          onRemove={removePoi}
          onReorder={reorderQueue}
          onPoiClick={(poi) => setSelectedPoi(poi)}
        />
        <RouteMap onMarkerClick={(poi) => setSelectedPoi(poi)} />
      </div>

      {queue.length >= 2 && (
        <div className="px-4 py-2">
          <GenerateButton />
        </div>
      )}

      <div className="flex-shrink-0">
        <BottomSearchBar
          onSelect={(poi) => {
            const newPoi: POI = {
              id: poi.id, name: poi.name, city: '杭州', category: poi.category,
              rating: poi.rating, lat: poi.lat, lng: poi.lng, address: poi.address,
              visitDuration: poi.visit_duration, indoor: false, price: poi.price,
            }
            addPoi(newPoi)
          }}
        />
      </div>

      <POIInsightDrawer poi={selectedPoi} onClose={() => setSelectedPoi(null)} />
    </div>
  )
}
