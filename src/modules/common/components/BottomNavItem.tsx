import { cn } from '@/lib/utils'

type BottomNavItemProps = {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ElementType
  disabled?: boolean
}

export const BottomNavItem = ({
  label,
  active,
  onClick,
  icon: Icon,
  disabled,
}: BottomNavItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-16 flex-1 flex-col items-center justify-center gap-2"
      disabled={disabled}
    >
      <Icon
        size={24}
        className={cn(active ? 'text-primary-700 fill-current' : 'text-neutral-500')}
      />
      <span className={cn('font-label-xxs-r', active ? 'text-primary-700' : 'text-neutral-500')}>
        {label}
      </span>
    </button>
  )
}
