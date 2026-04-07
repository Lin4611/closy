import Image from 'next/image'

type OutfitsOccasionCardProps = {
  occasionId: string
  occasionName: string
  description: string
  outfitCount: number
  onSelectOccasion?: (occasionId: string) => void
  imageUrl: string
  currentDates?: string[]
}

export const OutfitsOccasionCard = ({
  occasionId,
  occasionName,
  description,
  outfitCount,
  onSelectOccasion,
  imageUrl,
  currentDates,
}: OutfitsOccasionCardProps) => {
  return (
    <button
      className="flex w-full items-center gap-4 rounded-[20px] border-[0.5px] border-neutral-300 bg-white p-4 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.02)]"
      type="button"
      onClick={() => onSelectOccasion?.(occasionId)}
    >
      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-[12px] bg-white">
        <Image src={imageUrl} alt="outfit" width={80} height={80} />
      </div>
      <div className="flex flex-col items-start gap-1">
        <h4 className="font-label-md text-neutral-800">
          {occasionName}({outfitCount})
        </h4>
        <p className="font-paragraph-xs text-neutral-400">{description}</p>
        <div className="flex items-center gap-2">
          {currentDates?.map((date) => (
            <p
              key={date}
              className="bg-primary-200 font-label-xs text-primary-800 rounded-[20px] px-3 py-1"
            >
              {date}
            </p>
          ))}
        </div>
      </div>
    </button>
  )
}
