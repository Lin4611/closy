import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import {
  RECOGNITION_ENTRY_KEY,
  type RecognitionEntry,
} from '@/modules/wardrobe/constants/recognition'
import {
  mockAlbumRecognitionDraft,
  mockRecognitionDraft,
} from '@/modules/wardrobe/data/mockWardrobeItems'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeDraftItem } from '@/modules/wardrobe/types'

const getRecognitionEntry = (): RecognitionEntry => {
  if (typeof window === 'undefined') {
    return 'camera'
  }

  return window.sessionStorage.getItem(RECOGNITION_ENTRY_KEY) === 'album' ? 'album' : 'camera'
}

const getInitialDraft = (
  getRecognitionDraft: () => WardrobeDraftItem | null
): WardrobeDraftItem => {
  const savedDraft = getRecognitionDraft()

  if (savedDraft) {
    return savedDraft
  }

  return getRecognitionEntry() === 'album' ? mockAlbumRecognitionDraft : mockRecognitionDraft
}

const WardrobeReviewPage = () => {
  const router = useRouter()
  const { addItem, clearRecognitionDraft, getRecognitionDraft } = useWardrobeMock()
  const [draft, setDraft] = useState<WardrobeDraftItem>(() => getInitialDraft(getRecognitionDraft))
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const isDisabled = !draft.name.trim() || !draft.brand.trim() || draft.colorKeys.length === 0

  const backHref = useMemo(() => {
    if (!router.isReady) {
      return '/wardrobe/new/camera'
    }

    return getRecognitionEntry() === 'album' ? '/wardrobe/new/album' : '/wardrobe/new/camera'
  }, [router.isReady])

  const handleSave = () => {
    addItem(draft)
    clearRecognitionDraft()
    setIsSuccessOpen(true)
  }

  const handleConfirm = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(RECOGNITION_ENTRY_KEY)
    }

    setIsSuccessOpen(false)
    void router.push('/wardrobe')
  }

  return (
    <div className="relative bg-neutral-100 pb-24">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href={backHref} className="font-label-sm text-neutral-500">
          ←
        </Link>
        <h1 className="font-label-md text-neutral-900">編輯衣物資訊</h1>
        <span className="w-4" />
      </header>

      <WardrobeReviewForm value={draft} onChange={setDraft} />

      <div className="fixed right-0 bottom-0 left-0 z-40 mx-auto w-full max-w-93.75 bg-neutral-100 px-4 py-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleSave}
          className={cn(
            'h-11 w-full rounded-full font-label-md',
            isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
          )}
        >
          儲存
        </button>
      </div>

      {isSuccessOpen ? (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-93.75 items-center justify-center bg-black/20 px-10">
          <div className="w-full rounded-[16px] bg-white px-5 pt-6 pb-5 shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
            <p className="mb-5 text-center font-label-md text-neutral-900">新增成功</p>
            <button
              type="button"
              onClick={handleConfirm}
              className="h-10 w-full rounded-full bg-primary-900 font-label-md text-white"
            >
              確認
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default WardrobeReviewPage