import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { WardrobeItem } from '@/modules/wardrobe/types'

import {
  mapCreateClothesResponseToWardrobeItem,
  mapDeleteClothesResponseToSuccess,
  mapGetClothesDetailResponseToWardrobeItem,
  mapGetClothesListResponseToWardrobeItems,
  mapUpdateClothesResponseToWardrobeItem,
} from './mappers'
import type {
  CreateClothesRequest,
  CreateClothesResponseData,
  DeleteClothesResponseData,
  GetClothesDetailResponseData,
  GetClothesListResponseData,
  UpdateClothesRequest,
  UpdateClothesResponseData,
} from './types'

export const requestWardrobeListItems = async (): Promise<WardrobeItem[]> => {
  const response = await apiClient<ApiResponse<GetClothesListResponseData>>({
    endpoint: '/api/wardrobe/clothes',
    method: 'GET',
  })

  return mapGetClothesListResponseToWardrobeItems(response.data)
}

export const requestWardrobeItem = async (id: string): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<GetClothesDetailResponseData>>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'GET',
  })

  return mapGetClothesDetailResponseToWardrobeItem(response.data)
}

export const requestCreatedWardrobeItem = async (body: CreateClothesRequest): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<CreateClothesResponseData>, CreateClothesRequest>({
    endpoint: '/api/wardrobe/clothes',
    method: 'POST',
    body,
  })

  if (response.data.imageHash !== body.imageHash) {
    throw new Error('新增衣物成功，但回傳的衣物資料與本次建立內容不一致')
  }

  return mapCreateClothesResponseToWardrobeItem(response.data)
}

export const requestUpdatedWardrobeItem = async (id: string, body: UpdateClothesRequest): Promise<WardrobeItem> => {
  const response = await apiClient<ApiResponse<UpdateClothesResponseData>, UpdateClothesRequest>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'PATCH',
    body,
  })

  return mapUpdateClothesResponseToWardrobeItem(response.data)
}

export const requestDeletedWardrobeItem = async (id: string): Promise<true> => {
  const response = await apiClient<ApiResponse<DeleteClothesResponseData>>({
    endpoint: `/api/wardrobe/clothes/${id}`,
    method: 'DELETE',
  })

  return mapDeleteClothesResponseToSuccess(response.data)
}
