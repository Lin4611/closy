import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { UserInfo } from '../types/userInfoTypes'

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await apiClient<ApiResponse<UserInfo>>({
    endpoint: '/api/profile/get-info',
    method: 'GET',
  })
  return response.data
}
