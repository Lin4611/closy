import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type CalendarHeaderProps = {
  title: string
  backHref?: string
  rightSlot?: React.ReactNode
  className?: string
}

export const CalendarHeader = ({ title, backHref = '/home', rightSlot, className }: CalendarHeaderProps) => {
  return (
    <header className={cn('sticky top-0 z-10 bg-white px-4 py-4.5', className)}>
      <div className="relative flex items-center justify-center">
        <Link href={backHref} className="absolute left-0 flex size-10 items-center justify-center">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="font-label-xxl">{title}</h1>
        {rightSlot ? <div className="absolute right-0">{rightSlot}</div> : null}
      </div>
    </header>
  )
}
