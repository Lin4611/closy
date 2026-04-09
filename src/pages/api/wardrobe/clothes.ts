import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type {
  ClothesApiCategory,
  ClothesApiColor,
  ClothesApiOccasion,
  ClothesApiSeason,
  CreateClothesRequest,
  CreateClothesResponseData,
} from '@/modules/wardrobe/api/types'

type ErrorResponse = {
  message: string
}

const clothesApiCategories: ClothesApiCategory[] = [
  'top',
  'bottom',
  'outerwear',
  'shoes',
  'skirt',
  'dress',
]

const clothesApiOccasions: ClothesApiOccasion[] = [
  'socialGathering',
  'campusCasual',
  'businessCasual',
  'professional',
]

const clothesApiSeasons: ClothesApiSeason[] = ['spring', 'summer', 'autumn', 'winter']

const clothesApiColors: ClothesApiColor[] = [
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

const getApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL

  if (!baseUrl) {
    throw new Error('缺少 API_BASE_URL 環境變數')
  }

  return baseUrl
}

const getApiErrorResponse = (error: unknown, fallbackMessage: string) => {
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

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

const isCreateClothesRequest = (value: unknown): value is CreateClothesRequest => {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CreateClothesResponseData> | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!isCreateClothesRequest(req.body)) {
    return res.status(400).json({ message: '缺少新增衣物所需參數' })
  }

  try {
    const response = await apiClient<ApiResponse<CreateClothesResponseData>, CreateClothesRequest>({
      baseUrl: getApiBaseUrl(),
      endpoint: '/clothes',
      method: 'POST',
      body: req.body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(response.statusCode).json(response)
  } catch (error) {
    const errorResponse = getApiErrorResponse(error, '新增衣物失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}