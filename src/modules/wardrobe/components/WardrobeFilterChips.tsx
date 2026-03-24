import { wardrobeCategoryOptions } from '../constants/categoryOptions'
import { WardrobeCategoryKey } from '../types'

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
    <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-1">
      {wardrobeCategoryOptions.map((option) => {
        const count = counts[option.key] ?? 0
        const isActive = activeCategory === option.key

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={[
              'shrink-0 rounded-full border px-3 py-1 font-label-xs transition-colors',
              isActive
                ? 'border-primary-900 bg-primary-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-500',
            ].join(' ')}
          >
            {option.label}({count})
          </button>
        )
      })}
    </div>
  )
}