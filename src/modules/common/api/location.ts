import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

type LocationPayload = {
  latitude: number | null
  longitude: number | null
}

export const updateLocation = async (payload: LocationPayload): Promise<void> => {
  await apiClient<ApiResponse<null>, LocationPayload>({
    endpoint: '/api/profile/update-location',
    method: 'POST',
    body: payload,
  })
}
