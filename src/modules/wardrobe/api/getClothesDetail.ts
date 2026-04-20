import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { WardrobeItem } from '@/modules/wardrobe/types'

import { mapGetClothesDetailResponseToWardrobeItem } from './mappers'
import type { GetClothesDetailResponseData } from './types'

export const getClothesDetail = async (id: string): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<GetClothesDetailResponseData>>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'GET',
  })

  return mapGetClothesDetailResponseToWardrobeItem(response.data)
}
