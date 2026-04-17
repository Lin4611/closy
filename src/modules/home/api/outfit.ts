import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'

import type { ClothingItem } from '../types/dayRecommendationTypes'

type GenerateOutfitPayload = {
  selectedItems: ClothingItem[]
  occasion?: Occasion
}

export const generateOutfit = async (
  payload: GenerateOutfitPayload,
): Promise<{ outfitImgUrl: string; occasion: Occasion }> => {
  const res = await apiClient<
    ApiResponse<{ outfitImgUrl: string; occasion: Occasion }>,
    GenerateOutfitPayload
  >({
    endpoint: '/api/home/generate-outfit',
    method: 'POST',
    body: payload,
  })

  return res.data
}
