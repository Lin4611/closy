import { cn } from '@/lib/utils'

type WardrobeItemMenuProps = {
  open: boolean
  align?: 'card' | 'detail'
  onEdit: () => void
  onDelete: () => void
}

export const WardrobeItemMenu = ({
  open,
  align = 'detail',
  onEdit,
  onDelete,
}: WardrobeItemMenuProps) => {
  if (!open) return null

  return (
    <div
      className={cn(
        'absolute z-30 min-w-39 overflow-hidden rounded-[14px] bg-white p-2 space-y-1 shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
        align === 'card' ? 'top-9.5 -right-3' : 'top-8 right-0'
      )}
    >
      <button
        type="button"
        onClick={onEdit}
        className="block w-full p-2 text-left font-paragraph-sm text-neutral-800"
      >
        編輯
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="block w-full p-2 text-left font-paragraph-sm text-neutral-800"
      >
        刪除
      </button>
    </div>
  )
}