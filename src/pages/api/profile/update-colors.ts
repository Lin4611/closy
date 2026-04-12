import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Colors } from '@/modules/settings/types/colorsTypes'

type UpdateColorsBody = {
  colors?: Colors[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  const { colors } = (req.body || {}) as UpdateColorsBody

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!colors) {
    return res.status(400).json({ message: '缺少 color' })
  }

  try {
    const response = await apiClient<ApiResponse<null>, UpdateColorsBody>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/preferences/colors',
      method: 'PATCH',
      body: { colors },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '更新色系失敗' })
  }
}
