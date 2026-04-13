import { HumanFigureSvg } from './HumanFigureSvg'

export const HomeOutfitPreviewSkeleton = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="relative h-110 w-[153px] overflow-hidden">
        <HumanFigureSvg />
        <div className="shimmer-overlay absolute inset-0" />
      </div>
    </div>
  )
}
