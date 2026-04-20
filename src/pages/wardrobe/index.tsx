import { useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { AppShell } from '@/modules/common/components/AppShell'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { WardrobeFilterChips } from '@/modules/wardrobe/components/WardrobeFilterChips'
import { WardrobeGrid } from '@/modules/wardrobe/components/WardrobeGrid'
import { WardrobeHeader } from '@/modules/wardrobe/components/WardrobeHeader'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeCategoryKey } from '@/modules/wardrobe/types'

const WardrobePage = () => {
  const { items } = useWardrobeMock()
  const [activeCategory, setActiveCategory] = useState<WardrobeCategoryKey>('all')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const counts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.all = (acc.all ?? 0) + 1
        acc[item.category] = (acc[item.category] ?? 0) + 1
        return acc
      },
      {} as Partial<Record<WardrobeCategoryKey, number>>,
    )
  }, [items])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items
    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  return (
    <AppShell activeTab="wardrobe">
      <div className="relative">
        <WardrobeHeader />

        <main className="mt-16 space-y-6 pt-5">
          <WardrobeFilterChips
            activeCategory={activeCategory}
            counts={counts}
            onChange={setActiveCategory}
          />

          <WardrobeGrid items={filteredItems} onDelete={setDeleteTargetId} />
        </main>

        <DeleteClothingDialog
          open={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            setDeleteTargetId(null)
            showToast.error('目前尚未支援刪除衣物')
          }}
        />
      </div>
    </AppShell>
  )
}

export default WardrobePage
