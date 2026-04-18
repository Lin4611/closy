import { useRouter } from 'next/router'
import { useState } from 'react'

import { OutfitsOccasionList } from './OutfitsOccasionList'
import { OutfitsOverview } from './OutfitsOverview'
import { OutfitsTabs } from './OutfitsTabs'
import { type OutfitItem, type OutfitTab, type SummaryList } from '../types/outfitTypes'

type OutfitsContentSectionProps = {
  outfits: OutfitItem[]
  onDelete: (outfitId: string) => void
  occasionsList: SummaryList[]
}

export const OutfitsContentSection = ({
  outfits,
  onDelete,
  occasionsList,
}: OutfitsContentSectionProps) => {
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
        <OutfitsOccasionList occasions={occasionsList} onSelectOccasion={handleSelectOccasion} />
      )}
    </div>
  )
}
