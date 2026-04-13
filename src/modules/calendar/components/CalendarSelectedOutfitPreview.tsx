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
    <div className="flex flex-col items-center gap-4 pb-2">
      <div className="flex h-[262px] w-full items-center justify-center rounded-[24px] border border-neutral-200 bg-white">
        {outfit ? (
          <Image src={outfit.imageUrl} alt="已選穿搭" width={144} height={256} className="h-64 w-36 object-contain" />
        ) : (
          <Button type="button" variant="outline" size="lg" className="rounded-full border-neutral-500 bg-white text-neutral-800" onClick={onClick}>
            <Plus className="size-5" strokeWidth={2} />
            選擇穿搭
          </Button>
        )}
      </div>
      {outfit ? (
        <Button type="button" variant="outline" size="sm" className="rounded-full border-neutral-300 bg-[#F5F7FB] text-neutral-700" onClick={onClick}>
          重選穿搭
        </Button>
      ) : null}
    </div>
  )
}
