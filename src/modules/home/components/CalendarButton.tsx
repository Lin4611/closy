import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'

type CalendarButtonProps = {
  onClick?: () => void
  ariaLabel?: string
}

export const CalendarButton = ({ onClick, ariaLabel = '行事曆' }: CalendarButtonProps) => {
  return (
    <Button
      onClick={onClick}
      aria-label={ariaLabel}
      id="calendarBtn"
      className="size-10 self-end rounded-full bg-white text-neutral-600 shadow-[0px_2px_8px_0px_#18181B1F] transition-all duration-300 ease-in-out"
    >
      <CalendarDays className="size-6" strokeWidth={2} />
    </Button>
  )
}
