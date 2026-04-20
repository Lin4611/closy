import type { Occasion } from '@/modules/common/types/occasion'

export type OutfitTab = 'overview' | 'groupByOccasion'

export type OutfitProduct = {
  id: string
  name: string
  imageUrl: string
  category: string
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
  outfitId: string
  imageUrl: string
  occasionName: Occasion
  savedAt: string
}

export type OutfitDetailItem = OutfitProduct
