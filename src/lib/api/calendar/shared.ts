import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import {
  buildCreateCalendarEntryRequest,
  buildUpdateCalendarEntryRequest,
  mapDeleteCalendarEntryResponseToSuccess,
  mapGetCalendarListResponseToCalendarEntries,
  mapUpdateCalendarEntryResponseToSuccess,
} from '@/modules/calendar/api/mappers'
import type {
  CreateCalendarEntryRequest,
  CreateCalendarEntryResponseData,
  DeleteCalendarEntryResponseData,
  GetCalendarListResponseData,
  UpdateCalendarEntryRequest,
  UpdateCalendarEntryResponseData,
} from '@/modules/calendar/api/types'
import type { CalendarEntriesBaseline, CalendarServerEntry } from '@/modules/calendar/types'
import { isCalendarDashedDate, isCalendarSlashedDate } from '@/modules/calendar/utils/calendarDate'
import type { Occasion } from '@/modules/common/types/occasion'

export type ErrorResponse = {
  message: string
}

const calendarOccasions: Occasion[] = ['socialGathering', 'campusCasual', 'businessCasual', 'professional']

export const getApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL

  if (!baseUrl) {
    throw new Error('缺少 API_BASE_URL 環境變數')
  }

  return baseUrl
}

export const getApiErrorResponse = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    }
  }

  return {
    statusCode: 500,
    message: fallbackMessage,
  }
}

export const getRouteIdParam = (value: string | string[] | undefined) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}

const isCalendarOccasion = (value: unknown): value is Occasion => {
  return typeof value === 'string' && calendarOccasions.includes(value as Occasion)
}

export const isCreateCalendarEntryRequest = (value: unknown): value is CreateCalendarEntryRequest => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  if (typeof candidate.scheduleDate !== 'string' || !isCalendarSlashedDate(candidate.scheduleDate)) {
    return false
  }

  if (!isCalendarOccasion(candidate.calendarEventOccasion)) {
    return false
  }

  if ('outfitId' in candidate && typeof candidate.outfitId !== 'string') {
    return false
  }

  return true
}

export const isUpdateCalendarEntryRequest = (value: unknown): value is UpdateCalendarEntryRequest => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  const hasAnySupportedField = ['scheduleDate', 'calendarEventOccasion', 'outfitId'].some((key) => key in candidate)

  if (!hasAnySupportedField) {
    return false
  }

  if ('scheduleDate' in candidate) {
    if (typeof candidate.scheduleDate !== 'string' || !isCalendarSlashedDate(candidate.scheduleDate)) {
      return false
    }
  }

  if ('calendarEventOccasion' in candidate) {
    if (!isCalendarOccasion(candidate.calendarEventOccasion)) {
      return false
    }
  }

  if ('outfitId' in candidate) {
    if (typeof candidate.outfitId !== 'string') {
      return false
    }
  }

  return true
}

export const fetchCalendarList = async (accessToken: string) => {
  return apiClient<ApiResponse<GetCalendarListResponseData>>({
    baseUrl: getApiBaseUrl(),
    endpoint: '/calendar',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const createCalendarEntry = async (accessToken: string, body: CreateCalendarEntryRequest) => {
  return apiClient<ApiResponse<CreateCalendarEntryResponseData>, CreateCalendarEntryRequest>({
    baseUrl: getApiBaseUrl(),
    endpoint: '/calendar',
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const updateCalendarEntry = async (accessToken: string, id: string, body: UpdateCalendarEntryRequest) => {
  return apiClient<ApiResponse<UpdateCalendarEntryResponseData>, UpdateCalendarEntryRequest>({
    baseUrl: getApiBaseUrl(),
    endpoint: `/calendar/${id}`,
    method: 'PATCH',
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const deleteCalendarEntry = async (accessToken: string, id: string) => {
  return apiClient<ApiResponse<DeleteCalendarEntryResponseData>>({
    baseUrl: getApiBaseUrl(),
    endpoint: `/calendar/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const fetchCalendarServerEntries = async (accessToken: string): Promise<CalendarServerEntry[]> => {
  try {
    const response = await fetchCalendarList(accessToken)

    return mapGetCalendarListResponseToCalendarEntries(response.data)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return []
    }

    throw error
  }
}

export const fetchCalendarEntriesBaseline = async (accessToken: string): Promise<CalendarEntriesBaseline> => {
  return fetchCalendarServerEntries(accessToken)
}

export const findCalendarEntryBaselineByDate = (
  entries: CalendarEntriesBaseline,
  date: string,
): CalendarServerEntry | null => {
  return entries.find((entry) => entry.date === date) ?? null
}


export const createCalendarServerEntry = async (
  accessToken: string,
  input: {
    date: string
    occasionKey: Occasion
    selectedOutfitId?: string | null
  },
): Promise<boolean> => {
  const response = await createCalendarEntry(accessToken, buildCreateCalendarEntryRequest(input))

  return response.status === true
}

export const updateCalendarServerEntry = async (
  accessToken: string,
  id: string,
  input: {
    date?: string
    occasionKey?: Occasion
    selectedOutfitId?: string | null
  },
): Promise<true> => {
  const response = await updateCalendarEntry(accessToken, id, buildUpdateCalendarEntryRequest(input))

  return mapUpdateCalendarEntryResponseToSuccess(response.data)
}

export const deleteCalendarServerEntry = async (accessToken: string, id: string): Promise<true> => {
  const response = await deleteCalendarEntry(accessToken, id)

  return mapDeleteCalendarEntryResponseToSuccess(response.data)
}

export const isCalendarDateInput = (value: unknown) => {
  return typeof value === 'string' && (isCalendarDashedDate(value) || isCalendarSlashedDate(value))
}
