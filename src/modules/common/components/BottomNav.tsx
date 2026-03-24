import { useRouter } from 'next/router'

import { AddClothButton } from './AddClothButton'
import { BottomNavItem } from './BottomNavItem'
import { bottomNavItems, type TBottomNavItem } from '../data/bottom-nav'

export const BottomNav = () => {
  const router = useRouter()
  const renderNavItem = (item: TBottomNavItem) => (
    <BottomNavItem
      key={item.id}
      {...item}
      active={router.pathname === item.href}
      onClick={() => router.push(item.href)}
    />
  )
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[375px] -translate-x-1/2">
      <div className="flex h-20 items-center justify-center rounded-[10px] border border-neutral-200 bg-white px-1 py-2">
        {bottomNavItems.slice(0, 2).map(renderNavItem)}

        <AddClothButton onClick={() => router.push('/add-cloth')} />
        {bottomNavItems.slice(2).map(renderNavItem)}
      </div>
    </div>
  )
}
