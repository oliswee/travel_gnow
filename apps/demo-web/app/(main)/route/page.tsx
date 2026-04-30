export default function RoutePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">🗺️ 地图区域</p>
      </div>
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
          <span className="text-gray-400 text-sm">🔍</span>
          <span className="text-gray-400 text-sm">想去哪里？输入景点 / 店名</span>
        </div>
      </div>
    </div>
  )
}
