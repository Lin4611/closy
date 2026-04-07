import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { OutfitEmptyOverView } from '@/modules/outfit/components/OutfitEmptyOverView'
import { OutfitsOverview } from '@/modules/outfit/components/OutfitsOverview'
import { mockOutfits } from '@/modules/outfit/data/mockOutfits'
import { occasionMetaMap } from '@/modules/outfit/types/outfitTypes'

const isValidOccasionId = (value: string) => {
  return occasionMetaMap.some((item) => item.id === value)
}

const OutfitOccasionDetail = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const router = useRouter()

  const { occasionId } = router.query
  if (typeof occasionId !== 'string') {
    return null
  }

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

  if (!isValidOccasionId(occasionId)) {
    return (
      <AppShell activeTab="outfit">
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 bg-white px-4 py-3">
            <div className="flex items-center gap-20">
              <Link href="/outfit" className="flex h-10 w-10 items-center justify-center">
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

  const occasion = occasionMetaMap.find((item) => item.id === occasionId)
  const filteredOutfits = mockOutfits.filter((outfit) => outfit.occasionKey === occasion?.key)

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
          {filteredOutfits.length > 0 ? (
            <OutfitsOverview
              outfits={filteredOutfits}
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
