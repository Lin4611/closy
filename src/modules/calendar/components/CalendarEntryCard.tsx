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
    <article
      className={cn(
        'rounded-[20px] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-opacity',
        isExpired && 'bg-neutral-100 text-neutral-400 opacity-90'
      )}
    >
      <div className="relative flex items-start gap-3">
        <button
          type="button"
          onClick={onPreviewOutfit}
          disabled={!onPreviewOutfit}
          className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] disabled:pointer-events-none"
        >
          {hasResolvedOutfit && outfitDisplay.imageUrl ? (
            <Image
              src={outfitDisplay.imageUrl}
              alt="行事曆穿搭"
              width={48}
              height={64}
              className={cn('h-16 w-12 object-contain', isExpired && 'opacity-60 grayscale')}
            />
          ) : (
            <Image
              src="/calendar/figure-silhouette.png"
              alt={hasOutfit ? '已選穿搭狀態' : '未選穿搭'}
              width={48}
              height={64}
              className={cn('h-16 w-12 object-contain', isExpired && 'opacity-45')}
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
            {isGoogleEntry ? (
              <span className={cn('font-label-md text-neutral-700', isExpired && 'text-neutral-400')}>({events.length})</span>
            ) : null}
            {isGoogleEntry ? (
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className={cn('text-neutral-700', isExpired && 'cursor-not-allowed text-neutral-400')}
                disabled={isExpired}
                aria-disabled={isExpired}
              >
                {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span
              className={cn(
                'rounded-full bg-primary-800 px-3 py-1 font-paragraph-sm text-white',
                isExpired && 'bg-neutral-300 text-white'
              )}
            >
              #{occasionLabelMap[entry.occasionKey]}
            </span>
            <span
              className={cn('rounded-full px-3 py-1 font-paragraph-sm', outfitStatusClassName, isExpired && 'bg-neutral-200 text-neutral-400')}
            >
              {outfitStatusLabel}
            </span>
          </div>
        </div>
        {isGoogleEntry ? (
          <button
            type="button"
            onClick={onEdit}
            aria-label="編輯行事曆"
            className={cn('pt-1 text-neutral-700', isExpired && 'cursor-not-allowed text-neutral-400')}
            disabled={isExpired}
            aria-disabled={isExpired}
          >
            <Pencil className="size-5" strokeWidth={2} />
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="更多操作"
              className={cn('pt-1 text-neutral-700', isExpired && 'cursor-not-allowed text-neutral-400')}
              disabled={isExpired}
              aria-disabled={isExpired}
            >
              <EllipsisVertical className="size-5" strokeWidth={2} />
            </button>
            <CalendarLocalEntryMenu
              open={!isExpired && isMenuOpen}
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
