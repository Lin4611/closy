import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
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
  const { outfits, isEmpty } = useCalendarOutfits(formDraft?.occasionKey ?? null)
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(formDraft?.selectedOutfitId ?? null)

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
        {isEmpty ? (
          <SelectableOutfitEmptyState onGoHome={() => void router.push('/home')} onSkip={() => handleComplete(null)} />
        ) : (
          <>
            <div className="px-4 pb-6">
              <div className="flex items-center gap-3 rounded-[12px] bg-danger-100 font-label-sm px-4 py-2">
                <span className="mt-0.5 rounded-full bg-danger-300 px-2 py-0.5  text-white whitespace-nowrap">小提醒</span>
                <p className=" text-neutral-600">略過後可隨時修改，或等待前一天「Closy」依天氣及場合為你推薦。</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 pb-32">
              {outfits.map((outfit) => (
                <SelectableOutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  selected={selectedOutfitId === outfit.id}
                  onSelect={() => setSelectedOutfitId(outfit.id)}
                />
              ))}
            </div>
            <div className="fixed inset-x-0 bottom-0 z-10 px-4 py-4">
              <div className="mx-auto flex max-w-sm flex-col gap-3">
                <Button type="button" variant="brand" size="xl" onClick={() => handleComplete(selectedOutfitId)}>
                  下一步
                </Button>
                <Button type="button" variant="outline" size="xl" className="border-neutral-300 bg-white text-neutral-700" onClick={() => handleComplete(null)}>
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
