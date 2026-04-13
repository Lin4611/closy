import { Button } from '@/components/ui/button'

export const SelectableOutfitEmptyState = ({ onGoHome, onSkip }: { onGoHome: () => void; onSkip: () => void }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="font-h4 text-neutral-900">「你的穿搭」還是空的</p>
      <p className="pt-4 font-paragraph-md text-neutral-400">
        去首頁收藏喜歡的穿搭<br />或者取消，前一天會為你自動推薦
      </p>
      <div className="mt-14 flex w-full max-w-40 flex-col gap-4">
        <Button type="button" variant="brand" size="xl" onClick={onGoHome}>
          去首頁
        </Button>
        <Button type="button" variant="outline" size="xl" className="border-neutral-300 bg-white text-neutral-700" onClick={onSkip}>
          略過
        </Button>
      </div>
    </div>
  )
}
