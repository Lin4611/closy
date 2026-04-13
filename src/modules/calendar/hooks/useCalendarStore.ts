import { useCallback, useMemo, useSyncExternalStore } from 'react'

import {
  CALENDAR_ENTRIES_STORAGE_KEY,
  CALENDAR_ENTRIES_UPDATED_EVENT,
} from '@/modules/calendar/constants/storage'
import { mockCalendarEntries } from '@/modules/calendar/data/mockCalendarEntries'
import type { CalendarEntry, CalendarEntryInput } from '@/modules/calendar/types'
import { sortCalendarEntriesByDateDesc } from '@/modules/calendar/utils/calendarRules'

const calendarOccasions = ['socialGathering', 'campusCasual', 'businessCasual', 'professional'] as const
const calendarSources = ['local', 'google'] as const

let cachedEntriesSnapshot: CalendarEntry[] = mockCalendarEntries
let cachedEntriesStorageValue: string | null | undefined = undefined

const sanitizeNullableString = (value: unknown) => {
  if (typeof value !== 'string') return null
  return value.length > 0 ? value : null
}

const sanitizeEntry = (value: unknown): CalendarEntry | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const id = typeof candidate.id === 'string' ? candidate.id : null
  const date = typeof candidate.date === 'string' ? candidate.date : null
  const occasionKey = calendarOccasions.includes(candidate.occasionKey as (typeof calendarOccasions)[number])
    ? (candidate.occasionKey as CalendarEntry['occasionKey'])
    : null
  const sourceType = calendarSources.includes(candidate.sourceType as (typeof calendarSources)[number])
    ? (candidate.sourceType as CalendarEntry['sourceType'])
    : null

  if (!id || !date || !occasionKey || !sourceType) {
    return null
  }

  return {
    id,
    date,
    occasionKey,
    selectedOutfitId: sanitizeNullableString(candidate.selectedOutfitId),
    sourceType,
    googleEventId: sanitizeNullableString(candidate.googleEventId),
    createdAt:
      typeof candidate.createdAt === 'number' && Number.isFinite(candidate.createdAt)
        ? candidate.createdAt
        : Date.now(),
    updatedAt:
      typeof candidate.updatedAt === 'number' && Number.isFinite(candidate.updatedAt)
        ? candidate.updatedAt
        : Date.now(),
  }
}

const safeParseEntries = (value: string | null) => {
  if (!value) return mockCalendarEntries

  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) {
      return mockCalendarEntries
    }

    const sanitizedEntries = parsed
      .map((entry) => sanitizeEntry(entry))
      .filter((entry): entry is CalendarEntry => entry !== null)

    return sortCalendarEntriesByDateDesc(sanitizedEntries)
  } catch {
    return mockCalendarEntries
  }
}

const getStoredEntriesSnapshot = () => {
  if (typeof window === 'undefined') {
    return mockCalendarEntries
  }

  const storageValue = window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY)

  if (storageValue === cachedEntriesStorageValue) {
    return cachedEntriesSnapshot
  }

  cachedEntriesStorageValue = storageValue
  cachedEntriesSnapshot = safeParseEntries(storageValue)

  return cachedEntriesSnapshot
}

const notifyCalendarEntriesChanged = () => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(CALENDAR_ENTRIES_UPDATED_EVENT))
}

const writeStoredEntries = (entries: CalendarEntry[]) => {
  if (typeof window === 'undefined') return

  const sortedEntries = sortCalendarEntriesByDateDesc(entries)
  const nextStorageValue = JSON.stringify(sortedEntries)

  cachedEntriesStorageValue = nextStorageValue
  cachedEntriesSnapshot = sortedEntries

  window.localStorage.setItem(CALENDAR_ENTRIES_STORAGE_KEY, nextStorageValue)
  notifyCalendarEntriesChanged()
}

const subscribeCalendarEntries = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== CALENDAR_ENTRIES_STORAGE_KEY) return
    onStoreChange()
  }

  const handleEntriesUpdated = () => {
    onStoreChange()
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(CALENDAR_ENTRIES_UPDATED_EVENT, handleEntriesUpdated)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(CALENDAR_ENTRIES_UPDATED_EVENT, handleEntriesUpdated)
  }
}

const buildCalendarEntry = (input: CalendarEntryInput): CalendarEntry => {
  const timestamp = Date.now()

  return {
    id: input.id ?? `calendar-${input.sourceType}-${input.date}`,
    date: input.date,
    occasionKey: input.occasionKey,
    selectedOutfitId: input.selectedOutfitId ?? null,
    sourceType: input.sourceType,
    googleEventId: input.googleEventId ?? null,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  }
}

export const useCalendarStore = () => {
  const entries = useSyncExternalStore(
    subscribeCalendarEntries,
    getStoredEntriesSnapshot,
    () => mockCalendarEntries
  )
  const isReady = typeof window !== 'undefined'

  const addEntry = useCallback((input: CalendarEntryInput) => {
    const nextEntry = buildCalendarEntry(input)
    const nextEntries = getStoredEntriesSnapshot().filter(
      (entry) => entry.id !== nextEntry.id && entry.date !== nextEntry.date
    )

    writeStoredEntries([nextEntry, ...nextEntries])

    return nextEntry
  }, [])

  const updateEntry = useCallback((entryId: string, input: Omit<CalendarEntryInput, 'id'>) => {
    const previousEntry = getStoredEntriesSnapshot().find((entry) => entry.id === entryId)

    if (!previousEntry) {
      return null
    }

    const updatedEntry = buildCalendarEntry({
      ...input,
      id: previousEntry.id,
      createdAt: previousEntry.createdAt,
      updatedAt: Date.now(),
    })

    const nextEntries = getStoredEntriesSnapshot().filter(
      (entry) => entry.id !== entryId && entry.date !== updatedEntry.date
    )

    writeStoredEntries([updatedEntry, ...nextEntries])

    return updatedEntry
  }, [])

  const deleteEntry = useCallback((entryId: string) => {
    writeStoredEntries(getStoredEntriesSnapshot().filter((entry) => entry.id !== entryId))
  }, [])

  const getEntryById = useCallback((entryId: string) => {
    return entries.find((entry) => entry.id === entryId) ?? null
  }, [entries])

  const getEntryByDate = useCallback((date: string) => {
    return entries.find((entry) => entry.date === date) ?? null
  }, [entries])

  const replaceEntries = useCallback((nextEntries: CalendarEntry[]) => {
    writeStoredEntries(nextEntries)

    return sortCalendarEntriesByDateDesc(nextEntries)
  }, [])

  const resetCalendar = useCallback(() => {
    writeStoredEntries(mockCalendarEntries)
  }, [])

  return useMemo(
    () => ({
      isReady,
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntryById,
      getEntryByDate,
      replaceEntries,
      resetCalendar,
    }),
    [
      addEntry,
      deleteEntry,
      entries,
      getEntryByDate,
      getEntryById,
      isReady,
      replaceEntries,
      resetCalendar,
      updateEntry,
    ]
  )
}
