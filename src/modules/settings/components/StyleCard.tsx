import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { StylesMeta } from '../types/stylesTypes'

type StyleCardProps = StylesMeta & {
  isSelected: boolean
  onClick: () => void
}

export const StyleCard = ({ imageUrl, name, isSelected, onClick }: StyleCardProps) => {
  return (
    <button
      className={cn(
        'flex size-40 flex-col items-center gap-3 rounded-[16px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        isSelected ? 'ring-primary-800 ring-2' : 'ring-[0.5px] ring-neutral-300',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="relative h-25 w-[136px] rounded-[12px]">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>
      <p className="font-label-sm">{name}</p>
    </button>
  )
}
