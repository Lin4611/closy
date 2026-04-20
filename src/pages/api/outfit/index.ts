import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/common/types/occasion'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const occasion = req.query.occasion as Occasion | undefined

  try {
    const response = await apiClient<ApiResponse<{ list: OutfitItem[] }>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: occasion ? `/outfit?occasion=${occasion}` : `/outfit`,
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

    const errorMessage = occasion ? `取得${occasion}穿搭失敗` : '取得穿搭列表失敗'
    return res.status(500).json({ message: errorMessage })
  }
}
