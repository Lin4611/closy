import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const outfitId = req.query.outfitId as string

  try {
    const response = await apiClient<ApiResponse<{ message: string }>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: `/outfit/${outfitId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '刪除穿搭失敗' })
  }
}
