import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

type AddClothButtonProps = {
  onClick: () => void
  className?: string
}

export const AddClothButton = ({ onClick, className }: AddClothButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="新增衣物"
      className={cn('flex h-11.25 flex-1 items-center justify-center', className)}
    >
      <span className="bg-primary-800 flex h-11.25 w-11.25 items-center justify-center rounded-full">
        <Plus className="text-white" size={30} strokeWidth={2.45} />
      </span>
    </button>
  )
}
