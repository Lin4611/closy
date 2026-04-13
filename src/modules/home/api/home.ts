import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { DayRecommendation } from '../types/dayRecommendationTypes'

export const getHomeRecommendation = async (day: string): Promise<DayRecommendation> => {
  const res = await apiClient<ApiResponse<DayRecommendation>>({
    endpoint: `/api/home?day=${day}`,
    method: 'GET',
  })
  return res.data
}
