import { CalendarDays } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  initialDisplayValue?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  min?: string
  max?: string
  name?: string
  id?: string
  className?: string
  inputClassName?: string
  iconClassName?: string
  disabledDates?: string[]
  isDateDisabled?: (value: string) => boolean
}

const toDateValue = (value?: string | null) => (value ? new Date(`${value}T00:00:00`) : null)
const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const DatePicker = ({
  initialDisplayValue,
  value,
  onChange,
  placeholder = '選擇日期',
  disabled = false,
  min,
  max,
  name,
  id,
  className,
  inputClassName,
  iconClassName,
  disabledDates = [],
  isDateDisabled,
}: DatePickerProps) => {
  const selectedDate = useMemo(() => toDateValue(value), [value])
  const initialDisplayDate = useMemo(() => toDateValue(initialDisplayValue), [initialDisplayValue])
  const selectedMonth = useMemo(
    () => (selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : null),
    [selectedDate],
  )
  const initialDisplayMonth = useMemo(
    () => (initialDisplayDate ? new Date(initialDisplayDate.getFullYear(), initialDisplayDate.getMonth(), 1) : null),
    [initialDisplayDate],
  )
  const disabledDateSet = useMemo(() => new Set(disabledDates), [disabledDates])
  const [open, setOpen] = useState(false)
  const [monthOverride, setMonthOverride] = useState<Date | null>(null)
  const month = monthOverride ?? selectedMonth ?? initialDisplayMonth ?? new Date()

  const isDisabledDate = (date: Date) => {
    const dateKey = toDateKey(date)

    if (min && dateKey < min) return true
    if (max && dateKey > max) return true
    if (disabledDateSet.has(dateKey)) return true
    if (isDateDisabled?.(dateKey)) return true

    return false
  }

  return (
    <div className={cn('relative w-full', className)}>
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
      <Popover open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setMonthOverride(selectedMonth ?? initialDisplayMonth ?? new Date())
        }
      }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-label="選擇日期"
            className={cn(
              ' font-paragraph-lg h-13 w-full rounded-[16px] border border-neutral-300 bg-white px-5 py-3 text-left text-neutral-800 outline-none transition-colors focus-visible:border-primary-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100',
              inputClassName,
            )}
          >
            <span className={cn(!value && 'text-neutral-400')}>
              {value ? value.replace(/-/g, '/') : placeholder}
            </span>
            <span
              className={cn(
                'absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center text-neutral-500',
                disabled && 'text-neutral-300',
                iconClassName,
              )}
            >
              <CalendarDays className="size-5" strokeWidth={2} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            month={month}
            selected={selectedDate}
            onMonthChange={setMonthOverride}
            onSelect={(date) => {
              if (isDisabledDate(date)) return
              onChange?.(toDateKey(date))
              setOpen(false)
            }}
            disabled={isDisabledDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
