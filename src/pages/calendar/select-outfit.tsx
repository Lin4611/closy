import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { CalendarHeader } from '@/modules/calendar/components/CalendarHeader'
import { SelectableOutfitCard } from '@/modules/calendar/components/SelectableOutfitCard'
import { SelectableOutfitEmptyState } from '@/modules/calendar/components/SelectableOutfitEmptyState'
import { useCalendarOutfits } from '@/modules/calendar/hooks/useCalendarOutfits'
import { getCalendarFormDraft, saveCalendarSelectedOutfitDraft } from '@/modules/calendar/utils/calendarDraftStorage'
import { AppShell } from '@/modules/common/components/AppShell'

const CalendarSelectOutfitPage = () => {
  const router = useRouter()
  const formDraft = useMemo(() => getCalendarFormDraft(), [])
  const returnTo = typeof router.query.returnTo === 'string' ? router.query.returnTo : formDraft?.returnTo ?? '/calendar/new'
  const { outfits, isEmpty, isError, isLoading, errorMessage, reload } = useCalendarOutfits(
    formDraft?.occasionKey ?? null,
    { source: 'api' },
  )
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(formDraft?.selectedOutfitId ?? null)

  const resolvedSelectedOutfitId = useMemo(() => {
    if (!selectedOutfitId) {
      return null
    }

    return outfits.some((outfit) => outfit.id === selectedOutfitId) ? selectedOutfitId : null
  }, [outfits, selectedOutfitId])

  const handleComplete = (nextOutfitId: string | null) => {
    saveCalendarSelectedOutfitDraft({
      selectedOutfitId: nextOutfitId,
      returnTo,
      sourceEntryId: formDraft?.sourceEntryId ?? null,
      occasionKey: formDraft?.occasionKey ?? null,
      date: formDraft?.date ?? '',
    })
    void router.push(returnTo)
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex min-h-screen flex-col">
        <CalendarHeader title="選擇穿搭" backHref={returnTo} />
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
            onSecondary={() => handleComplete(null)}
          />
        ) : isEmpty ? (
          <SelectableOutfitEmptyState onPrimary={() => void router.push('/home')} onSecondary={() => handleComplete(null)} />
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
                <Button type="button" variant="brand" size="xl" onClick={() => handleComplete(resolvedSelectedOutfitId)}>
                  下一步
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="border-neutral-300 bg-white text-neutral-700"
                  onClick={() => handleComplete(null)}
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
