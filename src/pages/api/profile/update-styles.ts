import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Styles } from '@/modules/settings/types/stylesTypes'

type UpdateStylesBody = {
  styles?: Styles[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  const { styles } = (req.body || {}) as UpdateStylesBody

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!styles) {
    return res.status(400).json({ message: '缺少 style' })
  }

  try {
    const response = await apiClient<ApiResponse<null>, UpdateStylesBody>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/preferences/styles',
      method: 'PATCH',
      body: { styles },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '更新風格失敗' })
  }
}
