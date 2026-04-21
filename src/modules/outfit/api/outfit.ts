import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'
import type { OutfitListResponseData } from '@/modules/outfit/api/types'
import type { OutfitListItem } from '@/modules/outfit/types/outfitTypes'

import { mapOutfitListResponseData } from './mappers'

export const getOutfitList = async (occasion?: Occasion): Promise<OutfitListItem[]> => {
  const endpoint = occasion ? `/api/outfit?occasion=${occasion}` : '/api/outfit'

  const response = await apiClient<ApiResponse<OutfitListResponseData>>({
    endpoint,
    method: 'GET',
  })

  return mapOutfitListResponseData(response.data)
}
