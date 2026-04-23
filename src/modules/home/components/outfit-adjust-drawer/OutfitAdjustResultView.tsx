import { Button } from '@/components/ui/button'

import { AdjustSuggestionChip } from './AdjustSuggestionChip'
import { OutfitComparisonSection } from './OutfitComparisonSection'
import type { AdjustStreamResult } from '../../types/outfitAdjustChat'

type OutfitAdjustResultViewProps = {
  result: AdjustStreamResult
  remainingCount: number | null
  onConfirm: () => void
  onRevert: () => void
}

export const OutfitAdjustResultView = ({
  result,
  remainingCount,
  onConfirm,
  onRevert,
}: OutfitAdjustResultViewProps) => {
  return (
    <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
      <p className="font-label-xxl text-center text-neutral-800">已為您調整穿搭</p>
      <div className="flex items-center justify-center">
        <OutfitComparisonSection
          originalImageUrl={result.originalImageUrl}
          adjustedImageUrl={result.adjustedImageUrl}
        />
      </div>
      <div className="hide-scrollbar min-w-0 shrink-0 overflow-x-auto">
        <div className="flex items-center justify-center gap-15">
          <AdjustSuggestionChip
            label="保留原穿搭"
            onClick={onRevert}
            btnClassName="bg-[#E5EFFF]"
            textClassName="text-primary-800"
          />
          <AdjustSuggestionChip
            label="套用新穿搭"
            onClick={onConfirm}
            btnClassName="bg-[#E5EFFF]"
            textClassName="text-primary-800"
          />
        </div>
      </div>
      <div className="flex w-40 flex-col items-center gap-2 self-center">
        <Button
          disabled
          className="h-[46px] w-full rounded-[30px] border border-neutral-300 bg-white text-neutral-800 shadow-none"
        >
          <p className="font-paragraph-md">繼續調整</p>
        </Button>
        {remainingCount !== null && remainingCount > 0 && (
          <span className="font-paragraph-xs text-neutral-500">
            今天還可以調整{remainingCount}次
          </span>
        )}
      </div>
    </div>
  )
}
