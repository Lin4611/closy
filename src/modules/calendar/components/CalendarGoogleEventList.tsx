import type { CalendarGoogleEvent } from '@/modules/calendar/types'

export const CalendarGoogleEventList = ({ events }: { events: CalendarGoogleEvent[] }) => {
  return (
    <div className="space-y-3 pt-3">
      {events.map((event) => (
        <div key={event.id} className="bg-primary-200 flex items-center rounded-[16px] px-4 py-3">
          <span className="h-8.75 w-0.75 rounded-full bg-neutral-300" />
          <div className="flex flex-col px-2.5">
            <p className="font-label-xl text-neutral-900">{event.title}</p>
            <p className="font-paragraph-sm text-primary-500">
              {event.startTime} - {event.endTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
