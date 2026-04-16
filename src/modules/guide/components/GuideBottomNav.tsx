import { AddClothButton } from '@/modules/common/components/AddClothButton'
import { BottomNavItem } from '@/modules/common/components/BottomNavItem'
import { bottomNavItems, type TBottomNavItem } from '@/modules/common/data/bottom-nav'

type GuideBottomNavProps = {
  onAddClick?: () => void
  disabled?: boolean
}

export const GuideBottomNav = ({ onAddClick, disabled }: GuideBottomNavProps) => {
  const renderNavItem = (item: TBottomNavItem) => (
    <BottomNavItem key={item.id} {...item} active={item.id === 'home'} disabled={disabled} />
  )

  const handleAddClick = () => {
    onAddClick?.()
  }

  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-93.75 -translate-x-1/2">
      <div className="flex h-20 items-center justify-center rounded-[10px] border border-neutral-200 bg-white px-1 py-2">
        {bottomNavItems.slice(0, 2).map(renderNavItem)}
        <div className="relative flex flex-1 items-center justify-center">
          <span className="pointer-events-none absolute size-16 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.2)]" />
          <div className="relative z-10">
            <AddClothButton onClick={handleAddClick} />
          </div>
        </div>
        {bottomNavItems.slice(2).map(renderNavItem)}
      </div>
    </div>
  )
}
