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
      <AlertDialogContent className="w-86 rounded-[16px] bg-white px-6 py-6">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle className="font-h4 text-black">選擇你要出席的場合</AlertDialogTitle>
          <p className="font-paragraph-sm text-neutral-500">選擇一個最接近的情境，快速設定</p>
        </AlertDialogHeader>
        <div className="space-y-2">
          {calendarOccasionOptions.map((option) => {
            const isSelected = option.key === selectedOccasionKey

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelect(option.key)}
                className={cn(
                  'flex w-full items-center justify-start gap-2 rounded-[16px] bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out',
                  isSelected ? 'ring-primary-800 ring-2' : 'ring-[0.5px] ring-neutral-300',
                )}
              >
                <Image src={option.imageUrl} alt={option.name} width={40} height={40} />
                <div className="flex flex-col items-start gap-1">
                  <p className="font-label-md text-neutral-800">{option.name}</p>
                  <p className="font-paragraph-xs text-neutral-400">{option.description}</p>
                </div>
              </button>
            )
          })}
        </div>
        <AlertDialogFooter className="grid grid-cols-2 gap-3 pt-8">
          <AlertDialogCancel onClick={onCancel} variant="outline" className="col-span-1 h-10.5 rounded-[12px] border-neutral-300 bg-white text-neutral-500">
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="brand" className="col-span-1 h-10.5 rounded-[12px]" disabled={!selectedOccasionKey}>
            下一步
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
