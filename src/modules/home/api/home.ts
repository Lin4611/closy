import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'

import type { DayRecommendation } from '../types/dayRecommendationTypes'

export const getHomeRecommendation = async (
  day: string,
  occasion: Occasion,
): Promise<DayRecommendation> => {
  const res = await apiClient<ApiResponse<DayRecommendation>, { occasion: Occasion }>({
    endpoint: `/api/home?day=${day}`,
    method: 'POST',
    body: { occasion },
  })
  return res.data
}
