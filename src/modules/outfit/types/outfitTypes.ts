import type { Occasion } from '@/modules/common/types/occasion'

export type OutfitTab = 'overview' | 'groupByOccasion'

export type OutfitProduct = {
  category: string
  name: string
  brand: string
  cloudImgUrl: string
}

export type OutfitListItem = {
  _id: string
  outfitImgUrl: string
  occasion: Occasion
  selectedItems: OutfitProduct[]
  createdAt: string
  updatedAt: string
}

export type OutfitDetail = OutfitListItem

export type AddOutfitItem = {
  outfitImgUrl: string
  occasion: Occasion
  outfitDate: string
  selectedItems: OutfitProduct[]
}

export type OutfitOccasionSummary = {
  occasionId: Occasion
  count: number
  recentDates: string[]
  description: string
  imageUrl: string
}

export type OutfitDetailItem = OutfitProduct

// Legacy aliases kept for current page / component boundaries.
export type OutfitItem = OutfitListItem
export type SummaryList = OutfitOccasionSummary
