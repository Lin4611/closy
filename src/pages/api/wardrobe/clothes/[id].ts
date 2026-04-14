import type { NextApiRequest, NextApiResponse } from 'next'

import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type {
  DeleteClothesResponseData,
  GetClothesDetailResponseData,
  UpdateClothesRequest,
  UpdateClothesResponseData,
} from '@/modules/wardrobe/api/types'

import type { ErrorResponse } from '../shared'
import { getApiBaseUrl, getApiErrorResponse, getRouteIdParam, isUpdateClothesRequest } from '../shared'

type WardrobeClothesDetailResponse =
  | ApiResponse<GetClothesDetailResponseData>
  | ApiResponse<UpdateClothesResponseData>
  | ApiResponse<DeleteClothesResponseData>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WardrobeClothesDetailResponse | ErrorResponse>
) {
  if (req.method !== 'GET' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const id = getRouteIdParam(req.query.id)

  if (!id) {
    return res.status(400).json({ message: '請提供單品 id' })
  }

  if (req.method === 'PATCH' && !isUpdateClothesRequest(req.body)) {
    return res.status(400).json({ message: '缺少編輯衣物所需參數' })
  }

  try {
    if (req.method === 'GET') {
      const response = await apiClient<ApiResponse<GetClothesDetailResponseData>>({
        baseUrl: getApiBaseUrl(),
        endpoint: `/clothes/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return res.status(response.statusCode).json(response)
    }

    if (req.method === 'PATCH') {
      const response = await apiClient<ApiResponse<UpdateClothesResponseData>, UpdateClothesRequest>({
        baseUrl: getApiBaseUrl(),
        endpoint: `/clothes/${id}`,
        method: 'PATCH',
        body: req.body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return res.status(response.statusCode).json(response)
    }

    const response = await apiClient<ApiResponse<DeleteClothesResponseData>>({
      baseUrl: getApiBaseUrl(),
      endpoint: `/clothes/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(response.statusCode).json(response)
  } catch (error) {
    const fallbackMessage =
      req.method === 'GET' ? '取得衣物資訊失敗' : req.method === 'PATCH' ? '編輯衣物失敗' : '刪除衣物失敗'
    const errorResponse = getApiErrorResponse(error, fallbackMessage)

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
