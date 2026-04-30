'use client'

import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useRouteStore } from '@/lib/store/routeStore'
import { Loader2 } from 'lucide-react'

const AMAP_JS_KEY = '7085383572277ee2e81e63ed12241888'
const AMAP_JS_SECRET = '3ec22ddb9bde31f00c36322609d7f2d1'

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const amapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { queue } = useRouteStore()

  useEffect(() => {
    let cancelled = false
    async function initMap() {
      try {
        ;(window as any)._AMapSecurityConfig = {
          securityJsCode: AMAP_JS_SECRET,
        }
        const AMap = await AMapLoader.load({
          key: AMAP_JS_KEY,
          version: '2.0',
        })
        if (cancelled || !mapRef.current) return
        const map = new AMap.Map(mapRef.current, {
          zoom: 12,
          center: [120.155, 30.274],
          mapStyle: 'amap://styles/light',
        })
        amapRef.current = AMap
        mapInstance.current = map
        setLoaded(true)
      } catch (e: any) {
        if (!cancelled) {
          console.error('AMap init error:', e)
          setError(e.message || '地图加载失败')
        }
      }
    }
    initMap()
    return () => { cancelled = true }
  }, [])

  // Update markers when queue changes
  useEffect(() => {
    if (!mapInstance.current || !loaded) return
    const map = mapInstance.current
    const AMap = amapRef.current

    markersRef.current.forEach((m: any) => map.remove(m))
    markersRef.current = []
    if (queue.length === 0) return

    queue.forEach((poi, i) => {
      const marker = new AMap.Marker({
        position: [poi.lng, poi.lat],
        title: poi.name,
        label: {
          content: `<div style="background:#3B5BDB;color:#fff;font-size:11px;padding:1px 6px;border-radius:10px">${i + 1}</div>`,
          direction: 'top',
          offset: new AMap.Pixel(0, -5),
        },
      })
      map.add(marker)
      markersRef.current.push(marker)
    })

    map.setFitView(null, false, [48, 48, 48, 48])
  }, [queue, loaded])

  if (error) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <p className="text-risk-red text-sm">地图加载失败: {error}</p>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400">加载地图...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="flex-1 w-full" />
}
