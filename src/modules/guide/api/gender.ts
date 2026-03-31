import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

type Gender = 'male' | 'female'

export const updateGender = async (gender: Gender): Promise<void> => {
  await apiClient<ApiResponse<null>, { gender: Gender }>({
    endpoint: '/api/guide/gender',
    method: 'PATCH',
    body: { gender },
  })
}
