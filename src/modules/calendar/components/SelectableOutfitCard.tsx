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
        'relative flex cursor-pointer flex-col rounded-[20px] bg-white p-2 text-left shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow',
        selected ? 'ring-2 ring-neutral-900' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
      )}
    >
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-[16px] bg-neutral-50">
        <Image
          src={outfit.imageUrl}
          alt="穿搭預覽"
          width={120}
          height={176}
          className="h-44 w-30 object-contain"
        />
        {selected ? (
          <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      <div className="pt-2">
        <span className="rounded-full bg-[#DDE8F8] px-3 py-1 font-paragraph-sm text-[#5375A0]">
          {outfit.savedAt}
        </span>
      </div>
    </div>
  )
}
