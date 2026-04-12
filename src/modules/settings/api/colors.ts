import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Colors } from '@/modules/settings/types/colorsTypes'

export const updateColors = async (colors: Colors[]): Promise<void> => {
  await apiClient<ApiResponse<null>, { colors: Colors[] }>({
    endpoint: '/api/profile/update-colors',
    method: 'PATCH',
    body: { colors },
  })
}
