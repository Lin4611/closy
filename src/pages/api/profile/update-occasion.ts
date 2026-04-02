import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/home/types/occasion'

type UpdateOccasionBody = {
  occasionId?: Occasion
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  const { occasionId } = req.body as UpdateOccasionBody

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!occasionId) {
    return res.status(400).json({ message: '缺少 occasion' })
  }

  try {
    const response = await apiClient<ApiResponse<null>, UpdateOccasionBody>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/preferences/occasions',
      method: 'PATCH',
      body: { occasionId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '更新場合失敗' })
  }
}
