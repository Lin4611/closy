import { Plus } from 'lucide-react'

type AddClothButtonProps = {
  onClick: () => void
}

export const AddClothButton = ({ onClick }: AddClothButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="新增衣物"
      className="flex h-11.25 flex-1 items-center justify-center"
    >
      <span className="flex h-11.25 w-11.25 items-center justify-center rounded-full bg-primary-800">
        <Plus className="text-white" size={30} strokeWidth={2.45} />
      </span>
    </button>
  )
}