import type { WardrobeItem } from '../types'
import { WardrobeItemCard } from './WardrobeItemCard'

type WardrobeGridProps = {
  items: WardrobeItem[]
  onDelete: (id: string) => void
}

export const WardrobeGrid = ({ items, onDelete }: WardrobeGridProps) => {
  return (
    <section className="grid grid-cols-2 gap-x-5.75 gap-y-3 px-4 pb-25">
      {items.map((item) => (
        <WardrobeItemCard key={item.id} item={item} onDelete={onDelete} />
      ))}
    </section>
  )
}