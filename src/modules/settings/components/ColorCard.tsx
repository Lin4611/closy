import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { ColorsMeta } from '../types/colorsTypes'

type ColorCardProps = ColorsMeta & {
  isSelected: boolean
  onClick: () => void
}
const roundedMap: Record<number, string> = {
  0: 'rounded-tl-[16px]',
  1: 'rounded-tr-[16px]',
  2: 'rounded-bl-[16px]',
  3: 'rounded-br-[16px]',
}

export const ColorCard = ({ name, colors, isSelected, onClick }: ColorCardProps) => {
  return (
    <button
      className={cn(
        'relative grid grid-cols-2 gap-[2px] rounded-[16px]',
        isSelected ? 'ring-primary-800 ring-3' : '',
      )}
      onClick={onClick}
      type="button"
    >
      {colors.map((c, i) => {
        return <div key={i} className={cn(`size-[49px]`, c, roundedMap[i])} />
      })}
      <div className="absolute bottom-1 left-1/2 w-[52px] -translate-x-1/2 rounded-[20px] bg-black/30 px-2 py-0.5 text-center backdrop-blur-sm">
        <p className="font-label-xs text-white">{name}</p>
      </div>
      {isSelected && (
        <div className="bg-primary-800 absolute top-2 right-2 flex size-6 items-center justify-center rounded-full">
          <Check size={16} strokeWidth={3} className="text-white" />
        </div>
      )}
    </button>
  )
}
