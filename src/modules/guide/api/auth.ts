import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

import type { GoogleLoginData } from '../types/auth'
export const loginWithGoogle = async (idToken: string): Promise<GoogleLoginData> => {
  const res = await apiClient<ApiResponse<GoogleLoginData>, { id_token: string }>({
    endpoint: '/api/guide/login',
    method: 'POST',
    body: { id_token: idToken },
  })
  return res.data
}
