import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { ApiError } from '@/lib/api/client'
import { Toast } from '@/modules/common/components/feedback/Toast'
import { AddClothingSheet } from '@/modules/common/components/overlay/AddClothingSheet'
import { analyzeClothes } from '@/modules/wardrobe/api/analyzeClothes'
import { removeBackground } from '@/modules/wardrobe/api/removeBackground'
import { RecognitionLoading } from '@/modules/wardrobe/components/RecognitionLoading'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { mapAnalyzeResponseToWardrobeReviewDraft } from '@/modules/wardrobe/utils/apiMappers'

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
    saveReviewDraft,
    setProcessingStage,
    updateContext,
    clearStage,
  } = useWardrobeCreationFlow()

  const [statusText, setStatusText] = useState('圖片去背中...')
  const [isFailure, setIsFailure] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [toastState, setToastState] = useState<{
    open: boolean
    message: string
    tone: 'success' | 'error'
  }>({
    open: false,
    message: '',
    tone: 'success',
  })

  const footerText = '請稍後...'

  useEffect(() => {
    let isCancelled = false

    const hideToastLater = (delay = 1800) => {
      window.setTimeout(() => {
        if (isCancelled) return
        setToastState((prev: { open: boolean; message: string; tone: 'success' | 'error' }) => ({ ...prev, open: false }))
      }, delay)
    }

    const openFailureState = (message: string) => {
      if (isCancelled) return

      setProcessingStage('failed')
      setIsFailure(true)
      setIsSheetOpen(true)
      setToastState({
        open: true,
        message,
        tone: 'error',
      })
      hideToastLater()
    }

    const startProcessing = async () => {
      const context = getContext()
      const sourceFile = getSourceFile()

      if (!context?.entryType || !sourceFile) {
        openFailureState('找不到待辨識圖片，請重新上傳')
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
          imageUrl: removeBackgroundResult.cloudinaryImageUrl,
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
        setToastState({
          open: true,
          message: '辨識成功！',
          tone: 'success',
        })

        hideToastLater(1200)
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
    router,
    saveReviewDraft,
    setProcessingStage,
    updateContext,
  ])

  if (isFailure) {
    return (
      <>
        <div className="flex min-h-screen flex-col bg-neutral-100">
          <header className="px-4 pt-5 pb-3">
            <div className="rounded-full bg-primary-100 px-3 py-2 text-center font-label-xs text-primary-900">
              {FAILURE_TIP_MESSAGE}
            </div>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="space-y-2">
              <p className="font-label-xxl text-neutral-900">辨識失敗</p>
              <p className="font-paragraph-sm text-neutral-500">請重新選擇新增方式後再試一次</p>
            </div>
          </main>
        </div>

        <AddClothingSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
        <Toast open={toastState.open} message={toastState.message} tone={toastState.tone} />
      </>
    )
  }

  return (
    <>
      <div className="relative min-h-screen bg-neutral-100">
        <RecognitionLoading title={statusText} description="" />
        <div className="absolute right-0 bottom-10 left-0 px-6 text-center font-paragraph-xs text-neutral-500">
          {footerText}
        </div>
      </div>
      <Toast open={toastState.open} message={toastState.message} tone={toastState.tone} />
    </>
  )
}

export default WardrobeProcessingPage
