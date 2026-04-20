import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { DayRecommendation } from '@/modules/home/types/dayRecommendationTypes'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const day = (req.query.day as string) ?? 'today'

  try {
    const response = await apiClient<ApiResponse<DayRecommendation>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: `/home?day=${day}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: `取得${day}穿搭失敗` })
  }
}
