'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouteStore } from '@/lib/store/routeStore'
import { Loader2 } from 'lucide-react'

const AMAP_JS_KEY = '7085383572277ee2e81e63ed12241888'
const AMAP_JS_SECRET = '3ec22ddb9bde31f00c36322609d7f2d1'

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { queue } = useRouteStore()

  useEffect(() => {
    let cancelled = false

    async function initMap() {
      try {
        // Set security code BEFORE loading the Gaode script (required for JSAPI v2.0)
        ;(window as any)._AMapSecurityConfig = {
          securityJsCode: AMAP_JS_SECRET,
        }

        // Use the official Gaode Loader approach
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = `https://webapi.amap.com/loader.js?key=${AMAP_JS_KEY}`
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Gaode Maps script failed to load'))
          document.head.appendChild(script)
        })

        if (cancelled || !mapRef.current) return

        // After loader.js loads, window.AMap is available
        const AMap = (window as any).AMap
        if (!AMap) {
          setError('AMap global not found after loading')
          return
        }

        AMap.plugin('AMap.Geolocation', () => {
          // Plugin ready
        })

        const map = new AMap.Map(mapRef.current, {
          zoom: 12,
          center: [120.155, 30.274],
          viewMode: '2D' as any,
        })

        mapInstance.current = map
        setLoaded(true)
      } catch (e: any) {
        if (!cancelled) {
          console.error('Map init error:', e)
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
    const AMap = (window as any).AMap
    if (!AMap) return

    map.clearMap?.()

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
    })

    map.setFitView(null, false, [48, 48, 48, 48])
  }, [queue, loaded])

  if (error) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-risk-red text-sm mb-1">地图加载失败</p>
          <p className="text-xs text-gray-400 break-all">{error}</p>
        </div>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400">加载地图...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="absolute inset-0"
    />
  )
}
