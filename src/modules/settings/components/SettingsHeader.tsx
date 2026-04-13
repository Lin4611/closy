import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type SettingsHeaderProps = {
  title: string
}

export const SettingsHeader = ({ title }: SettingsHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white px-4 py-3">
      <div className="relative flex items-center justify-center">
        <Link href="/settings" className="absolute left-0 flex size-10 items-center justify-center">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="font-label-xxl">更改{title}</h1>
      </div>
    </header>
  )
}
