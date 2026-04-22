import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { DeleteOutfitResponseData } from './types'

export const deleteOutfit = async (id: string): Promise<string> => {
  const response = await apiClient<ApiResponse<DeleteOutfitResponseData>>({
    endpoint: `/api/outfit/${id}`,
    method: 'DELETE',
  })

  if (typeof response.data?.message === 'string' && response.data.message) {
    return response.data.message
  }

  return response.message
}
