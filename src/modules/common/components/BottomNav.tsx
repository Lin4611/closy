import { useRouter } from 'next/router'

import { AddClothButton } from './AddClothButton'
import { BottomNavItem } from './BottomNavItem'
import { bottomNavItems } from '../data/bottom-nav'

export const BottomNav = () => {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 z-50 w-full max-w-[375px]">
      <div className="flex h-20 items-center justify-center rounded-[10px] border border-neutral-200 bg-white px-1 shadow-sm">
        {bottomNavItems.slice(0, 2).map((item) => (
          <BottomNavItem
            key={item.id}
            {...item}
            active={router.pathname === item.href}
            onClick={() => router.push(item.href)}
          />
        ))}

        <AddClothButton onClick={() => router.push('/add-cloth')} />
        {bottomNavItems.slice(2).map((item) => (
          <BottomNavItem
            key={item.id}
            {...item}
            active={router.pathname === item.href}
            onClick={() => router.push(item.href)}
          />
        ))}
      </div>
    </div>
  )
}
