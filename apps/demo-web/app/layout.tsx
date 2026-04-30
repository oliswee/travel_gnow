import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoNow — 现在就出发',
  description: 'AI 本地路线智能规划',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="pb-16">{children}</body>
    </html>
  )
}
