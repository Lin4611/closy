import { Heart, X } from 'lucide-react'
import Image from 'next/image'

import { CircleIconButton } from './CircleIconButton'

type HomeOutfitPreviewProps = {
  src: string
  alt: string
  onDislikeClick?: () => void
}
export const HomeOutfitPreview = ({ src, alt, onDislikeClick }: HomeOutfitPreviewProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <Image src={src} alt={alt} width={126} height={440} />
      <div className="absolute bottom-0 left-1/2 flex w-full max-w-[283px] -translate-x-1/2 items-center justify-between">
        <CircleIconButton
          kind="dislike"
          icon={X}
          onClick={onDislikeClick}
          ariaLabel="不喜歡這套穿搭"
        />
        <CircleIconButton kind="like" icon={Heart} onClick={() => {}} ariaLabel="喜歡這套穿搭" />
      </div>
    </div>
  )
}
