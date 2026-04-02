import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Occasion } from '@/modules/home/types/occasion'

export const updateOccasion = async (occasionId: Occasion): Promise<void> => {
  await apiClient<ApiResponse<null>, { occasionId: Occasion }>({
    endpoint: '/api/profile/update-occasion',
    method: 'PATCH',
    body: { occasionId },
  })
}
