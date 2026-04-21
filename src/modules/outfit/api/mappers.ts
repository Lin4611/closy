import { occasionMetaMap, type Occasion } from '@/modules/common/types/occasion'
import type {
  OutfitDetail,
  OutfitListItem,
  OutfitOccasionSummary,
  OutfitProduct,
} from '@/modules/outfit/types/outfitTypes'

import type {
  OutfitDetailResponseEnvelope,
  OutfitListItemResponse,
  OutfitListResponseData,
  OutfitOccasionSummaryResponse,
  OutfitProductResponse,
  OutfitSummaryResponseData,
} from './types'

const fallbackOccasion: Occasion = 'socialGathering'
const validOccasionKeys = new Set(occasionMetaMap.map((item) => item.key))

const toNonEmptyString = (value: unknown, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value : fallback
}

const toOccasion = (value: unknown): Occasion => {
  return typeof value === 'string' && validOccasionKeys.has(value as Occasion)
    ? (value as Occasion)
    : fallbackOccasion
}

const toStringArray = (value: unknown) => {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

const toProduct = (value: unknown): OutfitProduct | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const product = value as OutfitProductResponse

  return {
    category: toNonEmptyString(product.category),
    name: toNonEmptyString(product.name),
    brand: toNonEmptyString(product.brand),
    cloudImgUrl: toNonEmptyString(product.cloudImgUrl),
  }
}

export const mapOutfitProductResponse = (product: unknown): OutfitProduct | null => {
  return toProduct(product)
}

export const mapOutfitListItemResponse = (item: unknown): OutfitListItem | null => {
  if (typeof item !== 'object' || item === null) {
    return null
  }

  const candidate = item as OutfitListItemResponse
  const id = toNonEmptyString(candidate._id)
  const outfitImgUrl = toNonEmptyString(candidate.outfitImgUrl)

  if (!id || !outfitImgUrl) {
    return null
  }

  const selectedItems = Array.isArray(candidate.selectedItems)
    ? candidate.selectedItems
        .map((selectedItem) => mapOutfitProductResponse(selectedItem))
        .filter((selectedItem): selectedItem is OutfitProduct => selectedItem !== null)
    : []

  return {
    _id: id,
    outfitImgUrl,
    occasion: toOccasion(candidate.occasion),
    selectedItems,
    createdAt: toNonEmptyString(candidate.createdAt),
    updatedAt: toNonEmptyString(candidate.updatedAt),
  }
}

export const mapOutfitListResponseData = (data: OutfitListResponseData): OutfitListItem[] => {
  if (!Array.isArray(data.list)) {
    return []
  }

  return data.list
    .map((item) => mapOutfitListItemResponse(item))
    .filter((item): item is OutfitListItem => item !== null)
}

export const mapOutfitDetailFromListItem = (item: OutfitListItem): OutfitDetail => {
  return item
}


export const mapOutfitDetailResponseData = (data: unknown): OutfitDetail | null => {
  const directItem = mapOutfitListItemResponse(data)

  if (directItem) {
    return mapOutfitDetailFromListItem(directItem)
  }

  if (typeof data !== 'object' || data === null) {
    return null
  }

  const candidate = data as OutfitDetailResponseEnvelope
  const nestedItem = mapOutfitListItemResponse(candidate.item ?? candidate.outfit ?? candidate.detail)

  if (!nestedItem) {
    return null
  }

  return mapOutfitDetailFromListItem(nestedItem)
}

const mapOutfitOccasionSummaryResponse = (summary: unknown): OutfitOccasionSummary | null => {
  if (typeof summary !== 'object' || summary === null) {
    return null
  }

  const candidate = summary as OutfitOccasionSummaryResponse

  return {
    occasionId: toOccasion(candidate.occasionId),
    count: typeof candidate.count === 'number' && Number.isFinite(candidate.count) ? candidate.count : 0,
    recentDates: toStringArray(candidate.recentDates),
    description: toNonEmptyString(candidate.description),
    imageUrl: toNonEmptyString(candidate.imageUrl),
  }
}

export const mapOutfitSummaryResponseData = (data: OutfitSummaryResponseData): OutfitOccasionSummary[] => {
  if (!Array.isArray(data.summaryList)) {
    return []
  }

  return data.summaryList
    .map((summary) => mapOutfitOccasionSummaryResponse(summary))
    .filter((summary): summary is OutfitOccasionSummary => summary !== null)
}
