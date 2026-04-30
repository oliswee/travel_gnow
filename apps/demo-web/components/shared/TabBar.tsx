'use client'

import { MapPin, Compass, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/route', label: '路线', icon: MapPin },
  { href: '/drift', label: '灵感', icon: Compass },
  { href: '/settings', label: '设置', icon: Settings },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[var(--z-tabbar)]
                 flex justify-around items-center h-16 pb-2"
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-0.5 w-20 py-1
                        ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}
          >
            <Icon size={22} />
            <span className="text-tag">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
