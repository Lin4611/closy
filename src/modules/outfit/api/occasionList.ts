import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { OutfitOccasionSummary } from '@/modules/outfit/types/outfitTypes'

import { mapOutfitSummaryResponseData } from './mappers'
import type { OutfitSummaryResponseData } from './types'

export const getOccasionList = async (): Promise<OutfitOccasionSummary[]> => {
  const response = await apiClient<ApiResponse<OutfitSummaryResponseData>>({
    endpoint: '/api/outfit/outfit-sum',
    method: 'GET',
  })

  return mapOutfitSummaryResponseData(response.data)
}
