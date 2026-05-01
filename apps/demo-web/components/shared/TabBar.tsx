'use client'

import { motion } from 'framer-motion'
import { MapPin, Compass, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/route', label: '路线', icon: MapPin },
  { href: '/drift', label: '灵感', icon: Compass },
  { href: '/settings', label: '设置', icon: Settings },
]

const pillPositions = ['16.67%', '50%', '83.33%']

export default function TabBar() {
  const pathname = usePathname()
  const activeIndex = tabs.findIndex((t) => pathname.startsWith(t.href))

  return (
    <nav className="relative glass-heavy border-t border-gray-100 z-[100] flex justify-around items-center h-16 pb-2 flex-shrink-0">
      {/* Sliding pill background */}
      <motion.div
        className="absolute top-2 h-10 w-20 bg-gradient-to-r from-brand-primary/20 to-brand-primary/10 rounded-xl -translate-x-1/2"
        animate={{ left: pillPositions[activeIndex] }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {tabs.map((tab, i) => {
        const isActive = i === activeIndex
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex flex-col items-center justify-center gap-0.5 w-20 py-1 z-10"
          >
            <motion.div
              animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Icon
                size={22}
                className={isActive ? 'text-brand-primary' : 'text-gray-400'}
                fill={isActive ? 'currentColor' : 'none'}
                fillOpacity={isActive ? 0.15 : 0}
              />
            </motion.div>
            <motion.span
              animate={{ opacity: isActive ? 1 : 0.6, fontWeight: isActive ? 600 : 400 }}
              className={`text-tag ${isActive ? 'text-brand-primary' : 'text-gray-400'}`}
            >
              {tab.label}
            </motion.span>
          </Link>
        )
      })}
    </nav>
  )
}
