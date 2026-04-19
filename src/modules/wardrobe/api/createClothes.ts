import { requestCreatedWardrobeItem } from './shared'
import type { CreateClothesRequest } from './types'

export const createClothes = async (body: CreateClothesRequest) => requestCreatedWardrobeItem(body)
