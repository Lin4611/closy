import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarSyncToggle } from '@/modules/calendar/components/CalendarSyncToggle'

type CalendarMonthBarProps = {
  month: string
  monthOptions: string[]
  isSynced: boolean
  onMonthChange: (month: string) => void
  onSyncChange: (checked: boolean) => void
  onAddClick?: () => void
  showAddButton?: boolean
  className?: string
}

export const CalendarMonthBar = ({
  month,
  monthOptions,
  isSynced,
  onMonthChange,
  onSyncChange,
  onAddClick,
  showAddButton = false,
  className,
}: CalendarMonthBarProps) => {
  return (
    <div className={cn('flex items-center gap-3 px-4 pt-2 pb-4', className)}>
      <select
        value={month}
        onChange={(event) => onMonthChange(event.target.value)}
        className="h-8 rounded-[12px] border border-neutral-300 bg-white px-3 font-paragraph-md text-neutral-800 outline-none"
      >
        {monthOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="ml-auto flex items-center gap-3">
        <CalendarSyncToggle checked={isSynced} onCheckedChange={onSyncChange} />
        {showAddButton ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onAddClick}
            className="rounded-full text-neutral-800"
            aria-label="新增行事曆"
          >
            <Plus className="size-5" strokeWidth={2} />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
