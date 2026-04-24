import type { Occasion } from '@/modules/common/types/occasion'

export type CalendarApiOccasion = Occasion

export type CalendarApiOutfitItem = {
  cloudImgUrl: string
  name: string
  brand: string
  category: string
}

export type CalendarApiOutfitPreview = {
  _id?: string | null
  outfitImgUrl: string
  occasion: CalendarApiOccasion
  selectedItems: CalendarApiOutfitItem[]
  createdAt: string
  createdDateSimply?: string
}

export type CalendarApiEntry = {
  _id: string
  userId: string
  scheduleDate: string
  calendarEventOccasion: CalendarApiOccasion
  createdAt: string
  updatedAt: string
  outfitId?: string | null
  outfit?: CalendarApiOutfitPreview | null
}

export type GetCalendarListResponseData = CalendarApiEntry[]

export type CreateCalendarEntryRequest = {
  scheduleDate: string
  calendarEventOccasion: CalendarApiOccasion
  outfitId?: string
}

export type CreateCalendarEntryResponseData = Record<string, never>

export type UpdateCalendarEntryRequest = Partial<CreateCalendarEntryRequest>

export type UpdateCalendarEntryResponseData = Record<string, never>

export type DeleteCalendarEntryResponseData = Record<string, never>
