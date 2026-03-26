import { BotMessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdjustOutfitButtonProps = {
  expanded?: boolean
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
}

export const AdjustOutfitButton = ({
  expanded = false,
  onClick,
  disabled,
  ariaLabel = '調整穿搭',
}: AdjustOutfitButtonProps) => {
  const baseClassName =
    'rounded-full transition-all duration-300  ease-in-out shadow-[0px_2px_8px_0px_#18181B1F] bg-neutral-100 text-neutral-600'
  const expandedClassName = expanded
    ? 'w-[212px] justify-center gap-1 px-7.5 py-2'
    : 'size-12 justify-center p-0'
  const disabledClassName = 'bg-neutral-200 text-neutral-400 opacity-100'
  return (
    <Button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(baseClassName, expandedClassName, disabled && disabledClassName)}
    >
      <BotMessageSquare className="size-6" strokeWidth={2} />
      {expanded && (
        <span
          className={cn('font-label-sm ml-1', disabled ? 'text-neutral-400' : 'text-neutral-600')}
        >
          想調整這套穿搭嗎？
        </span>
      )}
    </Button>
  )
}
