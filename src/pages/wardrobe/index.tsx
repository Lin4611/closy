import { useMemo, useState } from 'react'

import { MobileBottomNav } from '@/modules/common/components/MobileBottomNav'
import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { AddClothingSheet } from '@/modules/wardrobe/components/AddClothingSheet'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { DeleteSuccessDialog } from '@/modules/wardrobe/components/DeleteSuccessDialog'
import { WardrobeFilterChips } from '@/modules/wardrobe/components/WardrobeFilterChips'
import { WardrobeGrid } from '@/modules/wardrobe/components/WardrobeGrid'
import { WardrobeHeader } from '@/modules/wardrobe/components/WardrobeHeader'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import { WardrobeCategoryKey } from '@/modules/wardrobe/types'

const WardrobePage = () => {
  const { items, deleteItem } = useWardrobeMock()
  const [activeCategory, setActiveCategory] = useState<WardrobeCategoryKey>('all')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)

  const counts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.all = (acc.all ?? 0) + 1
        acc[item.category] = (acc[item.category] ?? 0) + 1
        return acc
      },
      {} as Partial<Record<WardrobeCategoryKey, number>>
    )
  }, [items])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items
    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  return (
    <MobileLayout className="relative pb-24">
      <WardrobeHeader />

      <main className="relative pt-4 space-y-4">
        <WardrobeFilterChips
          activeCategory={activeCategory}
          counts={counts}
          onChange={setActiveCategory}
        />

        <WardrobeGrid
          items={filteredItems}
          onDelete={setDeleteTargetId}
        />
      </main>

      <AddClothingSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />

      <DeleteClothingDialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (!deleteTargetId) return
          deleteItem(deleteTargetId)
          setDeleteTargetId(null)
          setIsDeleteSuccessOpen(true)
        }}
      />

      <DeleteSuccessDialog
        open={isDeleteSuccessOpen}
        onClose={() => setIsDeleteSuccessOpen(false)}
      />

      <MobileBottomNav activeTab="wardrobe" onAddClick={() => setIsSheetOpen(true)} />
    </MobileLayout>
  )
}

export default WardrobePage