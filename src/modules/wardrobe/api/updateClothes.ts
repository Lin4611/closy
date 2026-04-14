import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { WardrobeItem } from '@/modules/wardrobe/types'

import { mapUpdateClothesResponseToWardrobeItem } from './mappers'
import type { UpdateClothesRequest, UpdateClothesResponseData } from './types'

export const updateClothes = async (id: string, body: UpdateClothesRequest): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<UpdateClothesResponseData>, UpdateClothesRequest>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'PATCH',
    body,
  })

  return mapUpdateClothesResponseToWardrobeItem(response.data)
}
