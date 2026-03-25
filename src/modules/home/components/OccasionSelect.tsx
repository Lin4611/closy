import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { occasionOptions } from '../data/OccasionOptions'
import type { OccasionOption } from '../data/OccasionOptions'

type OccasionSelectProps = {
  options?: OccasionOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}
export const OccasionSelect = ({
  options = occasionOptions,
  value,
  onValueChange,
  placeholder = '場合',
}: OccasionSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="font-paragraph-sm h-9 min-w-20 rounded-[20px] border-none bg-neutral-100 px-4 py-2 text-neutral-500">
        <SelectValue placeholder={placeholder} />
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
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
