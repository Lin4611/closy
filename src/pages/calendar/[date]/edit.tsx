import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { fetchCalendarEntriesBaseline } from '@/lib/api/calendar/shared'
import { ApiError } from '@/lib/api/client'
import { requestCalendarEntries, requestUpdatedCalendarEntry } from '@/modules/calendar/api/shared'
import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { useCalendarOutfits } from '@/modules/calendar/hooks/useCalendarOutfits'
import { useCalendarServerEntries, useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntriesBaseline, CalendarFormDraft, CalendarSelectedOutfitDraft } from '@/modules/calendar/types'
import {
  clearCalendarFlowDrafts,
  clearCalendarFormDraft,
  clearCalendarSelectedOutfitDraft,
  getCalendarFormDraft,
  getCalendarSelectedOutfitDraft,
  hasCalendarFormDraftSelectedOutfitValue,
  hasCalendarSelectedOutfitDraft,
  saveCalendarFormDraft,
} from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute, parseCalendarEditDateParam } from '@/modules/calendar/utils/calendarNavigation'
import { mapResolvedOutfitToPreviewModel, mapServerOutfitPreviewToPreviewModel } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { EMPTY_CALENDAR_GOOGLE_EVENTS, canEditCalendarDate, getNearestAvailableCalendarDate, isCalendarDateBlocked, isCalendarDateDisabled, shouldResetSelectedOutfit } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import type { Occasion } from '@/modules/common/types/occasion'

type CalendarEditPageProps = {
  initialEntries: CalendarEntriesBaseline
  entryServerId: string
  routeDate: string
}

const getMatchingEditDraftState = (entryId: string): {
  hasMatchingDraft: boolean
  hasSelectedOutfitValue: boolean
  draft: CalendarFormDraft | null
} => {
  const draft = getCalendarFormDraft()

  if (!draft || draft.mode !== 'edit' || draft.sourceEntryId !== entryId) {
    return { hasMatchingDraft: false, hasSelectedOutfitValue: false, draft: null }
  }

  return {
    hasMatchingDraft: true,
    hasSelectedOutfitValue: hasCalendarFormDraftSelectedOutfitValue(),
    draft,
  }
}

const getMatchingSelectedOutfitDraftState = (entryId: string): {
  hasMatchingDraft: boolean
  draft: CalendarSelectedOutfitDraft | null
} => {
  if (!hasCalendarSelectedOutfitDraft()) {
    return { hasMatchingDraft: false, draft: null }
  }

  const draft = getCalendarSelectedOutfitDraft()

  if (!draft || draft.sourceEntryId !== entryId) {
    return { hasMatchingDraft: false, draft: null }
  }

  return { hasMatchingDraft: true, draft }
}

const getUpdateErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '編輯行事曆失敗，請稍後再試'
}

export const getServerSideProps: GetServerSideProps<CalendarEditPageProps> = async ({ params, req }) => {
  const accessToken = req.cookies.accessToken
  const routeDate = parseCalendarEditDateParam(params?.date)

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!routeDate) {
    return {
      redirect: {
        destination: '/calendar',
        permanent: false,
      },
    }
  }

  try {
    const initialEntries = await fetchCalendarEntriesBaseline(accessToken)
    const matchedEntry = initialEntries.find((entry) => entry.date === routeDate) ?? null

    if (!matchedEntry) {
      return {
        redirect: {
          destination: '/calendar',
          permanent: false,
        },
      }
    }

    return {
      props: {
        initialEntries,
        entryServerId: matchedEntry.serverId,
        routeDate,
      },
    }
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    throw error
  }
}

