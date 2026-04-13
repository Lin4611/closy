import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type SettingItemCard = {
  title: string
  href: string
  value: string[]
}

export const SettingItemCard = ({ title, href, value }: SettingItemCard) => {
  return (
    <Link
      href={href}
      className="font-paragraph-md flex flex-1 items-center justify-between py-[5.5px]"
    >
      <span className="shrink-0">{title}</span>
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-paragraph-md max-w-[150px] truncate text-neutral-500">
          {value.join('、')}
        </span>
        <ChevronRight size={20} className="shrink-0 text-neutral-900" strokeWidth={2} />
      </div>
    </Link>
  )
}
