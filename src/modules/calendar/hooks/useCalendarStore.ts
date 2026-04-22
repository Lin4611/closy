import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import {
  CALENDAR_ENTRIES_STORAGE_KEY,
  CALENDAR_ENTRIES_UPDATED_EVENT,
} from '@/modules/calendar/constants/storage'
import type { CalendarEntriesBaseline, CalendarEntry, CalendarEntryInput, CalendarServerEntry } from '@/modules/calendar/types'
import { sortCalendarEntriesByDateDesc } from '@/modules/calendar/utils/calendarRules'

const calendarOccasions = ['socialGathering', 'campusCasual', 'businessCasual', 'professional'] as const
const calendarSources = ['local', 'google'] as const
const EMPTY_CALENDAR_ENTRIES: CalendarEntry[] = []

let cachedEntriesSnapshot: CalendarEntry[] = EMPTY_CALENDAR_ENTRIES
let cachedEntriesStorageValue: string | null | undefined = undefined
let cachedEntriesRevision = 0

const sanitizeNullableString = (value: unknown) => {
  if (typeof value !== 'string') return null
  return value.length > 0 ? value : null
}

const sanitizeServerTimestamp = (value: unknown) => {
  if (typeof value !== 'string') return null

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}

const sanitizeServerOutfitPreview = (value: unknown): CalendarEntry['serverOutfitPreview'] => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const imageUrl = typeof candidate.imageUrl === 'string' ? candidate.imageUrl : null
  const occasionKey = calendarOccasions.includes(candidate.occasionKey as (typeof calendarOccasions)[number])
    ? (candidate.occasionKey as CalendarEntry['occasionKey'])
    : null
  const savedAt = sanitizeNullableString(candidate.savedAt)
  const items = Array.isArray(candidate.items)
    ? candidate.items
        .map((item) => {
          if (typeof item !== 'object' || item === null) {
            return null
          }

          const entry = item as Record<string, unknown>

          if (
            typeof entry.imageUrl !== 'string' ||
            typeof entry.name !== 'string' ||
            typeof entry.brand !== 'string' ||
            typeof entry.category !== 'string'
          ) {
            return null
          }

          return {
            imageUrl: entry.imageUrl,
            name: entry.name,
            brand: entry.brand,
            category: entry.category,
          }
        })
        .filter((item): item is NonNullable<CalendarEntry['serverOutfitPreview']>['items'][number] => item !== null)
    : null

  if (!imageUrl || !occasionKey || !items) {
    return null
  }

  return {
    imageUrl,
    occasionKey,
    savedAt,
    items,
  }
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
    serverId: sanitizeNullableString(candidate.serverId),
    date,
    occasionKey,
    selectedOutfitId: sanitizeNullableString(candidate.selectedOutfitId),
    sourceType,
    googleEventId: sanitizeNullableString(candidate.googleEventId),
    createdAt:
      typeof candidate.createdAt === 'number' && Number.isFinite(candidate.createdAt)
        ? candidate.createdAt
        : 0,
    updatedAt:
      typeof candidate.updatedAt === 'number' && Number.isFinite(candidate.updatedAt)
        ? candidate.updatedAt
        : 0,
    serverOutfitPreview: sanitizeServerOutfitPreview(candidate.serverOutfitPreview),
    serverCreatedAt: sanitizeServerTimestamp(candidate.serverCreatedAt),
    serverUpdatedAt: sanitizeServerTimestamp(candidate.serverUpdatedAt),
  }
}

const normalizeEntry = (entry: CalendarEntry): CalendarEntry => ({
  ...entry,
  serverId: entry.serverId ?? null,
  selectedOutfitId: entry.selectedOutfitId ?? null,
  googleEventId: entry.googleEventId ?? null,
  serverOutfitPreview: entry.serverOutfitPreview ?? null,
  serverCreatedAt: entry.serverCreatedAt ?? null,
  serverUpdatedAt: entry.serverUpdatedAt ?? null,
})

const safeParseEntries = (value: string | null) => {
  if (!value) return EMPTY_CALENDAR_ENTRIES

  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) {
      return EMPTY_CALENDAR_ENTRIES
    }

    const sanitizedEntries = parsed
      .map((entry) => sanitizeEntry(entry))
      .filter((entry): entry is CalendarEntry => entry !== null)

    return sortCalendarEntriesByDateDesc(sanitizedEntries)
  } catch {
    return EMPTY_CALENDAR_ENTRIES
  }
}

