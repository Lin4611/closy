import { useEffect, useMemo, useState } from 'react'

import type { OutfitDetail } from '@/modules/outfit/types/outfitTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { syncOutfitFromServer } from '@/store/slices/outfitSlice'

const getOutfitItemSignature = (item: OutfitDetail | null) => {
  if (!item) {
    return ''
  }

  return `${item._id}:${item.updatedAt}:${item.outfitImgUrl}`
}

export const useOutfitServerItem = (initialItem: OutfitDetail) => {
  const dispatch = useAppDispatch()
  const { outfitList, cacheRevision } = useAppSelector((state) => state.outfit)
  const [initialCacheRevision] = useState(cacheRevision)

  useEffect(() => {
    dispatch(syncOutfitFromServer(initialItem))
  }, [dispatch, initialItem])

  const cachedItem = useMemo(() => outfitList.find((item) => item._id === initialItem._id) ?? null, [initialItem._id, outfitList])
  const initialItemSignature = useMemo(() => getOutfitItemSignature(initialItem), [initialItem])
  const cachedItemSignature = useMemo(() => getOutfitItemSignature(cachedItem), [cachedItem])

  const hasClientItemTakenOver =
    cacheRevision !== initialCacheRevision || cachedItemSignature === initialItemSignature

  return !hasClientItemTakenOver ? initialItem : cachedItem ?? initialItem
}
