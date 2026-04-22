import type { NextApiRequest, NextApiResponse } from 'next'

import type { ErrorResponse } from '@/lib/api/calendar/shared'
import {
  deleteCalendarEntry,
  getApiErrorResponse,
  getRouteIdParam,
  isUpdateCalendarEntryRequest,
  updateCalendarEntry,
} from '@/lib/api/calendar/shared'
import type { ApiResponse } from '@/lib/api/types'
import type {
  DeleteCalendarEntryResponseData,
  UpdateCalendarEntryRequest,
  UpdateCalendarEntryResponseData,
} from '@/modules/calendar/api/types'

type CalendarDetailMutationResponse =
  | ApiResponse<UpdateCalendarEntryResponseData>
  | ApiResponse<DeleteCalendarEntryResponseData>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalendarDetailMutationResponse | ErrorResponse>,
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  const id = getRouteIdParam(req.query.id)

  if (!id) {
    return res.status(400).json({ message: '請提供行事曆 id' })
  }

  if (req.method === 'PATCH' && !isUpdateCalendarEntryRequest(req.body)) {
    return res.status(400).json({ message: '缺少更新行事曆所需參數' })
  }

  try {
    if (req.method === 'PATCH') {
      const response = await updateCalendarEntry(accessToken, id, req.body as UpdateCalendarEntryRequest)

      return res.status(response.statusCode).json(response)
    }

    const response = await deleteCalendarEntry(accessToken, id)

    return res.status(response.statusCode).json(response)
  } catch (error) {
    const errorResponse = getApiErrorResponse(
      error,
      req.method === 'PATCH' ? '更新行事曆失敗' : '刪除行事曆失敗',
    )

    return res.status(errorResponse.statusCode).json({ message: errorResponse.message })
  }
}
