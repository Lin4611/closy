import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { RemoveBackgroundRequest, RemoveBackgroundResponseData } from './types'

export const removeBackground = async (
  formData: RemoveBackgroundRequest
): Promise<RemoveBackgroundResponseData> => {
  const response = await apiClient<ApiResponse<RemoveBackgroundResponseData>, RemoveBackgroundRequest>({
    endpoint: '/api/wardrobe/removebg',
    method: 'POST',
    body: formData,
  })

  return response.data
}
