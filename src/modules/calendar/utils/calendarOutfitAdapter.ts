import type {
  CalendarOutfitCollectionStatus,
  CalendarResolvedOutfit,
  SelectableOutfitSummary,
} from '@/modules/calendar/types'
import type { Occasion } from '@/modules/common/types/occasion'
import { mockOutfitDetails } from '@/modules/outfit/data/mockOutfits'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

export const mapOutfitItemToSelectableOutfitSummary = (outfit: OutfitItem): SelectableOutfitSummary => ({
  id: outfit._id,
  imageUrl: outfit.outfitImgUrl,
  occasionKey: outfit.occasion,
  savedAt: outfit.createdAt,
  itemNames: outfit.selectedItems.map((item) => item.name),
})

export const mapOutfitItemsToSelectableOutfitSummaries = (outfits: OutfitItem[]) => {
  return outfits.map(mapOutfitItemToSelectableOutfitSummary)
}

export const filterSelectableOutfitSummariesByOccasion = (
  outfits: SelectableOutfitSummary[],
  occasionKey?: Occasion | null,
) => {
  if (!occasionKey) {
    return outfits
  }

  return outfits.filter((outfit) => outfit.occasionKey === occasionKey)
}

export const buildSelectableOutfitSummaryMap = (outfits: SelectableOutfitSummary[]) => {
  return outfits.reduce<Record<string, SelectableOutfitSummary>>((accumulator, outfit) => {
    accumulator[outfit.id] = outfit
    return accumulator
  }, {})
}

export const resolveSelectableOutfitById = ({
  outfitId,
  outfitsById,
  collectionStatus,
  errorMessage = null,
}: {
  outfitId: string | null | undefined
  outfitsById: Record<string, SelectableOutfitSummary>
  collectionStatus: CalendarOutfitCollectionStatus
  errorMessage?: string | null
}): CalendarResolvedOutfit => {
  if (!outfitId) {
    return {
      status: collectionStatus === 'error' ? 'error' : collectionStatus === 'loading' ? 'loading' : 'idle',
      outfit: null,
      errorMessage,
    }
  }

  if (collectionStatus === 'loading' || collectionStatus === 'idle') {
    return {
      status: 'loading',
      outfit: null,
      errorMessage,
    }
  }

  if (collectionStatus === 'error') {
    return {
      status: 'error',
      outfit: null,
      errorMessage,
    }
  }

  const outfit = outfitsById[outfitId] ?? null

  if (!outfit) {
    return {
      status: 'missing',
      outfit: null,
      errorMessage,
    }
  }

  return {
    status: 'ready',
    outfit,
    errorMessage: null,
  }
}

export const selectableOutfitSummaries: SelectableOutfitSummary[] = mockOutfitDetails.map((outfit) => ({
  id: outfit.id,
  imageUrl: outfit.imageUrl,
  occasionKey: outfit.occasionKey,
  savedAt: outfit.savedAt,
  itemNames: outfit.items.map((item) => item.name),
}))

export const getSelectableOutfitSummaries = (occasionKey?: Occasion | null) => {
  return filterSelectableOutfitSummariesByOccasion(selectableOutfitSummaries, occasionKey)
}

export const getSelectableOutfitSummaryById = (outfitId: string) => {
  return selectableOutfitSummaries.find((outfit) => outfit.id === outfitId) ?? null
}
