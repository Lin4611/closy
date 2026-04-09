import {
  WARDROBE_CREATION_FLOW_STORAGE_KEY,
  WARDROBE_PROCESSING_STAGE_STORAGE_KEY,
  WARDROBE_REVIEW_DRAFT_STORAGE_KEY,
} from '@/modules/wardrobe/constants/storage'
import type {
  WardrobeCategoryKey,
  WardrobeColorKey,
  WardrobeCreationFlowContext,
  WardrobeOccasionKey,
  WardrobeProcessingStage,
  WardrobeReviewDraft,
  WardrobeSeasonKey,
} from '@/modules/wardrobe/types'

const isClient = () => typeof window !== 'undefined'

const safeParseJson = <T>(value: string | null): T | null => {
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}


const wardrobeCategories: Array<Exclude<WardrobeCategoryKey, 'all'>> = [
  'top',
  'pants',
  'skirt',
  'dress',
  'outer',
  'shoes',
]

const wardrobeOccasions: WardrobeOccasionKey[] = [
  'social',
  'campus_casual',
  'business_casual',
  'professional',
]

const wardrobeSeasons: WardrobeSeasonKey[] = ['spring', 'summer', 'autumn', 'winter']

const wardrobeColors: WardrobeColorKey[] = [
  'light_beige',
  'dark_gray_black',
  'neutral_gray',
  'earth_brown',
  'butter_yellow',
  'warm_orange_red',
  'rose_pink',
  'natural_green',
  'fresh_blue',
  'elegant_purple',
]

const sanitizeString = (value: unknown) => (typeof value === 'string' ? value : '')

const sanitizeArray = <T extends string>(value: unknown, allowedValues: readonly T[]): T[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is T =>
    typeof item === 'string' && allowedValues.includes(item as T)
  )
}

const sanitizeWardrobeReviewDraft = (value: unknown): WardrobeReviewDraft | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const category = wardrobeCategories.includes(candidate.category as Exclude<WardrobeCategoryKey, 'all'>)
    ? (candidate.category as Exclude<WardrobeCategoryKey, 'all'>)
    : null

  if (!category) {
    return null
  }

  const colorKey = wardrobeColors.includes(candidate.colorKey as WardrobeColorKey)
    ? (candidate.colorKey as WardrobeColorKey)
    : null

  return {
    name: sanitizeString(candidate.name),
    brand: sanitizeString(candidate.brand),
    category,
    occasionKeys: sanitizeArray(candidate.occasionKeys, wardrobeOccasions),
    seasonKeys: sanitizeArray(candidate.seasonKeys, wardrobeSeasons),
    colorKey,
    imageUrl: typeof candidate.imageUrl === 'string' ? candidate.imageUrl : undefined,
    note: typeof candidate.note === 'string' ? candidate.note : undefined,
  }
}

const isValidProcessingStage = (value: unknown): value is WardrobeProcessingStage => {
  return (
    value === 'idle' ||
    value === 'removingBackground' ||
    value === 'removeBackgroundCompleted' ||
    value === 'analyzing' ||
    value === 'completed' ||
    value === 'failed'
  )
}

export const saveWardrobeCreationFlowContext = (context: WardrobeCreationFlowContext) => {
  if (!isClient()) return
  window.sessionStorage.setItem(WARDROBE_CREATION_FLOW_STORAGE_KEY, JSON.stringify(context))
}

export const getWardrobeCreationFlowContext = (): WardrobeCreationFlowContext | null => {
  if (!isClient()) return null

  const parsed = safeParseJson<WardrobeCreationFlowContext>(
    window.sessionStorage.getItem(WARDROBE_CREATION_FLOW_STORAGE_KEY)
  )

  if (!parsed?.entryType) {
    return null
  }

  return parsed
}

export const patchWardrobeCreationFlowContext = (
  patch: Partial<WardrobeCreationFlowContext>
): WardrobeCreationFlowContext | null => {
  const current = getWardrobeCreationFlowContext()

  if (!current && !patch.entryType) {
    return null
  }

  const nextContext = {
    ...(current ?? {}),
    ...patch,
  } as WardrobeCreationFlowContext

  if (!nextContext.entryType) {
    return null
  }

  saveWardrobeCreationFlowContext(nextContext)
  return nextContext
}

export const clearWardrobeCreationFlowContext = () => {
  if (!isClient()) return
  window.sessionStorage.removeItem(WARDROBE_CREATION_FLOW_STORAGE_KEY)
}

export const saveWardrobeReviewDraft = (draft: WardrobeReviewDraft) => {
  if (!isClient()) return

  const sanitizedDraft = sanitizeWardrobeReviewDraft(draft)

  if (!sanitizedDraft) {
    return
  }

  window.sessionStorage.setItem(WARDROBE_REVIEW_DRAFT_STORAGE_KEY, JSON.stringify(sanitizedDraft))
}

export const getWardrobeReviewDraft = (): WardrobeReviewDraft | null => {
  if (!isClient()) return null

  const parsed = safeParseJson<unknown>(window.sessionStorage.getItem(WARDROBE_REVIEW_DRAFT_STORAGE_KEY))

  return sanitizeWardrobeReviewDraft(parsed)
}

export const clearWardrobeReviewDraft = () => {
  if (!isClient()) return
  window.sessionStorage.removeItem(WARDROBE_REVIEW_DRAFT_STORAGE_KEY)
}

export const saveWardrobeProcessingStage = (stage: WardrobeProcessingStage) => {
  if (!isClient()) return
  window.sessionStorage.setItem(WARDROBE_PROCESSING_STAGE_STORAGE_KEY, stage)
}

export const getWardrobeProcessingStage = (): WardrobeProcessingStage | null => {
  if (!isClient()) return null

  const stage = window.sessionStorage.getItem(WARDROBE_PROCESSING_STAGE_STORAGE_KEY)

  return isValidProcessingStage(stage) ? stage : null
}

export const clearWardrobeProcessingStage = () => {
  if (!isClient()) return
  window.sessionStorage.removeItem(WARDROBE_PROCESSING_STAGE_STORAGE_KEY)
}

export const clearWardrobeCreationFlowState = () => {
  clearWardrobeCreationFlowContext()
  clearWardrobeReviewDraft()
  clearWardrobeProcessingStage()
}
