import { CalendarClock } from 'lucide-react'

import { AddCalendarButton } from './AddCalendarButton'

export const CalendarSummaryCard = () => {
  return (
    <section className="flex w-full max-w-[336px] items-center justify-between rounded-[16px] bg-white px-4 py-4 shadow-[0px_4px_12px_0px_#18181B1F]">
      <CalendarClock size={24} strokeWidth={1.5} />
      <div className="flex w-full max-w-[195px] flex-col items-start">
        <span className="font-paragraph-xs text-neutral-500">00:00 AM/PM</span>
        <p className="font-label-sm break-all text-neutral-800">尚未新增行事曆</p>
      </div>
      <AddCalendarButton onClick={() => {}} />
    </section>
  )
}
