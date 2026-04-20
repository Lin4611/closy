import { useEffect, useMemo, useState } from 'react'

import type {
  CalendarOutfitCollectionStatus,
  CalendarOutfitDataSource,
  CalendarResolvedOutfit,
  SelectableOutfitSummary,
} from '@/modules/calendar/types'
import {
  buildSelectableOutfitSummaryMap,
  filterSelectableOutfitSummariesByOccasion,
  getSelectableOutfitSummaries,
  resolveSelectableOutfitById,
  mapOutfitItemsToSelectableOutfitSummaries,
} from '@/modules/calendar/utils/calendarOutfitAdapter'
import type { Occasion } from '@/modules/common/types/occasion'
import { getOutfitList } from '@/modules/outfit/api/outfit'

type UseCalendarOutfitsOptions = {
  source?: CalendarOutfitDataSource
}

type ApiOutfitState = {
  outfits: SelectableOutfitSummary[]
  status: CalendarOutfitCollectionStatus
  errorMessage: string | null
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return '無法取得穿搭資料'
}

export const useCalendarOutfits = (
  occasionKey?: Occasion | null,
  options?: UseCalendarOutfitsOptions,
) => {
  const source = options?.source ?? 'mock'
  const [apiState, setApiState] = useState<ApiOutfitState>({
    outfits: [],
    status: 'idle',
    errorMessage: null,
  })

  useEffect(() => {
    if (source !== 'api') {
      return
    }

    let isActive = true

    void getOutfitList(occasionKey ?? undefined)
      .then((outfitList) => {
        if (!isActive) {
          return
        }

        const outfits = mapOutfitItemsToSelectableOutfitSummaries(outfitList)

        setApiState({
          outfits,
          status: outfits.length > 0 ? 'ready' : 'empty',
          errorMessage: null,
        })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setApiState({
          outfits: [],
          status: 'error',
          errorMessage: getErrorMessage(error),
        })
      })

    return () => {
      isActive = false
    }
  }, [occasionKey, source])

  const mockOutfits = useMemo(() => getSelectableOutfitSummaries(occasionKey), [occasionKey])

  const derivedApiStatus = useMemo<CalendarOutfitCollectionStatus>(() => {
    if (source !== 'api') {
      return mockOutfits.length > 0 ? 'ready' : 'empty'
    }

    if (apiState.status === 'idle') {
      return 'loading'
    }

    return apiState.status
  }, [apiState.status, mockOutfits.length, source])

  const outfits = source === 'api' ? apiState.outfits : mockOutfits
  const status = derivedApiStatus
  const errorMessage = source === 'api' ? apiState.errorMessage : null
  const outfitsById = useMemo(() => buildSelectableOutfitSummaryMap(outfits), [outfits])

  const getOutfitById = (outfitId: string) => {
    return outfitsById[outfitId] ?? null
  }

  const getOutfitStateById = (outfitId: string | null | undefined): CalendarResolvedOutfit => {
    return resolveSelectableOutfitById({
      outfitId,
      outfitsById,
      collectionStatus: status,
      errorMessage,
    })
  }

  return {
    source,
    outfits: filterSelectableOutfitSummariesByOccasion(outfits, occasionKey),
    status,
    isEmpty: status === 'empty',
    isLoading: status === 'loading',
    isReady: status === 'ready' || status === 'empty',
    isError: status === 'error',
    errorMessage,
    getOutfitById,
    getOutfitStateById,
  }
}
