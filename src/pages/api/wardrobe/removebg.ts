import { Readable } from 'node:stream'

import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError } from '@/lib/api/client'
import type { ApiResponse, BaseApiResponse } from '@/lib/api/types'
import type { RemoveBackgroundResponseData } from '@/modules/wardrobe/api/types'

type ErrorResponse = {
  message: string
}

type DuplexRequestInit = RequestInit & {
  duplex: 'half'
}

export const config = {
  api: {
    bodyParser: false,
  },
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

const isApiResponseShape = (value: unknown): value is BaseApiResponse => {
  return typeof value === 'object' && value !== null && 'status' in value
}

const getResponseErrorMessage = (value: unknown, fallbackMessage: string) => {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message?: unknown }).message === 'string'
  ) {
    return (value as { message: string }).message
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return fallbackMessage
}

const parseResponsePayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RemoveBackgroundResponseData> | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const contentType = req.headers['content-type']

  if (!contentType?.includes('multipart/form-data')) {
    return res.status(400).json({ message: '請使用 multipart/form-data 上傳圖片' })
  }

  try {
    const requestBody = Readable.toWeb(req) as BodyInit
    const requestInit: DuplexRequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': contentType,
      },
      body: requestBody,
      duplex: 'half',
    }

    const response = await fetch(`${getApiBaseUrl()}/process/removebg`, requestInit)
    const payload = await parseResponsePayload(response)

    if (!response.ok) {
      throw new ApiError(getResponseErrorMessage(payload, '圖片去背失敗'), response.status, payload)
    }

    if (isApiResponseShape(payload) && payload.status === false) {
      throw new ApiError(
        getResponseErrorMessage(payload, '圖片去背失敗'),
        payload.statusCode || response.status,
        payload
      )
    }

    const successResponse = payload as ApiResponse<RemoveBackgroundResponseData>

    return res.status(successResponse.statusCode || response.status).json(successResponse)
  } catch (error) {
    const errorResponse = getApiErrorResponse(error, '圖片去背失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}