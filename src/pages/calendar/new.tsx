import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { fetchCalendarEntriesBaseline } from '@/lib/api/calendar/shared'
import { ApiError } from '@/lib/api/client'
import { requestCalendarEntries, requestCreatedCalendarEntry } from '@/modules/calendar/api/shared'
import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarOccasionDialog } from '@/modules/calendar/components/CalendarOccasionDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { useCalendarServerEntries, useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntriesBaseline, CalendarSelectedOutfitPreviewModel } from '@/modules/calendar/types'
import {
  clearCalendarFlowDrafts,
  clearCalendarFormDraft,
  getCalendarFormDraft,
  saveCalendarFormDraft,
} from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute } from '@/modules/calendar/utils/calendarNavigation'
import {
  EMPTY_CALENDAR_GOOGLE_EVENTS,
  getNearestAvailableCalendarDate,
  hasSelectedOutfit,
  isCalendarDateBlocked,
  isCalendarDateDisabled,
  shouldResetSelectedOutfit,
} from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import { SubPageHeader } from '@/modules/common/components/SubPageHeader'
import type { Occasion } from '@/modules/common/types/occasion'

const getCreateErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '新增行事曆失敗，請稍後再試'
}

export const getServerSideProps: GetServerSideProps<{ initialEntries: CalendarEntriesBaseline }> = async ({ req }) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const initialEntries = await fetchCalendarEntriesBaseline(accessToken)

    return {
      props: {
        initialEntries,
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

const CalendarNewPage = ({ initialEntries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { hydrateEntriesFromServer } = useCalendarStore()
  const entries = useCalendarServerEntries(initialEntries)
  const initialDraft = useMemo(() => getCalendarFormDraft(), [])
  const initialDate = useMemo(() => {
    const draftDate = initialDraft?.date || ''

    if (draftDate && !isCalendarDateDisabled({ date: draftDate, entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS })) {
      return draftDate
    }

    return getNearestAvailableCalendarDate({ entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS })
  }, [entries, initialDraft?.date])
  const [occasionKey, setOccasionKey] = useState<Occasion | null>(initialDraft?.occasionKey ?? null)
  const [date, setDate] = useState(initialDate)
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(initialDraft?.selectedOutfitId ?? null)
  const [selectedOutfitPreview, setSelectedOutfitPreview] = useState<CalendarSelectedOutfitPreviewModel | null>(
    initialDraft?.selectedOutfitPreview ?? null,
  )
  const [selectionStatus, setSelectionStatus] = useState(initialDraft?.selectionStatus ?? 'unchanged')
  const [pendingOccasionKey, setPendingOccasionKey] = useState<Occasion | null>(null)
  const [isOccasionDialogOpen, setIsOccasionDialogOpen] = useState(!initialDraft?.occasionKey)
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasCompletedCreateRef = useRef(false)

  useEffect(() => {
    if (hasCompletedCreateRef.current || isSuccessDialogOpen) {
      return
    }

    saveCalendarFormDraft({
      mode: 'new',
      date,
      occasionKey,
      selectedOutfitId,
      selectedOutfitPreview,
      selectionStatus,
      sourceEntryId: null,
      returnTo: '/calendar/new',
    })
  }, [date, occasionKey, isSuccessDialogOpen, selectedOutfitId, selectedOutfitPreview, selectionStatus])

  const disabledDates = useMemo(() => {
    return entries
      .filter((entry) => isCalendarDateBlocked({ date: entry.date, entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS }))
      .map((entry) => entry.date)
  }, [entries])

  const initialDisplayDate = useMemo(() => {
    if (date && !isCalendarDateDisabled({ date, entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS })) {
      return date
    }

    return getNearestAvailableCalendarDate({ entries, googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS })
  }, [date, entries])

  const isDateDisabled = (candidateDate: string) => {
    return isCalendarDateDisabled({
      date: candidateDate,
      entries,
      googleEvents: EMPTY_CALENDAR_GOOGLE_EVENTS,
    })
  }

  const handleOccasionChange = (nextOccasionKey: Occasion) => {
    if (hasSelectedOutfit({ selectedOutfitId }) && shouldResetSelectedOutfit(occasionKey, nextOccasionKey)) {
      setPendingOccasionKey(nextOccasionKey)
      setIsOccasionChangeDialogOpen(true)
      return
    }

    setOccasionKey(nextOccasionKey)
  }

  const handleSelectOutfit = () => {
    saveCalendarFormDraft({
      mode: 'new',
      date,
      occasionKey,
      selectedOutfitId,
      selectedOutfitPreview,
      selectionStatus,
      sourceEntryId: null,
      returnTo: '/calendar/new',
    })

    const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'new' })
    void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
  }

  const handleSubmit = () => {
    if (!occasionKey || !date || isSubmitting) return
    if (isDateDisabled(date)) return

    void (async () => {
      try {
        setIsSubmitting(true)
        await requestCreatedCalendarEntry({
          date,
          occasionKey,
          selectedOutfitId,
        })
        hasCompletedCreateRef.current = true
        const nextEntries = await requestCalendarEntries()
        hydrateEntriesFromServer(nextEntries)
        clearCalendarFormDraft()
        setIsSuccessDialogOpen(true)
      } catch (error) {
        showToast.error(getCreateErrorMessage(error))
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <SubPageHeader
          title="新增"
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
          outfit={selectedOutfitPreview}
          disabledDates={disabledDates}
          initialDisplayDate={initialDisplayDate}
          isDateDisabled={isDateDisabled}
          onOccasionChange={handleOccasionChange}
          onDateChange={setDate}
          onSelectOutfit={handleSelectOutfit}
          onSubmit={handleSubmit}
        />
        <CalendarOccasionDialog
          open={isOccasionDialogOpen}
          selectedOccasionKey={occasionKey}
          onSelect={setOccasionKey}
          onCancel={() => {
            clearCalendarFlowDrafts()
            void router.push('/calendar')
          }}
          onConfirm={() => setIsOccasionDialogOpen(false)}
        />

        <CalendarOccasionChangeDialog
          open={isOccasionChangeDialogOpen}
          onClose={() => {
            setPendingOccasionKey(null)
            setIsOccasionChangeDialogOpen(false)
          }}
          onConfirm={() => {
            if (!pendingOccasionKey) return

            saveCalendarFormDraft({
              mode: 'new',
              date,
              occasionKey: pendingOccasionKey,
              selectedOutfitId: null,
              selectedOutfitPreview: null,
              selectionStatus: 'explicit-empty',
              sourceEntryId: null,
              returnTo: '/calendar/new',
            })
            setOccasionKey(pendingOccasionKey)
            setSelectedOutfitId(null)
            setSelectedOutfitPreview(null)
            setSelectionStatus('explicit-empty')
            setPendingOccasionKey(null)
            setIsOccasionChangeDialogOpen(false)
            const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'new' })
            void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
          }}
        />
        <CalendarSuccessDialog
          open={isSuccessDialogOpen}
          title="新增成功"
          confirmButtonClassName="bg-primary-800 text-white"
          onClose={() => {
            clearCalendarFormDraft()
            setIsSuccessDialogOpen(false)
            const targetMonth = date ? `${date.slice(0, 4)}年${date.slice(5, 7)}月` : null
            void router.push({
              pathname: '/calendar',
              query: targetMonth ? { month: targetMonth } : undefined,
            })
          }}
        />
      </div>
    </AppShell>
  )
}

export default CalendarNewPage
