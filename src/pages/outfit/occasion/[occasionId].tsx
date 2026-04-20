import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { occasionMetaMap } from '@/modules/common/types/occasion'
import type { Occasion } from '@/modules/common/types/occasion'
import { deleteOutfit } from '@/modules/outfit/api/delOutfit'
import { getOccasionList } from '@/modules/outfit/api/occasionList'
import { getOutfitList } from '@/modules/outfit/api/outfit'
import { OutfitGridSkeleton } from '@/modules/outfit/components/OutfitCardSkeleton'
import { OutfitEmptyOverView } from '@/modules/outfit/components/OutfitEmptyOverView'
import { OutfitsOverview } from '@/modules/outfit/components/OutfitsOverview'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setOccasionsList, setOutfitList as setOutfitListCache } from '@/store/slices/outfitSlice'

const isValidOccasionId = (value: string) => {
  return occasionMetaMap.some((item) => item.key === value)
}

const OutfitOccasionDetail = () => {
  const dispatch = useAppDispatch()
  const cachedOutfitList = useAppSelector((state) => state.outfit.outfitList)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)

  const [outfitList, setOutfitList] = useState<OutfitItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const router = useRouter()
  const { occasionId } = router.query

  const fetchOutfitList = async (occasionKey: Occasion) => {
    setIsLoading(true)
    try {
      const list = await getOutfitList(occasionKey)
      setOutfitList(list)
    } catch {
      showToast.error('取得穿搭失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const delOutfit = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteOutfit(id)
      setDialogMode('success')
      const [list, summaryList] = await Promise.all([
        getOutfitList(occasionId as Occasion),
        getOccasionList(),
      ])
      setOutfitList(list)
      dispatch(setOutfitListCache(cachedOutfitList.filter((item) => item._id !== id)))
      dispatch(setOccasionsList(summaryList))
    } catch {
      showToast.error('刪除穿搭失敗')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    const occasion = occasionMetaMap.find((item) => item.key === occasionId)
    if (!occasion) return
    const load = async () => {
      await fetchOutfitList(occasion.key)
    }
    load()
  }, [router.isReady, occasionId])

  if (typeof occasionId !== 'string') {
    return null
  }

  const handleClickDelete = (outfitId: string) => {
    setSelectedOutfitId(outfitId)
    setDialogMode('confirm')
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedOutfitId) return
    await delOutfit(selectedOutfitId)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDialogMode('confirm')
      setSelectedOutfitId(null)
    }, 150)
  }

  if (!isValidOccasionId(occasionId)) {
    return (
      <AppShell activeTab="outfit">
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 bg-white px-4 py-[18px]">
            <div className="relative flex items-center justify-center">
              <Link
                href="/outfit"
                className="absolute left-0 flex size-10 items-center justify-center"
              >
                <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
              </Link>
              <h1 className="font-label-xxl">場合詳情</h1>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="font-label-md text-neutral-500">找不到這個場合</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const occasion = occasionMetaMap.find((item) => item.key === occasionId)

  return (
    <AppShell activeTab="outfit">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-white px-4 py-3">
          <div className="relative flex items-center justify-center">
            <Link
              href="/outfit"
              className="absolute left-0 flex size-10 items-center justify-center"
            >
              <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
            </Link>
            <h1 className="font-label-xxl">{occasion?.name}</h1>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col py-4">
          {isLoading ? (
            <OutfitGridSkeleton />
          ) : outfitList.length > 0 ? (
            <OutfitsOverview
              outfits={outfitList}
              onDelete={handleClickDelete}
              tab="groupByOccasion"
            />
          ) : (
            <OutfitEmptyOverView />
          )}
        </div>
        <ConfirmAlertDialog
          open={isDialogOpen}
          mode={dialogMode}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDialog}
        />
      </div>
    </AppShell>
  )
}

export default OutfitOccasionDetail
