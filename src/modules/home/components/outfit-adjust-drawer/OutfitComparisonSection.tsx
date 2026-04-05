import { OutfitComparisonCard } from './OutfitComparisonCard'
type OutfitComparisonSectionProps = {
  originalImageUrl: string
  adjustedImageUrl: string
}
export const OutfitComparisonSection = ({
  originalImageUrl,
  adjustedImageUrl,
}: OutfitComparisonSectionProps) => {
  return (
    <div className="flex gap-[50px]">
      <OutfitComparisonCard title="調整前" imageUrl={originalImageUrl} />
      <OutfitComparisonCard title="調整後" imageUrl={adjustedImageUrl} />
    </div>
  )
}
