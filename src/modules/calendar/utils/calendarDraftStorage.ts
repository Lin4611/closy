import {
  CALENDAR_FORM_DRAFT_STORAGE_KEY,
  CALENDAR_SELECTED_OUTFIT_DRAFT_STORAGE_KEY,
} from '@/modules/calendar/constants/storage'
import type { CalendarFormDraft, CalendarSelectedOutfitDraft, CalendarFormMode } from '@/modules/calendar/types'
import type { Occasion } from '@/modules/common/types/occasion'

const calendarFormModes: CalendarFormMode[] = ['new', 'edit']
const occasions: Occasion[] = ['socialGathering', 'campusCasual', 'businessCasual', 'professional']

const isClient = () => typeof window !== 'undefined'

const safeParseJson = <T>(value: string | null): T | null => {
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const sanitizeString = (value: unknown) => (typeof value === 'string' ? value : '')

const sanitizeNullableString = (value: unknown) => {
  if (typeof value !== 'string') return null
  return value.length > 0 ? value : null
}

const sanitizeOccasion = (value: unknown): Occasion | null => {
  if (typeof value !== 'string') return null
  return occasions.includes(value as Occasion) ? (value as Occasion) : null
}

const sanitizeReturnTo = (value: unknown) => {
  if (typeof value !== 'string' || !value.startsWith('/')) return null
  return value
}

const sanitizeCalendarFormDraft = (value: unknown): CalendarFormDraft | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const mode = calendarFormModes.includes(candidate.mode as CalendarFormMode)
    ? (candidate.mode as CalendarFormMode)
    : null

  if (!mode) {
    return null
  }

  return {
    mode,
    date: sanitizeString(candidate.date),
    occasionKey: sanitizeOccasion(candidate.occasionKey),
    selectedOutfitId: sanitizeNullableString(candidate.selectedOutfitId),
    sourceEntryId: sanitizeNullableString(candidate.sourceEntryId),
    returnTo: sanitizeReturnTo(candidate.returnTo),
  }
}

const sanitizeCalendarSelectedOutfitDraft = (value: unknown): CalendarSelectedOutfitDraft | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>

  return {
    selectedOutfitId: sanitizeNullableString(candidate.selectedOutfitId),
    returnTo: sanitizeReturnTo(candidate.returnTo),
    sourceEntryId: sanitizeNullableString(candidate.sourceEntryId),
    occasionKey: sanitizeOccasion(candidate.occasionKey),
    date: sanitizeString(candidate.date),
  }
}

export const getCalendarFormDraft = () => {
  if (!isClient()) return null

  return sanitizeCalendarFormDraft(
    safeParseJson(window.sessionStorage.getItem(CALENDAR_FORM_DRAFT_STORAGE_KEY))
  )
}

export const saveCalendarFormDraft = (draft: CalendarFormDraft) => {
  if (!isClient()) return

  window.sessionStorage.setItem(CALENDAR_FORM_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export const patchCalendarFormDraft = (partialDraft: Partial<CalendarFormDraft>) => {
  const currentDraft = getCalendarFormDraft()

  if (!currentDraft) {
    return
  }

  saveCalendarFormDraft({
    ...currentDraft,
    ...partialDraft,
    mode: partialDraft.mode ?? currentDraft.mode,
  })
}

export const clearCalendarFormDraft = () => {
  if (!isClient()) return

  window.sessionStorage.removeItem(CALENDAR_FORM_DRAFT_STORAGE_KEY)
}

export const getCalendarSelectedOutfitDraft = () => {
  if (!isClient()) return null

  return sanitizeCalendarSelectedOutfitDraft(
    safeParseJson(window.sessionStorage.getItem(CALENDAR_SELECTED_OUTFIT_DRAFT_STORAGE_KEY))
  )
}

export const saveCalendarSelectedOutfitDraft = (draft: CalendarSelectedOutfitDraft) => {
  if (!isClient()) return

  window.sessionStorage.setItem(CALENDAR_SELECTED_OUTFIT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export const clearCalendarSelectedOutfitDraft = () => {
  if (!isClient()) return

  window.sessionStorage.removeItem(CALENDAR_SELECTED_OUTFIT_DRAFT_STORAGE_KEY)
}

export const clearCalendarFlowDrafts = () => {
  clearCalendarFormDraft()
  clearCalendarSelectedOutfitDraft()
}
