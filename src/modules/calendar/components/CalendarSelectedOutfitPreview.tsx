import { Plus } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import type { SelectableOutfitSummary } from '@/modules/calendar/types'

type CalendarSelectedOutfitPreviewProps = {
  outfit: SelectableOutfitSummary | null
  onClick: () => void
}

export const CalendarSelectedOutfitPreview = ({ outfit, onClick }: CalendarSelectedOutfitPreviewProps) => {
  return (
    <div className="relative mx-auto flex w-full max-w-85.75 min-h-83 flex-col items-center pb-2 pt-2">
      {outfit ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-0 top-0 rounded-full bg-primary-200 h-11 p-3 text-primary-700 shadow-[0_4px_4px_rgba(#18181B0D)] font-label-sm"
          onClick={onClick}
        >
          重選穿搭
        </Button>
      ) : null}

      {outfit ? (
        <Image src={outfit.imageUrl} alt="已選穿搭" width={144} height={256} className="h-80 w-36 object-contain" />
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
