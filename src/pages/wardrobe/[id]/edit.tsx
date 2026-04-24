import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { fetchWardrobeServerItem } from '@/lib/api/wardrobe/shared'
import { SubPageHeader } from '@/modules/common/components/SubPageHeader'
import { updateClothes } from '@/modules/wardrobe/api/updateClothes'
import { WardrobeReviewForm } from '@/modules/wardrobe/components/WardrobeReviewForm'
import { useWardrobeLocalStore, useWardrobeServerItem } from '@/modules/wardrobe/hooks/useWardrobeLocalStore'
import type { WardrobeItem, WardrobeReviewDraft } from '@/modules/wardrobe/types'
import { mapWardrobeReviewDraftToUpdateClothesRequest } from '@/modules/wardrobe/utils/apiMappers'
import {
  getWardrobeBrandOptionsServerSnapshot,
  getWardrobeBrandOptionsSnapshot,
  mapWardrobeBrandValuesToOptions,
  persistWardrobeBrandOption,
  sanitizeWardrobeBrandValue,
  subscribeWardrobeBrandOptions,
} from '@/modules/wardrobe/utils/brandOptionsStorage'

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

export const getServerSideProps: GetServerSideProps<{ initialItem: WardrobeItem }> = async ({ params, req }) => {
  const accessToken = req.cookies.accessToken
  const id = typeof params?.id === 'string' ? params.id : null

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!id) {
    return {
      notFound: true,
    }
  }

  try {
    const initialItem = await fetchWardrobeServerItem(accessToken, id)

    return {
      props: {
        initialItem,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      if (error.statusCode === 404) {
        return {
          notFound: true,
        }
      }
    }

    throw error
  }
}

type WardrobeEditContentProps = {
  item: WardrobeItem
}

const WardrobeEditContent = ({ item }: WardrobeEditContentProps) => {
  const router = useRouter()
  const { syncItemFromServer } = useWardrobeLocalStore()
  const [draft, setDraft] = useState<WardrobeReviewDraft>(() => createDraftFromItem(item))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [pendingBrandValue, setPendingBrandValue] = useState('')
  const storedBrandOptions = useSyncExternalStore(
    subscribeWardrobeBrandOptions,
    getWardrobeBrandOptionsSnapshot,
    getWardrobeBrandOptionsServerSnapshot
  )

  const isDisabled = !draft.name.trim() || !draft.colorKey || isSubmitting

  const brandOptions = useMemo(() => {
    if (!draft.brand) {
      return mapWardrobeBrandValuesToOptions(storedBrandOptions)
    }

    return mapWardrobeBrandValuesToOptions([...storedBrandOptions, draft.brand])
  }, [draft.brand, storedBrandOptions])

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

    if (!normalizedBrandValue) {
      return
    }

    persistWardrobeBrandOption(normalizedBrandValue)
    setDraft((currentDraft) => ({ ...currentDraft, brand: normalizedBrandValue }))
    setIsAddingBrand(false)
    setPendingBrandValue('')
  }, [pendingBrandValue])

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
    <div className="relative bg-neutral-100">
      <SubPageHeader title="編輯衣物資訊" backHref={`/wardrobe/${item.id}`} backLabel="返回衣物詳細頁" />

      <WardrobeReviewForm
        value={draft}
        onChange={setDraft}
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
          className={`font-label-md h-11 w-full rounded-full ${isDisabled ? 'bg-neutral-300 text-neutral-500' : 'bg-primary-900 text-white'
            }`}
        >
          {isSubmitting ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

const WardrobeEditPage = ({ initialItem }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const item = useWardrobeServerItem(initialItem)

  return <WardrobeEditContent key={item.id} item={item} />
}

export default WardrobeEditPage
