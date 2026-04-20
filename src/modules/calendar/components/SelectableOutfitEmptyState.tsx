import { Button } from '@/components/ui/button'

type SelectableOutfitEmptyStateProps = {
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary: () => void
  onSecondary: () => void
}

export const SelectableOutfitEmptyState = ({
  title = '「你的穿搭」還是空的',
  description = '去首頁收藏喜歡的穿搭\n或者取消，前一天會為你自動推薦',
  primaryLabel = '去首頁',
  secondaryLabel = '略過',
  onPrimary,
  onSecondary,
}: SelectableOutfitEmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="font-h4 text-neutral-900">{title}</p>
      <p className="pt-4 font-paragraph-md text-neutral-400 whitespace-pre-line">{description}</p>
      <div className="mt-14 flex w-full max-w-40 flex-col gap-4">
        <Button type="button" variant="brand" size="xl" onClick={onPrimary}>
          {primaryLabel}
        </Button>
        <Button type="button" variant="outline" size="xl" className="border-neutral-300 bg-white text-neutral-700" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      </div>
    </div>
  )
}
