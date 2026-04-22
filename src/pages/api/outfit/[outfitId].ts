import type { NextApiRequest, NextApiResponse } from 'next'

import {
  deleteOutfitResponse,
  fetchOutfitServerDetail,
  getOutfitApiErrorResponse,
  getOutfitRouteIdParam,
} from '@/lib/api/outfit/shared'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const outfitId = getOutfitRouteIdParam(req.query.outfitId)

  if (!outfitId) {
    return res.status(400).json({ message: '缺少穿搭 ID' })
  }

  if (req.method === 'GET') {
    try {
      const detail = await fetchOutfitServerDetail(accessToken, outfitId)

      return res.status(200).json({
        statusCode: 200,
        status: true,
        message: '取得穿搭詳情成功',
        data: detail,
      })
    } catch (error) {
      const errorResponse = getOutfitApiErrorResponse(error, '取得穿搭詳情失敗')

      return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const response = await deleteOutfitResponse(accessToken, outfitId)

      return res.status(200).json(response)
    } catch (error) {
      const errorResponse = getOutfitApiErrorResponse(error, '刪除穿搭失敗')

      return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
    }
  }

  return res.status(405).end()
}
