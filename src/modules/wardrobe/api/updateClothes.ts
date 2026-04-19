import { requestUpdatedWardrobeItem } from './shared'
import type { UpdateClothesRequest } from './types'

export const updateClothes = async (id: string, body: UpdateClothesRequest) => requestUpdatedWardrobeItem(id, body)
