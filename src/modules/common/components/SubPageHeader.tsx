import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'

type SubPageHeaderProps = {
  title?: string
  backHref: string
  backLabel: string
  onBackClick?: () => void
  rightSlot?: ReactNode
}

/**
 * 跨模組流程頁 / 子頁共用 header。
 *
 * sticky 為固定行為，不提供開關。
 */
export const SubPageHeader = ({ title, backHref, backLabel, onBackClick, rightSlot }: SubPageHeaderProps) => {
  const handleBackClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onBackClick) return
    event.preventDefault()
    onBackClick()
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-neutral-100 px-4 py-2.5">
      <Link href={backHref} onClick={handleBackClick} className="flex size-10 items-center justify-center" aria-label={backLabel}>
        <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
      </Link>

      <h1 className="font-label-xxl text-neutral-900">{title}</h1>

      {rightSlot ? (
        <div className="flex size-10 items-center justify-center">{rightSlot}</div>
      ) : (
        <span className="size-10" aria-hidden="true" />
      )}
    </header>
  )
}
