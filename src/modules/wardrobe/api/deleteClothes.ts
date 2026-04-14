import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import { mapDeleteClothesResponseToSuccess } from './mappers'
import type { DeleteClothesResponseData } from './types'

export const deleteClothes = async (id: string): Promise<true> => {
  const response = await apiClient<ApiResponse<DeleteClothesResponseData>>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'DELETE',
  })

  return mapDeleteClothesResponseToSuccess(response.data)
}
