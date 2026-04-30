'use client'

import dynamic from 'next/dynamic'
import BottomSearchBar from '@/components/route/BottomSearchBar'
import POIQueue from '@/components/route/POIQueue'
import RouteHealthBar from '@/components/route/RouteHealthBar'
import { useRouteStore } from '@/lib/store/routeStore'
import type { POI } from '@gonow/shared-types'

const RouteMap = dynamic(() => import('@/components/route/RouteMap'), { ssr: false })

export default function RoutePage() {
  const { queue, addPoi, removePoi, reorderQueue } = useRouteStore()

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <POIQueue pois={queue} onRemove={removePoi} onReorder={reorderQueue} />
        <RouteMap />
      </div>
      <div className="flex-shrink-0">
        <BottomSearchBar
          onSelect={(poi) =>
            addPoi({
              id: poi.id,
              name: poi.name,
              city: '杭州',
              category: poi.category,
              rating: poi.rating,
              lat: poi.lat,
              lng: poi.lng,
              address: poi.address,
              visitDuration: poi.visit_duration,
              indoor: false,
              price: poi.price,
            } as POI)
          }
        />
      </div>
    </div>
  )
}
