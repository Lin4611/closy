import { useEffect, useMemo, useState } from 'react'

import type {
  CalendarOutfitCollectionStatus,
  CalendarOutfitDataSource,
  CalendarResolvedOutfit,
} from '@/modules/calendar/types'
import {
  buildSelectableOutfitSummaryMap,
  filterSelectableOutfitSummariesByOccasion,
  mapOutfitItemsToSelectableOutfitSummaries,
  resolveSelectableOutfitById,
} from '@/modules/calendar/utils/calendarOutfitAdapter'
import type { Occasion } from '@/modules/common/types/occasion'
import { getOutfitBaseline } from '@/modules/outfit/api/outfit'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hydrateOutfitBaseline } from '@/store/slices/outfitSlice'

type UseCalendarOutfitsOptions = {
  source?: CalendarOutfitDataSource
}

type ApiOutfitState = {
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
  const dispatch = useAppDispatch()
  const { outfitList, occasionsList, baselineResolved } = useAppSelector((state) => state.outfit)
  const [refreshKey, setRefreshKey] = useState(0)
  const [apiState, setApiState] = useState<ApiOutfitState>({
    status: 'idle',
    errorMessage: null,
    requestKey: null,
  })

  const currentRequestKey = useMemo(() => getRequestKey(occasionKey, refreshKey), [occasionKey, refreshKey])
  const cachedSelectableOutfits = useMemo(() => mapOutfitItemsToSelectableOutfitSummaries(outfitList), [outfitList])
  const cachedBaselineAvailable = baselineResolved || outfitList.length > 0 || occasionsList.length > 0

  useEffect(() => {
    if (source !== 'api') {
      return
    }

    let isActive = true

    void getOutfitBaseline()
      .then((baseline) => {
        if (!isActive) {
          return
        }

        dispatch(hydrateOutfitBaseline(baseline))

        const outfits = filterSelectableOutfitSummariesByOccasion(
          mapOutfitItemsToSelectableOutfitSummaries(baseline.outfitList),
          occasionKey,
        )

        setApiState({
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
          status: 'error',
          errorMessage: getErrorMessage(error),
          requestKey: currentRequestKey,
        })
      })

    return () => {
      isActive = false
    }
  }, [currentRequestKey, dispatch, occasionKey, source])

  const filteredOutfits = useMemo(() => {
    const outfits = source === 'api' ? cachedSelectableOutfits : []
    return filterSelectableOutfitSummariesByOccasion(outfits, occasionKey)
  }, [source, cachedSelectableOutfits, occasionKey])

  const status = useMemo<CalendarOutfitCollectionStatus>(() => {
    if (source !== 'api') {
      return 'empty'
    }

    if (apiState.requestKey !== currentRequestKey) {
      if (!cachedBaselineAvailable) {
        return 'loading'
      }

      return filteredOutfits.length > 0 ? 'ready' : 'empty'
    }

    if (apiState.status === 'error' && cachedBaselineAvailable) {
      return filteredOutfits.length > 0 ? 'ready' : 'empty'
    }

    return apiState.status
  }, [apiState.requestKey, apiState.status, cachedBaselineAvailable, currentRequestKey, filteredOutfits.length, source])

  const errorMessage = source === 'api' && !cachedBaselineAvailable ? apiState.errorMessage : null
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
