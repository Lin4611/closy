import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import type { Styles } from '@/modules/settings/types/stylesTypes'

export const updateStyles = async (styles: Styles[]): Promise<void> => {
  await apiClient<ApiResponse<null>, { styles: Styles[] }>({
    endpoint: '/api/profile/update-styles',
    method: 'PATCH',
    body: { styles },
  })
}
