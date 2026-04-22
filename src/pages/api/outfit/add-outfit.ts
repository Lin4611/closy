import type { NextApiRequest, NextApiResponse } from 'next'

import {
  createOutfitResponse,
  getOutfitApiErrorResponse,
  isAddOutfitItem,
} from '@/lib/api/outfit/shared'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (!isAddOutfitItem(req.body)) {
    return res.status(400).json({ message: '缺少必要欄位' })
  }

  try {
    const response = await createOutfitResponse(accessToken, req.body)

    return res.status(200).json(response)
  } catch (error) {
    const errorResponse = getOutfitApiErrorResponse(error, '新增穿搭失敗')

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
