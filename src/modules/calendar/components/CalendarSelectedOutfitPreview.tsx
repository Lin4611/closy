import { LoaderCircle, Pen, Plus } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import type { CalendarSelectedOutfitPreviewModel, SelectableOutfitSummary } from '@/modules/calendar/types'

type CalendarSelectedOutfitPreviewProps = {
  outfit: CalendarSelectedOutfitPreviewModel | SelectableOutfitSummary | null
  onClick: () => void
  isLoading?: boolean
}

export const CalendarSelectedOutfitPreview = ({ outfit, onClick, isLoading = false }: CalendarSelectedOutfitPreviewProps) => {
  const previewStatus = isLoading ? 'loading' : outfit && 'previewStatus' in outfit ? outfit.previewStatus : 'resolved'
  const previewMessage = isLoading ? '正在載入穿搭預覽' : outfit && 'previewMessage' in outfit ? outfit.previewMessage : null
  const shouldShowPlaceholder = isLoading || Boolean(outfit && previewStatus !== 'resolved')

  return (
    <div className="relative mx-auto flex w-full max-w-85.75 min-h-83 flex-col items-center pb-2 pt-2">
      {outfit && !isLoading ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-0 top-0 rounded-full bg-primary-200 h-11 p-3 text-primary-700 shadow-[0_4px_4px_rgba(#18181B0D)] font-label-sm"
          onClick={onClick}
        >
          <Pen className="size-6" strokeWidth={2} />
          重選穿搭
        </Button>
      ) : null}

      {outfit && !shouldShowPlaceholder ? (
        <Image src={outfit.imageUrl} alt="已選穿搭" width={144} height={256} className="h-80 w-36 object-contain" />
      ) : shouldShowPlaceholder ? (
        <div className="flex min-h-83 max-w-66.25 w-full flex-col items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          {previewStatus === 'loading' ? <LoaderCircle className="mb-3 size-6 animate-spin text-primary-700" strokeWidth={1.75} /> : null}
          <p className="font-label-lg text-neutral-800">{previewStatus === 'loading' ? '載入中' : previewStatus === 'error' ? '載入失敗' : '穿搭不存在'}</p>
          {previewMessage ? <p className="mt-2 font-paragraph-sm text-neutral-500">{previewMessage}</p> : null}
        </div>
      ) : (
        <div className="flex min-h-83 max-w-66.25 w-full items-center justify-center rounded-[20px] border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.12)] bg-white">
          <Button type="button" variant="outline" size="lg" className="rounded-full border border-black bg-white text-neutral-800 font-h4" onClick={onClick}>
            <Plus className="size-5" strokeWidth={2} />
            選擇穿搭
          </Button>
        </div>
      )}
    </div>
  )
}
