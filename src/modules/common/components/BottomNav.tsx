import { useRouter } from 'next/router'

import { AddClothButton } from './AddClothButton'
import { BottomNavItem } from './BottomNavItem'
import { bottomNavItems, type TBottomNavItem } from '../data/bottom-nav'

type BottomNavProps = {
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
  onAddClick?: () => void
}

export const BottomNav = ({ activeTab, onAddClick }: BottomNavProps) => {
  const router = useRouter()

  const currentTab =
    activeTab ??
    (() => {
      if (router.pathname.startsWith('/wardrobe')) return 'wardrobe'
      if (router.pathname.startsWith('/outfit')) return 'outfit'
      if (router.pathname.startsWith('/settings')) return 'settings'
      return 'home'
    })()

  const renderNavItem = (item: TBottomNavItem) => (
    <BottomNavItem
      key={item.id}
      {...item}
      active={currentTab === item.id}
      onClick={() => router.push(item.href)}
    />
  )

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick()
      return
    }

    void router.push('/wardrobe/new')
  }

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-93.75 -translate-x-1/2">
      <div className="flex h-20 items-center justify-center rounded-[10px] border border-neutral-200 bg-white px-1 py-2">
        {bottomNavItems.slice(0, 2).map(renderNavItem)}
        <AddClothButton onClick={handleAddClick} />
        {bottomNavItems.slice(2).map(renderNavItem)}
      </div>
    </div>
  )
}