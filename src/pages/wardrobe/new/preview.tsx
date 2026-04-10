import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Toast } from '@/modules/common/components/feedback/Toast'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { RecognitionImagePreview } from '@/modules/wardrobe/components/RecognitionImagePreview'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { confirmPendingRecognitionSource } from '@/modules/wardrobe/utils/confirmPendingRecognitionSource'

const getFallbackHref = (origin: 'camera' | 'album' | null) => {
  if (origin === 'album') {
    return '/wardrobe/new/album'
  }

  return '/wardrobe/new/camera'
}

const WardrobePreviewPage = () => {
  const router = useRouter()
  const {
    getContext,
    getPendingSource,
    getPendingSourceFile,
    getSourceFile,
    hasConfirmedSource,
    clearFlow,
    confirmPendingSource,
  } = useWardrobeCreationFlow()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isMissingSource, setIsMissingSource] = useState(false)

  const pendingSource = getPendingSource()
  const pendingFile = getPendingSourceFile()
  const confirmedContext = getContext()
  const confirmedFile = getSourceFile()

  const activeOrigin = pendingSource?.origin ?? confirmedContext?.entryType ?? null
  const fallbackHref = getFallbackHref(activeOrigin)
  const secondaryActionLabel = activeOrigin === 'album' ? '重新選擇' : '重新拍攝'
  const pageTitle = activeOrigin === 'album' ? '從相簿上傳' : '圖片確認'

  const sourceMode = useMemo<'pending' | 'confirmed' | 'missing'>(() => {
    if (pendingSource && pendingFile) {
      return 'pending'
    }

    if (confirmedContext?.entryType && confirmedContext.confirmedAt && confirmedFile && hasConfirmedSource()) {
      return 'confirmed'
    }

    return 'missing'
  }, [confirmedContext?.confirmedAt, confirmedContext?.entryType, confirmedFile, hasConfirmedSource, pendingFile, pendingSource])

  const previewSrc = useMemo(() => {
    if (pendingSource?.previewUrl) {
      return pendingSource.previewUrl
    }

    if (confirmedContext?.previewUrl) {
      return confirmedContext.previewUrl
    }

    return ''
  }, [confirmedContext?.previewUrl, pendingSource?.previewUrl])

  useEffect(() => {
    if (sourceMode !== 'missing') {
      setIsMissingSource(false)
      return
    }

    setIsMissingSource(true)
    setToastMessage('找不到待確認圖片，請重新選擇來源')
  }, [sourceMode])

  useEffect(() => {
    if (!toastMessage) return

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])


  const handleConfirm = async () => {
    if (isSubmitting) {
      return
    }

    if (sourceMode === 'confirmed') {
      await router.push('/wardrobe/new/processing')
      return
    }

    if (!pendingSource || !pendingFile) {
      setToastMessage('找不到待確認圖片，請重新選擇來源')
      setIsMissingSource(true)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await confirmPendingRecognitionSource({
        router,
        pendingSource,
        pendingFile,
        confirmPendingSource,
      })

      if (!result) {
        setIsMissingSource(true)
        setToastMessage('找不到待確認圖片，請重新選擇來源')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async () => {
    if (isSubmitting) return

    clearFlow()
    await router.push(fallbackHref)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <button
          type="button"
          onClick={() => {
            void handleReset()
          }}
          className="flex size-8 items-center justify-center text-neutral-500"
          aria-label="返回上一頁"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="font-label-md text-neutral-900">{pageTitle}</h1>
        <span className="w-8" />
      </header>

      <main className="flex flex-1 flex-col px-4 pb-24">
        <section className="flex flex-1 items-center justify-center pb-6">
          <RecognitionImagePreview src={previewSrc || undefined} alt="待確認衣物圖片" />
        </section>

        <div className="space-y-3 pt-4">
          <PrimaryButton
            content="使用這張"
            disabled={!previewSrc || isMissingSource}
            loading={isSubmitting}
            onClick={() => {
              void handleConfirm()
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full rounded-full text-neutral-700"
            disabled={isSubmitting}
            onClick={() => {
              void handleReset()
            }}
          >
            {secondaryActionLabel}
          </Button>

          <p className="text-center font-paragraph-xs text-neutral-500">
            確認圖片無誤後再開始辨識，能降低錯誤結果。
          </p>
        </div>
      </main>

      <Toast open={Boolean(toastMessage)} message={toastMessage} tone="error" />
    </div>
  )
}

export default WardrobePreviewPage
