import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { RecognitionSuccessToast } from '@/modules/wardrobe/components/RecognitionSuccessToast'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { mockRecognitionDraft } from '@/modules/wardrobe/data/mockWardrobeItems'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import { WardrobeDraftItem } from '@/modules/wardrobe/types'

const WardrobeReviewPage = () => {
  const router = useRouter()
  const { addItem, clearRecognitionDraft, getRecognitionDraft } = useWardrobeMock()
  const [draft, setDraft] = useState<WardrobeDraftItem>(mockRecognitionDraft)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  useEffect(() => {
    const savedDraft = getRecognitionDraft()
    setDraft(savedDraft ?? mockRecognitionDraft)
  }, [getRecognitionDraft])

  const isDisabled = !draft.name.trim() || !draft.brand.trim() || draft.colorKeys.length === 0

  return (
    <MobileLayout className="bg-neutral-100 pb-24">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href="/wardrobe/new/camera" className="font-label-sm text-neutral-500">
          ←
        </Link>
        <h1 className="font-label-md text-neutral-900">編輯衣物資訊</h1>
        <span className="w-4" />
      </header>

      <WardrobeReviewForm value={draft} onChange={setDraft} />

      <div className="fixed right-0 bottom-0 left-0 z-40 mx-auto w-full max-w-[375px] bg-neutral-100 px-4 py-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => {
            addItem(draft)
            clearRecognitionDraft()
            setIsSuccessOpen(true)

            window.setTimeout(() => {
              setIsSuccessOpen(false)
              void router.push('/wardrobe')
            }, 900)
          }}
          className={`h-11 w-full rounded-full font-label-md ${isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
            }`}
        >
          儲存
        </button>
      </div>

      <RecognitionSuccessToast open={isSuccessOpen} message="新增成功" />
    </MobileLayout>
  )
}

export default WardrobeReviewPage