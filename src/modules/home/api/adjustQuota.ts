import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { AdjustQuota } from '@/modules/home/types/outfitAdjustChat'

export const getAdjustQuota = async (): Promise<AdjustQuota> => {
  const res = await apiClient<ApiResponse<AdjustQuota>>({
    endpoint: '/api/adjust/quota',
    method: 'GET',
  })
  return res.data
}
