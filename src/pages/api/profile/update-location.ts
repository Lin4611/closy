import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

type UpdateLocationBody = {
  latitude: number | null
  longitude: number | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  const { latitude, longitude } = (req.body || {}) as UpdateLocationBody

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (latitude === undefined) {
    return res.status(400).json({ message: '缺少 latitude' })
  }

  if (longitude === undefined) {
    return res.status(400).json({ message: '缺少 longitude' })
  }

  try {
    const response = await apiClient<ApiResponse<null>, UpdateLocationBody>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/location',
      method: 'POST',
      body: { latitude, longitude },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '更新位置失敗' })
  }
}
