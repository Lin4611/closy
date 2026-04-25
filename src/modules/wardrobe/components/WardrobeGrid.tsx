import { memo } from 'react'

import type { WardrobeItem } from '../types'
import { WardrobeItemCard } from './WardrobeItemCard'

type WardrobeGridProps = {
  items: WardrobeItem[]
  onDelete: (id: string) => void
}

const FIRST_VIEWPORT_IMAGE_COUNT = 10

export const WardrobeGrid = memo(function WardrobeGrid({ items, onDelete }: WardrobeGridProps) {
  return (
    <section className="grid grid-cols-2 gap-x-5.75 gap-y-3 px-4 pb-25">
      {items.map((item, index) => (
        <WardrobeItemCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          priority={index < FIRST_VIEWPORT_IMAGE_COUNT}
        />
      ))}
    </section>
  )
})
