'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouteStore } from '@/lib/store/routeStore'
import { Loader2, AlertTriangle } from 'lucide-react'

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
    let timeout: ReturnType<typeof setTimeout>

    async function initMap() {
      try {
        // Gaode JSAPI v2.0 security — must run before script loads
        ;(window as any)._AMapSecurityConfig = {
          securityJsCode: AMAP_JS_SECRET,
        }

        console.log('[RouteMap] Loading Gaode script...')

        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_JS_KEY}`

        await new Promise<void>((resolve, reject) => {
          script.onload = () => {
            console.log('[RouteMap] Script onload')
            resolve()
          }
          script.onerror = () => reject(new Error('Gaode script load error'))
          document.head.appendChild(script)

          timeout = setTimeout(() => {
            reject(new Error('地图加载超时。请检查：高德控制台 JS API key 是否启用、安全密钥是否正确、域名白名单是否包含 localhost'))
          }, 20000)
        })

        clearTimeout(timeout)
        if (cancelled) return

        // mapRef.current is always available because we render the container div alongside the overlay
        const el = mapRef.current
        if (!el) {
          setError('地图容器未找到')
          return
        }

        const AMap = (window as any).AMap
        console.log('[RouteMap] window.AMap:', typeof AMap, typeof AMap?.Map)

        if (!AMap || typeof AMap.Map !== 'function') {
          setError('高德 JSAPI 加载不完整，key 或安全密钥可能不正确')
          return
        }

        const map = new AMap.Map(el, {
          zoom: 12,
          center: [120.155, 30.274],
        })

        console.log('[RouteMap] Map created OK')
        mapInstance.current = map
        setLoaded(true)
      } catch (e: any) {
        clearTimeout(timeout)
        if (!cancelled) {
          console.error('[RouteMap] Error:', e)
          setError(e.message || '地图加载失败')
        }
      }
    }

    initMap()
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
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

  return (
    <div className="absolute inset-0">
      {/* Map container — always rendered so ref is never null */}
      <div ref={mapRef} className="absolute inset-0" />

      {/* Loading overlay */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 size={28} className="animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-400">地图加载中...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center p-6 max-w-sm">
            <AlertTriangle size={28} className="text-amber-500 mx-auto mb-3" />
            <p className="text-sm text-gray-700 font-medium mb-2">地图加载失败</p>
            <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
