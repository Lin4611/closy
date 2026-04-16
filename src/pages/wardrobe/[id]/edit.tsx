import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { updateClothes } from '@/modules/wardrobe/api/updateClothes'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeItem, WardrobeReviewDraft } from '@/modules/wardrobe/types'
import { mapWardrobeReviewDraftToUpdateClothesRequest } from '@/modules/wardrobe/utils/apiMappers'

const createDraftFromItem = (item: WardrobeItem): WardrobeReviewDraft => ({
  name: item.name,
  brand: item.brand,
  category: item.category,
  occasionKeys: item.occasionKeys,
  seasonKeys: item.seasonKeys,
  colorKey: item.colorKeys[0] ?? null,
  imageUrl: item.imageUrl,
  note: item.note,
})

const getSaveErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '編輯衣物失敗，請稍後再試'
}

type WardrobeEditContentProps = {
  item: WardrobeItem
}

const WardrobeEditContent = ({ item }: WardrobeEditContentProps) => {
  const router = useRouter()
  const { syncItemFromServer } = useWardrobeMock()
  const [draft, setDraft] = useState<WardrobeReviewDraft>(() => createDraftFromItem(item))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDisabled = !draft.name.trim() || !draft.colorKey || isSubmitting

  const handleSave = async () => {
    if (isDisabled) {
      return
    }

    try {
      setIsSubmitting(true)

      const payload = mapWardrobeReviewDraftToUpdateClothesRequest(draft)
      const updatedItem = await updateClothes(item.id, payload)

      syncItemFromServer(updatedItem)
      showToast.success('編輯成功')
      await router.replace(`/wardrobe/${updatedItem.id}`)
    } catch (error) {
      showToast.error(getSaveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-neutral-100 ">
      <header className="relative flex items-center justify-center h-16 px-4 pt-5 pb-4">
        <Link href={`/wardrobe/${item.id}`} className="absolute left-4 flex size-10 items-center justify-center" aria-label="返回衣物詳細頁">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-label-xxl text-neutral-900">編輯衣物資訊</h1>
        <span className="w-10" />
      </header>

      <WardrobeReviewForm value={draft} onChange={setDraft} />

      <div className="fixed right-0 bottom-0 left-0 z-40 mx-auto w-full max-w-93.75 bg-neutral-100 px-4 py-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => void handleSave()}
          className={`font-label-md h-11 w-full rounded-full ${isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
            }`}
        >
          {isSubmitting ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

const WardrobeEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { getItemById, isReady } = useWardrobeMock()

  const item = useMemo(() => {
    if (typeof id !== 'string') return null
    return getItemById(id)
  }, [getItemById, id])

  if (!router.isReady || !isReady || typeof id !== 'string') {
    return (
      <div className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">載入中...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">找不到可編輯的衣物</p>
        </div>
      </div>
    )
  }

  return <WardrobeEditContent key={item.id} item={item} />
}

export default WardrobeEditPage
