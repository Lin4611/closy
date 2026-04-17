import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { ClothingItem } from '../types/dayRecommendationTypes'

type GenerateOutfitPayload = {
  selectedItems: ClothingItem[]
}

export const generateOutfit = async (
  payload: GenerateOutfitPayload,
): Promise<{ outfitImgUrl: string }> => {
  const res = await apiClient<ApiResponse<{ outfitImgUrl: string }>, GenerateOutfitPayload>({
    endpoint: '/api/home/generate-outfit',
    method: 'POST',
    body: payload,
  })

  return res.data
}
