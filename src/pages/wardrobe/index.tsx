import { useEffect, useMemo, useState } from 'react'

import { AppShell } from '@/modules/common/components/AppShell'
import { Toast } from '@/modules/common/components/feedback/Toast'
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
  const [isUnsupportedDeleteToastOpen, setIsUnsupportedDeleteToastOpen] = useState(false)

  useEffect(() => {
    if (!isUnsupportedDeleteToastOpen) return

    const timeoutId = window.setTimeout(() => {
      setIsUnsupportedDeleteToastOpen(false)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [isUnsupportedDeleteToastOpen])

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
            setIsUnsupportedDeleteToastOpen(true)
          }}
        />

        <Toast
          open={isUnsupportedDeleteToastOpen}
          message="目前尚未支援刪除衣物"
          tone="error"
        />
      </div>
    </AppShell>
  )
}

export default WardrobePage
