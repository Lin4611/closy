import Link from 'next/link'

import { cn } from '@/lib/utils'

type BottomNavItemProps = {
  label: string
  active: boolean
  href: string
  icon: React.ElementType
  id?: string
}

export const BottomNavItem = ({ label, active, href, icon: Icon, id }: BottomNavItemProps) => {
  return (
    <Link
      href={href}
      className="flex h-16 flex-1 flex-col items-center justify-center gap-2"
      id={id}
    >
      <Icon
        size={24}
        className={cn(active ? 'text-primary-700 fill-current' : 'text-neutral-500')}
      />
      <span className={cn('font-label-xxs-r', active ? 'text-primary-700' : 'text-neutral-500')}>
        {label}
      </span>
    </Link>
  )
}
