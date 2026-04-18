import type { Occasion } from '@/modules/common/types/occasion'

export type OutfitTab = 'overview' | 'groupByOccasion'

export type OutfitProduct = {
  category: string
  name: string
  brand: string
  cloudImgUrl: string
}

export type OutfitSummary = {
  id: string
  imageUrl: string
  occasionKey: Occasion
  savedAt: string
}

export type OutfitDetail = OutfitSummary & {
  items: OutfitProduct[]
}

export type OutfitItem = {
  _id: string
  outfitImgUrl: string
  occasion: Occasion
  selectedItems: OutfitProduct[]
  createdAt: string
  updatedAt: string
}

export type AddOutfitItem = {
  outfitImgUrl: string
  occasion: Occasion
  selectedItems: OutfitProduct[]
}

export type SummaryList = {
  occasionId: Occasion
  count: number
  recentDates: string[]
} & {
  description: string
  imageUrl: string
}

export type OutfitDetailItem = OutfitProduct
