import type { CalendarGoogleEvent } from '@/modules/calendar/types'

export const CalendarGoogleEventList = ({ events }: { events: CalendarGoogleEvent[] }) => {
  return (
    <div className="space-y-3 pt-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-[16px] bg-[#F2F5F9] px-4 py-3">
          <p className="font-label-md text-neutral-900">{event.title}</p>
          <p className="pt-1 font-paragraph-sm text-neutral-500">
            {event.startTime} - {event.endTime}
          </p>
        </div>
      ))}
    </div>
  )
}
