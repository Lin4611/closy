import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { DeleteClothingDialog } from '@/modules/wardrobe/components/DeleteClothingDialog'
import { DeleteSuccessDialog } from '@/modules/wardrobe/components/DeleteSuccessDialog'
import { WardrobeDetailSection } from '@/modules/wardrobe/components/WardrobeDetailSection'
import { WardrobeItemMenu } from '@/modules/wardrobe/components/WardrobeItemMenu'
import { wardrobeCategoryOptions } from '@/modules/wardrobe/constants/categoryOptions'
import { wardrobeColorOptions } from '@/modules/wardrobe/constants/colorOptions'
import { wardrobeOccasionOptions } from '@/modules/wardrobe/constants/occasionOptions'
import { wardrobeSeasonOptions } from '@/modules/wardrobe/constants/seasonOptions'
import { useWardrobeMock } from '@/modules/wardrobe/hooks/useWardrobeMock'

const WardrobeDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { getItemById, deleteItem } = useWardrobeMock()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)

  const item = useMemo(() => {
    if (typeof id !== 'string') return null
    return getItemById(id)
  }, [getItemById, id])

  if (!item) {
    return (
      <MobileLayout className="px-4 py-10">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ← 返回我的衣櫃
        </Link>
        <div className="mt-10 rounded-[24px] bg-white p-6 text-center">
          <p className="font-label-md text-neutral-900">找不到這件衣物</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout className="relative min-h-screen bg-neutral-100 pb-24">
      <div className="px-4 pt-5 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/wardrobe" className="font-label-sm text-neutral-500">
            ←
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center font-label-xl text-neutral-700"
            >
              ⋮
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
        </div>

        <section className="pb-4">
          <div className="mx-auto flex h-[188px] items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <div className="relative h-full w-[180px]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="min-h-[calc(100vh-248px)] rounded-t-[28px] bg-white px-4 pt-4 pb-24 shadow-[0_-2px_8px_rgba(15,23,42,0.04)]">
        <div>
          <h1 className="text-h3 text-neutral-900">{item.brand} {item.name}</h1>
          <p className="mt-1 font-paragraph-sm text-neutral-500">新增日期：{item.createdAt}</p>
        </div>

        <div className="mt-4 space-y-5">
          <WardrobeDetailSection title="類別">
            <div className="inline-flex rounded-full bg-primary-900 px-3 py-1 font-label-xs text-white">
              {wardrobeCategoryOptions.find((option) => option.key === item.category)?.label}
            </div>
          </WardrobeDetailSection>

          <WardrobeDetailSection title="場合">
            <div className="flex flex-wrap gap-2">
              {item.occasionKeys.map((key) => (
                <span key={key} className="rounded-full bg-primary-900 px-3 py-1 font-label-xs text-white">
                  {wardrobeOccasionOptions.find((option) => option.key === key)?.label}
                </span>
              ))}
            </div>
          </WardrobeDetailSection>

          <WardrobeDetailSection title="季節">
            <div className="flex flex-wrap gap-2">
              {item.seasonKeys.map((key) => (
                <span key={key} className="rounded-full bg-primary-900 px-3 py-1 font-label-xs text-white">
                  {wardrobeSeasonOptions.find((option) => option.key === key)?.label}
                </span>
              ))}
            </div>
          </WardrobeDetailSection>

          <WardrobeDetailSection title="色系">
            <div className="flex flex-wrap gap-3">
              {item.colorKeys.map((key) => {
                const color = wardrobeColorOptions.find((option) => option.key === key)
                if (!color) return null

                return (
                  <div key={key}>
                    <div className="grid h-[60px] w-[60px] grid-cols-2 overflow-hidden rounded-[10px] border border-neutral-300">
                      <span style={{ backgroundColor: color.hex }} />
                      <span style={{ backgroundColor: color.hex }} />
                      <span style={{ backgroundColor: color.hex, opacity: 0.9 }} />
                      <span style={{ backgroundColor: color.hex, opacity: 0.8 }} />
                    </div>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 font-label-xxs-sb ${color.textClassName ?? 'text-white'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </WardrobeDetailSection>

          <WardrobeDetailSection title="品牌">
            <span className="inline-flex rounded-full bg-primary-900 px-3 py-1 font-label-xs text-white">
              {item.brand}
            </span>
          </WardrobeDetailSection>
        </div>
      </section>

      <DeleteClothingDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          deleteItem(item.id)
          setIsDeleteOpen(false)
          setIsDeleteSuccessOpen(true)
        }}
      />

      <DeleteSuccessDialog
        open={isDeleteSuccessOpen}
        onClose={() => {
          setIsDeleteSuccessOpen(false)
          void router.push('/wardrobe')
        }}
      />
    </MobileLayout>
  )
}

export default WardrobeDetailPage