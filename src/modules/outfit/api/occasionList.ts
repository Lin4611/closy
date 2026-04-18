import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { SummaryList } from '../types/outfitTypes'

export const getOccasionList = async (): Promise<SummaryList[]> => {
  const res = await apiClient<ApiResponse<{ summaryList: SummaryList[] }>>({
    endpoint: `/api/outfit/outfit-sum`,
    method: 'GET',
  })
  return res.data.summaryList
}
