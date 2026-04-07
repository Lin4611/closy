import { useRef, useState } from 'react'

import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { OutfitsContentSection } from '@/modules/outfit/components/OutfitsContentSection'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'

const outfits: OutfitItem[] = [
  {
    outfitId: '1',
    imageUrl: '/outfit/mock-1.webp',
    occasionName: 'campusCasual',
    savedAt: '2022-01-01',
  },
  {
    outfitId: '2',
    imageUrl: '/outfit/mock-2.webp',
    occasionName: 'socialGathering',
    savedAt: '2022-01-01',
  },
  {
    outfitId: '3',
    imageUrl: '/outfit/mock-1.webp',
    occasionName: 'businessCasual',
    savedAt: '2022-01-01',
  },
  {
    outfitId: '4',
    imageUrl: '/outfit/mock-2.webp',
    occasionName: 'professional',
    savedAt: '2022-01-01',
  },
  {
    outfitId: '5',
    imageUrl: '/outfit/mock-1.webp',
    occasionName: 'businessCasual',
    savedAt: '2022-01-01',
  },
  {
    outfitId: '6',
    imageUrl: '/outfit/mock-2.webp',
    occasionName: 'professional',
    savedAt: '2022-01-01',
  },
]
const Outfit = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    <AppShell>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-4 py-3 shadow-[0px_1px_3px_0px_#18181B0D]">
          <h1 className="font-h1">我的穿搭</h1>
          <p className="font-paragraph-sm text-neutral-500">回顧已收藏的穿搭</p>
        </div>
        <OutfitsContentSection outfits={outfits} onDelete={handleClickDelete} />
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
