import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

import { ApiError } from '@/lib/api/client'
import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { GoogleLoginData } from '@/modules/guide/types/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id_token } = req.body
  if (!id_token) return res.status(400).json({ message: '缺少 id_token' })

  try {
    const response = await apiClient<ApiResponse<GoogleLoginData>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/auth/google',
      method: 'POST',
      body: { id_token },
    })

    const token = response.data.token

    res.setHeader(
      'Set-Cookie',
      serialize('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      }),
    )
    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Google 登入失敗' })
  }
}
