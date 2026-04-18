import { useEffect, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { getOutfitList } from '@/modules/outfit/api/outfit'
import { OutfitsContentSection } from '@/modules/outfit/components/OutfitsContentSection'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

const Outfit = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)
  const [outfitList, setOutfitList] = useState<OutfitItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchOutfitList = async () => {
    setIsLoading(true)
    try {
      const list = await getOutfitList()
      setOutfitList(list)
    } catch {
      showToast.error('取得穿搭失敗')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOutfitList()
  }, [])

  const handleClickDelete = (outfitId: string) => {
    setSelectedOutfitId(outfitId)
    setDialogMode('confirm')
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedOutfitId) return

    console.log('delete', selectedOutfitId)
    setDialogMode('success')
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
        <OutfitsContentSection outfits={outfitList} onDelete={handleClickDelete} />
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
