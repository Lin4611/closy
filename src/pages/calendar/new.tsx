import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarOccasionDialog } from '@/modules/calendar/components/CalendarOccasionDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { mockGoogleEvents } from '@/modules/calendar/data/mockGoogleEvents'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import { getCalendarFormDraft, saveCalendarFormDraft, clearCalendarFormDraft, getCalendarSelectedOutfitDraft, clearCalendarSelectedOutfitDraft, clearCalendarFlowDrafts } from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute } from '@/modules/calendar/utils/calendarNavigation'
import { getSelectableOutfitSummaryById } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { getNearestAvailableCalendarDate, hasSelectedOutfit, isCalendarDateBlocked, isCalendarDateDisabled, shouldResetSelectedOutfit } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import type { Occasion } from '@/modules/common/types/occasion'

const CalendarNewPage = () => {
  const router = useRouter()
  const { entries, addEntry } = useCalendarStore()
  const initialDraft = useMemo(() => getCalendarFormDraft(), [])
  const selectedOutfitDraft = useMemo(() => getCalendarSelectedOutfitDraft(), [])
  const initialDate = useMemo(() => {
    const draftDate = selectedOutfitDraft?.date || initialDraft?.date || ''

    if (draftDate && !isCalendarDateDisabled({ date: draftDate, entries, googleEvents: mockGoogleEvents })) {
      return draftDate
    }

    return getNearestAvailableCalendarDate({ entries, googleEvents: mockGoogleEvents })
  }, [entries, initialDraft?.date, selectedOutfitDraft?.date])
  const [occasionKey, setOccasionKey] = useState<Occasion | null>(selectedOutfitDraft?.occasionKey ?? initialDraft?.occasionKey ?? null)
  const [date, setDate] = useState(initialDate)
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(selectedOutfitDraft?.selectedOutfitId ?? initialDraft?.selectedOutfitId ?? null)
  const [pendingOccasionKey, setPendingOccasionKey] = useState<Occasion | null>(null)
  const [isOccasionDialogOpen, setIsOccasionDialogOpen] = useState(!(selectedOutfitDraft?.occasionKey ?? initialDraft?.occasionKey))
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  useEffect(() => {
    saveCalendarFormDraft({
      mode: 'new',
      date,
      occasionKey,
      selectedOutfitId,
      sourceEntryId: null,
      returnTo: '/calendar/new',
    })
  }, [date, occasionKey, selectedOutfitId])

  useEffect(() => {
    if (selectedOutfitDraft) {
      clearCalendarSelectedOutfitDraft()
    }
  }, [selectedOutfitDraft])

  const selectedOutfit = selectedOutfitId ? getSelectableOutfitSummaryById(selectedOutfitId) : null
  const disabledDates = useMemo(() => {
    return entries
      .filter((entry) => isCalendarDateBlocked({ date: entry.date, entries, googleEvents: mockGoogleEvents }))
      .map((entry) => entry.date)
  }, [entries])

  const initialDisplayDate = useMemo(() => {
    if (date && !isCalendarDateDisabled({ date, entries, googleEvents: mockGoogleEvents })) {
      return date
    }

    return getNearestAvailableCalendarDate({ entries, googleEvents: mockGoogleEvents })
  }, [date, entries])


  const isDateDisabled = (candidateDate: string) => {
    return isCalendarDateDisabled({
      date: candidateDate,
      entries,
      googleEvents: mockGoogleEvents,
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
      sourceEntryId: null,
      returnTo: '/calendar/new',
    })

    const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'new' })
    void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
  }

  const handleSubmit = () => {
    if (!occasionKey || !date) return
    if (isDateDisabled(date)) return

    addEntry({
      date,
      occasionKey,
      selectedOutfitId,
      sourceType: 'local',
      googleEventId: null,
    })
    clearCalendarFormDraft()
    clearCalendarSelectedOutfitDraft()
    setIsSuccessDialogOpen(true)
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <CalendarHeader
          title="新增"
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
          onCancel={() => {
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
              sourceEntryId: null,
              returnTo: '/calendar/new',
            })
            setOccasionKey(pendingOccasionKey)
            setSelectedOutfitId(null)
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
          onCancel={() => {
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
