import { useEffect, useMemo, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { AppShell } from '@/modules/common/components/AppShell'
import { deleteClothes } from '@/modules/wardrobe/api/deleteClothes'
import { getClothesList } from '@/modules/wardrobe/api/getClothesList'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { WardrobeEmptyState } from '@/modules/wardrobe/components/WardrobeEmptyState'
import { WardrobeFilterChips } from '@/modules/wardrobe/components/WardrobeFilterChips'
import { WardrobeGrid } from '@/modules/wardrobe/components/WardrobeGrid'
import { WardrobeHeader } from '@/modules/wardrobe/components/WardrobeHeader'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeCategoryKey } from '@/modules/wardrobe/types'

const getDeleteErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '刪除衣物失敗，請稍後再試'
}

const WardrobePage = () => {
  const { deleteItem, hydrateItemsFromServer, isReady, items } = useWardrobeMock()
  const hasHydratedFromServerRef = useRef(false)
  const [activeCategory, setActiveCategory] = useState<WardrobeCategoryKey>('all')

  useEffect(() => {
    if (!isReady || hasHydratedFromServerRef.current) {
      return
    }

    let isActive = true

    const hydrateWardrobeItems = async () => {
      try {
        const serverItems = await getClothesList()

        if (!isActive) {
          return
        }

        hydrateItemsFromServer(serverItems)
        hasHydratedFromServerRef.current = true
      } catch {
        if (!isActive) {
          return
        }

        hasHydratedFromServerRef.current = true
      }
    }

    void hydrateWardrobeItems()

    return () => {
      isActive = false
    }
  }, [hydrateItemsFromServer, isReady])

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const isWardrobeEmpty = filteredItems.length === 0

  return (
    <AppShell activeTab="wardrobe">
      <div className="relative flex min-h-[calc(100dvh-80px)] flex-col overflow-hidden">
        <div className="fixed top-0 left-1/2 z-20 w-full max-w-93.75 -translate-x-1/2 bg-white">
          <WardrobeHeader />
          <div className="pt-5 bg-neutral-100">
            <WardrobeFilterChips
              activeCategory={activeCategory}
              counts={counts}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {isWardrobeEmpty ? (
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-34">
            <WardrobeEmptyState />
          </main>
        ) : (
          <main className="flex min-h-0 flex-1 flex-col pt-34">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <WardrobeGrid items={filteredItems} onDelete={setDeleteTargetId} />
            </div>
          </main>
        )}

        <DeleteClothingDialog
          open={Boolean(deleteTargetId)}
          onClose={() => {
            if (isDeleting) {
              return
            }

            setDeleteTargetId(null)
          }}
          onConfirm={() => {
            if (!deleteTargetId || isDeleting) {
              return
            }

            void (async () => {
              try {
                setIsDeleting(true)
                await deleteClothes(deleteTargetId)
                deleteItem(deleteTargetId)
                setDeleteTargetId(null)
                showToast.success('已刪除衣物')
              } catch (error) {
                showToast.error(getDeleteErrorMessage(error))
              } finally {
                setIsDeleting(false)
              }
            })()
          }}
        />
      </div>
    </AppShell>
  )
}

export default WardrobePage
