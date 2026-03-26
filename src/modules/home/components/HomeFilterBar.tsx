import { cn } from '@/lib/utils'

import { DaySwitch } from './DaySwitch'
import { OccasionSelect } from './OccasionSelect'

type HomeFilterBarProps = {
  className?: string
}
export const HomeFilterBar = ({ className }: HomeFilterBarProps) => {
  return (
    <div
      className={cn(
        'flex h-16 items-center justify-between bg-white px-4 py-[10.5px] shadow-[0px_1px_3px_0px_#18181B0D]',
        className,
      )}
    >
      <DaySwitch />
      <OccasionSelect />
    </div>
  )
}
