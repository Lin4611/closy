import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defaultOccasion as fallbackOccasion } from '@/modules/common/types/occasion'
import { useAppSelector } from '@/store/hooks'

import { occasionOptions } from '../data/occasionOptions'
import type { OccasionOption } from '../data/occasionOptions'

type OccasionSelectProps = {
  options?: OccasionOption[]
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  placeholder?: string
}

export const OccasionSelect = ({
  options = occasionOptions,
  value,
  onValueChange,
  disabled,
  placeholder = '場合',
}: OccasionSelectProps) => {
  const defaultOccasion = useAppSelector(
    (state) => state.user.user?.preferences.occasions ?? fallbackOccasion,
  )
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="font-paragraph-sm h-10 min-w-20 rounded-[20px] border-none bg-neutral-100 px-4 py-2 text-neutral-500">
        <SelectValue placeholder={placeholder}>
          {options.find((o) => o.value === value)?.label ?? placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="font-paragraph-sm rounded-[16px] bg-white p-2 text-neutral-500 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="h-9 rounded-[8px] border border-white px-2 data-[state=checked]:bg-neutral-300 data-[state=checked]:text-neutral-800"
          >
            {option.label}
            {option.value === defaultOccasion ? '（預設）' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
