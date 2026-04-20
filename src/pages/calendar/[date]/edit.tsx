import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { mockGoogleEvents } from '@/modules/calendar/data/mockGoogleEvents'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntry } from '@/modules/calendar/types'
import { clearCalendarFormDraft, clearCalendarSelectedOutfitDraft, getCalendarSelectedOutfitDraft, saveCalendarFormDraft, clearCalendarFlowDrafts } from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute, parseCalendarEditDateParam } from '@/modules/calendar/utils/calendarNavigation'
import { getSelectableOutfitSummaryById } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { canEditCalendarDate, getNearestAvailableCalendarDate, hasSelectedOutfit, isCalendarDateBlocked, isCalendarDateDisabled, shouldResetSelectedOutfit } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import type { Occasion } from '@/modules/common/types/occasion'

type CalendarEditFormState = {
  occasionKey: Occasion | null
  date: string
  selectedOutfitId: string | null
}

const buildInitialFormState = (entry: CalendarEntry): CalendarEditFormState => {
  const selectedOutfitDraft = getCalendarSelectedOutfitDraft()

  return {
    occasionKey: selectedOutfitDraft?.occasionKey ?? entry.occasionKey,
    date: selectedOutfitDraft?.date || entry.date,
    selectedOutfitId: selectedOutfitDraft?.selectedOutfitId ?? entry.selectedOutfitId,
  }
}

const CalendarEditContent = ({ entry }: { entry: CalendarEntry }) => {
  const router = useRouter()
  const { entries, updateEntry } = useCalendarStore()
  const initialFormState = useMemo(() => buildInitialFormState(entry), [entry])
  const [occasionKey, setOccasionKey] = useState<Occasion | null>(initialFormState.occasionKey)
  const [date, setDate] = useState(initialFormState.date)
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(initialFormState.selectedOutfitId)
  const [pendingOccasionKey, setPendingOccasionKey] = useState<Occasion | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)

  useEffect(() => {
    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${entry.date}/edit`,
    })
  }, [date, entry.date, entry.id, occasionKey, selectedOutfitId])

  const selectedOutfit = selectedOutfitId ? getSelectableOutfitSummaryById(selectedOutfitId) : null
  const disabledDates = entries
    .filter((item) => isCalendarDateBlocked({ date: item.date, entries, googleEvents: mockGoogleEvents, currentEntryId: entry.id }))
    .map((item) => item.date)

  const initialDisplayDate = useMemo(() => {
    if (date && !isCalendarDateDisabled({ date, entries, googleEvents: mockGoogleEvents, currentEntryId: entry.id })) {
      return date
    }

    return getNearestAvailableCalendarDate({
      entries,
      googleEvents: mockGoogleEvents,
      currentEntryId: entry.id,
    })
  }, [date, entries, entry.id])


  const isDateDisabled = (candidateDate: string) => {
    return isCalendarDateDisabled({
      date: candidateDate,
      entries,
      googleEvents: mockGoogleEvents,
      currentEntryId: entry.id,
    })
  }

  const handleOccasionChange = (nextOccasionKey: Occasion) => {
    if (hasSelectedOutfit({ ...entry, selectedOutfitId }) && shouldResetSelectedOutfit(occasionKey, nextOccasionKey)) {
      setPendingOccasionKey(nextOccasionKey)
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
      sourceEntryId: entry.id,
      returnTo: `/calendar/${entry.date}/edit`,
    })

    const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: entry.date })
    void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
  }

  const handleSubmit = () => {
    if (!occasionKey || !date) return
    if (isDateDisabled(date)) return

    updateEntry(entry.id, {
      date,
      occasionKey,
      selectedOutfitId,
      sourceType: entry.sourceType,
      googleEventId: entry.googleEventId,
      createdAt: entry.createdAt,
      updatedAt: Date.now(),
    })

    clearCalendarFormDraft()
    clearCalendarSelectedOutfitDraft()
    setIsSuccessDialogOpen(true)
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
            setPendingOccasionKey(null)
            setIsOccasionChangeDialogOpen(false)
          }}
          onConfirm={() => {
            if (!pendingOccasionKey) return

            saveCalendarFormDraft({
              mode: 'edit',
              date,
              occasionKey: pendingOccasionKey,
              selectedOutfitId: null,
              sourceEntryId: entry.id,
              returnTo: `/calendar/${entry.date}/edit`,
            })
            setOccasionKey(pendingOccasionKey)
            setSelectedOutfitId(null)
            setPendingOccasionKey(null)
            setIsOccasionChangeDialogOpen(false)
            const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: entry.date })
            void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
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

const CalendarEditPage = () => {
  const router = useRouter()
  const { entries } = useCalendarStore()
  const dateParam = parseCalendarEditDateParam(router.query.date)
  const entry = dateParam ? entries.find((item) => item.date === dateParam) ?? null : null

  if (!entry) {
    return null
  }

  return <CalendarEditContent key={entry.id} entry={entry} />
}

export default CalendarEditPage
