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
  mapOutfitItemsToSelectableOutfitSummaries,
  resolveSelectableOutfitById,
} from '@/modules/calendar/utils/calendarOutfitAdapter'
import type { Occasion } from '@/modules/common/types/occasion'
import { getOutfitList } from '@/modules/outfit/api/outfit'

type UseCalendarOutfitsOptions = {
  source?: CalendarOutfitDataSource
}

type ApiOutfitState = {
  outfits: SelectableOutfitSummary[]
  status: Exclude<CalendarOutfitCollectionStatus, 'loading'>
  errorMessage: string | null
  requestKey: string | null
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return '無法取得穿搭資料'
}

const getRequestKey = (occasionKey?: Occasion | null, refreshKey = 0) => {
  return `${occasionKey ?? 'all'}:${refreshKey}`
}

export const useCalendarOutfits = (
  occasionKey?: Occasion | null,
  options?: UseCalendarOutfitsOptions,
) => {
  const source = options?.source ?? 'mock'
  const [refreshKey, setRefreshKey] = useState(0)
  const [apiState, setApiState] = useState<ApiOutfitState>({
    outfits: [],
    status: 'idle',
    errorMessage: null,
    requestKey: null,
  })

  const currentRequestKey = useMemo(() => getRequestKey(occasionKey, refreshKey), [occasionKey, refreshKey])

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
          requestKey: currentRequestKey,
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
          requestKey: currentRequestKey,
        })
      })

    return () => {
      isActive = false
    }
  }, [occasionKey, currentRequestKey, source])

  const status = useMemo<CalendarOutfitCollectionStatus>(() => {
    if (source !== 'api') {
      return 'empty'
    }

    if (apiState.requestKey !== currentRequestKey) {
      return 'loading'
    }

    return apiState.status
  }, [apiState.requestKey, apiState.status, currentRequestKey, source])

  const errorMessage = source === 'api' ? apiState.errorMessage : null
  const filteredOutfits = useMemo(() => {
    const outfits = source === 'api' ? apiState.outfits : []
    return filterSelectableOutfitSummariesByOccasion(outfits, occasionKey)
  }, [source, apiState.outfits, occasionKey])
  const outfitsById = useMemo(() => buildSelectableOutfitSummaryMap(filteredOutfits), [filteredOutfits])

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

  const reload = () => {
    if (source !== 'api') {
      return
    }

    setRefreshKey((currentKey) => currentKey + 1)
  }

  return {
    source,
    outfits: filteredOutfits,
    status,
    isEmpty: status === 'empty',
    isLoading: status === 'loading',
    isReady: status === 'ready' || status === 'empty',
    isError: status === 'error',
    errorMessage,
    getOutfitById,
    getOutfitStateById,
    reload,
  }
}
