import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchOutfitSummaryResponse, getOutfitApiErrorResponse } from '@/lib/api/outfit/shared'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  try {
    const response = await fetchOutfitSummaryResponse(accessToken)
    return res.status(200).json(response)
  } catch (error) {
    const errorResponse = getOutfitApiErrorResponse(error, '取得場合資料失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
