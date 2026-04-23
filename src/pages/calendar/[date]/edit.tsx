import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { fetchCalendarEntriesBaseline, findCalendarEntryBaselineByDate } from '@/lib/api/calendar/shared'
import { ApiError } from '@/lib/api/client'
import { requestCalendarEntries, requestUpdatedCalendarEntry } from '@/modules/calendar/api/shared'
import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntriesBaseline, CalendarEntry, CalendarFormDraft, CalendarOutfitSelectionStatus, CalendarSelectedOutfitPreviewModel } from '@/modules/calendar/types'
import {
  clearCalendarFlowDrafts,
  clearCalendarFormDraft,
  getCalendarFormDraft,
  saveCalendarFormDraft,
} from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute, parseCalendarEditDateParam } from '@/modules/calendar/utils/calendarNavigation'
import { mapServerOutfitPreviewToPreviewModel } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { EMPTY_CALENDAR_GOOGLE_EVENTS, canEditCalendarDate, getNearestAvailableCalendarDate, isCalendarDateBlocked, isCalendarDateDisabled, shouldResetSelectedOutfit } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import { SubPageHeader } from '@/modules/common/components/SubPageHeader'
import type { Occasion } from '@/modules/common/types/occasion'

type CalendarEditPageProps = {
  initialEntries: CalendarEntriesBaseline
  initialEntry: CalendarEntry
  routeDate: string
}

const getMatchingCalendarEditDraft = (entryId: string) => {
  const draft = getCalendarFormDraft()

  if (!draft || draft.mode !== 'edit' || draft.sourceEntryId !== entryId) {
    return null
  }

  return draft
}

const buildInitialCalendarEditDraft = ({
  entry,
  routeDate,
}: {
  entry: CalendarEntry
  routeDate: string
}): CalendarFormDraft => ({
  mode: 'edit',
  date: entry.date,
  occasionKey: entry.occasionKey,
  selectedOutfitId: entry.selectedOutfitId,
  selectedOutfitPreview: entry.serverOutfitPreview ? mapServerOutfitPreviewToPreviewModel(entry.serverOutfitPreview) : null,
  selectionStatus: 'unchanged',
  sourceEntryId: entry.id,
  returnTo: `/calendar/${routeDate}/edit`,
})


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
    const matchedEntry = findCalendarEntryBaselineByDate(initialEntries, routeDate)

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
        initialEntry: matchedEntry,
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

const CalendarEditPage = ({ initialEntries, initialEntry, routeDate }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { hydrateEntriesFromServer } = useCalendarStore()
  const entry = initialEntry
  const entries = initialEntries

  const [occasionKey, setOccasionKey] = useState<Occasion | null>(entry.occasionKey)
  const [date, setDate] = useState(entry.date)
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(entry.selectedOutfitId ?? null)
  const [selectedOutfitPreview, setSelectedOutfitPreview] = useState<CalendarSelectedOutfitPreviewModel | null>(
    entry.serverOutfitPreview ? mapServerOutfitPreviewToPreviewModel(entry.serverOutfitPreview) : null,
  )
  const [selectionStatus, setSelectionStatus] = useState<CalendarOutfitSelectionStatus>('unchanged')
  const [occasionChangeCandidate, setOccasionChangeCandidate] = useState<Occasion | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRestoredDraftState, setHasRestoredDraftState] = useState(false)




  useEffect(() => {
    const matchingDraft = getMatchingCalendarEditDraft(entry.id)

    if (matchingDraft) {
      setOccasionKey(matchingDraft.occasionKey)
      setDate(matchingDraft.date)
      setSelectedOutfitId(matchingDraft.selectedOutfitId)
      setSelectedOutfitPreview(matchingDraft.selectedOutfitPreview)
      setSelectionStatus(matchingDraft.selectionStatus)
      setHasRestoredDraftState(true)
      return
    }

    const initialDraft = buildInitialCalendarEditDraft({
      entry,
      routeDate,
    })

    saveCalendarFormDraft(initialDraft)
    setOccasionKey(initialDraft.occasionKey)
    setDate(initialDraft.date)
    setSelectedOutfitId(initialDraft.selectedOutfitId)
    setSelectedOutfitPreview(initialDraft.selectedOutfitPreview)
    setSelectionStatus(initialDraft.selectionStatus)
    setHasRestoredDraftState(true)
  }, [entry, routeDate])

  useEffect(() => {
    if (!entry || !hasRestoredDraftState) {
      return
    }

    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      selectedOutfitPreview,
      selectionStatus,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${routeDate}/edit`,
    })
  }, [date, selectedOutfitId, selectedOutfitPreview, entry, hasRestoredDraftState, occasionKey, routeDate, selectionStatus])

  const selectedOutfit = useMemo<CalendarSelectedOutfitPreviewModel | null>(() => {
    if (!hasRestoredDraftState) {
      return null
    }

    return selectedOutfitPreview
  }, [hasRestoredDraftState, selectedOutfitPreview])

  const isOutfitPreviewLoading = !hasRestoredDraftState

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
    const hasPersistedSelectedOutfit = Boolean(selectedOutfit)

    if (hasPersistedSelectedOutfit && shouldResetSelectedOutfit(occasionKey, nextOccasionKey)) {
      setOccasionChangeCandidate(nextOccasionKey)
      setIsOccasionChangeDialogOpen(true)
      return
    }

    setOccasionKey(nextOccasionKey)
  }

  const handleSelectOutfit = () => {

    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      selectedOutfitPreview,
      selectionStatus,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${routeDate}/edit`,
    })

    const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: routeDate })
    void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
  }

  const handleSubmit = () => {
    if (!occasionKey || !date || isSubmitting) return
    if (isDateDisabled(date)) return

    const hasPersistedSelectedOutfit = Boolean(entry.serverOutfitPreview)

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

    if (selectionStatus === 'selected') {
      if (selectedOutfitId) {
        nextUpdateInput.selectedOutfitId = selectedOutfitId
      }
    } else if (selectionStatus === 'explicit-empty') {
      if (hasPersistedSelectedOutfit) {
        nextUpdateInput.selectedOutfitId = ''
      }
    }

    if (Object.keys(nextUpdateInput).length === 0) {
      clearCalendarFormDraft()
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
        setSelectionStatus('unchanged')
        const nextEntries = await requestCalendarEntries()
        hydrateEntriesFromServer(nextEntries)
        clearCalendarFormDraft()
        setIsSuccessDialogOpen(true)
      } catch (error) {
        showToast.error(getUpdateErrorMessage(error))
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <SubPageHeader
          title="編輯"
          backHref="/calendar"
          backLabel="返回行事曆"
          onBackClick={() => {
            clearCalendarFlowDrafts()
            void router.push('/calendar')
          }}
        />
        <CalendarForm
          occasionKey={occasionKey}
          date={date}
          outfit={selectedOutfit}
          isOutfitLoading={isOutfitPreviewLoading}
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

            saveCalendarFormDraft({
              mode: 'edit',
              date,
              occasionKey: occasionChangeCandidate,
              selectedOutfitId: null,
              selectedOutfitPreview: null,
              selectionStatus: 'explicit-empty',
              sourceEntryId: entry.id,
              returnTo: `/calendar/${routeDate}/edit`,
            })
            setOccasionKey(occasionChangeCandidate)
            setSelectedOutfitId(null)
            setSelectedOutfitPreview(null)
            setOccasionChangeCandidate(null)
            setSelectionStatus('explicit-empty')
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
