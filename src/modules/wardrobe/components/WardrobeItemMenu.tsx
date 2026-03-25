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
        'absolute z-30 min-w-22 overflow-hidden rounded-[14px] bg-white py-1 shadow-[0_8px_20px_rgba(15,23,42,0.14)]',
        align === 'card' ? 'right-0 bottom-7' : 'top-8 right-0'
      )}
    >
      <button
        type="button"
        onClick={onEdit}
        className="block w-full px-4 py-2 text-left font-paragraph-sm text-neutral-700"
      >
        編輯
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="block w-full px-4 py-2 text-left font-paragraph-sm text-neutral-700"
      >
        刪除
      </button>
    </div>
  )
}