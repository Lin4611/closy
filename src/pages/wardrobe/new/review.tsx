import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { getOnboardingAddFlow, setOnboardingAddFlow } from '@/modules/guide/utils/onboardingAddFlow'
import { createClothes } from '@/modules/wardrobe/api/createClothes'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeCreationFlow } from '@/modules/wardrobe/hooks/useWardrobeCreationFlow'
import { useWardrobeLocalStore } from '@/modules/wardrobe/hooks/useWardrobeLocalStore'
import type { WardrobeReviewDraft } from '@/modules/wardrobe/types'
import { mapWardrobeReviewDraftToCreateClothesRequest } from '@/modules/wardrobe/utils/apiMappers'
import {
  getWardrobeBrandOptionsServerSnapshot,
  getWardrobeBrandOptionsSnapshot,
  mapWardrobeBrandValuesToOptions,
  persistWardrobeBrandOption,
  sanitizeWardrobeBrandValue,
  subscribeWardrobeBrandOptions,
} from '@/modules/wardrobe/utils/brandOptionsStorage'

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
  const { syncCreatedItemFromServer } = useWardrobeLocalStore()
  const { getContext, getReviewDraft, saveReviewDraft, completeCreateSuccess } = useWardrobeCreationFlow()

  const [draft, setDraft] = useState<WardrobeReviewDraft | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [successRedirectTo, setSuccessRedirectTo] = useState<string | null>(null)
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [pendingBrandValue, setPendingBrandValue] = useState('')
  const storedBrandOptions = useSyncExternalStore(
    subscribeWardrobeBrandOptions,
    getWardrobeBrandOptionsSnapshot,
    getWardrobeBrandOptionsServerSnapshot
  )


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

  const brandOptions = useMemo(() => {
    const nextOptions = storedBrandOptions

    if (!draft?.brand) {
      return mapWardrobeBrandValuesToOptions(nextOptions)
    }

    return mapWardrobeBrandValuesToOptions([...nextOptions, draft.brand])
  }, [draft?.brand, storedBrandOptions])

  const handleBrandAddStart = useCallback(() => {
    setIsAddingBrand(true)
    setPendingBrandValue('')
  }, [])

  const handleBrandAddCancel = useCallback(() => {
    setIsAddingBrand(false)
    setPendingBrandValue('')
  }, [])

  const handleBrandAddConfirm = useCallback(() => {
    const normalizedBrandValue = sanitizeWardrobeBrandValue(pendingBrandValue)

    if (!normalizedBrandValue || !draft) {
      return
    }

    persistWardrobeBrandOption(normalizedBrandValue)
    const nextDraft = { ...draft, brand: normalizedBrandValue }
    setDraft(nextDraft)
    saveReviewDraft(nextDraft)
    setIsAddingBrand(false)
    setPendingBrandValue('')
  }, [draft, pendingBrandValue, saveReviewDraft])

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
      completeCreateSuccess()

      setSuccessRedirectTo(getNextOnboardingRoute(createdItem.category))
      setIsSuccessDialogOpen(true)
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
    <>
      <div className="relative bg-neutral-100">
        <header className="sticky top-0 z-10 flex items-center justify-between w-full h-16 px-4 py-2.5 bg-neutral-100">
          <Link href={backHref} className="flex size-10 items-center justify-center" aria-label="返回圖片確認頁">
            <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
          </Link>
          <h1 className="font-label-xxl text-neutral-900">編輯衣物資訊</h1>
          <span className="size-10" />
        </header>

        <WardrobeReviewForm
          value={draft}
          onChange={handleDraftChange}
          brandField={{
            options: brandOptions,
            pendingValue: pendingBrandValue,
            isAdding: isAddingBrand,
            onPendingValueChange: setPendingBrandValue,
            onAddStart: handleBrandAddStart,
            onAddCancel: handleBrandAddCancel,
            onAddConfirm: handleBrandAddConfirm,
          }}
        />

        <div className="sticky right-0 bottom-0 left-0 z-10 mx-auto w-full bg-neutral-100 px-4 py-4">
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

      <ConfirmAlertDialog
        open={isSuccessDialogOpen}
        mode="settingSuccess"
        title="新增成功"
        onClose={() => {
          setIsSuccessDialogOpen(false)
          if (successRedirectTo) {
            void router.replace(successRedirectTo)
          }
        }}
      />
    </>
  )
}

export default WardrobeReviewPage
