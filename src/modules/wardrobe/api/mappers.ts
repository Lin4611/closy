import type {
  CreateClothesResponseData,
  DeleteClothesResponseData,
  GetClothesDetailResponseData,
  GetClothesListResponseData,
  UpdateClothesResponseData,
} from './types'
import type { WardrobeItem } from '../types'
import { mapClothesApiItemToWardrobeItem } from '../utils/apiMappers'

export const mapGetClothesListResponseToWardrobeItems = (
  response: GetClothesListResponseData
): WardrobeItem[] => response.list.map(mapClothesApiItemToWardrobeItem)

export const mapGetClothesDetailResponseToWardrobeItem = (
  response: GetClothesDetailResponseData
): WardrobeItem => mapClothesApiItemToWardrobeItem(response)

export const mapCreateClothesResponseToWardrobeItem = (
  response: CreateClothesResponseData
): WardrobeItem => mapClothesApiItemToWardrobeItem(response)

export const mapUpdateClothesResponseToWardrobeItem = (
  response: UpdateClothesResponseData
): WardrobeItem => mapClothesApiItemToWardrobeItem(response)

export const mapDeleteClothesResponseToSuccess = (
  _response: DeleteClothesResponseData
): true => true
