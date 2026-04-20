import { ChevronDown, ChevronUp, EllipsisVertical, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { CalendarGoogleEventList } from '@/modules/calendar/components/CalendarGoogleEventList'
import { CalendarLocalEntryMenu } from '@/modules/calendar/components/CalendarLocalEntryMenu'
import type { CalendarEntry, CalendarGoogleEvent, SelectableOutfitSummary } from '@/modules/calendar/types'
import { getCalendarEventsByDate, hasSelectedOutfit, isGoogleCalendarEntry } from '@/modules/calendar/utils/calendarRules'
import { occasionLabelMap } from '@/modules/common/types/occasion'

type CalendarEntryCardProps = {
  entry: CalendarEntry
  googleEvents: CalendarGoogleEvent[]
  selectedOutfit: SelectableOutfitSummary | null
  onPreviewOutfit?: () => void
  onEdit: () => void
  onDelete: () => void
}

const formatDateLabel = (date: string) => date.replace(/-/g, '/')

export const CalendarEntryCard = ({
  entry,
  googleEvents,
  selectedOutfit,
  onPreviewOutfit,
  onEdit,
  onDelete,
}: CalendarEntryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isGoogleEntry = isGoogleCalendarEntry(entry)
  const events = useMemo(() => getCalendarEventsByDate(entry.date, googleEvents), [entry.date, googleEvents])
  const hasOutfit = hasSelectedOutfit(entry)

  return (
    <article className="rounded-[20px] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="relative flex items-start gap-3">
        <button
          type="button"
          onClick={onPreviewOutfit}
          disabled={!onPreviewOutfit}
          className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] disabled:pointer-events-none"
        >
          <Image
            src={selectedOutfit?.imageUrl ?? '/outfit/mock-1.webp'}
            alt="行事曆穿搭"
            width={48}
            height={64}
            className="h-16 w-12 object-contain"
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-h4 text-neutral-900">{formatDateLabel(entry.date)}</p>
            {isGoogleEntry ? <span className="font-label-md text-neutral-700">({events.length})</span> : null}
            {isGoogleEntry ? (
              <button type="button" onClick={() => setIsExpanded((value) => !value)} className="text-neutral-700">
                {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="rounded-full bg-primary-800 px-3 py-1 font-paragraph-sm text-white">
              #{occasionLabelMap[entry.occasionKey]}
            </span>
            <span
              className={cn(
                'rounded-full px-3 py-1 font-paragraph-sm',
                hasOutfit ? 'bg-[#E9F6EE] text-[#3AA769]' : 'bg-[#FCEEEE] text-[#E35D59]'
              )}
            >
              {hasOutfit ? '已選穿搭' : '未選穿搭'}
            </span>
          </div>
        </div>
        {isGoogleEntry ? (
          <button type="button" onClick={onEdit} aria-label="編輯行事曆" className="pt-1 text-neutral-700">
            <Pencil className="size-5" strokeWidth={2} />
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="更多操作"
              className="pt-1 text-neutral-700"
            >
              <EllipsisVertical className="size-5" strokeWidth={2} />
            </button>
            <CalendarLocalEntryMenu
              open={isMenuOpen}
              onEdit={() => {
                setIsMenuOpen(false)
                onEdit()
              }}
              onDelete={() => {
                setIsMenuOpen(false)
                onDelete()
              }}
            />
          </div>
        )}
      </div>
      {isGoogleEntry && isExpanded ? <CalendarGoogleEventList events={events} /> : null}
    </article>
  )
}
