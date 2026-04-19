import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useMemo, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { fetchWardrobeClothesList } from '@/lib/api/wardrobe/shared'
import { AppShell } from '@/modules/common/components/AppShell'
import { SuccessAlertDialog } from '@/modules/common/components/SuccessAlertDialog'
import { deleteClothes } from '@/modules/wardrobe/api/deleteClothes'
import { mapGetClothesListResponseToWardrobeItems } from '@/modules/wardrobe/api/mappers'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { WardrobeEmptyState } from '@/modules/wardrobe/components/WardrobeEmptyState'
import { WardrobeFilterChips } from '@/modules/wardrobe/components/WardrobeFilterChips'
import { WardrobeGrid } from '@/modules/wardrobe/components/WardrobeGrid'
import { WardrobeHeader } from '@/modules/wardrobe/components/WardrobeHeader'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeItem } from '@/modules/wardrobe/types'
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

export const getServerSideProps: GetServerSideProps<{ initialItems: WardrobeItem[] }> = async ({ req }) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const response = await fetchWardrobeClothesList(accessToken)

    return {
      props: {
        initialItems: mapGetClothesListResponseToWardrobeItems(response.data),
      },
    }
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    throw error
  }
}

const WardrobePage = ({ initialItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { deleteItem, hydrateItemsFromServer, isReady, items } = useWardrobeMock()
  const hasHydratedFromServerRef = useRef(false)
  const [activeCategory, setActiveCategory] = useState<WardrobeCategoryKey>('all')
  const [hasSyncedSsrItems, setHasSyncedSsrItems] = useState(false)

  useEffect(() => {
    if (!isReady || hasHydratedFromServerRef.current) {
      return
    }

    hydrateItemsFromServer(initialItems)
    hasHydratedFromServerRef.current = true
    setHasSyncedSsrItems(true)
  }, [hydrateItemsFromServer, initialItems, isReady])

  const displayItems = hasSyncedSsrItems ? items : initialItems

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)

  const counts = useMemo(() => {
    return displayItems.reduce(
      (acc, item) => {
        acc.all = (acc.all ?? 0) + 1
        acc[item.category] = (acc[item.category] ?? 0) + 1
        return acc
      },
      {} as Partial<Record<WardrobeCategoryKey, number>>,
    )
  }, [displayItems])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return displayItems
    return displayItems.filter((item) => item.category === activeCategory)
  }, [activeCategory, displayItems])

  const isWardrobeEmpty = filteredItems.length === 0

  return (
    <AppShell activeTab="wardrobe">
      <div className="flex min-h-[calc(100dvh-80px)] flex-col">
        <div className="sticky top-0 z-20 shrink-0 bg-neutral-100">
          <WardrobeHeader />
          <div className="py-5">
            <WardrobeFilterChips
              activeCategory={activeCategory}
              counts={counts}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {isWardrobeEmpty ? (
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WardrobeEmptyState />
          </main>
        ) : (
          <main className="min-h-0 flex-1 overflow-y-auto">
            <WardrobeGrid items={filteredItems} onDelete={setDeleteTargetId} />
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
                setIsDeleteSuccessOpen(true)
              } catch (error) {
                showToast.error(getDeleteErrorMessage(error))
              } finally {
                setIsDeleting(false)
              }
            })()
          }}
        />

        <SuccessAlertDialog
          open={isDeleteSuccessOpen}
          title="已刪除衣物"
          onClose={() => {
            setIsDeleteSuccessOpen(false)
          }}
        />
      </div>
    </AppShell>
  )
}

export default WardrobePage
