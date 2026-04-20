import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { AnalyzeClothesRequest, AnalyzeClothesResponseData } from './types'

export const analyzeClothes = async (
  body: AnalyzeClothesRequest
): Promise<AnalyzeClothesResponseData> => {
  const response = await apiClient<ApiResponse<AnalyzeClothesResponseData>, AnalyzeClothesRequest>({
    endpoint: '/api/wardrobe/analyze',
    method: 'POST',
    body,
  })

  return response.data
}
