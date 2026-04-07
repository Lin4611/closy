import { OutfitCard } from './OutfitCard'
import type { OutfitSummary } from '../types/outfitTypes'
import { occasionLabelMap, type OutfitTab } from '../types/outfitTypes'

type OutfitsOverviewProps = {
  outfits: OutfitSummary[]
  onDelete: (outfitId: string) => void
  tab: OutfitTab
}
export const OutfitsOverview = ({ outfits, onDelete, tab }: OutfitsOverviewProps) => {
  const sortedOutfits = [...outfits].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  )
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-2 place-content-center justify-items-center gap-4">
        {sortedOutfits.map((outfit) => {
          const footLabel =
            tab === 'overview'
              ? occasionLabelMap[outfit.occasionKey]
              : outfit.savedAt.replaceAll('-', '/')
          return (
            <OutfitCard
              key={outfit.id}
              outfitId={outfit.id}
              modelImage={outfit.imageUrl}
              footLabel={footLabel}
              onDelete={() => onDelete(outfit.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
