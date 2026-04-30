import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoNow — 现在就出发',
  description: 'AI 本地路线智能规划',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-900 flex items-center justify-center min-h-[100dvh]">
        {/* Phone frame */}
        <div className="w-full max-w-md min-h-[100dvh] bg-white shadow-2xl flex flex-col">
          {/* Status bar */}
          <div className="h-11 bg-white flex items-center justify-between px-6 text-xs font-medium text-gray-900 flex-shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 border border-gray-700 rounded-sm" />
              <div className="w-3.5 h-3.5 border border-gray-700 rounded-sm" />
              <div className="w-6 h-2.5 border border-gray-700 rounded-sm" />
            </div>
          </div>
          {/* App content — fills remaining height */}
          <div className="flex-1 relative overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
