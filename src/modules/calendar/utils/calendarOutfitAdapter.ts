import type { SelectableOutfitSummary } from '@/modules/calendar/types'
import type { Occasion } from '@/modules/common/types/occasion'
import { mockOutfitDetails } from '@/modules/outfit/data/mockOutfits'

export const selectableOutfitSummaries: SelectableOutfitSummary[] = mockOutfitDetails.map((outfit) => ({
  id: outfit.id,
  imageUrl: outfit.imageUrl,
  occasionKey: outfit.occasionKey,
  savedAt: outfit.savedAt,
  itemNames: outfit.items.map((item) => item.name),
}))

export const getSelectableOutfitSummaries = (occasionKey?: Occasion | null) => {
  if (!occasionKey) {
    return selectableOutfitSummaries
  }

  return selectableOutfitSummaries.filter((outfit) => outfit.occasionKey === occasionKey)
}

export const getSelectableOutfitSummaryById = (outfitId: string) => {
  return selectableOutfitSummaries.find((outfit) => outfit.id === outfitId) ?? null
}
