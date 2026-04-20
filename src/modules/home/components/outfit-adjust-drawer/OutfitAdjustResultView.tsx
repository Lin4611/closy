import { AdjustSuggestionChip } from './AdjustSuggestionChip'
import { OutfitComparisonSection } from './OutfitComparisonSection'

export const OutfitAdjustResultView = () => {
  return (
    <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
      <p className="font-label-xxl text-center text-neutral-800">已為您調整穿搭</p>
      <div className="flex items-center justify-center">
        <OutfitComparisonSection
          originalImageUrl="/home/model_man.webp"
          adjustedImageUrl="/home/model_man.webp"
        />
      </div>
      <div className="hide-scrollbar min-w-0 shrink-0 overflow-x-auto">
        <div className="flex gap-2">
          <AdjustSuggestionChip label="我喜歡！幫我換成這套" />
          <AdjustSuggestionChip label="還是原本那套好了" />
        </div>
      </div>
    </div>
  )
}
