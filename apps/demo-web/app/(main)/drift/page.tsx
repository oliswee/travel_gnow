export default function DriftPage() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-[28px] font-bold text-brand-primary mt-4">现在就出发</h1>
      <p className="text-gray-500 mb-6">说一句话，8 秒出草案</p>
      <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 mb-4">
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-400 text-sm">
          杭州 2 天，想吃好但别太累
        </div>
        <button className="btn-primary w-full mt-3">生成 3 套方案</button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-300 text-sm">Plan A/B/C 将在这里展示</p>
      </div>
    </div>
  )
}
