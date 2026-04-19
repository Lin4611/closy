import { occasionMetaMap } from '@/modules/common/types/occasion'

import { OutfitsOccasionCard } from './OutfitsOccasionCard'
import { type SummaryList } from '../types/outfitTypes'

type MyOutfitsOccasionListProps = {
  occasions: SummaryList[]
  onSelectOccasion?: (occasionId: string) => void
}

export const OutfitsOccasionList = ({
  occasions,
  onSelectOccasion,
}: MyOutfitsOccasionListProps) => {
  return (
    <div className="flex flex-col gap-3 px-5">
      {occasions.map((occasion) => {
        const meta = occasionMetaMap.find((m) => m.key === occasion.occasionId)
        return (
          <OutfitsOccasionCard
            key={occasion.occasionId}
            occasionId={occasion.occasionId}
            occasionName={meta?.name}
            description={meta?.description}
            outfitCount={occasion.count}
            imageUrl={meta?.imageUrl}
            onSelectOccasion={onSelectOccasion}
            currentDates={occasion.recentDates}
          />
        )
      })}
    </div>
  )
}
