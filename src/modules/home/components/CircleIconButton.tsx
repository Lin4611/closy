import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CircleIconButtonProps = {
  kind: 'like' | 'dislike'
  icon: LucideIcon
  onClick?: () => void
  disabled?: boolean
  isActive?: boolean
  ariaLabel: string
}

export const CircleIconButton = ({
  icon: Icon,
  onClick,
  disabled = false,
  isActive = false,
  ariaLabel,
  kind,
}: CircleIconButtonProps) => {
  const baseClassName =
    'rounded-full transition-all duration-300  ease-in-out shadow-[0px_4px_4px_0px_#18181B40] '

  const enabledClassName =
    kind === 'like'
      ? 'bg-white text-[#FF8B8B] active:bg-[#FF5656] active:text-white'
      : 'bg-white text-neutral-900 active:bg-neutral-800 active:text-neutral-100'

  const savedClassName = 'bg-[#FF5656] text-white disabled:opacity-100'
  const disabledClassName = 'bg-neutral-200 text-neutral-400'

  const buttonClassName = disabled
    ? kind === 'like' && isActive
      ? savedClassName
      : disabledClassName
    : enabledClassName

  return (
    <Button
      aria-label={ariaLabel}
      className={cn(baseClassName, buttonClassName)}
      onClick={onClick}
      size="circle"
      id={kind}
      disabled={disabled}
    >
      <Icon
        className={cn(
          'size-[28px] transition-none',
          kind === 'like' &&
            (isActive ? 'fill-current' : 'fill-none group-active/button:fill-current'),
        )}
        strokeWidth={2}
      />
    </Button>
  )
}
