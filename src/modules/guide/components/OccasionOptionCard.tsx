import Image from 'next/image'

import { cn } from '@/lib/utils'

type OccasionOptionCardProps = {
  imageUrl: string
  name: string
  description: string
  onClick: () => void
  isSelected: boolean
}
export const OccasionOptionCard = ({
  imageUrl,
  name,
  description,
  onClick,
  isSelected,
}: OccasionOptionCardProps) => {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-start gap-2 rounded-[16px] bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out',
        isSelected ? 'ring-primary-800 ring-2' : 'ring-[0.5px] ring-neutral-300',
      )}
      onClick={onClick}
    >
      <Image src={imageUrl} alt={name} width={40} height={40} />
      <div className="flex flex-col items-start gap-1">
        <p className="font-label-md text-neutral-800">{name}</p>
        <p className="font-paragraph-xs text-neutral-400">{description}</p>
      </div>
    </button>
  )
}
