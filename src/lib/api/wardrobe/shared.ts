import { apiClient, ApiError } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type {
  ClothesApiCategory,
  ClothesApiColor,
  ClothesApiOccasion,
  ClothesApiSeason,
  CreateClothesRequest,
  GetClothesListResponseData,
  UpdateClothesRequest,
} from '@/modules/wardrobe/api/types'

export type ErrorResponse = {
  message: string
}

export const clothesApiCategories: ClothesApiCategory[] = [
  'top',
  'bottom',
  'outerwear',
  'shoes',
  'skirt',
  'dress',
]

export const clothesApiOccasions: ClothesApiOccasion[] = [
  'socialGathering',
  'campusCasual',
  'businessCasual',
  'professional',
]

export const clothesApiSeasons: ClothesApiSeason[] = ['spring', 'summer', 'autumn', 'winter']

export const clothesApiColors: ClothesApiColor[] = [
  'white',
  'black',
  'gray',
  'brown',
  'yellow',
  'orange',
  'pink',
  'green',
  'blue',
  'purple',
]

export const getApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL

  if (!baseUrl) {
    throw new Error('缺少 API_BASE_URL 環境變數')
  }

  return baseUrl
}

export const getApiErrorResponse = (error: unknown, fallbackMessage: string) => {
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


export const fetchWardrobeClothesList = async (accessToken: string) => {
  return apiClient<ApiResponse<GetClothesListResponseData>>({
    baseUrl: getApiBaseUrl(),
    endpoint: '/clothes',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export const isCreateClothesRequest = (value: unknown): value is CreateClothesRequest => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.cloudImgUrl === 'string' &&
    typeof candidate.imageHash === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.brand === 'string' &&
    typeof candidate.category === 'string' &&
    clothesApiCategories.includes(candidate.category as ClothesApiCategory) &&
    typeof candidate.color === 'string' &&
    clothesApiColors.includes(candidate.color as ClothesApiColor) &&
    isStringArray(candidate.occasions) &&
    candidate.occasions.every((occasion) => clothesApiOccasions.includes(occasion as ClothesApiOccasion)) &&
    isStringArray(candidate.seasons) &&
    candidate.seasons.every((season) => clothesApiSeasons.includes(season as ClothesApiSeason))
  )
}

export const isUpdateClothesRequest = (value: unknown): value is UpdateClothesRequest => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  const hasAnySupportedField = ['category', 'name', 'color', 'occasions', 'seasons', 'brand'].some(
    (key) => key in candidate
  )

  if (!hasAnySupportedField) {
    return false
  }

  if ('category' in candidate) {
    if (typeof candidate.category !== 'string' || !clothesApiCategories.includes(candidate.category as ClothesApiCategory)) {
      return false
    }
  }

  if ('name' in candidate) {
    if (typeof candidate.name !== 'string') {
      return false
    }
  }

  if ('color' in candidate) {
    if (typeof candidate.color !== 'string' || !clothesApiColors.includes(candidate.color as ClothesApiColor)) {
      return false
    }
  }

  if ('brand' in candidate) {
    if (typeof candidate.brand !== 'string') {
      return false
    }
  }

  if ('occasions' in candidate) {
    if (
      !isStringArray(candidate.occasions) ||
      !candidate.occasions.every((occasion) => clothesApiOccasions.includes(occasion as ClothesApiOccasion))
    ) {
      return false
    }
  }

  if ('seasons' in candidate) {
    if (
      !isStringArray(candidate.seasons) ||
      !candidate.seasons.every((season) => clothesApiSeasons.includes(season as ClothesApiSeason))
    ) {
      return false
    }
  }

  return true
}

export const getRouteIdParam = (value: string | string[] | undefined): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  return value
}
