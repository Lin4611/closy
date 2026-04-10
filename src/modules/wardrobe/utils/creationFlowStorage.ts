import {
  WARDROBE_CREATION_FLOW_STORAGE_KEY,
  WARDROBE_PENDING_RECOGNITION_SOURCE_STORAGE_KEY,
  WARDROBE_PROCESSING_STAGE_STORAGE_KEY,
  WARDROBE_REVIEW_DRAFT_STORAGE_KEY,
} from '@/modules/wardrobe/constants/storage'
import type {
  PendingRecognitionSource,
  WardrobeCategoryKey,
  WardrobeColorKey,
  WardrobeCreationFlowContext,
  WardrobeOccasionKey,
  WardrobeProcessingStage,
  WardrobeRecognitionSource,
  WardrobeReviewDraft,
  WardrobeSeasonKey,
} from '@/modules/wardrobe/types'
import { isWardrobeCreationEntryScope } from '@/modules/wardrobe/utils/creationFlowNavigation'

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

const wardrobeRecognitionSources: WardrobeRecognitionSource[] = ['camera', 'album']

const sanitizeString = (value: unknown) => (typeof value === 'string' ? value : '')

const sanitizeNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)

const sanitizeArray = <T extends string>(value: unknown, allowedValues: readonly T[]): T[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is T =>
    typeof item === 'string' && allowedValues.includes(item as T)
  )
}

const sanitizePreviewUrl = (value: unknown) => (typeof value === 'string' && value.length > 0 ? value : '')

const sanitizePendingRecognitionSource = (value: unknown): PendingRecognitionSource | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const origin = wardrobeRecognitionSources.includes(candidate.origin as WardrobeRecognitionSource)
    ? (candidate.origin as WardrobeRecognitionSource)
    : null
  const entryScope = isWardrobeCreationEntryScope(candidate.entryScope)
    ? candidate.entryScope
    : 'wardrobe'
  const previewUrl = sanitizePreviewUrl(candidate.previewUrl)
  const fileName = sanitizeString(candidate.fileName)
  const mimeType = sanitizeString(candidate.mimeType)
  const createdAt = sanitizeNumber(candidate.createdAt)

  if (!origin || !previewUrl || !fileName || !mimeType || createdAt <= 0) {
    return null
  }

  return {
    origin,
    entryScope,
    previewUrl,
    fileName,
    mimeType,
    createdAt,
  }
}

