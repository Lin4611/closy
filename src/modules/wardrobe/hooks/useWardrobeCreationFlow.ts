import { useCallback, useMemo } from 'react'

import type {
  WardrobeCreationFlowContext,
  WardrobeProcessingStage,
  WardrobeRecognitionSource,
  WardrobeReviewDraft,
} from '@/modules/wardrobe/types'
import {
  clearWardrobeCreationFlowContext,
  clearWardrobeCreationFlowState,
  clearWardrobeProcessingStage,
  clearWardrobeReviewDraft,
  getWardrobeCreationFlowContext,
  getWardrobeProcessingStage,
  getWardrobeReviewDraft,
  patchWardrobeCreationFlowContext,
  saveWardrobeCreationFlowContext,
  saveWardrobeProcessingStage,
  saveWardrobeReviewDraft,
} from '@/modules/wardrobe/utils/creationFlowStorage'

let currentSourceFile: File | null = null

const mapFileToSourceFileMeta = (file: File) => ({
  name: file.name,
  size: file.size,
  type: file.type,
})

export const useWardrobeCreationFlow = () => {
  const getContext = useCallback(() => getWardrobeCreationFlowContext(), [])

  const initializeFlow = useCallback(
    (params: {
      entryType: WardrobeRecognitionSource
      file?: File | null
      previewUrl?: string
    }) => {
      currentSourceFile = params.file ?? null

      const nextContext: WardrobeCreationFlowContext = {
        entryType: params.entryType,
        previewUrl: params.previewUrl,
        sourceFile: params.file ? mapFileToSourceFileMeta(params.file) : undefined,
      }

      saveWardrobeCreationFlowContext(nextContext)
      return nextContext
    },
    []
  )

  const updateContext = useCallback((patch: Partial<WardrobeCreationFlowContext>) => {
    if (patch.sourceFile === undefined && patch.previewUrl === undefined) {
      return patchWardrobeCreationFlowContext(patch)
    }

    return patchWardrobeCreationFlowContext({
      ...patch,
      sourceFile: patch.sourceFile,
      previewUrl: patch.previewUrl,
    })
  }, [])

  const setSourceFile = useCallback((file: File | null, previewUrl?: string) => {
    currentSourceFile = file

    if (!file) {
      return patchWardrobeCreationFlowContext({
        sourceFile: undefined,
        previewUrl,
      })
    }

    return patchWardrobeCreationFlowContext({
      sourceFile: mapFileToSourceFileMeta(file),
      previewUrl,
    })
  }, [])

  const getSourceFile = useCallback(() => currentSourceFile, [])

  const clearSourceFile = useCallback(() => {
    currentSourceFile = null
  }, [])

  const saveReviewDraft = useCallback((draft: WardrobeReviewDraft) => {
    saveWardrobeReviewDraft(draft)
    return draft
  }, [])

  const getReviewDraft = useCallback(() => getWardrobeReviewDraft(), [])

  const clearReview = useCallback(() => {
    clearWardrobeReviewDraft()
  }, [])

  const setProcessingStage = useCallback((stage: WardrobeProcessingStage) => {
    saveWardrobeProcessingStage(stage)
    return stage
  }, [])

  const getProcessingStage = useCallback(() => getWardrobeProcessingStage(), [])

  const clearStage = useCallback(() => {
    clearWardrobeProcessingStage()
  }, [])

  const clearContext = useCallback(() => {
    clearWardrobeCreationFlowContext()
  }, [])

  const clearFlow = useCallback(() => {
    currentSourceFile = null
    clearWardrobeCreationFlowState()
  }, [])

  return useMemo(
    () => ({
      initializeFlow,
      getContext,
      updateContext,
      setSourceFile,
      getSourceFile,
      clearSourceFile,
      saveReviewDraft,
      getReviewDraft,
      clearReview,
      setProcessingStage,
      getProcessingStage,
      clearStage,
      clearContext,
      clearFlow,
    }),
    [
      clearContext,
      clearFlow,
      clearReview,
      clearSourceFile,
      clearStage,
      getContext,
      getProcessingStage,
      getReviewDraft,
      getSourceFile,
      initializeFlow,
      saveReviewDraft,
      setProcessingStage,
      setSourceFile,
      updateContext,
    ]
  )
}
