import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

export const getOutfitList = async (occasion?: Occasion): Promise<OutfitItem[]> => {
  const endpoint = occasion ? `/api/outfit?occasion=${occasion}` : '/api/outfit'

  const response = await apiClient<ApiResponse<{ list: OutfitItem[] }>>({
    endpoint,
    method: 'GET',
  })

  return response.data.list
}
