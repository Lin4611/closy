import { ChevronLeft, EllipsisVertical, Package } from 'lucide-react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { fetchWardrobeServerItem } from '@/lib/api/wardrobe/shared'
import { AppShell } from '@/modules/common/components/AppShell'
import { SuccessAlertDialog } from '@/modules/common/components/SuccessAlertDialog'
import { deleteClothes } from '@/modules/wardrobe/api/deleteClothes'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { WardrobeColorPalette } from '@/modules/wardrobe/components/WardrobeColorPalette'
import { WardrobeDetailSection } from '@/modules/wardrobe/components/WardrobeDetailSection'
import { WardrobeItemMenu } from '@/modules/wardrobe/components/WardrobeItemMenu'
import { wardrobeCategoryOptions } from '@/modules/wardrobe/constants/categoryOptions'
import { wardrobeOccasionOptions } from '@/modules/wardrobe/constants/occasionOptions'
import { wardrobeSeasonOptions } from '@/modules/wardrobe/constants/seasonOptions'
import { useWardrobeLocalStore, useWardrobeServerItem } from '@/modules/wardrobe/hooks/useWardrobeLocalStore'
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

export const getServerSideProps: GetServerSideProps<{ initialItem: WardrobeItem }> = async ({ params, req }) => {
  const accessToken = req.cookies.accessToken
  const id = typeof params?.id === 'string' ? params.id : null

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!id) {
    return {
      notFound: true,
    }
  }

  try {
    const initialItem = await fetchWardrobeServerItem(accessToken, id)

    return {
      props: {
        initialItem,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      if (error.statusCode === 404) {
        return {
          notFound: true,
        }
      }
    }

    throw error
  }
}

const WardrobeDetailPage = ({ initialItem }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { deleteItem } = useWardrobeLocalStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const item = useWardrobeServerItem(initialItem)

  return (
    <AppShell activeTab="wardrobe">
      <div className="relative bg-neutral-100">
        <header className="relative flex items-center justify-center h-16 px-4 pt-5 pb-2">
          <Link href="/wardrobe" className="absolute left-4 flex size-10 items-center justify-center" aria-label="返回我的衣櫃">
            <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
          </Link>

          <div ref={menuRef} className="absolute right-4">
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

        <section className="min-h-[calc(100vh-248px)] rounded-t-[28px] bg-white px-4 pt-5 pb-10 shadow-[0_-2px_8px_rgba(15,23,42,0.04)]">
          <div>
            <h1 className="text-h3 text-neutral-900">
              {item.brand} {item.name}
            </h1>
            <p className="mt-1 font-paragraph-sm text-neutral-500">更新日期：{item.updatedAt}</p>
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
            void router.replace('/wardrobe')
          }}
        />
      </div>
    </AppShell>
  )
}

export default WardrobeDetailPage
