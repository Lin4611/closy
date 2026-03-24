type WardrobeItemMenuProps = {
  open: boolean
  onEdit: () => void
  onDelete: () => void
}

export const WardrobeItemMenu = ({ open, onEdit, onDelete }: WardrobeItemMenuProps) => {
  if (!open) return null

  return (
    <div className="absolute top-6 right-0 z-30 min-w-[108px] overflow-hidden rounded-[12px] border border-neutral-200 bg-white py-1 shadow-[0_6px_18px_rgba(15,23,42,0.14)]">
      <button
        type="button"
        onClick={onEdit}
        className="w-full px-4 py-2 text-left font-paragraph-sm text-neutral-700"
      >
        編輯
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-full px-4 py-2 text-left font-paragraph-sm text-neutral-700"
      >
        刪除
      </button>
    </div>
  )
}