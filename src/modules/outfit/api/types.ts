import type { Occasion } from '@/modules/common/types/occasion'

export type OutfitProductResponse = {
  category?: unknown
  name?: unknown
  brand?: unknown
  cloudImgUrl?: unknown
}

export type OutfitListItemResponse = {
  _id?: unknown
  outfitImgUrl?: unknown
  occasion?: unknown
  selectedItems?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

export type OutfitOccasionSummaryResponse = {
  occasionId?: unknown
  count?: unknown
  recentDates?: unknown
  description?: unknown
  imageUrl?: unknown
}

export type OutfitListResponseData = {
  list?: unknown
}

export type OutfitSummaryResponseData = {
  summaryList?: unknown
}

export type DeleteOutfitResponseData = {
  message?: unknown
}

export type AddOutfitRequest = {
  outfitImgUrl: string
  occasion: Occasion
  outfitDate: string
  selectedItems: Array<{
    category: string
    name: string
    brand: string
    cloudImgUrl: string
  }>
}


export type OutfitDetailResponseEnvelope = {
  item?: unknown
  outfit?: unknown
  detail?: unknown
}
