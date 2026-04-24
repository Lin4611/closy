import { ChevronDown, ChevronUp, EllipsisVertical, LoaderCircle, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { CalendarGoogleEventList } from '@/modules/calendar/components/CalendarGoogleEventList'
import { CalendarLocalEntryMenu } from '@/modules/calendar/components/CalendarLocalEntryMenu'
import type { CalendarEntry, CalendarEntryOutfitDisplayModel, CalendarGoogleEvent } from '@/modules/calendar/types'
import {
  getCalendarEventsByDate,
  hasSelectedOutfit,
  isCalendarEntryExpired,
  isGoogleCalendarEntry,
} from '@/modules/calendar/utils/calendarRules'
import { occasionLabelMap } from '@/modules/common/types/occasion'

type CalendarEntryCardProps = {
  entry: CalendarEntry
  googleEvents: CalendarGoogleEvent[]
  outfitDisplay: CalendarEntryOutfitDisplayModel
  onPreviewOutfit?: () => void
  onEdit: () => void
  onDelete: () => void
}

const formatDateLabel = (date: string) => date.replace(/-/g, '/')

export const CalendarEntryCard = ({
  entry,
  googleEvents,
  outfitDisplay,
  onPreviewOutfit,
  onEdit,
  onDelete,
}: CalendarEntryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isGoogleEntry = isGoogleCalendarEntry(entry)
  const isExpired = isCalendarEntryExpired(entry)
  const events = useMemo(() => getCalendarEventsByDate(entry.date, googleEvents), [entry.date, googleEvents])
  const hasResolvedOutfit = outfitDisplay.status === 'resolved' && Boolean(outfitDisplay.imageUrl)
  const hasOutfit = hasSelectedOutfit(entry) || hasResolvedOutfit
  const showLoadingIndicator = outfitDisplay.status === 'loading'
  const outfitStatusLabel =
    outfitDisplay.status === 'resolved'
      ? '已選穿搭'
      : outfitDisplay.status === 'loading'
        ? '穿搭載入中'
        : outfitDisplay.status === 'missing'
          ? '穿搭不存在'
          : outfitDisplay.status === 'error'
            ? '穿搭載入失敗'
            : '未選穿搭'
  const outfitStatusClassName =
    outfitDisplay.status === 'resolved'
      ? 'bg-[#E9F6EE] text-[#3AA769]'
      : outfitDisplay.status === 'none'
        ? 'bg-[#FCEEEE] text-[#E35D59]'
        : 'bg-neutral-100 text-neutral-600'

  return (
    <article className="rounded-[20px] bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="relative flex items-start gap-3">
        <button
          type="button"
          onClick={onPreviewOutfit}
          disabled={!onPreviewOutfit || isExpired}
          className="relative flex h-18.75 w-16.5 shrink-0 items-center justify-center overflow-hidden rounded-[12px] disabled:pointer-events-none"
        >
          {hasResolvedOutfit && outfitDisplay.imageUrl ? (
            <Image
              src={outfitDisplay.imageUrl}
              alt="行事曆穿搭"
              width={66}
              height={75}
              className="h-18.75 w-16.5 object-contain"
            />
          ) : (
            <Image
              src="/calendar/figure-silhouette.png"
              alt={hasOutfit ? '已選穿搭狀態' : '未選穿搭'}
              width={66}
              height={75}
              className="h-18.75 w-16.5 object-contain"
            />
          )}
          {showLoadingIndicator ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <LoaderCircle className="size-4 animate-spin text-neutral-600" strokeWidth={1.75} />
            </span>
          ) : null}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={cn('font-h4 text-neutral-900', isExpired && 'text-neutral-400')}>{formatDateLabel(entry.date)}</p>
            {isGoogleEntry ? <span className="font-label-md text-neutral-700">({events.length})</span> : null}
            {isGoogleEntry && !isExpired ? (
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="text-neutral-700"
                aria-label={isExpanded ? '收合 Google 行程' : '展開 Google 行程'}
              >
                {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="rounded-full bg-primary-800 px-2 py-1 font-paragraph-xs text-white">
              #{occasionLabelMap[entry.occasionKey]}
            </span>
            <span className={cn('rounded-full px-2 py-1 font-paragraph-xs', outfitStatusClassName)}>{outfitStatusLabel}</span>
          </div>
        </div>
        {isExpired ? (
          <span className="rounded-full bg-danger-300 px-2 py-0.5 font-paragraph-sm text-white">已過期</span>
        ) : isGoogleEntry ? (
          <button type="button" onClick={onEdit} aria-label="編輯行事曆" className="pt-1 text-neutral-700">
            <Pencil className="size-5" strokeWidth={2} />
          </button>
        ) : (
          <div className="relative">
            <button type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-label="更多操作" className="pt-1 text-neutral-700">
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
      {isGoogleEntry && isExpanded && !isExpired ? <CalendarGoogleEventList events={events} /> : null}
    </article>
  )
}
