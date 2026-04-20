import { Button } from '@/components/ui/button'

import type { OutfitTab } from '../types/outfitTypes'

type OutfitsTabsProps = {
  tab: OutfitTab
  onTabChange: (tab: OutfitTab) => void
}
export const OutfitsTabs = ({ tab, onTabChange }: OutfitsTabsProps) => {
  return (
    <div className="flex shrink-0 justify-center gap-3 py-4">
      <Button
        className="font-label-md w-24 rounded-[24px] px-5 py-2.5"
        onClick={() => onTabChange('overview')}
        variant={tab === 'overview' ? 'daySwitch_active' : 'daySwitch_inactive'}
      >
        總覽
      </Button>
      <Button
        className="font-label-md w-[110px] rounded-[24px] px-5 py-2.5"
        onClick={() => onTabChange('groupByOccasion')}
        variant={tab === 'groupByOccasion' ? 'daySwitch_active' : 'daySwitch_inactive'}
      >
        場合分類
      </Button>
    </div>
  )
}
