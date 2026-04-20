import type {
  CalendarEntryOutfitDisplayModel,
  CalendarOutfitCollectionStatus,
  CalendarResolvedOutfit,
  CalendarSelectedOutfitPreviewModel,
  SelectableOutfitSummary,
} from '@/modules/calendar/types'
import type { Occasion } from '@/modules/common/types/occasion'
import { mockOutfitDetails } from '@/modules/outfit/data/mockOutfits'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

const ISO_DATE_PREFIX_PATTERN = /^\d{4}-\d{2}-\d{2}(?:$|T)/

const formatSavedAt = (value: string) => {
  if (!ISO_DATE_PREFIX_PATTERN.test(value)) {
    return value
  }

  const normalizedValue = value.length === 10 ? `${value}T00:00:00` : value
  const date = new Date(normalizedValue)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}/${month}/${day}`
}

export const mapOutfitItemToSelectableOutfitSummary = (outfit: OutfitItem): SelectableOutfitSummary => ({
  id: outfit._id,
  imageUrl: outfit.outfitImgUrl,
  occasionKey: outfit.occasion,
  savedAt: formatSavedAt(outfit.createdAt),
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
      status: 'idle',
      outfit: null,
      errorMessage: null,
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


const createPreviewPlaceholder = ({
  outfitId,
  occasionKey,
  status,
  message,
}: {
  outfitId: string
  occasionKey?: Occasion | null
  status: Exclude<CalendarSelectedOutfitPreviewModel['previewStatus'], 'resolved'>
  message: string | null
}): CalendarSelectedOutfitPreviewModel => ({
  id: `calendar-preview-${status}-${outfitId}`,
  imageUrl: '',
  occasionKey: occasionKey ?? 'socialGathering',
  savedAt: '',
  itemNames: [],
  previewStatus: status,
  previewMessage: message,
})

export const mapResolvedOutfitToPreviewModel = ({
  resolvedOutfit,
  outfitId,
  occasionKey,
}: {
  resolvedOutfit: CalendarResolvedOutfit
  outfitId: string | null | undefined
  occasionKey?: Occasion | null
}): CalendarSelectedOutfitPreviewModel | null => {
  if (!outfitId) {
    return null
  }

  if (resolvedOutfit.status === 'ready' && resolvedOutfit.outfit) {
    return {
      ...resolvedOutfit.outfit,
      previewStatus: 'resolved',
      previewMessage: null,
    }
  }

  if (resolvedOutfit.status === 'loading') {
    return createPreviewPlaceholder({
      outfitId,
      occasionKey,
      status: 'loading',
      message: '正在載入穿搭預覽',
    })
  }

  if (resolvedOutfit.status === 'error') {
    return createPreviewPlaceholder({
      outfitId,
      occasionKey,
      status: 'error',
      message: resolvedOutfit.errorMessage ?? '目前無法取得穿搭資料',
    })
  }

  return createPreviewPlaceholder({
    outfitId,
    occasionKey,
    status: 'missing',
    message: '這套穿搭已不存在，請重新選擇',
  })
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


export const mapResolvedOutfitToEntryDisplayModel = ({
  resolvedOutfit,
}: {
  resolvedOutfit: CalendarResolvedOutfit
}): CalendarEntryOutfitDisplayModel => {
  if (resolvedOutfit.status === 'ready' && resolvedOutfit.outfit) {
    return {
      status: 'resolved',
      imageUrl: resolvedOutfit.outfit.imageUrl,
      message: null,
    }
  }

  if (resolvedOutfit.status === 'loading') {
    return {
      status: 'loading',
      imageUrl: null,
      message: '穿搭載入中',
    }
  }

  if (resolvedOutfit.status === 'error') {
    return {
      status: 'error',
      imageUrl: null,
      message: resolvedOutfit.errorMessage ?? '穿搭載入失敗',
    }
  }

  if (resolvedOutfit.status === 'missing') {
    return {
      status: 'missing',
      imageUrl: null,
      message: '這套穿搭已不存在',
    }
  }

  return {
    status: 'none',
    imageUrl: null,
    message: null,
  }
}
