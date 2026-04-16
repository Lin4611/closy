import { cn } from '@/lib/utils'

import { wardrobeCategoryOptions } from '../constants/categoryOptions'
import type { WardrobeCategoryKey } from '../types'

type WardrobeFilterChipsProps = {
  activeCategory: WardrobeCategoryKey
  counts: Partial<Record<WardrobeCategoryKey, number>>
  onChange: (category: WardrobeCategoryKey) => void
}

export const WardrobeFilterChips = ({
  activeCategory,
  counts,
  onChange,
}: WardrobeFilterChipsProps) => {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
      {wardrobeCategoryOptions.map((option) => {
        const count = counts[option.key] ?? 0
        const isActive = activeCategory === option.key

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              'shrink-0 rounded-full border-[0.5px] px-3 py-1 font-label-md transition-colors',
              isActive
                ? 'border-primary-800 bg-primary-800 text-white'
                : 'border-neutral-500 bg-white text-neutral-500'
            )}
          >
            {option.label}({count})
          </button>
        )
      })}
    </div>
  )
}