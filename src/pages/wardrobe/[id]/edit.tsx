import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeItem, WardrobeReviewDraft } from '@/modules/wardrobe/types'

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

type WardrobeEditContentProps = {
  item: WardrobeItem
}

const WardrobeEditContent = ({ item }: WardrobeEditContentProps) => {
  const [draft, setDraft] = useState<WardrobeReviewDraft>(() => createDraftFromItem(item))

  const isDisabled = !draft.name.trim() || !draft.colorKey

  return (
    <div className="bg-neutral-100 pb-24">
      <header className="flex items-center justify-between px-4 pt-5 pb-4">
        <Link href={`/wardrobe/${item.id}`} className="font-label-sm text-neutral-500">
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
          onClick={() => {
            showToast.error('目前尚未支援編輯衣物同步')
          }}
          className={`font-label-md h-11 w-full rounded-full ${
            isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
          }`}
        >
          儲存
        </button>
      </div>
    </div>
  )
}

const WardrobeEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { getItemById } = useWardrobeMock()

  const item = useMemo(() => {
    if (typeof id !== 'string') return null
    return getItemById(id)
  }, [getItemById, id])

  if (!item) {
    return (
      <div className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ← 返回我的衣櫃
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
