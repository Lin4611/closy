import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CalendarDeleteEntryDialog } from '@/modules/calendar/components/CalendarDeleteEntryDialog'
import { CalendarEmptyState } from '@/modules/calendar/components/CalendarEmptyState'
import { CalendarEntryCard } from '@/modules/calendar/components/CalendarEntryCard'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarMonthBar } from '@/modules/calendar/components/CalendarMonthBar'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { mockGoogleEvents } from '@/modules/calendar/data/mockGoogleEvents'
import { useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntry } from '@/modules/calendar/types'
import { buildOutfitDetailReturnTo, getCalendarEditRoute } from '@/modules/calendar/utils/calendarNavigation'
import { getSelectableOutfitSummaryById } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { AppShell } from '@/modules/common/components/AppShell'

const CalendarPage = () => {
  const router = useRouter()
  const { entries, deleteEntry } = useCalendarStore()
  const [isSynced, setIsSynced] = useState(true)
  const [deletingEntry, setDeletingEntry] = useState<CalendarEntry | null>(null)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)
  const monthOptions = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set(entries.map((entry) => entry.date.slice(0, 7).replace('-', '年') + '月'))
    )
    return uniqueMonths.length > 0 ? uniqueMonths : ['2026年03月']
  }, [entries])
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0] ?? '2026年03月')

  const visibleEntries = useMemo(() => {
    const normalized = selectedMonth.replace('年', '-').replace('月', '')
    return entries.filter((entry) => entry.date.startsWith(normalized))
  }, [entries, selectedMonth])

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col bg-[#F6F6F4]">
        <CalendarHeader
          title="行事曆"
          rightSlot={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void router.push('/calendar/new')}
              className="rounded-full text-neutral-800"
              aria-label="新增行事曆"
            >
              <Plus className="size-5" strokeWidth={2} />
            </Button>
          }
        />
        <CalendarMonthBar
          month={selectedMonth}
          monthOptions={monthOptions}
          isSynced={isSynced}
          onMonthChange={setSelectedMonth}
          onSyncChange={setIsSynced}
        />
        <div className="flex flex-1 flex-col gap-4 px-4 pb-6">
          {visibleEntries.length === 0 ? (
            <CalendarEmptyState />
          ) : (
            visibleEntries.map((entry) => {
              const selectedOutfit = entry.selectedOutfitId
                ? getSelectableOutfitSummaryById(entry.selectedOutfitId)
                : null

              return (
                <CalendarEntryCard
                  key={entry.id}
                  entry={entry}
                  googleEvents={mockGoogleEvents}
                  selectedOutfit={selectedOutfit}
                  onPreviewOutfit={
                    entry.selectedOutfitId
                      ? () =>
                        void router.push(
                          buildOutfitDetailReturnTo({
                            outfitId: entry.selectedOutfitId as string,
                            returnTo: '/calendar',
                          })
                        )
                      : undefined
                  }
                  onEdit={() => void router.push(getCalendarEditRoute(entry.date))}
                  onDelete={() => setDeletingEntry(entry)}
                />
              )
            })
          )}
        </div>
        <CalendarDeleteEntryDialog
          open={Boolean(deletingEntry)}
          onClose={() => setDeletingEntry(null)}
          onConfirm={() => {
            if (!deletingEntry) return
            deleteEntry(deletingEntry.id)
            setDeletingEntry(null)
            setIsDeleteSuccessOpen(true)
          }}
        />
        <CalendarSuccessDialog
          open={isDeleteSuccessOpen}
          title="已刪除行事曆"
          onClose={() => setIsDeleteSuccessOpen(false)}
        />
      </div>
    </AppShell>
  )
}

export default CalendarPage
