import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type {
  AnalyzeClothesRequest,
  AnalyzeClothesResponseData,
} from '@/modules/wardrobe/api/types'

type ErrorResponse = {
  message: string
}

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

const isAnalyzeClothesRequest = (value: unknown): value is AnalyzeClothesRequest => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'cloudinaryImageUrl' in value &&
    typeof (value as { cloudinaryImageUrl?: unknown }).cloudinaryImageUrl === 'string' &&
    'imageHash' in value &&
    typeof (value as { imageHash?: unknown }).imageHash === 'string'
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AnalyzeClothesResponseData> | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!isAnalyzeClothesRequest(req.body)) {
    return res.status(400).json({ message: '缺少辨識所需參數' })
  }

  try {
    const response = await apiClient<
      ApiResponse<AnalyzeClothesResponseData>,
      AnalyzeClothesRequest
    >({
      baseUrl: getApiBaseUrl(),
      endpoint: '/process/analyze-clothes',
      method: 'POST',
      body: req.body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(response.statusCode).json(response)
  } catch (error) {
    const errorResponse = getApiErrorResponse(error, '衣物屬性辨識失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
