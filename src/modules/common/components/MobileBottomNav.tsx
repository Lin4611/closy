import Link from 'next/link'
import { BookImage, House, Plus, Settings, Shirt } from 'lucide-react'

import { cn } from '@/lib/utils'

type MobileBottomNavProps = {
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
  onAddClick?: () => void
}

const items = [
  { key: 'home', label: '首頁', href: '/', icon: House },
  { key: 'outfit', label: '穿搭', href: '#', icon: Shirt },
  { key: 'wardrobe', label: '我的衣櫃', href: '/wardrobe', icon: BookImage },
  { key: 'settings', label: '設定', href: '#', icon: Settings },
] as const

export const MobileBottomNav = ({ activeTab, onAddClick }: MobileBottomNavProps) => {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 mx-auto w-full max-w-[375px] border-t border-neutral-200 bg-white px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="relative grid grid-cols-5 items-end">
        {items.slice(0, 2).map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeTab

          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Icon
                className={cn('h-[19px] w-[19px]', isActive ? 'text-primary-900' : 'text-neutral-400')}
                strokeWidth={1.9}
              />
              <span
                className={cn(
                  'font-label-xxs-r',
                  isActive ? 'text-primary-900' : 'text-neutral-400'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        <div className="flex justify-center">
          <button
            type="button"
            aria-label="新增衣物"
            onClick={onAddClick}
            className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-primary-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)]"
          >
            <Plus className="h-7 w-7" strokeWidth={2.4} />
          </button>
        </div>

        {items.slice(2).map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeTab

          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Icon
                className={cn('h-[19px] w-[19px]', isActive ? 'text-primary-900' : 'text-neutral-400')}
                strokeWidth={1.9}
              />
              <span
                className={cn(
                  'font-label-xxs-r',
                  isActive ? 'text-primary-900' : 'text-neutral-400'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