const getCalendarEntrySignature = (entry: CalendarEntry | null) => {
  if (!entry) {
    return ''
  }

  const previewSignature = entry.serverOutfitPreview
    ? [
        entry.serverOutfitPreview.imageUrl,
        entry.serverOutfitPreview.occasionKey,
        entry.serverOutfitPreview.savedAt ?? '',
      ].join('~')
    : ''

  return [
    entry.id,
    entry.serverId ?? '',
    entry.updatedAt,
    entry.occasionKey,
    entry.selectedOutfitId ?? '',
    previewSignature,
  ].join(':')
}

const getCalendarEntriesSignature = (entries: CalendarEntry[]) => {
  return entries.map((entry) => getCalendarEntrySignature(entry)).join('|')
}

const getStoredEntriesSnapshot = () => {
  if (typeof window === 'undefined') {
    return EMPTY_CALENDAR_ENTRIES
  }

  const storageValue = window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY)

  if (storageValue === cachedEntriesStorageValue) {
    return cachedEntriesSnapshot
  }

  cachedEntriesStorageValue = storageValue
  cachedEntriesSnapshot = safeParseEntries(storageValue)

  return cachedEntriesSnapshot
}

const getServerStoredEntriesSnapshot = (): CalendarEntry[] => EMPTY_CALENDAR_ENTRIES

const getWritableStoredEntriesBase = (): CalendarEntry[] => {
  if (typeof window === 'undefined') {
    return EMPTY_CALENDAR_ENTRIES
  }

  const storageValue = window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY)

  if (!storageValue) {
    return EMPTY_CALENDAR_ENTRIES
  }

  return safeParseEntries(storageValue)
}

const notifyCalendarEntriesChanged = () => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(CALENDAR_ENTRIES_UPDATED_EVENT))
}

const writeStoredEntries = (entries: CalendarEntry[]) => {
  if (typeof window === 'undefined') return

  const normalizedEntries = sortCalendarEntriesByDateDesc(entries.map(normalizeEntry))
  const nextStorageValue = JSON.stringify(normalizedEntries)
  const currentStorageValue = window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY)

  if (nextStorageValue === currentStorageValue) {
    cachedEntriesStorageValue = currentStorageValue
    cachedEntriesSnapshot = normalizedEntries
    return
  }

  cachedEntriesStorageValue = nextStorageValue
  cachedEntriesSnapshot = normalizedEntries
  cachedEntriesRevision += 1

  window.localStorage.setItem(CALENDAR_ENTRIES_STORAGE_KEY, nextStorageValue)
  notifyCalendarEntriesChanged()
}

const clearStoredEntries = () => {
  if (typeof window === 'undefined') return

  const currentStorageValue = window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY)

  if (currentStorageValue === null) {
    cachedEntriesStorageValue = null
    cachedEntriesSnapshot = EMPTY_CALENDAR_ENTRIES
    return
  }

  cachedEntriesStorageValue = null
  cachedEntriesSnapshot = EMPTY_CALENDAR_ENTRIES
  cachedEntriesRevision += 1

  window.localStorage.removeItem(CALENDAR_ENTRIES_STORAGE_KEY)
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

const useCalendarServerTakeover = (hydrateFromServer: () => void) => {
  const hasHydratedFromServerRef = useRef(false)

  useEffect(() => {
    if (hasHydratedFromServerRef.current) {
      return
    }

    hasHydratedFromServerRef.current = true
    hydrateFromServer()
  }, [hydrateFromServer])
}

const buildCalendarEntry = (input: CalendarEntryInput): CalendarEntry => {
  const timestamp = Date.now()

  return normalizeEntry({
    id: input.id ?? input.serverId ?? `calendar-${input.sourceType}-${input.date}`,
    serverId: input.serverId ?? null,
    date: input.date,
    occasionKey: input.occasionKey,
    selectedOutfitId: input.selectedOutfitId ?? null,
    sourceType: input.sourceType,
    googleEventId: input.googleEventId ?? null,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
    serverOutfitPreview: input.serverOutfitPreview ?? null,
    serverCreatedAt: input.serverCreatedAt ?? null,
    serverUpdatedAt: input.serverUpdatedAt ?? null,
  })
}

