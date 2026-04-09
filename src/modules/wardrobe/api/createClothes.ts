import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { CreateClothesRequest, CreateClothesResponseData } from './types'

export const createClothes = async (
  body: CreateClothesRequest
): Promise<CreateClothesResponseData> => {
  const response = await apiClient<ApiResponse<CreateClothesResponseData>, CreateClothesRequest>({
    endpoint: '/api/wardrobe/clothes',
    method: 'POST',
    body,
  })

  return response.data
}
