import { useEffect, useMemo, useState } from 'react'

import type { OutfitBaseline } from '@/lib/api/outfit/shared'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hydrateOutfitBaseline } from '@/store/slices/outfitSlice'

const getOutfitListSignature = (items: OutfitBaseline['outfitList']) => {
  return items
    .map((item) => `${item._id}:${item.updatedAt}:${item.outfitImgUrl}:${item.occasion}`)
    .join('|')
}

const getOutfitSummarySignature = (items: OutfitBaseline['occasionsList']) => {
  return items
    .map((item) => `${item.occasionId}:${item.count}:${item.recentDates.join(',')}:${item.imageUrl}`)
    .join('|')
}

export const useOutfitServerBaseline = (baseline: OutfitBaseline): OutfitBaseline => {
  const dispatch = useAppDispatch()
  const { outfitList, occasionsList, cacheRevision } = useAppSelector((state) => state.outfit)
  const [initialCacheRevision] = useState(cacheRevision)

  const baselineListSignature = useMemo(() => getOutfitListSignature(baseline.outfitList), [baseline.outfitList])
  const baselineSummarySignature = useMemo(
    () => getOutfitSummarySignature(baseline.occasionsList),
    [baseline.occasionsList],
  )
  const cachedListSignature = useMemo(() => getOutfitListSignature(outfitList), [outfitList])
  const cachedSummarySignature = useMemo(() => getOutfitSummarySignature(occasionsList), [occasionsList])

  useEffect(() => {
    dispatch(hydrateOutfitBaseline(baseline))
  }, [baseline, dispatch])

  const hasClientBaselineTakenOver =
    cacheRevision !== initialCacheRevision ||
    (cachedListSignature === baselineListSignature && cachedSummarySignature === baselineSummarySignature)

  if (!hasClientBaselineTakenOver) {
    return baseline
  }

  return {
    outfitList,
    occasionsList,
  }
}
