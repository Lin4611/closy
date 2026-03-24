import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { RecognitionSuccessToast } from '@/modules/wardrobe/components/RecognitionSuccessToast'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import { WardrobeDraftItem } from '@/modules/wardrobe/types'

const WardrobeEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { getItemById, updateItem } = useWardrobeMock()
  const [draft, setDraft] = useState<WardrobeDraftItem | null>(null)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const item = useMemo(() => {
    if (typeof id !== 'string') return null
    return getItemById(id)
  }, [getItemById, id])

  useEffect(() => {
    if (!item) return

    setDraft({
      name: item.name,
      brand: item.brand,
      category: item.category,
      occasionKeys: item.occasionKeys,
      seasonKeys: item.seasonKeys,
      colorKeys: item.colorKeys,
      imageUrl: item.imageUrl,
      note: item.note,
    })
  }, [item])

  if (!item || !draft) {
    return (
      <MobileLayout className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ← 返回我的衣櫃
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">找不到可編輯的衣物</p>
        </div>
      </MobileLayout>
    )
  }

  const isDisabled = !draft.name.trim() || !draft.brand.trim() || draft.colorKeys.length === 0

  return (
    <MobileLayout className="bg-neutral-100 pb-24">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href={`/wardrobe/${item.id}`} className="font-label-sm text-neutral-500">
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
            if (typeof id !== 'string') return
            updateItem(id, draft)
            setIsSuccessOpen(true)
            window.setTimeout(() => {
              setIsSuccessOpen(false)
              void router.push(`/wardrobe/${id}`)
            }, 900)
          }}
          className={`h-11 w-full rounded-full font-label-md ${isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
            }`}
        >
          儲存
        </button>
      </div>

      <RecognitionSuccessToast open={isSuccessOpen} message="儲存成功" />
    </MobileLayout>
  )
}

export default WardrobeEditPage