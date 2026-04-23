import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'

import type { ClothingItem } from '../types/dayRecommendationTypes'

type AddOutfitPayload = {
  outfitImgUrl: string
  occasion: Occasion
  outfitDate: string
  selectedItems: ClothingItem[]
}

export const addOutfit = async (payload: AddOutfitPayload): Promise<void> => {
  await apiClient<ApiResponse<null>, AddOutfitPayload>({
    endpoint: '/api/outfit/add-outfit',
    method: 'POST',
    body: payload,
  })
}