export const useCalendarStore = () => {
  const entries = useSyncExternalStore(
    subscribeCalendarEntries,
    getStoredEntriesSnapshot,
    getServerStoredEntriesSnapshot,
  )
  const isReady = typeof window !== 'undefined'
  const entriesRevision = cachedEntriesRevision

  const hydrateEntriesFromServer = useCallback((serverEntries: CalendarEntriesBaseline) => {
    writeStoredEntries(serverEntries)

    return serverEntries.map(normalizeEntry)
  }, [])

  const syncEntryFromServer = useCallback((entry: CalendarServerEntry) => {
    const normalizedEntry = normalizeEntry(entry)
    const currentEntries = getWritableStoredEntriesBase()
    const existingIndex = currentEntries.findIndex((storedEntry) => {
      const matchesId = storedEntry.id === normalizedEntry.id
      const matchesServerId =
        normalizedEntry.serverId !== null &&
        storedEntry.serverId !== null &&
        storedEntry.serverId === normalizedEntry.serverId

      return matchesId || matchesServerId
    })

    if (existingIndex === -1) {
      writeStoredEntries([normalizedEntry, ...currentEntries])
      return normalizedEntry
    }

    const nextEntries = [...currentEntries]
    nextEntries[existingIndex] = normalizedEntry
    writeStoredEntries(nextEntries)

    return normalizedEntry
  }, [])

  const addEntry = useCallback((input: CalendarEntryInput) => {
    const nextEntry = buildCalendarEntry(input)
    const nextEntries = getStoredEntriesSnapshot().filter(
      (entry) =>
        entry.id !== nextEntry.id &&
        entry.date !== nextEntry.date &&
        (!nextEntry.serverId || entry.serverId !== nextEntry.serverId),
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
      serverId: input.serverId ?? previousEntry.serverId,
      createdAt: previousEntry.createdAt,
      updatedAt: Date.now(),
      serverOutfitPreview: input.serverOutfitPreview ?? previousEntry.serverOutfitPreview,
      serverCreatedAt: input.serverCreatedAt ?? previousEntry.serverCreatedAt,
      serverUpdatedAt: input.serverUpdatedAt ?? previousEntry.serverUpdatedAt,
    })

    const nextEntries = getStoredEntriesSnapshot().filter(
      (entry) =>
        entry.id !== entryId &&
        entry.date !== updatedEntry.date &&
        (!updatedEntry.serverId || entry.serverId !== updatedEntry.serverId),
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

  const getEntryByServerId = useCallback((serverId: string) => {
    return entries.find((entry) => entry.serverId === serverId) ?? null
  }, [entries])

  const getEntryByDate = useCallback((date: string) => {
    return entries.find((entry) => entry.date === date) ?? null
  }, [entries])

  const replaceEntries = useCallback((nextEntries: CalendarEntry[]) => {
    writeStoredEntries(nextEntries)

    return sortCalendarEntriesByDateDesc(nextEntries)
  }, [])

  const resetCalendar = useCallback(() => {
    clearStoredEntries()
  }, [])

  return useMemo(
    () => ({
      isReady,
      entries,
      entriesRevision,
      hydrateEntriesFromServer,
      syncEntryFromServer,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntryById,
      getEntryByServerId,
      getEntryByDate,
      replaceEntries,
      resetCalendar,
    }),
    [
      addEntry,
      deleteEntry,
      entries,
      entriesRevision,
      getEntryByDate,
      getEntryById,
      getEntryByServerId,
      hydrateEntriesFromServer,
      isReady,
      replaceEntries,
      resetCalendar,
      syncEntryFromServer,
      updateEntry,
    ],
  )
}

export const useCalendarServerEntries = (initialEntries: CalendarEntriesBaseline) => {
  const { entries, entriesRevision, hydrateEntriesFromServer, isReady } = useCalendarStore()
  const [initialEntriesRevision] = useState(entriesRevision)
  const initialEntriesSignature = useMemo(() => getCalendarEntriesSignature(initialEntries), [initialEntries])
  const currentEntriesSignature = useMemo(() => getCalendarEntriesSignature(entries), [entries])

  useCalendarServerTakeover(
    useCallback(() => {
      if (!isReady) {
        return
      }

      hydrateEntriesFromServer(initialEntries)
    }, [hydrateEntriesFromServer, initialEntries, isReady]),
  )

  const hasClientEntriesTakenOver =
    entriesRevision !== initialEntriesRevision || currentEntriesSignature === initialEntriesSignature

  return !isReady || !hasClientEntriesTakenOver ? initialEntries : entries
}
