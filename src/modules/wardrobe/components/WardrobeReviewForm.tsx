import Image from 'next/image'
import type { ChangeEvent } from 'react'

import { WardrobeColorPalette } from './WardrobeColorPalette'
import { WardrobeDetailSection } from './WardrobeDetailSection'
import { WardrobeTagGroup } from './WardrobeTagGroup'
import { wardrobeCategoryOptions } from '../constants/categoryOptions'
import { wardrobeOccasionOptions } from '../constants/occasionOptions'
import { wardrobeSeasonOptions } from '../constants/seasonOptions'
import type { WardrobeReviewDraft } from '../types'

type WardrobeReviewFormProps = {
  value: WardrobeReviewDraft
  onChange: (next: WardrobeReviewDraft) => void
}

const categoryPreviewEmoji = {
  top: '👕',
  pants: '👖',
  skirt: '🩳',
  dress: '👗',
  outer: '🧥',
  shoes: '👟',
}

const formCategoryOptions = wardrobeCategoryOptions.filter(
  (option): option is (typeof wardrobeCategoryOptions)[number] & {
    key: WardrobeReviewDraft['category']
  } => option.key !== 'all'
)

export const WardrobeReviewForm = ({ value, onChange }: WardrobeReviewFormProps) => {
  const name = value.name ?? ''
  const brand = value.brand ?? ''

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, name: event.target.value })
  }

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, brand: event.target.value })
  }

  return (
    <form className="px-4 pb-28">
      <section className="pb-5">
        <div className="mx-auto flex h-47 items-center justify-center overflow-hidden rounded-[12px] border border-neutral-200 bg-neutral-100">
          {value.imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={value.imageUrl}
                alt={name || '衣物圖片'}
                fill
                sizes="(max-width: 375px) 80vw, 220px"
                className="object-contain p-4"
              />
            </div>
          ) : (
            <span className="text-8xl">{categoryPreviewEmoji[value.category]}</span>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <label className="block space-y-1.5">
          <span className="font-label-md text-neutral-900">名稱</span>
          <input
            value={name}
            onChange={handleNameChange}
            placeholder="請輸入衣物名稱"
            className="h-9 w-full rounded-full border border-neutral-300 bg-neutral-100 px-4 font-paragraph-sm text-neutral-900 outline-none focus:border-primary-900"
          />
        </label>

        <WardrobeDetailSection title="類別">
          <WardrobeTagGroup
            multiple={false}
            options={formCategoryOptions}
            selectedKeys={[value.category]}
            onChange={(next) =>
              onChange({
                ...value,
                category: next[0] ?? value.category,
              })
            }
          />
        </WardrobeDetailSection>

        <WardrobeDetailSection title="場合" multiple>
          <WardrobeTagGroup
            options={wardrobeOccasionOptions}
            selectedKeys={value.occasionKeys}
            onChange={(next) => onChange({ ...value, occasionKeys: next })}
          />
        </WardrobeDetailSection>

        <WardrobeDetailSection title="季節" multiple>
          <WardrobeTagGroup
            options={wardrobeSeasonOptions}
            selectedKeys={value.seasonKeys}
            onChange={(next) => onChange({ ...value, seasonKeys: next })}
          />
        </WardrobeDetailSection>

        <WardrobeDetailSection title="色系">
          <WardrobeColorPalette
            selectedKeys={value.colorKey ? [value.colorKey] : []}
            selectionMode="single"
            onChange={(next) =>
              onChange({
                ...value,
                colorKey: next[0] ?? null,
              })
            }
          />
        </WardrobeDetailSection>

        <label className="block space-y-1.5">
          <span className="font-label-md text-neutral-900">品牌</span>
          <input
            value={brand}
            onChange={handleBrandChange}
            placeholder="可選填品牌名稱"
            className="h-9 w-full rounded-full border border-neutral-300 bg-neutral-100 px-4 font-paragraph-sm text-neutral-900 outline-none focus:border-primary-900"
            aria-label="品牌"
          />
        </label>
      </section>
    </form>
  )
}
