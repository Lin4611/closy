import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { CalendarSelectedOutfitPreview } from '@/modules/calendar/components/CalendarSelectedOutfitPreview'
import { calendarOccasionOptions } from '@/modules/calendar/data/calendarOccasionOptions'
import type { SelectableOutfitSummary } from '@/modules/calendar/types'
import type { Occasion } from '@/modules/common/types/occasion'

type CalendarFormProps = {
  occasionKey: Occasion | null
  date: string
  initialDisplayDate?: string
  outfit: SelectableOutfitSummary | null
  disabledDate?: boolean
  disabledDates?: string[]
  isDateDisabled?: (value: string) => boolean
  submitLabel?: string
  onOccasionChange: (occasionKey: Occasion) => void
  onDateChange: (date: string) => void
  onSelectOutfit: () => void
  onSubmit: () => void
}

export const CalendarForm = ({
  occasionKey,
  date,
  initialDisplayDate,
  outfit,
  disabledDate = false,
  disabledDates = [],
  isDateDisabled,
  submitLabel = '確定',
  onOccasionChange,
  onDateChange,
  onSelectOutfit,
  onSubmit,
}: CalendarFormProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-2">
        <CalendarSelectedOutfitPreview outfit={outfit} onClick={onSelectOutfit} />
      </div>
      <div className="flex flex-1 flex-col mt-4 rounded-t-[40px] bg-white px-4 py-5 shadow-[0_1px_16px_rgba(0,0,0,0.1)]">
        <div className="px-4">
          <label className="pb-2 font-label-md text-neutral-700">
            場合<span className="text-danger-300">*</span>
          </label>
          <div className="relative mt-2">
            <select
              value={occasionKey ?? ''}
              onChange={(event) => onOccasionChange(event.target.value as Occasion)}
              className="h-13 w-full appearance-none rounded-[16px] border border-neutral-300 bg-white py-3 pr-12 pl-5 font-paragraph-lg text-neutral-800 outline-none"
            >
              <option value="" disabled>
                選擇場合
              </option>
              {calendarOccasionOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-5 flex -translate-y-1/2 items-center justify-center text-neutral-500">
              <ChevronDown className="size-5" strokeWidth={1.5} />
            </span>
          </div>
        </div>
        <div className="px-4 pt-4">
          <label className={cn('pb-2 font-label-md', disabledDate ? 'text-neutral-400' : 'text-neutral-700')}>
            日期<span className="text-danger-300">*</span>
          </label>
          <DatePicker
            value={date}
            onChange={onDateChange}
            initialDisplayValue={initialDisplayDate}
            disabled={disabledDate}
            disabledDates={disabledDates}
            isDateDisabled={isDateDisabled}
            className="mt-2"
          />
        </div>
        <Button type="button" variant="brand" size="xl" className="mx-auto mt-10 w-33" onClick={onSubmit} disabled={!occasionKey || !date}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
