import { Plus } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent } from 'react'

import { WardrobeColorPalette } from './WardrobeColorPalette'
import { WardrobeDetailSection } from './WardrobeDetailSection'
import { WardrobeTagGroup } from './WardrobeTagGroup'
import { wardrobeCategoryOptions } from '../constants/categoryOptions'
import { wardrobeOccasionOptions } from '../constants/occasionOptions'
import { wardrobeSeasonOptions } from '../constants/seasonOptions'
import type { WardrobeBrandOption, WardrobeReviewDraft } from '../types'

type WardrobeReviewFormBrandFieldProps = {
  options: WardrobeBrandOption[]
  pendingValue: string
  isAdding: boolean
  onPendingValueChange: (next: string) => void
  onAddStart: () => void
  onAddCancel: () => void
  onAddConfirm: () => void
  addInputPlaceholder?: string
}

type WardrobeReviewFormProps = {
  value: WardrobeReviewDraft
  onChange: (next: WardrobeReviewDraft) => void
  brandField?: WardrobeReviewFormBrandFieldProps
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

export const WardrobeReviewForm = ({ value, onChange, brandField }: WardrobeReviewFormProps) => {
  const name = value.name ?? ''
  const brand = value.brand ?? ''

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, name: event.target.value })
  }

  const handleBrandSelectionChange = (next: string[]) => {
    onChange({ ...value, brand: next[0] ?? '' })
  }

  return (
    <form className="px-4 pb-4">
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
            className="h-9 w-full rounded-full border border-neutral-300 bg-white px-4 font-paragraph-sm text-neutral-800 outline-none focus:border-primary-900"
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

        {brandField ? (
          <WardrobeDetailSection title="品牌">
            <div className="space-y-2">
              {brandField.options.length > 0 ? (
                <WardrobeTagGroup
                  multiple={false}
                  allowEmptySingleSelection
                  options={brandField.options.map((option) => ({
                    key: option.value,
                    label: option.label,
                  }))}
                  selectedKeys={brand ? [brand] : []}
                  onChange={handleBrandSelectionChange}
                />
              ) : null}

              {brandField.isAdding ? (
                <div className="flex items-center gap-2">
                  <input
                    value={brandField.pendingValue}
                    onChange={(event) => brandField.onPendingValueChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        brandField.onAddConfirm()
                      }
                    }}
                    placeholder={brandField.addInputPlaceholder ?? '輸入品牌名稱'}
                    className="h-9 flex-1 rounded-full border border-neutral-500 bg-neutral-100 px-4 font-paragraph-sm text-neutral-900 outline-none focus:border-primary-900"
                    aria-label="新增品牌"
                  />
                  <button
                    type="button"
                    onClick={brandField.onAddConfirm}
                    className="rounded-full border border-primary-900 px-3 py-1 font-label-xs text-primary-900"
                  >
                    確認
                  </button>
                  <button
                    type="button"
                    onClick={brandField.onAddCancel}
                    className="rounded-full border border-neutral-300 px-3 py-1 font-label-xs text-neutral-700"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={brandField.onAddStart}
                  className="inline-flex items-center rounded-full border border-neutral-500 bg-neutral-100 px-3 py-1 font-label-sm text-primary-800"
                >
                  新增品牌 <Plus className="size-4" strokeWidth={2} />
                </button>
              )}
            </div>
          </WardrobeDetailSection>
        ) : null}
      </section>
    </form>
  )
}
