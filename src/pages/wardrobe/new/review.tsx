import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { getOnboardingAddFlow, setOnboardingAddFlow } from '@/modules/guide/utils/onboardingAddFlow'
import { createClothes } from '@/modules/wardrobe/api/createClothes'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeReviewDraft } from '@/modules/wardrobe/types'
import { mapWardrobeReviewDraftToCreateClothesRequest } from '@/modules/wardrobe/utils/apiMappers'

const getSaveErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '衣物新增失敗，請稍後再試'
}

const getNextOnboardingRoute = (savedCategory: WardrobeReviewDraft['category']) => {
  const onboardingStep = getOnboardingAddFlow()

  if (onboardingStep === 'top-required') {
    if (savedCategory !== 'top') {
      showToast.error('第一次請先新增上衣')
      return '/guide/add-top'
    }

    setOnboardingAddFlow('bottom-required')
    return '/guide/add-bottom?openAddDrawer=1'
  }

  if (onboardingStep === 'bottom-required') {
    if (savedCategory !== 'pants' && savedCategory !== 'skirt') {
      showToast.error('請再新增一件下身單品')
      return '/guide/add-bottom'
    }

    setOnboardingAddFlow('completed')
    return '/guide/complete'
  }

  return '/wardrobe'
}

const WardrobeReviewPage = () => {
  const router = useRouter()
  const { syncCreatedItemFromServer, clearRecognitionDraft } = useWardrobeMock()
  const { getContext, getReviewDraft, saveReviewDraft, clearFlow } = useWardrobeCreationFlow()

  const [draft, setDraft] = useState<WardrobeReviewDraft | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedDraft = getReviewDraft()

    if (!savedDraft) {
      void router.replace('/wardrobe/new')
      return
    }

    setDraft(savedDraft)
  }, [getReviewDraft, router])

  const isDisabled = !draft || !draft.name.trim() || !draft.colorKey || isSubmitting

  const backHref = useMemo(() => {
    if (!router.isReady) {
      return '/wardrobe/new/preview'
    }

    const context = getContext()
    return context?.entryType ? '/wardrobe/new/preview' : '/wardrobe/new'
  }, [getContext, router.isReady])

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
      showToast.error('找不到圖片處理結果，請重新新增衣物')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = mapWardrobeReviewDraftToCreateClothesRequest(draft, {
        cloudImgUrl: removeBackgroundResult.cloudinaryImageUrl,
        imageHash: removeBackgroundResult.imageHash,
      })

      const createdItem = await createClothes(payload)

      syncCreatedItemFromServer(createdItem)
      clearRecognitionDraft()
      clearFlow()

      const nextRoute = getNextOnboardingRoute(createdItem.category)

      await router.replace(nextRoute)
    } catch (error) {
      showToast.error(getSaveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!draft) {
    return null
  }

  return (
    <div className="relative bg-neutral-100">
      <header className="relative flex items-center justify-center h-16 px-4 pt-5 pb-4">
        <Link href={backHref} className="absolute left-4 flex size-10 items-center justify-center" aria-label="返回圖片確認頁">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-label-xxl text-neutral-900">編輯衣物資訊</h1>
        <span className="w-10" />
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
  )
}

export default WardrobeReviewPage
