export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-title font-bold mt-4 mb-6">⚙️ 设置 / Memory Control</h1>
      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">👤 我的出行背景</h2>
        <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 text-sm text-gray-500">
          我喜欢小众、人少的地方...
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-body font-semibold mb-2">🎚️ 偏好权重</h2>
        <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 space-y-3">
          {['美食', '博物馆', '少步行', '小众'].map((pref) => (
            <div key={pref} className="flex items-center gap-3">
              <span className="text-sm w-16">{pref}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className="h-full w-3/5 bg-brand-primary rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
