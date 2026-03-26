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
        'flex h-16 w-full items-center justify-between bg-white px-4 py-[10.5px]',
        className,
      )}
    >
      <DaySwitch />
      <OccasionSelect />
    </div>
  )
}
