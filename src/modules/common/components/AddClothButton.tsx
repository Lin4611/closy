import { Plus } from 'lucide-react'
type AddClothButtonProps = {
  onClick: () => void
}
export const AddClothButton = ({ onClick }: AddClothButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[45px] flex-1 items-center justify-center"
    >
      <span className="bg-primary-800 flex h-[45px] w-[45px] items-center justify-center rounded-full">
        <Plus className="text-white" size={30} strokeWidth={2.45} />
      </span>
    </button>
  )
}
