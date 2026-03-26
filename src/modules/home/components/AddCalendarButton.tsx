import { Plus } from 'lucide-react'

type AddCalendarButtonProps = {
  onClick: () => void
}

export const AddCalendarButton = ({ onClick }: AddCalendarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="新增衣物"
      className="bg-primary-200 flex size-11 items-center justify-center rounded-full"
    >
      <Plus className="text-primary-800" size={24} strokeWidth={2} />
    </button>
  )
}
