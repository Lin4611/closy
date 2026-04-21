import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { CalendarServerEntry } from '@/modules/calendar/types'

import {
  buildCreateCalendarEntryRequest,
  buildUpdateCalendarEntryRequest,
  mapDeleteCalendarEntryResponseToSuccess,
  mapGetCalendarListResponseToCalendarEntries,
  mapUpdateCalendarEntryResponseToSuccess,
} from './mappers'
import type {
  CreateCalendarEntryResponseData,
  DeleteCalendarEntryResponseData,
  GetCalendarListResponseData,
  UpdateCalendarEntryResponseData,
} from './types'

export const requestCalendarEntries = async (): Promise<CalendarServerEntry[]> => {
  try {
    const response = await apiClient<ApiResponse<GetCalendarListResponseData>>({
      endpoint: '/api/calendar',
      method: 'GET',
    })

    return mapGetCalendarListResponseToCalendarEntries(response.data)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return []
    }

    throw error
  }
}

export const requestCreatedCalendarEntry = async (input: {
  date: string
  occasionKey: CalendarServerEntry['occasionKey']
  selectedOutfitId?: string | null
}): Promise<boolean> => {
  const response = await apiClient<ApiResponse<CreateCalendarEntryResponseData>>({
    endpoint: '/api/calendar',
    method: 'POST',
    body: buildCreateCalendarEntryRequest(input),
  })

  return response.status === true
}

export const requestUpdatedCalendarEntry = async (
  id: string,
  input: {
    date?: string
    occasionKey?: CalendarServerEntry['occasionKey']
    selectedOutfitId?: string | null
  },
): Promise<true> => {
  const response = await apiClient<ApiResponse<UpdateCalendarEntryResponseData>>({
    endpoint: `/api/calendar/${id}`,
    method: 'PATCH',
    body: buildUpdateCalendarEntryRequest(input),
  })

  return mapUpdateCalendarEntryResponseToSuccess(response.data)
}

export const requestDeletedCalendarEntry = async (id: string): Promise<true> => {
  const response = await apiClient<ApiResponse<DeleteCalendarEntryResponseData>>({
    endpoint: `/api/calendar/${id}`,
    method: 'DELETE',
  })

  return mapDeleteCalendarEntryResponseToSuccess(response.data)
}
