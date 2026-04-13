import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarOccasionDialog } from '@/modules/calendar/components/CalendarOccasionDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { mockGoogleEvents } from '@/modules/calendar/data/mockGoogleEvents'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import { getCalendarFormDraft, saveCalendarFormDraft, clearCalendarFormDraft, getCalendarSelectedOutfitDraft, clearCalendarSelectedOutfitDraft } from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute } from '@/modules/calendar/utils/calendarNavigation'
import { getSelectableOutfitSummaryById } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { isCalendarDateBlocked } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import type { Occasion } from '@/modules/common/types/occasion'

const CalendarNewPage = () => {
  const router = useRouter()
  const { entries, addEntry } = useCalendarStore()
  const initialDraft = useMemo(() => getCalendarFormDraft(), [])
  const selectedOutfitDraft = useMemo(() => getCalendarSelectedOutfitDraft(), [])
  const [occasionKey, setOccasionKey] = useState<Occasion | null>(selectedOutfitDraft?.occasionKey ?? initialDraft?.occasionKey ?? null)
  const [date, setDate] = useState(selectedOutfitDraft?.date || initialDraft?.date || '')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(selectedOutfitDraft?.selectedOutfitId ?? initialDraft?.selectedOutfitId ?? null)
  const [isOccasionDialogOpen, setIsOccasionDialogOpen] = useState(!(selectedOutfitDraft?.occasionKey ?? initialDraft?.occasionKey))
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

  const handleSubmit = () => {
    if (!occasionKey || !date) return
    if (isCalendarDateBlocked({ date, entries, googleEvents: mockGoogleEvents })) return

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
      <div className="flex min-h-screen flex-col bg-white">
        <CalendarHeader title="新增" backHref="/calendar" />
        <CalendarForm
          occasionKey={occasionKey}
          date={date}
          outfit={selectedOutfit}
          disabledDates={disabledDates}
          onOccasionChange={setOccasionKey}
          onDateChange={setDate}
          onSelectOutfit={() => {
            const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'new' })
            void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
          }}
          onSubmit={handleSubmit}
        />
        <CalendarOccasionDialog
          open={isOccasionDialogOpen}
          selectedOccasionKey={occasionKey}
          onSelect={setOccasionKey}
          onClose={() => setIsOccasionDialogOpen(false)}
          onConfirm={() => setIsOccasionDialogOpen(false)}
        />
        <CalendarSuccessDialog
          open={isSuccessDialogOpen}
          title="新增成功"
          onClose={() => {
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
