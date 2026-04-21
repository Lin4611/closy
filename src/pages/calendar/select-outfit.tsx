import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { fetchCalendarEntriesBaseline } from '@/lib/api/calendar/shared'
import { ApiError } from '@/lib/api/client'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { SelectableOutfitCard } from '@/modules/calendar/components/SelectableOutfitCard'
import { SelectableOutfitEmptyState } from '@/modules/calendar/components/SelectableOutfitEmptyState'
import { useCalendarOutfits } from '@/modules/calendar/hooks/useCalendarOutfits'
import { useCalendarServerEntries } from '@/modules/calendar/hooks/useCalendarStore'
import type { CalendarEntriesBaseline, CalendarFormDraft } from '@/modules/calendar/types'
import { getCalendarFormDraft, saveCalendarFormDraft } from '@/modules/calendar/utils/calendarDraftStorage'
import { normalizeCalendarReturnTo } from '@/modules/calendar/utils/calendarNavigation'
import { mapSelectableOutfitSummaryToPreviewModel } from '@/modules/calendar/utils/calendarOutfitAdapter'
import { AppShell } from '@/modules/common/components/AppShell'

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

const resolveInitialSelectedOutfitId = (draft: CalendarFormDraft | null) => {
  if (!draft || draft.selectionStatus === 'explicit-empty') {
    return null
  }

  return draft.selectedOutfitId
}

const CalendarSelectOutfitPage = ({ initialEntries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  useCalendarServerEntries(initialEntries)
  const formDraft = useMemo(() => getCalendarFormDraft(), [])
  const returnTo = useMemo(() => {
    const queryReturnTo = typeof router.query.returnTo === 'string' ? normalizeCalendarReturnTo(router.query.returnTo) : null

    return queryReturnTo ?? formDraft?.returnTo ?? '/calendar/new'
  }, [formDraft?.returnTo, router.query.returnTo])
  const resolvedDate = useMemo(() => {
    return typeof router.query.date === 'string' ? router.query.date : formDraft?.date ?? ''
  }, [formDraft?.date, router.query.date])
  const { outfits, isEmpty, isError, isLoading, errorMessage, reload } = useCalendarOutfits(
    formDraft?.occasionKey ?? null,
    { source: 'api' },
  )
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(resolveInitialSelectedOutfitId(formDraft))

  const resolvedSelectedOutfitId = useMemo(() => {
    if (!selectedOutfitId) {
      return null
    }

    return outfits.some((outfit) => outfit.id === selectedOutfitId) ? selectedOutfitId : null
  }, [outfits, selectedOutfitId])

  const handleSubmitSelection = (nextOutfitId: string | null) => {
    if (formDraft) {
      const nextSelectedOutfit = nextOutfitId
        ? outfits.find((outfit) => outfit.id === nextOutfitId) ?? null
        : null

      saveCalendarFormDraft({
        ...formDraft,
        date: resolvedDate,
        selectedOutfitId: nextOutfitId,
        selectedOutfitPreview: nextSelectedOutfit ? mapSelectableOutfitSummaryToPreviewModel(nextSelectedOutfit) : null,
        selectionStatus: nextOutfitId ? 'selected' : 'explicit-empty',
        returnTo,
      })
    }

    void router.push(returnTo)
  }

  const handleLeaveWithoutSubmit = () => {
    void router.push(returnTo)
  }

  if (!formDraft?.occasionKey) {
    void router.replace('/calendar/new')
    return null
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <CalendarHeader title="選擇穿搭" backHref={returnTo} onBackClick={handleLeaveWithoutSubmit} />
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <Spinner className="size-8 text-neutral-700" />
            <p className="font-h4 text-neutral-900">正在載入你的穿搭</p>
            <p className="font-paragraph-md text-neutral-400">請稍候一下，完成後就可以直接挑選。</p>
          </div>
        ) : isError ? (
          <SelectableOutfitEmptyState
            title="暫時無法載入你的穿搭"
            description={errorMessage ?? '請稍後再試一次，或先略過，前一天會為你自動推薦。'}
            primaryLabel="重新整理"
            secondaryLabel="略過"
            onPrimary={reload}
            onSecondary={handleLeaveWithoutSubmit}
          />
        ) : isEmpty ? (
          <SelectableOutfitEmptyState onPrimary={() => void router.push('/home')} onSecondary={handleLeaveWithoutSubmit} />
        ) : (
          <>
            <div className="px-4 pb-6">
              <div className="flex items-center gap-3 rounded-[12px] bg-danger-100 px-4 py-2 font-label-sm">
                <span className="mt-0.5 rounded-full bg-danger-300 px-2 py-0.5 whitespace-nowrap text-white">小提醒</span>
                <p className="text-neutral-600">略過後可隨時修改，或等待前一天「Closy」依天氣及場合為你推薦。</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 pb-32">
              {outfits.map((outfit) => (
                <SelectableOutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  selected={resolvedSelectedOutfitId === outfit.id}
                  onSelect={() => setSelectedOutfitId((currentId) => (currentId === outfit.id ? null : outfit.id))}
                />
              ))}
            </div>
            <div className="fixed inset-x-0 bottom-0 z-10 px-4 py-4">
              <div className="mx-auto flex max-w-sm flex-col gap-3">
                <Button type="button" variant="brand" size="xl" onClick={() => handleSubmitSelection(resolvedSelectedOutfitId)}>
                  下一步
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="border-neutral-300 bg-white text-neutral-700"
                  onClick={handleLeaveWithoutSubmit}
                >
                  略過
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

export default CalendarSelectOutfitPage
