import type {
  CalendarServerEntry,
  CalendarServerOutfitPreview,
  CalendarServerOutfitPreviewItem,
} from '@/modules/calendar/types'
import { toCalendarDashedDate, toCalendarSlashedDate } from '@/modules/calendar/utils/calendarDate'

import type {
  CalendarApiEntry,
  CalendarApiOutfitItem,
  CalendarApiOutfitPreview,
  CreateCalendarEntryRequest,
  DeleteCalendarEntryResponseData,
  GetCalendarListResponseData,
  UpdateCalendarEntryRequest,
  UpdateCalendarEntryResponseData,
} from './types'

const mapCalendarApiOutfitItemToPreviewItem = (
  item: CalendarApiOutfitItem,
): CalendarServerOutfitPreviewItem => ({
  imageUrl: item.cloudImgUrl,
  name: item.name,
  brand: item.brand,
  category: item.category,
})

const mapCalendarApiOutfitPreview = (
  outfit: CalendarApiOutfitPreview | null | undefined,
): CalendarServerOutfitPreview | null => {
  if (!outfit) {
    return null
  }

  return {
    imageUrl: outfit.outfitImgUrl,
    occasionKey: outfit.occasion,
    savedAt: outfit.createdDateSimply ? toCalendarDashedDate(outfit.createdDateSimply) : null,
    items: outfit.selectedItems.map(mapCalendarApiOutfitItemToPreviewItem),
  }
}

export const mapCalendarApiEntryToCalendarServerEntry = (entry: CalendarApiEntry): CalendarServerEntry => {
  const createdAtTime = new Date(entry.createdAt).getTime()
  const updatedAtTime = new Date(entry.updatedAt).getTime()

  return {
    id: entry._id,
    serverId: entry._id,
    date: toCalendarDashedDate(entry.scheduleDate),
    occasionKey: entry.calendarEventOccasion,
    selectedOutfitId: entry.outfitId ?? null,
    sourceType: 'local',
    googleEventId: null,
    createdAt: Number.isFinite(createdAtTime) ? createdAtTime : 0,
    updatedAt: Number.isFinite(updatedAtTime) ? updatedAtTime : 0,
    serverOutfitPreview: mapCalendarApiOutfitPreview(entry.outfit),
    serverCreatedAt: entry.createdAt,
    serverUpdatedAt: entry.updatedAt,
  }
}

export const mapGetCalendarListResponseToCalendarEntries = (
  response: GetCalendarListResponseData,
): CalendarServerEntry[] => response.map(mapCalendarApiEntryToCalendarServerEntry)

export const mapDeleteCalendarEntryResponseToSuccess = (
  _response: DeleteCalendarEntryResponseData,
): true => true

export const mapUpdateCalendarEntryResponseToSuccess = (
  _response: UpdateCalendarEntryResponseData,
): true => true

export const buildCreateCalendarEntryRequest = ({
  date,
  occasionKey,
  selectedOutfitId,
}: {
  date: string
  occasionKey: CalendarServerEntry['occasionKey']
  selectedOutfitId?: string | null
}): CreateCalendarEntryRequest => {
  const request: CreateCalendarEntryRequest = {
    scheduleDate: toCalendarSlashedDate(date),
    calendarEventOccasion: occasionKey,
  }

  if (selectedOutfitId) {
    request.outfitId = selectedOutfitId
  }

  return request
}

const createInvalidCalendarUpdateRequestError = (message: string) => {
  const error = new Error(message)
  error.name = 'InvalidCalendarUpdateRequestError'
  return error
}

export const buildUpdateCalendarEntryRequest = ({
  date,
  occasionKey,
  selectedOutfitId,
}: {
  date?: string
  occasionKey?: CalendarServerEntry['occasionKey']
  selectedOutfitId?: string | null
}): UpdateCalendarEntryRequest => {
  const request: UpdateCalendarEntryRequest = {}

  if (date !== undefined) {
    request.scheduleDate = toCalendarSlashedDate(date)
  }

  if (occasionKey !== undefined) {
    request.calendarEventOccasion = occasionKey
  }

  if (selectedOutfitId !== undefined) {
    if (selectedOutfitId === null) {
      throw createInvalidCalendarUpdateRequestError('selectedOutfitId 若要清除已選穿搭，請明確傳入空字串')
    }

    request.outfitId = selectedOutfitId
  }

  if (Object.keys(request).length === 0) {
    throw createInvalidCalendarUpdateRequestError('請提供至少一個可更新的欄位')
  }

  return request
}
