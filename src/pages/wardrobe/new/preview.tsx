import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Toast } from '@/modules/common/components/feedback/Toast'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
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
  const { getPendingSource, getPendingSourceFile, clearPendingSource, confirmPendingSource } = useWardrobeCreationFlow()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isMissingSource, setIsMissingSource] = useState(false)

  const pendingSource = getPendingSource()
  const pendingFile = getPendingSourceFile()

  const fallbackHref = getFallbackHref(pendingSource?.origin ?? null)
  const secondaryActionLabel = pendingSource?.origin === 'album' ? '重新選擇' : '重新拍攝'
  const pageTitle = pendingSource?.origin === 'album' ? '從相簿上傳' : '拍照預覽'

  const previewSrc = useMemo(() => {
    if (pendingSource?.previewUrl) {
      return pendingSource.previewUrl
    }

    if (pendingFile) {
      return URL.createObjectURL(pendingFile)
    }

    return ''
  }, [pendingFile, pendingSource?.previewUrl])

  useEffect(() => {
    if (pendingSource && pendingFile) {
      setIsMissingSource(false)
      return
    }

    setIsMissingSource(true)
    setToastMessage('找不到待確認圖片，請重新選擇來源')
  }, [pendingFile, pendingSource])

  useEffect(() => {
    if (!toastMessage) return

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  useEffect(() => {
    if (!pendingSource?.previewUrl && pendingFile && previewSrc) {
      return () => {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [pendingFile, pendingSource?.previewUrl, previewSrc])

  const handleConfirm = async () => {
    if (isSubmitting || !pendingSource || !pendingFile) {
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

    clearPendingSource()
    await router.push(fallbackHref)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href={fallbackHref} className="font-label-sm text-neutral-500">
          ←
        </Link>
        <h1 className="font-label-md text-neutral-900">{pageTitle}</h1>
        <span className="w-4" />
      </header>

      <main className="flex flex-1 flex-col px-4 pb-24">
        <section className="flex flex-1 items-center justify-center pb-6">
          <div className="flex w-full items-center justify-center overflow-hidden rounded-[12px] border border-neutral-200 bg-white p-4">
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-[12px] bg-neutral-50">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSrc}
                  alt="待確認衣物圖片"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Skeleton className="h-full w-full rounded-[12px]" />
              )}
            </div>
          </div>
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
