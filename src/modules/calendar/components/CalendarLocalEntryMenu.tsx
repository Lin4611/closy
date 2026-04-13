import { cn } from '@/lib/utils'

type CalendarLocalEntryMenuProps = {
  open: boolean
  onEdit: () => void
  onDelete: () => void
}

export const CalendarLocalEntryMenu = ({ open, onEdit, onDelete }: CalendarLocalEntryMenuProps) => {
  if (!open) return null

  return (
    <div
      className={cn(
        'absolute top-9 right-0 z-30 min-w-30 space-y-1 overflow-hidden rounded-[14px] bg-white p-2 shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
      )}
    >
      <button type="button" onClick={onEdit} className="block w-full p-2 text-left font-paragraph-sm text-neutral-800">
        編輯
      </button>
      <button type="button" onClick={onDelete} className="block w-full p-2 text-left font-paragraph-sm text-neutral-800">
        刪除
      </button>
    </div>
  )
}
