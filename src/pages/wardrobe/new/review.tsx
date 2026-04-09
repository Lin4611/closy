import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { Toast } from '@/modules/common/components/feedback/Toast'
import { createClothes } from '@/modules/wardrobe/api/createClothes'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import {
  RECOGNITION_ENTRY_KEY,
  type RecognitionEntry,
} from '@/modules/wardrobe/constants/recognition'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeReviewDraft } from '@/modules/wardrobe/types'
import {
  mapCreateClothesResponseItemToWardrobeItem,
  mapWardrobeReviewDraftToCreateClothesRequest,
} from '@/modules/wardrobe/utils/apiMappers'

const getRecognitionEntry = (): RecognitionEntry => {
  if (typeof window === 'undefined') {
    return 'camera'
  }

  return window.sessionStorage.getItem(RECOGNITION_ENTRY_KEY) === 'album' ? 'album' : 'camera'
}

const getSaveErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '衣物新增失敗，請稍後再試'
}

const WardrobeReviewPage = () => {
  const router = useRouter()
  const { replaceItems, clearRecognitionDraft } = useWardrobeMock()
  const { getContext, getReviewDraft, saveReviewDraft, clearFlow } = useWardrobeCreationFlow()

  const [draft, setDraft] = useState<WardrobeReviewDraft | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastState, setToastState] = useState<{
    open: boolean
    message: string
    tone: 'success' | 'error'
  }>({
    open: false,
    message: '',
    tone: 'success',
  })

  useEffect(() => {
    const savedDraft = getReviewDraft()

    if (!savedDraft) {
      void router.replace('/wardrobe/new')
      return
    }

    setDraft(savedDraft)
  }, [getReviewDraft, router])

  const isDisabled =
    !draft || !draft.name.trim() || !draft.colorKey || isSubmitting

  const backHref = useMemo(() => {
    if (!router.isReady) {
      return '/wardrobe/new/camera'
    }

    return getRecognitionEntry() === 'album' ? '/wardrobe/new/album' : '/wardrobe/new/camera'
  }, [router.isReady])

  const handleDraftChange = (next: WardrobeReviewDraft) => {
    setDraft(next)
    saveReviewDraft(next)
  }

  const handleSave = async () => {
    if (!draft || isSubmitting) {
      return
    }

    const context = getContext()
    const removeBackgroundResult = context?.removeBackgroundResult

    if (!removeBackgroundResult) {
      setToastState({
        open: true,
        message: '找不到圖片處理結果，請重新新增衣物',
        tone: 'error',
      })
      return
    }

    try {
      setIsSubmitting(true)

      const payload = mapWardrobeReviewDraftToCreateClothesRequest(draft, {
        cloudImgUrl: removeBackgroundResult.cloudinaryImageUrl,
        imageHash: removeBackgroundResult.imageHash,
      })

      const result = await createClothes(payload)

      if (!Array.isArray(result.list) || result.list.length === 0) {
        throw new Error('新增衣物成功，但未取得衣櫃列表資料')
      }

      replaceItems(result.list.map(mapCreateClothesResponseItemToWardrobeItem))
      clearRecognitionDraft()
      clearFlow()

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(RECOGNITION_ENTRY_KEY)
        window.history.replaceState(null, '', '/wardrobe')
      }

      await router.replace('/wardrobe')
    } catch (error) {
      setToastState({
        open: true,
        message: getSaveErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!toastState.open) return

    const timer = window.setTimeout(() => {
      setToastState((prev) => ({ ...prev, open: false }))
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [toastState.open])

  if (!draft) {
    return null
  }

  return (
    <>
      <div className="relative bg-neutral-100 pb-24">
        <header className="flex items-center justify-between px-4 pt-5 pb-4">
          <Link href={backHref} className="font-label-sm text-neutral-500">
            ←
          </Link>
          <h1 className="font-label-md text-neutral-900">編輯衣物資訊</h1>
          <span className="w-4" />
        </header>

        <WardrobeReviewForm value={draft} onChange={handleDraftChange} />

        <div className="fixed right-0 bottom-0 left-0 z-40 mx-auto w-full max-w-93.75 bg-neutral-100 px-4 py-4">
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => void handleSave()}
            className={cn(
              'h-11 w-full rounded-full font-label-md',
              isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
            )}
          >
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </div>

      <Toast open={toastState.open} message={toastState.message} tone={toastState.tone} />
    </>
  )
}

export default WardrobeReviewPage
