import { occasionLabelMap } from '@/modules/common/types/occasion'

import { OutfitCard } from './OutfitCard'
import type { OutfitItem, OutfitTab } from '../types/outfitTypes'

type OutfitsOverviewProps = {
  outfits: OutfitItem[]
  onDelete: (outfitId: string) => void
  tab: OutfitTab
  returnTo?: string
}
export const OutfitsOverview = ({ outfits, onDelete, tab, returnTo }: OutfitsOverviewProps) => {
  const sortedOutfits = [...outfits].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (sortedOutfits.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-label-md text-center text-neutral-500">
          還沒遇到心動的組合？
          <br />
          快去首頁收藏你的專屬穿搭吧！
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-2 place-content-center justify-items-center gap-4">
        {sortedOutfits.map((outfit) => {
          const footLabel =
            tab === 'overview'
              ? occasionLabelMap[outfit.occasion]
              : outfit.createdAt.split('T')[0].replaceAll('-', '/')
          return (
            <OutfitCard
              key={outfit._id}
              outfitId={outfit._id}
              modelImage={outfit.outfitImgUrl}
              footLabel={footLabel}
              onDelete={() => onDelete(outfit._id)}
              returnTo={returnTo}
            />
          )
        })}
      </div>
    </div>
  )
}
