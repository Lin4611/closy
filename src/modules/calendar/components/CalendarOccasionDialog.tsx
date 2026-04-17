import Image from 'next/image'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { calendarOccasionOptions } from '@/modules/calendar/data/calendarOccasionOptions'
import type { Occasion } from '@/modules/common/types/occasion'

export const CalendarOccasionDialog = ({
  open,
  selectedOccasionKey,
  onSelect,
  onCancel,
  onConfirm,
}: {
  open: boolean
  selectedOccasionKey: Occasion | null
  onSelect: (occasionKey: Occasion) => void
  onCancel: () => void
  onConfirm: () => void
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-86 rounded-[20px] bg-white px-5 py-4">
        <AlertDialogHeader className="gap-1 pb-2">
          <AlertDialogTitle className="font-h4 text-black">選擇你要出席的場合</AlertDialogTitle>
          <p className="font-paragraph-sm text-neutral-500">選擇一個最接近的情境，快速設定</p>
        </AlertDialogHeader>
        <div className="space-y-3">
          {calendarOccasionOptions.map((option) => {
            const isSelected = option.key === selectedOccasionKey

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelect(option.key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition-colors',
                  isSelected ? 'border-primary-800 bg-primary-50' : 'border-neutral-200 bg-white'
                )}
              >
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8F5EF]">
                  <Image src={option.imageUrl} alt={option.name} width={44} height={44} className="size-11 object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-label-md text-neutral-900">{option.name}</p>
                  <p className="pt-1 font-paragraph-sm text-neutral-400">{option.description}</p>
                </div>
              </button>
            )
          })}
        </div>
        <AlertDialogFooter className="grid grid-cols-2 gap-3 pt-3">
          <AlertDialogCancel onClick={onCancel} variant="outline" className="col-span-1 h-11 rounded-[12px] border-neutral-300 bg-white text-neutral-700">
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="brand" className="col-span-1 h-11 rounded-[12px]" disabled={!selectedOccasionKey}>
            下一步
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
