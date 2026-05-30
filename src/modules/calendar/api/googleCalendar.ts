import { apiClient } from '@/lib/api/client'
  import type { ApiResponse } from '@/lib/api/types'

  export const connectGoogleCalendar = async (code: string): Promise<void> => {
    await apiClient<ApiResponse<null>>({
      endpoint: '/api/calendar/connect',
      method: 'POST',
      body: { code },
    })
  }

  export const disconnectGoogleCalendar = async (): Promise<void> => {
    await apiClient<ApiResponse<null>>({
      endpoint: '/api/calendar/disconnect',
      method: 'POST',
    })
  }