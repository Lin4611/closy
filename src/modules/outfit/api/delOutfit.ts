import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'

export const deleteOutfit = async (id: string): Promise<string> => {
  const res = await apiClient<ApiResponse<string>>({
    endpoint: `/api/outfit/${id}`,
    method: 'DELETE',
  })

  return res.message
}
