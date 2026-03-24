import Image from 'next/image'
import { ChangeEvent } from 'react'

import { wardrobeCategoryOptions } from '../constants/categoryOptions'
import { wardrobeOccasionOptions } from '../constants/occasionOptions'
import { wardrobeSeasonOptions } from '../constants/seasonOptions'
import { WardrobeDraftItem } from '../types'
import { WardrobeColorPalette } from './WardrobeColorPalette'
import { WardrobeDetailSection } from './WardrobeDetailSection'
import { WardrobeTagGroup } from './WardrobeTagGroup'

type WardrobeReviewFormProps = {
  value: WardrobeDraftItem
  onChange: (next: WardrobeDraftItem) => void
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
    key: WardrobeDraftItem['category']
  } => option.key !== 'all'
)

export const WardrobeReviewForm = ({ value, onChange }: WardrobeReviewFormProps) => {
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
                alt={value.name}
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
            value={value.name}
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

        <WardrobeDetailSection title="場合" required>
          <WardrobeTagGroup
            options={wardrobeOccasionOptions}
            selectedKeys={value.occasionKeys}
            onChange={(next) => onChange({ ...value, occasionKeys: next })}
          />
        </WardrobeDetailSection>

        <WardrobeDetailSection title="季節" required>
          <WardrobeTagGroup
            options={wardrobeSeasonOptions}
            selectedKeys={value.seasonKeys}
            onChange={(next) => onChange({ ...value, seasonKeys: next })}
          />
        </WardrobeDetailSection>

        <WardrobeDetailSection title="色系">
          <WardrobeColorPalette
            selectedKeys={value.colorKeys}
            onChange={(next) => onChange({ ...value, colorKeys: next })}
          />
        </WardrobeDetailSection>

        <label className="block space-y-1.5">
          <span className="font-label-md text-neutral-900">品牌</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-full bg-primary-900 px-3 font-label-xs text-white"
            >
              {value.brand}
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-full text-neutral-500 font-label-xs"
              onClick={(event) => event.preventDefault()}
            >
              新增品牌 +
            </button>
          </div>
          <input
            value={value.brand}
            onChange={handleBrandChange}
            placeholder="請輸入品牌名稱"
            className="sr-only"
            aria-label="品牌"
          />
        </label>
      </section>
    </form>
  )
}