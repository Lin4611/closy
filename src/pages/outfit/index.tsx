import { useEffect, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { deleteOutfit } from '@/modules/outfit/api/delOutfit'
import { getOccasionList } from '@/modules/outfit/api/occasionList'
import { getOutfitList } from '@/modules/outfit/api/outfit'
import { OutfitsContentSection } from '@/modules/outfit/components/OutfitsContentSection'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setOccasionsList, setOutfitList } from '@/store/slices/outfitSlice'

const Outfit = () => {
  const dispatch = useAppDispatch()
  const { outfitList, occasionsList } = useAppSelector((state) => state.outfit)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const [list, summaryList] = await Promise.all([getOutfitList(), getOccasionList()])
      dispatch(setOutfitList(list))
      dispatch(setOccasionsList(summaryList))
    } catch {
      showToast.error('取得資料失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const delOutfit = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteOutfit(id)
      setDialogMode('success')
      const [list, summaryList] = await Promise.all([getOutfitList(), getOccasionList()])
      dispatch(setOutfitList(list))
      dispatch(setOccasionsList(summaryList))
    } catch {
      showToast.error('刪除穿搭失敗')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchAll()
    }
    load()
  }, [])

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

  return (
    <AppShell activeTab="outfit">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-4 py-3 shadow-[0px_1px_3px_0px_#18181B0D]">
          <h1 className="font-h1">我的穿搭</h1>
          <p className="font-paragraph-sm text-neutral-500">回顧已收藏的穿搭</p>
        </div>
        <OutfitsContentSection
          outfits={outfitList}
          onDelete={handleClickDelete}
          occasionsList={occasionsList}
        />
      </div>
      <ConfirmAlertDialog
        open={isDialogOpen}
        mode={dialogMode}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
    </AppShell>
  )
}

export default Outfit
