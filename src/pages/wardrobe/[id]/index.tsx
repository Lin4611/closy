import { EllipsisVertical, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { AppShell } from '@/modules/common/components/AppShell'
import { deleteClothes } from '@/modules/wardrobe/api/deleteClothes'
import { getClothesDetail } from '@/modules/wardrobe/api/getClothesDetail'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { WardrobeColorPalette } from '@/modules/wardrobe/components/WardrobeColorPalette'
import { WardrobeDetailSection } from '@/modules/wardrobe/components/WardrobeDetailSection'
import { WardrobeItemMenu } from '@/modules/wardrobe/components/WardrobeItemMenu'
import { wardrobeCategoryOptions } from '@/modules/wardrobe/constants/categoryOptions'
import { wardrobeOccasionOptions } from '@/modules/wardrobe/constants/occasionOptions'
import { wardrobeSeasonOptions } from '@/modules/wardrobe/constants/seasonOptions'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'
import type { WardrobeItem } from '@/modules/wardrobe/types'

const getDeleteErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '刪除衣物失敗，請稍後再試'
}

const WardrobeDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { deleteItem, getItemById, isReady, syncItemFromServer } = useWardrobeMock()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [item, setItem] = useState<WardrobeItem | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const hydratedDetailIdRef = useRef<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const cachedItem = useMemo(() => {
    if (typeof id !== 'string') return null
    return getItemById(id)
  }, [getItemById, id])

  useEffect(() => {
    if (!isReady || typeof id !== 'string') {
      return
    }

    if (hydratedDetailIdRef.current === id) {
      return
    }

    hydratedDetailIdRef.current = id

    let isActive = true

    setItem(cachedItem)
    setIsLoading(true)
    setIsNotFound(false)

    const loadWardrobeItem = async () => {
      try {
        const serverItem = await getClothesDetail(id)

        if (!isActive) {
          return
        }

        const syncedItem = syncItemFromServer(serverItem)
        setItem(syncedItem)
        setIsNotFound(false)
      } catch (error) {
        if (!isActive) {
          return
        }

        if (error instanceof ApiError && error.statusCode === 404) {
          deleteItem(id)
          setItem(null)
          setIsNotFound(true)
          return
        }

        if (!cachedItem) {
          setItem(null)
        }

        showToast.error('取得衣物資訊失敗')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadWardrobeItem()

    return () => {
      isActive = false
    }
  }, [cachedItem, deleteItem, id, isReady, syncItemFromServer])

  if (!isReady || typeof id !== 'string' || (isLoading && !item)) {
    return (
      <div className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ← 返回我的衣櫃
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">載入中...</p>
        </div>
      </div>
    )
  }

  if (isNotFound || !item) {
    return (
      <div className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ← 返回我的衣櫃
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">找不到這件衣物</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell activeTab="wardrobe">
      <div className="relative bg-neutral-100">
        <header className="flex items-center justify-between px-4 pt-5 pb-2">
          <Link href="/wardrobe" className="font-label-sm text-neutral-500">
            ←
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center text-neutral-700"
              aria-label="更多操作"
            >
              <EllipsisVertical className="h-4 w-4" strokeWidth={2.1} />
            </button>

            <WardrobeItemMenu
              open={isMenuOpen}
              onEdit={() => {
                setIsMenuOpen(false)
                void router.push(`/wardrobe/${item.id}/edit`)
              }}
              onDelete={() => {
                setIsMenuOpen(false)
                setIsDeleteOpen(true)
              }}
            />
          </div>
        </header>

        <section className="px-4 pt-1 pb-3">
          <div className="mx-auto flex h-47 items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <div className="relative h-full w-45">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            ) : (
              <Package className="h-20 w-20 text-neutral-300" strokeWidth={1.6} />
            )}
          </div>
        </section>

        <section className="min-h-[calc(100vh-248px)] rounded-t-[28px] bg-white px-4 pt-5 pb-24 shadow-[0_-2px_8px_rgba(15,23,42,0.04)]">
          <div>
            <h1 className="text-h3 text-neutral-900">
              {item.brand} {item.name}
            </h1>
            <p className="mt-1 font-paragraph-sm text-neutral-500">新增日期：{item.createdAt}</p>
          </div>

          <div className="mt-5 space-y-5">
            <WardrobeDetailSection title="類別">
              <div className="bg-primary-900 inline-flex rounded-full px-3 py-1 font-label-xs text-white">
                {wardrobeCategoryOptions.find((option) => option.key === item.category)?.label}
              </div>
            </WardrobeDetailSection>

            <WardrobeDetailSection title="場合">
              <div className="flex flex-wrap gap-2">
                {item.occasionKeys.map((key) => (
                  <span
                    key={key}
                    className="bg-primary-900 rounded-full px-3 py-1 font-label-xs text-white"
                  >
                    {wardrobeOccasionOptions.find((option) => option.key === key)?.label}
                  </span>
                ))}
              </div>
            </WardrobeDetailSection>

            <WardrobeDetailSection title="季節">
              <div className="flex flex-wrap gap-2">
                {item.seasonKeys.map((key) => (
                  <span
                    key={key}
                    className="bg-primary-900 rounded-full px-3 py-1 font-label-xs text-white"
                  >
                    {wardrobeSeasonOptions.find((option) => option.key === key)?.label}
                  </span>
                ))}
              </div>
            </WardrobeDetailSection>

            <WardrobeDetailSection title="色系">
              <div className="-mx-2">
                <WardrobeColorPalette
                  selectedKeys={item.colorKeys}
                  onChange={() => undefined}
                  displayKeys={item.colorKeys}
                  readOnly
                />
              </div>
            </WardrobeDetailSection>

            <WardrobeDetailSection title="品牌">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary-900 inline-flex rounded-full px-3 py-1 font-label-xs text-white">
                  {item.brand}
                </span>
                <span className="inline-flex items-center font-label-xs text-neutral-500">
                  新增品牌 +
                </span>
              </div>
            </WardrobeDetailSection>
          </div>
        </section>

        <DeleteClothingDialog
          open={isDeleteOpen}
          onClose={() => {
            if (isDeleting) {
              return
            }

            setIsDeleteOpen(false)
          }}
          onConfirm={() => {
            if (isDeleting) {
              return
            }

            void (async () => {
              try {
                setIsDeleting(true)
                await deleteClothes(item.id)
                deleteItem(item.id)
                setIsDeleteOpen(false)
                showToast.success('已刪除衣物')
                await router.replace('/wardrobe')
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

export default WardrobeDetailPage
