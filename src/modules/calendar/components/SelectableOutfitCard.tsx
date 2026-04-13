import { Check } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { SelectableOutfitSummary } from '@/modules/calendar/types'

type SelectableOutfitCardProps = {
  outfit: SelectableOutfitSummary
  selected: boolean
  onSelect: () => void
  onPreview: () => void
}

export const SelectableOutfitCard = ({
  outfit,
  selected,
  onSelect,
  onPreview,
}: SelectableOutfitCardProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[20px] bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)]',
        selected && 'ring-2 ring-neutral-900'
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        className="relative flex h-44 items-center justify-center overflow-hidden rounded-[16px] bg-neutral-50"
      >
        <Image
          src={outfit.imageUrl}
          alt="穿搭預覽"
          width={120}
          height={176}
          className="h-44 w-30 object-contain"
        />
        {selected ? (
          <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
        ) : null}
      </button>
      <button type="button" onClick={onSelect} className="pt-2 text-left">
        <span className="rounded-full bg-[#DDE8F8] px-3 py-1 font-paragraph-sm text-[#5375A0]">
          {outfit.savedAt}
        </span>
      </button>
    </div>
  )
}
