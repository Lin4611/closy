import { useCallback, useMemo } from 'react'

import type {
  PendingRecognitionSource,
  WardrobeCreationFlowContext,
  WardrobeProcessingStage,
  WardrobeRecognitionSource,
  WardrobeReviewDraft,
} from '@/modules/wardrobe/types'
import {
  clearPendingRecognitionSource,
  clearPendingRecognitionState,
  clearWardrobeCreationFlowContext,
  clearWardrobeCreationFlowState,
  clearWardrobeProcessingStage,
  clearWardrobeReviewDraft,
  getPendingRecognitionSource,
  getWardrobeCreationFlowContext,
  getWardrobeProcessingStage,
  getWardrobeReviewDraft,
  patchWardrobeCreationFlowContext,
  savePendingRecognitionSource,
  saveWardrobeCreationFlowContext,
  saveWardrobeProcessingStage,
  saveWardrobeReviewDraft,
} from '@/modules/wardrobe/utils/creationFlowStorage'

let currentSourceFile: File | null = null
let currentPendingSourceFile: File | null = null

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
      confirmedAt?: number
    }) => {
      currentSourceFile = params.file ?? null

      const nextContext: WardrobeCreationFlowContext = {
        entryType: params.entryType,
        confirmedAt: params.confirmedAt ?? Date.now(),
        previewUrl: params.previewUrl,
        sourceFile: params.file ? mapFileToSourceFileMeta(params.file) : undefined,
      }

      saveWardrobeCreationFlowContext(nextContext)
      return nextContext
    },
    []
  )

  const updateContext = useCallback((patch: Partial<WardrobeCreationFlowContext>) => {
    if (
      patch.sourceFile === undefined &&
      patch.previewUrl === undefined &&
      patch.confirmedAt === undefined
    ) {
      return patchWardrobeCreationFlowContext(patch)
    }

    return patchWardrobeCreationFlowContext({
      ...patch,
      sourceFile: patch.sourceFile,
      previewUrl: patch.previewUrl,
      confirmedAt: patch.confirmedAt,
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

  const setPendingSource = useCallback(
    (params: {
      origin: WardrobeRecognitionSource
      file: File | null
      previewUrl: string
      createdAt?: number
    }) => {
      currentPendingSourceFile = params.file

      if (!params.file) {
        clearPendingRecognitionSource()
        return null
      }

      const pendingSource: PendingRecognitionSource = {
        origin: params.origin,
        previewUrl: params.previewUrl,
        fileName: params.file.name,
        mimeType: params.file.type,
        createdAt: params.createdAt ?? Date.now(),
      }

      savePendingRecognitionSource(pendingSource)
      return pendingSource
    },
    []
  )

  const getPendingSource = useCallback(() => getPendingRecognitionSource(), [])

  const getPendingSourceFile = useCallback(() => currentPendingSourceFile, [])

  const clearPendingSource = useCallback(() => {
    currentPendingSourceFile = null
    clearPendingRecognitionState()
  }, [])

  const confirmPendingSource = useCallback(
    (params?: { confirmedAt?: number }) => {
      const pendingSource = getPendingRecognitionSource()

      if (!pendingSource || !currentPendingSourceFile) {
        return null
      }

      const confirmedContext = initializeFlow({
        entryType: pendingSource.origin,
        file: currentPendingSourceFile,
        previewUrl: pendingSource.previewUrl,
        confirmedAt: params?.confirmedAt ?? Date.now(),
      })

      currentPendingSourceFile = null
      clearPendingRecognitionState()

      return confirmedContext
    },
    [initializeFlow]
  )

  const hasConfirmedSource = useCallback(() => {
    const context = getWardrobeCreationFlowContext()
    return Boolean(context?.entryType && context.confirmedAt && currentSourceFile)
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
    currentPendingSourceFile = null
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
      setPendingSource,
      getPendingSource,
      getPendingSourceFile,
      clearPendingSource,
      confirmPendingSource,
      hasConfirmedSource,
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
      clearPendingSource,
      clearReview,
      clearSourceFile,
      clearStage,
      confirmPendingSource,
      getContext,
      getPendingSource,
      getPendingSourceFile,
      getProcessingStage,
      getReviewDraft,
      getSourceFile,
      hasConfirmedSource,
      initializeFlow,
      saveReviewDraft,
      setPendingSource,
      setProcessingStage,
      setSourceFile,
      updateContext,
    ]
  )
}
