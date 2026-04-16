import type {
  CalendarEntry,
  CalendarEntryCapabilities,
  CalendarGoogleEvent,
} from '@/modules/calendar/types'

export const isGoogleCalendarEntry = (entry: CalendarEntry) => entry.sourceType === 'google'

export const hasSelectedOutfit = (entry: Pick<CalendarEntry, 'selectedOutfitId'>) => {
  return typeof entry.selectedOutfitId === 'string' && entry.selectedOutfitId.length > 0
}

export const shouldResetSelectedOutfit = (
  previousOccasionKey: CalendarEntry['occasionKey'] | null,
  nextOccasionKey: CalendarEntry['occasionKey'] | null
) => {
  if (!previousOccasionKey || !nextOccasionKey) return false

  return previousOccasionKey !== nextOccasionKey
}

export const canDeleteCalendarEntry = (entry: CalendarEntry) => entry.sourceType === 'local'

export const canEditCalendarDate = (entry: CalendarEntry) => entry.sourceType === 'local'

export const getCalendarEntryCapabilities = (entry: CalendarEntry): CalendarEntryCapabilities => {
  const isGoogleEntry = isGoogleCalendarEntry(entry)

  return {
    canExpand: isGoogleEntry,
    canDelete: !isGoogleEntry,
    canEditDate: !isGoogleEntry,
    canEditOccasion: true,
    canSelectOutfit: true,
  }
}

export const getCalendarEventsByDate = (date: string, events: CalendarGoogleEvent[]) => {
  return events.filter((event) => event.date === date)
}

export const isCalendarDateBlocked = ({
  date,
  entries,
  googleEvents,
  currentEntryId,
}: {
  date: string
  entries: CalendarEntry[]
  googleEvents: CalendarGoogleEvent[]
  currentEntryId?: string | null
}) => {
  const hasEntryOnDate = entries.some((entry) => {
    if (currentEntryId && entry.id === currentEntryId) {
      return false
    }

    return entry.date === date
  })

  if (hasEntryOnDate) {
    return true
  }

  return googleEvents.some((event) => {
    if (!currentEntryId) {
      return event.date === date
    }

    const matchingEntry = entries.find((entry) => entry.id === currentEntryId)

    if (matchingEntry?.googleEventId && matchingEntry.date === date) {
      return false
    }

    return event.date === date
  })
}

export const sortCalendarEntriesByDateDesc = (entries: CalendarEntry[]) => {
  return [...entries].sort((left, right) => right.date.localeCompare(left.date))
}

const getTodayDateKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const isCalendarEntryExpired = (entry: Pick<CalendarEntry, 'date'>) => {
  return entry.date < getTodayDateKey()
}

export const sortCalendarEntriesForHome = (entries: CalendarEntry[]) => {
  const upcomingEntries = entries
    .filter((entry) => !isCalendarEntryExpired(entry))
    .sort((left, right) => left.date.localeCompare(right.date))

  const expiredEntries = entries
    .filter((entry) => isCalendarEntryExpired(entry))
    .sort((left, right) => right.date.localeCompare(left.date))

  return [...upcomingEntries, ...expiredEntries]
}
