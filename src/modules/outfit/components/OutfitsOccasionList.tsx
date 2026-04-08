import { OutfitsOccasionCard } from './OutfitsOccasionCard'

type OutfitOccasionItem = {
  occasionId: string
  occasionName: string
  description: string
  outfitCount: number
  imageUrl: string
  currentDates?: string[]
}

type MyOutfitsOccasionListProps = {
  occasions: OutfitOccasionItem[]
  onSelectOccasion?: (occasionId: string) => void
}

export const OutfitsOccasionList = ({
  occasions,
  onSelectOccasion,
}: MyOutfitsOccasionListProps) => {
  return (
    <div className="flex flex-col gap-3 px-5">
      {occasions.map((occasion) => (
        <OutfitsOccasionCard
          key={occasion.occasionId}
          occasionId={occasion.occasionId}
          occasionName={occasion.occasionName}
          description={occasion.description}
          outfitCount={occasion.outfitCount}
          imageUrl={occasion.imageUrl}
          onSelectOccasion={onSelectOccasion}
          currentDates={occasion.currentDates}
        />
      ))}
    </div>
  )
}
