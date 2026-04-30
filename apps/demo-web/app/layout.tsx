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
      <body className="bg-gray-900 font-sans text-gray-900 antialiased overflow-hidden">
        {/* Centered on desktop, full-width on mobile */}
        <div className="mx-auto max-w-md h-[100dvh] flex flex-col relative shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  )
}
