import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import {
  mapOutfitListResponseData,
  mapOutfitSummaryResponseData,
} from '@/modules/outfit/api/mappers'
import type {
  AddOutfitRequest,
  DeleteOutfitResponseData,
  OutfitListResponseData,
  OutfitSummaryResponseData,
} from '@/modules/outfit/api/types'
import type {
  AddOutfitItem,
  OutfitListItem,
  OutfitOccasionSummary,
} from '@/modules/outfit/types/outfitTypes'

export type OutfitErrorResponse = {
  message: string
}

export const getOutfitApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL

  if (!baseUrl) {
    throw new Error('缺少 API_BASE_URL 環境變數')
  }

  return baseUrl
}

export const getOutfitApiErrorResponse = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    }
  }

  return {
    statusCode: 500,
    message: fallbackMessage,
  }
}

export const fetchOutfitListResponse = async (accessToken: string, occasion?: string) => {
  return apiClient<ApiResponse<OutfitListResponseData>>({
    baseUrl: getOutfitApiBaseUrl(),
    endpoint: occasion ? `/outfit?occasion=${occasion}` : '/outfit',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const fetchOutfitSummaryResponse = async (accessToken: string) => {
  return apiClient<ApiResponse<OutfitSummaryResponseData>>({
    baseUrl: getOutfitApiBaseUrl(),
    endpoint: '/outfit/summary',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const deleteOutfitResponse = async (accessToken: string, outfitId: string) => {
  return apiClient<ApiResponse<DeleteOutfitResponseData>>({
    baseUrl: getOutfitApiBaseUrl(),
    endpoint: `/outfit/${outfitId}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const createOutfitResponse = async (accessToken: string, body: AddOutfitRequest) => {
  return apiClient<ApiResponse<null>, AddOutfitRequest>({
    baseUrl: getOutfitApiBaseUrl(),
    endpoint: '/outfit',
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const fetchOutfitServerList = async (
  accessToken: string,
  occasion?: string,
): Promise<OutfitListItem[]> => {
  const response = await fetchOutfitListResponse(accessToken, occasion)

  return mapOutfitListResponseData(response.data)
}

export const fetchOutfitServerSummary = async (
  accessToken: string,
): Promise<OutfitOccasionSummary[]> => {
  const response = await fetchOutfitSummaryResponse(accessToken)

  return mapOutfitSummaryResponseData(response.data)
}

const isOutfitProductRequest = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.category === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.brand === 'string' &&
    typeof candidate.cloudImgUrl === 'string'
  )
}

export const isAddOutfitItem = (value: unknown): value is AddOutfitItem => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.outfitImgUrl === 'string' &&
    typeof candidate.occasion === 'string' &&
    Array.isArray(candidate.selectedItems) &&
    candidate.selectedItems.every((item) => isOutfitProductRequest(item))
  )
}

export const getOutfitRouteIdParam = (value: string | string[] | undefined): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  return value
}
