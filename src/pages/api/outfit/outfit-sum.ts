import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { SummaryList } from '@/modules/outfit/types/outfitTypes'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  try {
    const response = await apiClient<ApiResponse<{ summaryList: SummaryList[] }>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: `/outfit/summary`,
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

    return res.status(500).json({ message: `取得場合資料失敗` })
  }
}
