import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchOutfitListResponse, getOutfitApiErrorResponse } from '@/lib/api/outfit/shared'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const occasion = typeof req.query.occasion === 'string' ? req.query.occasion : undefined

  try {
    const response = await fetchOutfitListResponse(accessToken, occasion)
    return res.status(200).json(response)
  } catch (error) {
    const errorResponse = getOutfitApiErrorResponse(
      error,
      occasion ? `取得${occasion}穿搭失敗` : '取得穿搭列表失敗',
    )

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
