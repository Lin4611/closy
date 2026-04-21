import { cn } from '@/lib/utils'
import { type Occasion } from '@/modules/common/types/occasion'

import { DaySwitch } from './DaySwitch'
import { OccasionSelect } from './OccasionSelect'
type HomeFilterBarProps = {
  className?: string
  selectedOccasion: Occasion
  onDayChange?: (day: 'today' | 'tomorrow') => void
  onOccasionChange?: (occasion: Occasion) => void
}

export const HomeFilterBar = ({
  className,
  selectedOccasion,
  onDayChange,
  onOccasionChange,
}: HomeFilterBarProps) => {
  return (
    <div
      className={cn(
        'flex h-16 items-center justify-between bg-white px-4 py-[10.5px] shadow-[0px_1px_3px_0px_#18181B0D]',
        className,
      )}
    >
      <DaySwitch onDayChange={onDayChange} />
      <div id="occasion-trigger">
        <OccasionSelect
          value={selectedOccasion}
          onValueChange={(value) => onOccasionChange?.(value as Occasion)}
        />
      </div>
    </div>
  )
}