const CalendarEditPage = ({ initialEntries, entryServerId, routeDate }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { hydrateEntriesFromServer } = useCalendarStore()
  const entries = useCalendarServerEntries(initialEntries)
  const entry = useMemo(() => {
    return entries.find((item) => item.serverId === entryServerId) ?? initialEntries.find((item) => item.serverId === entryServerId) ?? null
  }, [entries, entryServerId, initialEntries])

  const [occasionKey, setOccasionKey] = useState<Occasion | null>(entry?.occasionKey ?? null)
  const [date, setDate] = useState(entry?.date ?? '')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(entry?.selectedOutfitId ?? null)
  const [hasSelectedOutfitDraftOverride, setHasSelectedOutfitDraftOverride] = useState(false)
  const [occasionChangeCandidate, setOccasionChangeCandidate] = useState<Occasion | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRestoredDraftState, setHasRestoredDraftState] = useState(false)

  useEffect(() => {
    if (!entry) {
      return
    }

    const {
      hasMatchingDraft: hasMatchingFormDraft,
      hasSelectedOutfitValue: hasFormDraftSelectedOutfitValue,
      draft: formDraft,
    } = getMatchingEditDraftState(entry.id)
    const { hasMatchingDraft: hasMatchingSelectedOutfitDraft, draft: selectedOutfitDraft } = getMatchingSelectedOutfitDraftState(entry.id)
    const nextOccasionKey = formDraft?.occasionKey ?? selectedOutfitDraft?.occasionKey ?? entry.occasionKey
    const nextDate = formDraft?.date || selectedOutfitDraft?.date || entry.date
    const shouldUseFormDraftSelectedOutfit = hasMatchingFormDraft && hasFormDraftSelectedOutfitValue
    const nextSelectedOutfitId = hasMatchingSelectedOutfitDraft
      ? (selectedOutfitDraft?.selectedOutfitId ?? null)
      : shouldUseFormDraftSelectedOutfit
        ? (formDraft?.selectedOutfitId ?? null)
        : entry.selectedOutfitId

    setOccasionKey(nextOccasionKey)
    setDate(nextDate)
    setSelectedOutfitId(nextSelectedOutfitId)
    setHasSelectedOutfitDraftOverride(hasMatchingSelectedOutfitDraft || shouldUseFormDraftSelectedOutfit)
    setHasRestoredDraftState(true)
  }, [entry])

  useEffect(() => {
    if (!entry || !hasRestoredDraftState) {
      return
    }

    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${routeDate}/edit`,
    })
  }, [date, entry, hasRestoredDraftState, occasionKey, routeDate, selectedOutfitId])

  const { getOutfitStateById } = useCalendarOutfits(occasionKey, { source: 'api' })

  const selectedOutfit = useMemo(() => {
    if (!entry) {
      return null
    }

    if (selectedOutfitId) {
      return mapResolvedOutfitToPreviewModel({
        resolvedOutfit: getOutfitStateById(selectedOutfitId),
        outfitId: selectedOutfitId,
        occasionKey,
      })
    }

    if (hasSelectedOutfitDraftOverride) {
      return null
    }

    if (entry.serverOutfitPreview && occasionKey === entry.occasionKey) {
      return mapServerOutfitPreviewToPreviewModel(entry.serverOutfitPreview)
    }

    return null
  }, [entry, getOutfitStateById, hasSelectedOutfitDraftOverride, occasionKey, selectedOutfitId])

  const disabledDates = useMemo(() => {
    if (!entry) {
      return []
    }

    return entries
      .filter((item) => isCalendarDateBlocked({ date: item.date, entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS, currentEntryId: entry.id }))
      .map((item) => item.date)
  }, [entries, entry])

  const initialDisplayDate = useMemo(() => {
    if (!entry) {
      return ''
    }

    if (date && !isCalendarDateDisabled({ date, entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS, currentEntryId: entry.id })) {
      return date
    }

    return getNearestAvailableCalendarDate({
      entries,
      googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS,
      currentEntryId: entry.id,
    })
  }, [date, entries, entry])

  const isDateDisabled = (candidateDate: string) => {
    if (!entry) {
      return false
    }

    return isCalendarDateDisabled({
      date: candidateDate,
      entries,
      googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS,
      currentEntryId: entry.id,
    })
  }

  const handleOccasionChange = (nextOccasionKey: Occasion) => {
    if (!entry) {
      return
    }

    const hasPersistedSelectedOutfit = Boolean(selectedOutfitId || entry.serverOutfitPreview)

    if (hasPersistedSelectedOutfit && shouldResetSelectedOutfit(occasionKey, nextOccasionKey)) {
      setOccasionChangeCandidate(nextOccasionKey)
      setIsOccasionChangeDialogOpen(true)
      return
    }

    setOccasionKey(nextOccasionKey)
  }

  const handleSelectOutfit = () => {
    if (!entry) {
      return
    }

    clearCalendarSelectedOutfitDraft()

    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${routeDate}/edit`,
    })

    const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: routeDate })
    void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
  }

  const handleSubmit = () => {
    if (!entry || !occasionKey || !date || isSubmitting) return
    if (isDateDisabled(date)) return

    const hasPersistedSelectedOutfit = Boolean(entry.serverOutfitPreview)
    const shouldClearSelectedOutfit =
      hasPersistedSelectedOutfit &&
      selectedOutfitId === null &&
      hasSelectedOutfitDraftOverride

    const nextUpdateInput: {
      date?: string
      occasionKey?: Occasion
      selectedOutfitId?: string | null
    } = {}

    if (date !== entry.date) {
      nextUpdateInput.date = date
    }

    if (occasionKey !== entry.occasionKey) {
      nextUpdateInput.occasionKey = occasionKey
    }

    if (selectedOutfitId) {
      nextUpdateInput.selectedOutfitId = selectedOutfitId
    } else if (shouldClearSelectedOutfit) {
      nextUpdateInput.selectedOutfitId = ''
    }

    if (Object.keys(nextUpdateInput).length === 0) {
      clearCalendarFormDraft()
      clearCalendarSelectedOutfitDraft()
      setIsSuccessDialogOpen(true)
      return
    }

    void (async () => {
      try {
        setIsSubmitting(true)
        await requestUpdatedCalendarEntry(entry.serverId ?? entry.id, nextUpdateInput)
        setOccasionKey(occasionKey)
        setDate(date)
        setSelectedOutfitId(selectedOutfitId)
        setHasSelectedOutfitDraftOverride(false)
        const nextEntries = await requestCalendarEntries()
        hydrateEntriesFromServer(nextEntries)
        clearCalendarFormDraft()
        clearCalendarSelectedOutfitDraft()
        setIsSuccessDialogOpen(true)
      } catch (error) {
        showToast.error(getUpdateErrorMessage(error))
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  if (!entry) {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex min-h-screen flex-col">
          <CalendarHeader title="編輯" backHref="/calendar" />
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="font-paragraph-md text-neutral-400">找不到對應的行事曆資料</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <CalendarHeader
          title="編輯"
          backHref="/calendar"
          onBackClick={() => {
            clearCalendarFlowDrafts()
            void router.push('/calendar')
          }}
        />
        <CalendarForm
          occasionKey={occasionKey}
          date={date}
          outfit={selectedOutfit}
          disabledDate={!canEditCalendarDate(entry)}
          disabledDates={disabledDates}
          initialDisplayDate={initialDisplayDate}
          isDateDisabled={isDateDisabled}
          onOccasionChange={handleOccasionChange}
          onDateChange={setDate}
          onSelectOutfit={handleSelectOutfit}
          onSubmit={handleSubmit}
        />
        <CalendarOccasionChangeDialog
          open={isOccasionChangeDialogOpen}
          onClose={() => {
            setOccasionChangeCandidate(null)
            setIsOccasionChangeDialogOpen(false)
          }}
          onConfirm={() => {
            if (!occasionChangeCandidate) return

            clearCalendarSelectedOutfitDraft()
            saveCalendarFormDraft({
              mode: 'edit',
              date,
              occasionKey: occasionChangeCandidate,
              selectedOutfitId: null,
              sourceEntryId: entry.id,
              returnTo: `/calendar/${routeDate}/edit`,
            })
            setOccasionKey(occasionChangeCandidate)
            setSelectedOutfitId(null)
            setOccasionChangeCandidate(null)
            setHasSelectedOutfitDraftOverride(true)
            setIsOccasionChangeDialogOpen(false)
          }}
        />
        <CalendarSuccessDialog
          open={isSuccessDialogOpen}
          title="編輯成功"
          onClose={() => {
            setIsSuccessDialogOpen(false)
            const targetMonth = date ? `${date.slice(0, 4)}年${date.slice(5, 7)}月` : `${entry.date.slice(0, 4)}年${entry.date.slice(5, 7)}月`
            void router.push({
              pathname: '/calendar',
              query: { month: targetMonth },
            })
          }}
        />
      </div>
    </AppShell>
  )
}

export default CalendarEditPage
