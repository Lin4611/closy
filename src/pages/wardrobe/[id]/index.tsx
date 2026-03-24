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
    <MobileLayout className="relative px-4 pt-6 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/wardrobe" className="font-label-sm text-neutral-500">
          ←
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="font-label-xl h-8 w-8 text-neutral-700"
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

      <section className="mb-4 rounded-[24px] bg-white p-4">
        <div className="mx-auto flex aspect-square max-w-60 items-center justify-center rounded-[20px] bg-neutral-100 text-8xl">
          {item.category === 'top' && '👕'}
          {item.category === 'pants' && '👖'}
          {item.category === 'skirt' && '🩳'}
          {item.category === 'dress' && '👗'}
          {item.category === 'outer' && '🧥'}
          {item.category === 'shoes' && '👟'}
        </div>
      </section>

      <section className="space-y-5 rounded-[28px] bg-white p-5">
        <div>
          <h1 className="text-h3 text-neutral-900">{item.name}</h1>
          <p className="font-paragraph-sm mt-1 text-neutral-500">新增日期：{item.createdAt}</p>
        </div>

        <WardrobeDetailSection title="類別">
          <div className="font-label-xs inline-flex rounded-full bg-primary-900 px-3 py-1.5 text-white">
            {wardrobeCategoryOptions.find((option) => option.key === item.category)?.label}
          </div>
        </WardrobeDetailSection>

        <WardrobeDetailSection title="場合">
          <div className="flex flex-wrap gap-2">
            {item.occasionKeys.map((key) => (
              <span key={key} className="font-label-xs rounded-full bg-primary-900 px-3 py-1.5 text-white">
                {wardrobeOccasionOptions.find((option) => option.key === key)?.label}
              </span>
            ))}
          </div>
        </WardrobeDetailSection>

        <WardrobeDetailSection title="季節">
          <div className="flex flex-wrap gap-2">
            {item.seasonKeys.map((key) => (
              <span key={key} className="font-label-xs rounded-full bg-primary-900 px-3 py-1.5 text-white">
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
                <div key={key} className="space-y-1">
                  <div className="grid h-18 w-18 grid-cols-2 overflow-hidden rounded-[16px] border border-neutral-200">
                    <span style={{ backgroundColor: color.hex }} />
                    <span style={{ backgroundColor: color.hex }} />
                    <span style={{ backgroundColor: color.hex, opacity: 0.9 }} />
                    <span style={{ backgroundColor: color.hex, opacity: 0.8 }} />
                  </div>
                  <span
                    className={`font-label-xxs-sb inline-flex rounded-full px-2 py-1 ${color.textClassName ?? 'text-white'}`}
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
          <span className="font-label-xs inline-flex rounded-full bg-primary-900 px-3 py-1.5 text-white">
            {item.brand}
          </span>
        </WardrobeDetailSection>
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
