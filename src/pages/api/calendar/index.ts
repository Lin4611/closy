import type { NextApiRequest, NextApiResponse } from 'next'

import type { ErrorResponse } from '@/lib/api/calendar/shared'
import {
  createCalendarEntry,
  fetchCalendarList,
  getApiErrorResponse,
  isCreateCalendarEntryRequest,
} from '@/lib/api/calendar/shared'
import type { ApiResponse } from '@/lib/api/types'
import type {
  CreateCalendarEntryRequest,
  CreateCalendarEntryResponseData,
  GetCalendarListResponseData,
} from '@/modules/calendar/api/types'

type CalendarCollectionResponse =
  | ApiResponse<GetCalendarListResponseData>
  | ApiResponse<CreateCalendarEntryResponseData>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalendarCollectionResponse | ErrorResponse>,
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  if (req.method === 'POST' && !isCreateCalendarEntryRequest(req.body)) {
    return res.status(400).json({ message: '缺少新增行事曆所需參數' })
  }

  try {
    if (req.method === 'GET') {
      const response = await fetchCalendarList(accessToken)

      return res.status(response.statusCode).json(response)
    }

    const response = await createCalendarEntry(accessToken, req.body as CreateCalendarEntryRequest)

    return res.status(response.statusCode).json(response)
  } catch (error) {
    const errorResponse = getApiErrorResponse(
      error,
      req.method === 'GET' ? '取得行事曆列表失敗' : '新增行事曆失敗',
    )

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
