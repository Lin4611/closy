import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { WardrobeItem } from '@/modules/wardrobe/types'

import { mapCreateClothesResponseToWardrobeItem } from './mappers'
import type { CreateClothesRequest, CreateClothesResponseData } from './types'

export const createClothes = async (
  body: CreateClothesRequest
): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<CreateClothesResponseData>, CreateClothesRequest>({
    endpoint: '/api/wardrobe/clothes',
    method: 'POST',
    body,
  })

  if (response.data.imageHash !== body.imageHash) {
    throw new Error('新增衣物成功，但回傳的衣物資料與本次建立內容不一致')
  }

  return mapCreateClothesResponseToWardrobeItem(response.data)
}
