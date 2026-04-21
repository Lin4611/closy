import { CalendarDays, Link } from 'lucide-react'

import { Button } from '@/components/ui/button'

type CalendarButtonProps = {
  ariaLabel?: string
  onClick?: () => void
}

export const CalendarButton = ({ ariaLabel = '行事曆', onClick }: CalendarButtonProps) => {
  return (
    <Link href="/calendar">
      <Button
        onClick={onClick}
        aria-label={ariaLabel}
        id="calendarBtn"
        className="size-10 self-end rounded-full bg-white text-neutral-600 shadow-[0px_2px_8px_0px_#18181B1F] transition-all duration-300 ease-in-out"
      >
        <CalendarDays className="size-6" strokeWidth={2} />
      </Button>
    </Link>
  )
}
