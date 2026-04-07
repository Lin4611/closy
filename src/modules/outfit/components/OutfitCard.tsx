import { Trash2 } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

type OutfitCardProps = {
  footLabel: string
  onDelete: () => void
  modelImage: string
}

export const OutfitCard = ({ footLabel, onDelete, modelImage }: OutfitCardProps) => {
  return (
    <div className="relative h-[224px] w-[164px]">
      <div className="flex items-center justify-center rounded-[24px] bg-white py-3">
        <Image src={modelImage} alt="outfit" width={54} height={200} />
      </div>
      <Button
        variant="ghost"
        className="absolute top-[14px] right-[14px] size-4"
        onClick={onDelete}
      >
        <Trash2 className="text-neutral-600" size={16} strokeWidth={2} />
      </Button>
      <div className="absolute bottom-7 left-1/2 w-[90px] -translate-x-1/2 rounded-[20px] bg-[#E5EFFF] px-3 py-1">
        <p className="font-label-sm text-primary-800">#{footLabel}</p>
      </div>
    </div>
  )
}
