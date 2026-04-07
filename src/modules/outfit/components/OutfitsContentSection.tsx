import { useRouter } from 'next/router'
import { useState } from 'react'

import { OutfitsOccasionList } from './OutfitsOccasionList'
import { OutfitsOverview } from './OutfitsOverview'
import { OutfitsTabs } from './OutfitsTabs'
import { type OutfitSummary, type OutfitTab } from '../types/outfitTypes'

type OutfitsContentSectionProps = {
  outfits: OutfitSummary[]
  onDelete: (outfitId: string) => void
}

const occasionsData = [
  {
    occasionId: '1',
    occasionName: '社交聚會',
    description: '注重風格展現，適合聚餐、看展或約會',
    outfitCount: 1,
    imageUrl: '/outfit/socialGathering.webp',
    currentDates: ['2026-04-07', '2026-04-08'],
  },
  {
    occasionId: '2',
    occasionName: '校園休閒',
    description: '適合校園生活的舒適穿搭',
    outfitCount: 5,
    imageUrl: '/outfit/campusCasual.webp',
    currentDates: ['2026-04-01', '2026-04-05'],
  },
  {
    occasionId: '3',
    occasionName: '商務休閒',
    description: '適合辦公室、會議，兼顧專業與舒適感',
    outfitCount: 6,
    imageUrl: '/outfit/businessCasual.webp',
    currentDates: ['2026-04-02', '2026-04-03'],
  },
  {
    occasionId: '4',
    occasionName: '專業職場',
    description: '需要穿西裝、襯衫等正式商務場合',
    outfitCount: 7,
    imageUrl: '/outfit/professional.webp',
    currentDates: ['2026-04-02', '2026-04-04'],
  },
]

export const OutfitsContentSection = ({ outfits, onDelete }: OutfitsContentSectionProps) => {
  const router = useRouter()
  const [tab, setTab] = useState<OutfitTab>('overview')

  const handleSelectOccasion = (occasionId: string) => {
    void router.push(`/outfit/occasion/${occasionId}`)
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <OutfitsTabs tab={tab} onTabChange={setTab} />
      {tab === 'overview' ? (
        <OutfitsOverview outfits={outfits} onDelete={onDelete} tab={tab} />
      ) : (
        <OutfitsOccasionList occasions={occasionsData} onSelectOccasion={handleSelectOccasion} />
      )}
    </div>
  )
}
