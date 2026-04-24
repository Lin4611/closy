/**
 * Calendar 主頁專用 header。
 *
 * 不作為跨模組流程頁 / 子頁共用 header 的抽取基底；
 * 後續跨模組共用應另以 SubPageHeader 承接。
 */
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'

type CalendarHeaderProps = {
  title: string
  backHref?: string
  onBackClick?: () => void
  rightSlot?: React.ReactNode
  className?: string
}

export const CalendarHeader = ({ title, backHref = '/home', onBackClick, rightSlot, className }: CalendarHeaderProps) => {
  const handleBackClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onBackClick) return
    event.preventDefault()
    onBackClick()
  }
  return (
    <header className={cn('px-4 py-4.5', className)}>
      <div className="relative flex items-center justify-center">
        <Link href={backHref} onClick={handleBackClick} className="absolute left-0 flex size-10 items-center justify-center">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="font-label-xxl">{title}</h1>
        {rightSlot ? <div className="absolute right-0">{rightSlot}</div> : null}
      </div>
    </header>
  )
}
