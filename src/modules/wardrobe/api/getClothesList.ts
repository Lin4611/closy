import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { WardrobeItem } from '@/modules/wardrobe/types'

import { mapGetClothesListResponseToWardrobeItems } from './mappers'
import type { GetClothesListResponseData } from './types'

export const getClothesList = async (): Promise<WardrobeItem[]> => {
  const response = await apiClient<ApiResponse<GetClothesListResponseData>>({
    endpoint: '/api/wardrobe/clothes',
    method: 'GET',
  })

  return mapGetClothesListResponseToWardrobeItems(response.data)
}
