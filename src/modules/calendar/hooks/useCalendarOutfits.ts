import { useMemo } from 'react'

import {
  getSelectableOutfitSummaries,
  getSelectableOutfitSummaryById,
} from '@/modules/calendar/utils/calendarOutfitAdapter'
import type { Occasion } from '@/modules/common/types/occasion'

export const useCalendarOutfits = (occasionKey?: Occasion | null) => {
  const outfits = useMemo(() => getSelectableOutfitSummaries(occasionKey), [occasionKey])

  return {
    outfits,
    isEmpty: outfits.length === 0,
    getOutfitById: getSelectableOutfitSummaryById,
  }
}
