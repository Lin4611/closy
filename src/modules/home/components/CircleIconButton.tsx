import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CircleIconButtonProps = {
  kind: 'like' | 'dislike'
  icon: LucideIcon
  onClick?: () => void
  disabled?: boolean
  ariaLabel: string
}

export const CircleIconButton = ({
  icon: Icon,
  onClick,
  disabled = false,
  ariaLabel,
  kind,
}: CircleIconButtonProps) => {
  const baseClassName =
    'rounded-full transition-all duration-300  ease-in-out shadow-[0px_4px_4px_0px_#18181B40]'

  const enabledClassName =
    kind === 'like'
      ? 'bg-primary-800 text-white active:bg-primary-800 active:text-neutral-400'
      : 'bg-white text-neutral-900 active:bg-white active:text-neutral-400'

  const disabledClassName =
    kind === 'like'
      ? 'bg-neutral-200 text-neutral-400 opacity-100 shadow-[0px_4px_4px_0px_#18181B14]'
      : 'bg-neutral-100 text-neutral-400 opacity-100 shadow-[0px_4px_4px_0px_#18181B14]'
  return (
    <Button
      aria-label={ariaLabel}
      className={cn(baseClassName, disabled ? disabledClassName : enabledClassName)}
      onClick={onClick}
      size="circle"
      disabled={disabled}
    >
      <Icon className="size-[28px]" strokeWidth={2} />
    </Button>
  )
}
