import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError, apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

type UpdateGenderBody = {
  gender?: 'male' | 'female'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  const { gender } = req.body as UpdateGenderBody

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!gender) {
    return res.status(400).json({ message: '缺少 gender' })
  }

  try {
    const response = await apiClient<ApiResponse<null>, { gender: 'male' | 'female' }>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/gender',
      method: 'PATCH',
      body: { gender },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    return res.status(500).json({ message: '更新性別失敗' })
  }
}
