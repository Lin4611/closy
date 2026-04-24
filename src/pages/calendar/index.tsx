import { Plus } from 'lucide-react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/sonner'
import { fetchCalendarEntriesBaseline } from '@/lib/api/calendar/shared'
import { ApiError } from '@/lib/api/client'
import { requestCalendarEntries, requestDeletedCalendarEntry } from '@/modules/calendar/api/shared'
import { CalendarDeleteEntryDialog } from '@/modules/calendar/components/CalendarDeleteEntryDialog'
import { CalendarEmptyState } from '@/modules/calendar/components/CalendarEmptyState'
import { CalendarEntryCard } from '@/modules/calendar/components/CalendarEntryCard'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { CalendarMonthBar } from '@/modules/calendar/components/CalendarMonthBar'
import { CalendarSuccessDialog } from '@/modules/calendar/components/CalendarSuccessDialog'
import { useCalendarServerEntries, useCalendarStore } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntriesBaseline, CalendarEntry } from '@/modules/calendar/types'
import { buildOutfitDetailReturnTo, getCalendarEditRoute } from '@/modules/calendar/utils/calendarNavigation'
import {
  getCalendarEntryServerPreviewOutfitId,
  mapCalendarEntryServerPreviewToDisplayModel,
} from '@/modules/calendar/utils/calendarOutfitAdapter'
import { EMPTY_CALENDAR_GOOGLE_EVENTS, sortCalendarEntriesForHome } from '@/modules/calendar/utils/calendarRules'
import { AppShell } from '@/modules/common/components/AppShell'

const getCurrentMonthLabel = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${year}年${month}月`
}

const getDeleteErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return '刪除行事曆失敗，請稍後再試'
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

const CalendarPage = ({ initialEntries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { deleteEntry, hydrateEntriesFromServer } = useCalendarStore()
  const entries = useCalendarServerEntries(initialEntries)
  const [isSynced, setIsSynced] = useState(false)
  const [deletingEntry, setDeletingEntry] = useState<CalendarEntry | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false)
  const currentMonthLabel = useMemo(() => getCurrentMonthLabel(), [])
  const monthOptions = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set([currentMonthLabel, ...entries.map((entry) => entry.date.slice(0, 7).replace('-', '年') + '月')])
    )

    return uniqueMonths.sort((left, right) => right.localeCompare(left))
  }, [currentMonthLabel, entries])
  const requestedMonth = typeof router.query.month === 'string' ? router.query.month : null
  const [userSelectedMonth, setUserSelectedMonth] = useState<string | null>(null)
  const selectedMonth = useMemo(() => {
    if (userSelectedMonth && monthOptions.includes(userSelectedMonth)) {
      return userSelectedMonth
    }

    if (requestedMonth && monthOptions.includes(requestedMonth)) {
      return requestedMonth
    }

    if (monthOptions.includes(currentMonthLabel)) {
      return currentMonthLabel
    }

    return monthOptions[0] ?? currentMonthLabel
  }, [currentMonthLabel, monthOptions, requestedMonth, userSelectedMonth])

  const visibleEntries = useMemo(() => {
    const normalized = selectedMonth.replace('年', '-').replace('月', '')
    return sortCalendarEntriesForHome(entries.filter((entry) => entry.date.startsWith(normalized)))
  }, [entries, selectedMonth])

  const handleDeleteConfirm = () => {
    if (!deletingEntry || isDeleting) {
      return
    }

    void (async () => {
      try {
        setIsDeleting(true)

        if (deletingEntry.serverId) {
          await requestDeletedCalendarEntry(deletingEntry.serverId)
          const nextEntries = await requestCalendarEntries()
          hydrateEntriesFromServer(nextEntries)
        } else {
          deleteEntry(deletingEntry.id)
        }

        setDeletingEntry(null)
        setIsDeleteSuccessOpen(true)
      } catch (error) {
        showToast.error(getDeleteErrorMessage(error))
      } finally {
        setIsDeleting(false)
      }
    })()
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col bg-[#F6F6F4]">
        <div className="sticky top-0 z-20 bg-white shadow-[0_1px_0_rgba(17,24,39,0.08)]">
          <CalendarHeader
            title="行事曆"
            className="bg-transparent shadow-none"
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
            onMonthChange={setUserSelectedMonth}
            onSyncChange={setIsSynced}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-20">
          {visibleEntries.length === 0 ? (
            <CalendarEmptyState />
          ) : (
            visibleEntries.map((entry) => {
              const outfitDisplay = mapCalendarEntryServerPreviewToDisplayModel(entry)
              const previewOutfitId = getCalendarEntryServerPreviewOutfitId(entry)

              return (
                <CalendarEntryCard
                  key={entry.id}
                  entry={entry}
                  googleEvents={EMPTY_CALENDAR_GOOGLE_EVENTS}
                  outfitDisplay={outfitDisplay}
                  onPreviewOutfit={
                    previewOutfitId
                      ? () =>
                        void router.push(
                          buildOutfitDetailReturnTo({
                            outfitId: previewOutfitId,
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
          onClose={() => {
            if (isDeleting) {
              return
            }

            setDeletingEntry(null)
          }}
          onConfirm={handleDeleteConfirm}
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
