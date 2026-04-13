import { CalendarDays } from 'lucide-react'
import { useMemo, useRef } from 'react'

import { cn } from '@/lib/utils'

type DatePickerProps = {
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

const toDateInputValue = (value: string | undefined) => value ?? ''

export const DatePicker = ({
  value,
  onChange,
  placeholder,
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
  const inputRef = useRef<HTMLInputElement | null>(null)
  const disabledDateSet = useMemo(() => new Set(disabledDates), [disabledDates])

  const handleChange = (nextValue: string) => {
    if (!nextValue) {
      onChange?.('')
      return
    }

    if (disabledDateSet.has(nextValue) || isDateDisabled?.(nextValue)) {
      inputRef.current?.blur()
      if (inputRef.current) {
        inputRef.current.value = toDateInputValue(value)
      }
      return
    }

    onChange?.(nextValue)
  }

  const handleOpenPicker = () => {
    if (disabled) return

    inputRef.current?.focus()
    inputRef.current?.showPicker?.()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <input
        ref={inputRef}
        type="date"
        id={id}
        name={name}
        value={toDateInputValue(value)}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => handleChange(event.target.value)}
        className={cn(
          'h-13 w-full rounded-[20px] border border-neutral-300 bg-white px-4 pr-12 font-paragraph-md text-neutral-800 outline-none transition-colors focus-visible:border-primary-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100',
          '[-webkit-calendar-picker-indicator:opacity-0]',
          '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer',
          inputClassName,
        )}
      />
      <button
        type="button"
        onClick={handleOpenPicker}
        disabled={disabled}
        aria-label="選擇日期"
        className={cn(
          'absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center text-neutral-500 disabled:pointer-events-none disabled:text-neutral-300',
          iconClassName,
        )}
      >
        <CalendarDays className="size-5" strokeWidth={2} />
      </button>
    </div>
  )
}
