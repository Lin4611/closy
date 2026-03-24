type WardrobeItemMenuProps = {
  open: boolean
  onEdit: () => void
  onDelete: () => void
}

export const WardrobeItemMenu = ({ open, onEdit, onDelete }: WardrobeItemMenuProps) => {
  if (!open) return null

  return (
    <div className="absolute top-8 right-0 z-30 min-w-[104px] overflow-hidden rounded-2xl border border-neutral-200 bg-white py-1 shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        onClick={onEdit}
        className="w-full px-4 py-3 text-left font-paragraph-sm text-neutral-800 hover:bg-neutral-100"
      >
        編輯
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-full px-4 py-3 text-left font-paragraph-sm text-neutral-800 hover:bg-neutral-100"
      >
        刪除
      </button>
    </div>
  )
}
