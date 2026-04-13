import type { CalendarEntry } from '@/modules/calendar/types'

export const mockCalendarEntries: CalendarEntry[] = [
  {
    id: 'calendar-google-2026-03-10',
    date: '2026-03-10',
    occasionKey: 'businessCasual',
    selectedOutfitId: '1',
    sourceType: 'google',
    googleEventId: 'google-event-2026-03-10',
    createdAt: 1773052800000,
    updatedAt: 1773052800000,
  },
  {
    id: 'calendar-google-2026-03-15',
    date: '2026-03-15',
    occasionKey: 'professional',
    selectedOutfitId: null,
    sourceType: 'google',
    googleEventId: 'google-event-2026-03-15',
    createdAt: 1773484800000,
    updatedAt: 1773484800000,
  },
  {
    id: 'calendar-local-2026-03-18',
    date: '2026-03-18',
    occasionKey: 'socialGathering',
    selectedOutfitId: '2',
    sourceType: 'local',
    googleEventId: null,
    createdAt: 1773744000000,
    updatedAt: 1773744000000,
  },
  {
    id: 'calendar-google-2026-03-20',
    date: '2026-03-20',
    occasionKey: 'socialGathering',
    selectedOutfitId: null,
    sourceType: 'google',
    googleEventId: 'google-event-2026-03-20',
    createdAt: 1773916800000,
    updatedAt: 1773916800000,
  },
]
