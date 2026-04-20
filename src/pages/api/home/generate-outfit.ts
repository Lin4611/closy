import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { ClothingItem } from '@/modules/home/types/dayRecommendationTypes'

type GenerateOutfitBody = {
  selectedItems: ClothingItem[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const { selectedItems } = req.body as GenerateOutfitBody

  try {
    const response = await apiClient<ApiResponse<{ imageUrl: string }>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: `/home/outfit`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: { selectedItems },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: `生成穿搭失敗` })
  }
}
