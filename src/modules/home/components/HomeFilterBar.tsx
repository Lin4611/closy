import { DaySwitch } from './DaySwitch'
import { OccasionSelect } from './OccasionSelect'

export const HomeFilterBar = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between bg-white px-4 py-[14.5px]">
      <DaySwitch />
      <OccasionSelect />
    </div>
  )
}