const sanitizeWardrobeCreationFlowContext = (
  value: unknown
): WardrobeCreationFlowContext | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const entryType = wardrobeRecognitionSources.includes(candidate.entryType as WardrobeRecognitionSource)
    ? (candidate.entryType as WardrobeRecognitionSource)
    : null

  const entryScope = isWardrobeCreationEntryScope(candidate.entryScope)
    ? candidate.entryScope
    : 'wardrobe'

  if (!entryType) {
    return null
  }

  const sourceFileCandidate =
    typeof candidate.sourceFile === 'object' && candidate.sourceFile !== null
      ? (candidate.sourceFile as Record<string, unknown>)
      : null

  const sourceFile = sourceFileCandidate
    ? {
        name: sanitizeString(sourceFileCandidate.name),
        size: sanitizeNumber(sourceFileCandidate.size),
        type: sanitizeString(sourceFileCandidate.type),
      }
    : undefined

  const removeBackgroundCandidate =
    typeof candidate.removeBackgroundResult === 'object' && candidate.removeBackgroundResult !== null
      ? (candidate.removeBackgroundResult as Record<string, unknown>)
      : null

  const analyzeCandidate =
    typeof candidate.analyzeResult === 'object' && candidate.analyzeResult !== null
      ? (candidate.analyzeResult as Record<string, unknown>)
      : null

  const analyzedCategory = wardrobeCategories.includes(
    analyzeCandidate?.category as Exclude<WardrobeCategoryKey, 'all'>
  )
    ? (analyzeCandidate?.category as Exclude<WardrobeCategoryKey, 'all'>)
    : null

  const analyzedColor = wardrobeColors.includes(analyzeCandidate?.color as WardrobeColorKey)
    ? (analyzeCandidate?.color as WardrobeColorKey)
    : null

  return {
    entryType,
    entryScope,
    confirmedAt:
      typeof candidate.confirmedAt === 'number' && Number.isFinite(candidate.confirmedAt)
        ? candidate.confirmedAt
        : undefined,
    previewUrl:
      typeof candidate.previewUrl === 'string' && candidate.previewUrl.length > 0
        ? candidate.previewUrl
        : undefined,
    sourceFile:
      sourceFile && sourceFile.name && sourceFile.type
        ? sourceFile
        : undefined,
    removeBackgroundResult:
      removeBackgroundCandidate &&
      typeof removeBackgroundCandidate.cloudinaryImageUrl === 'string' &&
      typeof removeBackgroundCandidate.imageHash === 'string'
        ? {
            cloudinaryImageUrl: removeBackgroundCandidate.cloudinaryImageUrl,
            imageHash: removeBackgroundCandidate.imageHash,
          }
        : undefined,
    analyzeResult:
      analyzeCandidate && analyzedCategory && analyzedColor
        ? {
            cloudImgUrl: sanitizeString(analyzeCandidate.cloudImgUrl),
            category: analyzedCategory,
            name: sanitizeString(analyzeCandidate.name),
            seasons: sanitizeArray(analyzeCandidate.seasons, wardrobeSeasons),
            occasions: sanitizeArray(analyzeCandidate.occasions, wardrobeOccasions),
            color: analyzedColor,
            brand: sanitizeString(analyzeCandidate.brand),
          }
        : undefined,
  }
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

  const parsed = safeParseJson<unknown>(window.sessionStorage.getItem(WARDROBE_CREATION_FLOW_STORAGE_KEY))

  return sanitizeWardrobeCreationFlowContext(parsed)
}

export const patchWardrobeCreationFlowContext = (
  patch: Partial<WardrobeCreationFlowContext>
): WardrobeCreationFlowContext | null => {
  const current = getWardrobeCreationFlowContext()

  if (!current && !patch.entryType) {
    return null
  }

  const nextContext = sanitizeWardrobeCreationFlowContext({
    ...(current ?? {}),
    ...patch,
  })

  if (!nextContext) {
    return null
  }

  saveWardrobeCreationFlowContext(nextContext)
  return nextContext
}

export const clearWardrobeCreationFlowContext = () => {
  if (!isClient()) return
  window.sessionStorage.removeItem(WARDROBE_CREATION_FLOW_STORAGE_KEY)
}

export const savePendingRecognitionSource = (pendingSource: PendingRecognitionSource) => {
  if (!isClient()) return

  const sanitizedPendingSource = sanitizePendingRecognitionSource(pendingSource)

  if (!sanitizedPendingSource) {
    return
  }

  window.sessionStorage.setItem(
    WARDROBE_PENDING_RECOGNITION_SOURCE_STORAGE_KEY,
    JSON.stringify(sanitizedPendingSource)
  )
}

export const getPendingRecognitionSource = (): PendingRecognitionSource | null => {
  if (!isClient()) return null

  const parsed = safeParseJson<unknown>(
    window.sessionStorage.getItem(WARDROBE_PENDING_RECOGNITION_SOURCE_STORAGE_KEY)
  )

  return sanitizePendingRecognitionSource(parsed)
}

export const clearPendingRecognitionSource = () => {
  if (!isClient()) return
  window.sessionStorage.removeItem(WARDROBE_PENDING_RECOGNITION_SOURCE_STORAGE_KEY)
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

export const clearPendingRecognitionState = () => {
  clearPendingRecognitionSource()
}

export const clearWardrobeCreationFlowState = () => {
  clearWardrobeCreationFlowContext()
  clearPendingRecognitionState()
  clearWardrobeReviewDraft()
  clearWardrobeProcessingStage()
}
