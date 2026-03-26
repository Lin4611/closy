import { House, Shirt, Settings2, ShelvingUnit } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type TBottomNavItem = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}
export const bottomNavItems: TBottomNavItem[] = [
  {
    id: 'home',
    label: '首頁',
    href: '/home',
    icon: House,
  },
  {
    id: 'outfit',
    label: '穿搭',
    href: '/outfit',
    icon: Shirt,
  },
  {
    id: 'wardrobe',
    label: '我的衣櫃',
    href: '/wardrobe',
    icon: ShelvingUnit,
  },
  {
    id: 'settings',
    label: '設定',
    href: '/settings',
    icon: Settings2,
  },
]
