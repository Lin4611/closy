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
    <form className="space-y-6 px-4 pb-28">
      <section className="rounded-[24px] border border-neutral-200 bg-white p-4">
        <div className="mx-auto flex aspect-square max-w-60 items-center justify-center rounded-[20px] bg-neutral-100">
          <span className="text-8xl">{categoryPreviewEmoji[value.category]}</span>
        </div>
      </section>

      <section className="rounded-[24px] border border-neutral-200 bg-white p-4">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="font-label-md text-neutral-900">名稱</span>
            <input
              value={value.name}
              onChange={handleNameChange}
              placeholder="請輸入衣物名稱"
              className="font-paragraph-md h-12 w-full rounded-[14px] border border-neutral-300 bg-white px-4 text-neutral-900 outline-none focus:border-primary-900"
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

          <label className="block space-y-2">
            <span className="font-label-md text-neutral-900">品牌</span>
            <input
              value={value.brand}
              onChange={handleBrandChange}
              placeholder="請輸入品牌名稱"
              className="font-paragraph-md h-12 w-full rounded-[14px] border border-neutral-300 bg-white px-4 text-neutral-900 outline-none focus:border-primary-900"
            />
          </label>
        </div>
      </section>
    </form>
  )
}