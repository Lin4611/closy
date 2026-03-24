import { Plus } from 'lucide-react'
type AddClothButtonProps = {
  onClick: () => void
}
export const AddClothButton = ({ onClick }: AddClothButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary-800 flex h-[45px] w-[45px] flex-col items-center justify-center rounded-[40px]"
    >
      <Plus className="text-white" size={30} strokeWidth={2.45} />
    </button>
  )
}
