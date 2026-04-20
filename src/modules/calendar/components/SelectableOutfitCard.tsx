import { Check } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { SelectableOutfitSummary } from '@/modules/calendar/types'

type SelectableOutfitCardProps = {
  outfit: SelectableOutfitSummary
  selected: boolean
  onSelect: () => void
}

export const SelectableOutfitCard = ({
  outfit,
  selected,
  onSelect,
}: SelectableOutfitCardProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={selected}
      className={cn(
        'relative flex cursor-pointer flex-col rounded-[20px] bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow',
        selected ? 'ring-2 ring-neutral-900' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
      )}
    >
      <div className="relative flex h-54 items-center justify-center overflow-hidden">
        <Image
          src={outfit.imageUrl}
          alt="穿搭預覽"
          width={120}
          height={176}
          className="h-50 w-14.5 object-contain"
        />
        {selected ? (
          <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      <div className="pt-2">
        <span className="absolute bottom-4 left-1/2 -translate-1/2 rounded-full bg-[#E5EFFF] px-3 py-1 font-label-sm text-primary-800 whitespace-nowrap">
          {outfit.savedAt}
        </span>
      </div>
    </div>
  )
}
