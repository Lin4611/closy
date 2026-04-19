import type { NextApiRequest, NextApiResponse } from 'next'

import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { ErrorResponse } from '@/lib/api/wardrobe/shared'
import { fetchWardrobeClothesList, getApiBaseUrl, getApiErrorResponse, isCreateClothesRequest } from '@/lib/api/wardrobe/shared'
import type { CreateClothesRequest, CreateClothesResponseData, GetClothesListResponseData } from '@/modules/wardrobe/api/types'

type WardrobeClothesResponse = ApiResponse<CreateClothesResponseData> | ApiResponse<GetClothesListResponseData>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WardrobeClothesResponse | ErrorResponse>
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (req.method === 'POST' && !isCreateClothesRequest(req.body)) {
    return res.status(400).json({ message: '缺少新增衣物所需參數' })
  }

  try {
    if (req.method === 'GET') {
      const response = await fetchWardrobeClothesList(accessToken)

      return res.status(response.statusCode).json(response)
    }

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
    const errorResponse = getApiErrorResponse(error, req.method === 'GET' ? '取得衣櫃清單失敗' : '新增衣物失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
