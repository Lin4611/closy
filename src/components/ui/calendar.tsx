import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CalendarProps = {
  month: Date
  selected?: Date | null
  onMonthChange: (month: Date) => void
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
  className?: string
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

const buildMonthGrid = (month: Date) => {
  const firstDay = startOfMonth(month)
  const lastDay = endOfMonth(month)
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  const endDate = new Date(lastDay)
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

  const days: Date[] = []
  const cursor = new Date(startDate)

  while (cursor <= endDate) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

export const Calendar = ({ month, selected, onMonthChange, onSelect, disabled, className }: CalendarProps) => {
  const monthGrid = useMemo(() => buildMonthGrid(month), [month])

  return (
    <div className={cn('w-58 rounded-[16px] bg-white p-3', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="size-6 rounded-[8px] border-neutral-200 bg-white text-neutral-500"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          aria-label="上個月"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </Button>
        <div className="font-label-sm text-neutral-700">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="size-6 rounded-[8px] border-neutral-200 bg-white text-neutral-500"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          aria-label="下個月"
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="font-label-xs text-neutral-400">
            {label}
          </div>
        ))}
        {monthGrid.map((date) => {
          const isOutsideMonth = date.getMonth() !== month.getMonth()
          const isSelected = selected ? isSameDay(date, selected) : false
          const isDisabled = disabled?.(date) ?? false

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect?.(date)}
              className={cn(
                'mx-auto flex size-7 items-center justify-center rounded-[8px] font-paragraph-sm text-neutral-700 transition-colors',
                isOutsideMonth && 'text-neutral-300',
                isSelected && 'bg-primary-800 text-white',
                isDisabled && 'cursor-not-allowed bg-neutral-100 text-neutral-300',
                !isSelected && !isDisabled && 'hover:bg-neutral-100',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
