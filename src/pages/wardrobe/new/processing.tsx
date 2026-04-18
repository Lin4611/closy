import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { AddClothingDrawer } from '@/modules/common/components/overlay/AddClothingDrawer'
import { analyzeClothes } from '@/modules/wardrobe/api/analyzeClothes'
import { removeBackground } from '@/modules/wardrobe/api/removeBackground'
import { RecognitionLoading } from '@/modules/wardrobe/components/RecognitionLoading'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { mapAnalyzeResponseToWardrobeReviewDraft } from '@/modules/wardrobe/utils/apiMappers'
import {
  getCreationFlowSourceRoute,
  resolveCreationFlowEntryScope,
} from '@/modules/wardrobe/utils/creationFlowNavigation'

const FAILURE_TIP_MESSAGE = '建議更換較清楚衣物圖片'

const getProcessingErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '辨識失敗，請重新選擇衣物圖片'
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const WardrobeProcessingPage = () => {
  const router = useRouter()
  const {
    getContext,
    getSourceFile,
    hasConfirmedSource,
    saveReviewDraft,
    setProcessingStage,
    updateContext,
    clearStage,
  } = useWardrobeCreationFlow()

  const [statusText, setStatusText] = useState('圖片去背中...')
  const [isFailure, setIsFailure] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const currentContext = getContext()
  const entryScope = resolveCreationFlowEntryScope({ router, context: currentContext })

  const handleNavigateCamera = () => {
    setIsSheetOpen(false)
    void router.push(getCreationFlowSourceRoute('camera', entryScope))
  }

  const handleNavigateAlbum = () => {
    setIsSheetOpen(false)
    void router.push(getCreationFlowSourceRoute('album', entryScope))
  }

  const shouldUseFailureSheet = useMemo(() => {
    const context = getContext()
    return entryScope === 'wardrobe' && !context?.entryType
  }, [entryScope, getContext])

  useEffect(() => {
    let isCancelled = false

    const openFailureState = (message: string) => {
      if (isCancelled) return

      setProcessingStage('failed')
      setIsFailure(true)
      setIsSheetOpen(shouldUseFailureSheet)
      showToast.error(message)
    }

    const startProcessing = async () => {
      const context = getContext()
      const sourceFile = getSourceFile()

      if (!context?.entryType || !context.confirmedAt || !sourceFile || !hasConfirmedSource()) {
        openFailureState('找不到已確認的圖片，請重新拍攝或重新選擇')
        return
      }

      try {
        setProcessingStage('removingBackground')
        setStatusText('圖片去背中...')

        const formData = new FormData()
        formData.append('image', sourceFile)

        const removeBackgroundResult = await removeBackground(formData)

        if (isCancelled) return

        updateContext({
          removeBackgroundResult: {
            cloudinaryImageUrl: removeBackgroundResult.cloudinaryImageUrl,
            imageHash: removeBackgroundResult.imageHash,
          },
        })

        setProcessingStage('removeBackgroundCompleted')
        setStatusText('圖片去背完成')

        await wait(500)

        if (isCancelled) return

        setProcessingStage('analyzing')
        setStatusText('正在辨識中...')

        const analyzeResult = await analyzeClothes({
          cloudinaryImageUrl: removeBackgroundResult.cloudinaryImageUrl,
          imageHash: removeBackgroundResult.imageHash,
        })

        if (isCancelled) return

        const reviewDraft = mapAnalyzeResponseToWardrobeReviewDraft(analyzeResult)

        saveReviewDraft(reviewDraft)
        updateContext({
          analyzeResult: {
            cloudImgUrl: analyzeResult.cloudImgUrl,
            category: reviewDraft.category,
            name: analyzeResult.name,
            seasons: reviewDraft.seasonKeys,
            occasions: reviewDraft.occasionKeys,
            color: reviewDraft.colorKey ?? 'light_beige',
            brand: analyzeResult.brand,
          },
        })

        setProcessingStage('completed')
        showToast.success('辨識成功！')

        await wait(700)

        if (isCancelled) return

        clearStage()
        void router.replace('/wardrobe/new/review')
      } catch (error) {
        openFailureState(getProcessingErrorMessage(error))
      }
    }

    void startProcessing()

    return () => {
      isCancelled = true
    }
  }, [
    clearStage,
    getContext,
    getSourceFile,
    hasConfirmedSource,
    router,
    saveReviewDraft,
    setProcessingStage,
    shouldUseFailureSheet,
    updateContext,
  ])

  if (isFailure) {
    const context = getContext()
    const retryHref = context?.entryType
      ? '/wardrobe/new/preview'
      : getCreationFlowSourceRoute(null, entryScope)
    const retryLabel = context?.entryType ? '回到圖片確認' : '重新選擇新增方式'

    return (
      <>
        <div className="flex min-h-screen flex-col bg-neutral-100">
          <header className="px-4 pt-14 pb-3">
            <div className="rounded-[12px] bg-[#FDF0F0] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-label-xs rounded-full bg-[#D9534F] px-2 py-1 text-white">
                  小提醒
                </span>
                <span className="font-paragraph-sm text-neutral-700">{FAILURE_TIP_MESSAGE}</span>
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center px-6 pb-48 text-center">
            <div className="space-y-2">
              <p className="font-label-xxl text-neutral-900">辨識失敗</p>
            </div>

            {!shouldUseFailureSheet ? (
              <button
                type="button"
                onClick={() => {
                  void router.replace(retryHref)
                }}
                className="bg-primary-900 font-label-md mt-6 rounded-full px-5 py-3 text-white"
              >
                {retryLabel}
              </button>
            ) : null}
          </main>
        </div>

        <AddClothingDrawer
          open={isSheetOpen}
          onOpenChange={(open) => {
            if (!open) return
            setIsSheetOpen(true)
          }}
          onCameraClick={handleNavigateCamera}
          onAlbumClick={handleNavigateAlbum}
          dismissible={false}
        />
      </>
    )
  }

  return (
    <div className="relative min-h-screen bg-neutral-100">
      <RecognitionLoading title={statusText} description="請稍後..." />
    </div>
  )
}

export default WardrobeProcessingPage
