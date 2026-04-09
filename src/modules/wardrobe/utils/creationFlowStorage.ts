import {
  WARDROBE_CREATION_FLOW_STORAGE_KEY,
  WARDROBE_PROCESSING_STAGE_STORAGE_KEY,
  WARDROBE_REVIEW_DRAFT_STORAGE_KEY,
} from '@/modules/wardrobe/constants/storage'
import type {
  WardrobeCreationFlowContext,
  WardrobeProcessingStage,
  WardrobeReviewDraft,
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
  window.sessionStorage.setItem(WARDROBE_REVIEW_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export const getWardrobeReviewDraft = (): WardrobeReviewDraft | null => {
  if (!isClient()) return null

  const parsed = safeParseJson<WardrobeReviewDraft>(
    window.sessionStorage.getItem(WARDROBE_REVIEW_DRAFT_STORAGE_KEY)
  )

  if (!parsed?.name || !parsed.category) {
    return null
  }

  return parsed
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
