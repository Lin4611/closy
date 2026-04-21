import { apiClient } from '@/lib/api/client'
import type { OutfitBaseline } from '@/lib/api/outfit/shared'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'
import type { OutfitDetailResponseEnvelope, OutfitListResponseData } from '@/modules/outfit/api/types'
import type { OutfitDetail, OutfitListItem } from '@/modules/outfit/types/outfitTypes'

import { mapOutfitDetailResponseData, mapOutfitListResponseData } from './mappers'
import { getOccasionList } from './occasionList'

export const getOutfitList = async (occasion?: Occasion): Promise<OutfitListItem[]> => {
  const endpoint = occasion ? `/api/outfit?occasion=${occasion}` : '/api/outfit'

  const response = await apiClient<ApiResponse<OutfitListResponseData>>({
    endpoint,
    method: 'GET',
  })

  return mapOutfitListResponseData(response.data)
}


export const getOutfitBaseline = async (): Promise<OutfitBaseline> => {
  const [outfitList, occasionsList] = await Promise.all([getOutfitList(), getOccasionList()])

  return {
    outfitList,
    occasionsList,
  }
}


export const getOutfitDetail = async (outfitId: string): Promise<OutfitDetail> => {
  const response = await apiClient<ApiResponse<OutfitDetailResponseEnvelope>>({
    endpoint: `/api/outfit/${outfitId}`,
    method: 'GET',
  })

  const detail = mapOutfitDetailResponseData(response.data)

  if (!detail) {
    throw new Error('無法取得穿搭詳情')
  }

  return detail
}
