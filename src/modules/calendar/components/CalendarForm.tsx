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
  outfit: SelectableOutfitSummary | null
  disabledDate?: boolean
  disabledDates?: string[]
  submitLabel?: string
  onOccasionChange: (occasionKey: Occasion) => void
  onDateChange: (date: string) => void
  onSelectOutfit: () => void
  onSubmit: () => void
}

export const CalendarForm = ({
  occasionKey,
  date,
  outfit,
  disabledDate = false,
  disabledDates = [],
  submitLabel = '確定',
  onOccasionChange,
  onDateChange,
  onSelectOutfit,
  onSubmit,
}: CalendarFormProps) => {
  return (
    <div className="flex flex-1 flex-col px-4 pb-8">
      <div className="pt-2">
        <CalendarSelectedOutfitPreview outfit={outfit} onClick={onSelectOutfit} />
      </div>
      <div className="mt-4 rounded-[28px] bg-[#FAF9F7] px-5 py-6">
        <div>
          <label className="pb-2 font-label-md text-neutral-700">
            場合<span className="text-danger-300">*</span>
          </label>
          <select
            value={occasionKey ?? ''}
            onChange={(event) => onOccasionChange(event.target.value as Occasion)}
            className="mt-2 h-13 w-full rounded-[20px] border border-neutral-300 bg-white px-4 font-paragraph-md text-neutral-800 outline-none"
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
        </div>
        <div className="pt-5">
          <label className={cn('pb-2 font-label-md', disabledDate ? 'text-neutral-400' : 'text-neutral-700')}>
            日期<span className="text-danger-300">*</span>
          </label>
          <DatePicker
            value={date}
            onChange={onDateChange}
            disabled={disabledDate}
            disabledDates={disabledDates}
            className="mt-2"
          />
        </div>
      </div>
      <Button type="button" variant="brand" size="xl" className="mx-auto mt-9 w-33" onClick={onSubmit} disabled={!occasionKey || !date}>
        {submitLabel}
      </Button>
    </div>
  )
}
