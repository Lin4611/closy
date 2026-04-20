import type {
  CreateClothesResponseData,
  DeleteClothesResponseData,
  GetClothesDetailResponseData,
  GetClothesListResponseData,
  UpdateClothesResponseData,
  WardrobeClothesApiItem,
} from './types'
import type { WardrobeItem } from '../types'
import { mapClothesApiItemToWardrobeItem } from '../utils/apiMappers'

export const mapWardrobeApiItemToWardrobeItem = (item: WardrobeClothesApiItem): WardrobeItem =>
  mapClothesApiItemToWardrobeItem(item)

export const mapWardrobeApiListToWardrobeItems = (items: WardrobeClothesApiItem[]): WardrobeItem[] =>
  items.map(mapWardrobeApiItemToWardrobeItem)

export const mapGetClothesListResponseToWardrobeItems = (
  response: GetClothesListResponseData
): WardrobeItem[] => mapWardrobeApiListToWardrobeItems(response.list)

export const mapGetClothesDetailResponseToWardrobeItem = (
  response: GetClothesDetailResponseData
): WardrobeItem => mapWardrobeApiItemToWardrobeItem(response)

export const mapCreateClothesResponseToWardrobeItem = (
  response: CreateClothesResponseData
): WardrobeItem => mapWardrobeApiItemToWardrobeItem(response)

export const mapUpdateClothesResponseToWardrobeItem = (
  response: UpdateClothesResponseData
): WardrobeItem => mapWardrobeApiItemToWardrobeItem(response)

export const mapDeleteClothesResponseToSuccess = (
  _response: DeleteClothesResponseData
): true => true
