import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

type OutfitCardProps = {
  footLabel: string
  onDelete: () => void
  modelImage: string
  outfitId: string
}

export const OutfitCard = ({ footLabel, onDelete, modelImage, outfitId }: OutfitCardProps) => {
  return (
    <div className="relative">
      <Link href={`/outfit/${outfitId}`} className="block">
        <div className="flex h-[224px] w-[164px] items-center justify-center rounded-[24px] bg-white py-3">
          <Image src={modelImage} alt="outfit" width={54} height={200} />
        </div>
        <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 rounded-[20px] bg-[#E5EFFF] px-3 py-1">
          <p className="font-label-sm text-primary-800 whitespace-nowrap">#{footLabel}</p>
        </div>
      </Link>
      <Button
        variant="ghost"
        className="absolute top-[14px] right-[14px] size-4"
        onClick={onDelete}
      >
        <Trash2 className="text-neutral-600" size={16} strokeWidth={2} />
      </Button>
    </div>
  )
}
