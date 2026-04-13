import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { CalendarDeleteEntryDialog } from '@/modules/calendar/components/CalendarDeleteEntryDialog'
import { CalendarForm } from '@/modules/calendar/components/CalendarForm'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarOccasionChangeDialog } from '@/modules/calendar/components/CalendarOccasionChangeDialog'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { mockGoogleEvents } from '@/modules/calendar/data/mockGoogleEvents'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import { clearCalendarFormDraft, clearCalendarSelectedOutfitDraft, getCalendarSelectedOutfitDraft, saveCalendarFormDraft } from '@/modules/calendar/utils/calendarDraftStorage'
import { buildCalendarSelectOutfitReturnTo, buildCalendarSelectOutfitRoute, parseCalendarEditDateParam } from '@/modules/calendar/utils/calendarNavigation'
import { getSelectableOutfitSummaryById } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { canDeleteCalendarEntry, canEditCalendarDate, hasSelectedOutfit, isCalendarDateBlocked, shouldResetSelectedOutfit } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'
import type { Occasion } from '@/modules/common/types/occasion'

const CalendarEditPage = () => {
  const router = useRouter()
  const { entries, updateEntry, deleteEntry } = useCalendarStore()
  const dateParam = parseCalendarEditDateParam(router.query.date)
  const entry = dateParam ? entries.find((item) => item.date === dateParam) ?? null : null
  const selectedOutfitDraft = useMemo(() => getCalendarSelectedOutfitDraft(), [])
  const [occasionKey, setOccasionKey] = useState<Occasion | null>(entry?.occasionKey ?? null)
  const [date, setDate] = useState(entry?.date ?? '')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(entry?.selectedOutfitId ?? null)
  const [pendingOccasionKey, setPendingOccasionKey] = useState<Occasion | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [successTitle, setSuccessTitle] = useState('編輯成功')
  const [isOccasionChangeDialogOpen, setIsOccasionChangeDialogOpen] = useState(false)

  useEffect(() => {
    if (!entry) return
    setOccasionKey(selectedOutfitDraft?.occasionKey ?? entry.occasionKey)
    setDate(selectedOutfitDraft?.date || entry.date)
    setSelectedOutfitId(selectedOutfitDraft?.selectedOutfitId ?? entry.selectedOutfitId)
  }, [entry, selectedOutfitDraft])

  useEffect(() => {
    if (!entry) return
    saveCalendarFormDraft({
      mode: 'edit',
      date,
      occasionKey,
      selectedOutfitId,
      sourceEntryId: entry.id,
      returnTo: `/calendar/${entry.date}/edit`,
    })
  }, [date, entry, occasionKey, selectedOutfitId])

  if (!entry) {
    return null
  }

  const selectedOutfit = selectedOutfitId ? getSelectableOutfitSummaryById(selectedOutfitId) : null
  const disabledDates = entries
    .filter((item) => isCalendarDateBlocked({ date: item.date, entries, googleEvents: mockGoogleEvents, currentEntryId: entry.id }))
    .map((item) => item.date)

  const handleOccasionChange = (nextOccasionKey: Occasion) => {
    if (hasSelectedOutfit(entry) && shouldResetSelectedOutfit(occasionKey, nextOccasionKey)) {
      setPendingOccasionKey(nextOccasionKey)
      setIsOccasionChangeDialogOpen(true)
      return
    }

    setOccasionKey(nextOccasionKey)
  }

  const handleSubmit = () => {
    if (!occasionKey || !date) return
    if (isCalendarDateBlocked({ date, entries, googleEvents: mockGoogleEvents, currentEntryId: entry.id })) return

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
    setSuccessTitle('編輯成功')
    setIsSuccessDialogOpen(true)
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col bg-white">
        <CalendarHeader title="編輯" backHref="/calendar" />
        <CalendarForm
          occasionKey={occasionKey}
          date={date}
          outfit={selectedOutfit}
          disabledDate={!canEditCalendarDate(entry)}
          disabledDates={disabledDates}
          onOccasionChange={handleOccasionChange}
          onDateChange={setDate}
          onSelectOutfit={() => {
            const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: entry.date })
            void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
          }}
          onSubmit={handleSubmit}
        />
        {canDeleteCalendarEntry(entry) ? (
          <div className="px-4 pb-8">
            <button type="button" onClick={() => setIsDeleteDialogOpen(true)} className="w-full text-left font-paragraph-sm text-neutral-400">
              刪除此行事曆
            </button>
          </div>
        ) : null}
        <CalendarDeleteEntryDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            deleteEntry(entry.id)
            clearCalendarFormDraft()
            clearCalendarSelectedOutfitDraft()
            setIsDeleteDialogOpen(false)
            setSuccessTitle('已刪除行事曆')
            setIsSuccessDialogOpen(true)
          }}
        />
        <CalendarOccasionChangeDialog
          open={isOccasionChangeDialogOpen}
          onClose={() => setIsOccasionChangeDialogOpen(false)}
          onConfirm={() => {
            if (pendingOccasionKey) {
              setOccasionKey(pendingOccasionKey)
              setSelectedOutfitId(null)
              setIsOccasionChangeDialogOpen(false)
              const returnTo = buildCalendarSelectOutfitReturnTo({ mode: 'edit', date: entry.date })
              void router.push(buildCalendarSelectOutfitRoute({ returnTo, date }))
            }
          }}
        />
        <CalendarSuccessDialog
          open={isSuccessDialogOpen}
          title={successTitle}
          onClose={() => {
            setIsSuccessDialogOpen(false)
            void router.push('/calendar')
          }}
        />
      </div>
    </AppShell>
  )
}

export default CalendarEditPage
