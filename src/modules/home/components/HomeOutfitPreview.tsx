import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { CircleIconButton } from './CircleIconButton'
import { HomeOutfitPreviewSkeleton } from './HomeOutfitPreviewSkeleton'

type HomeOutfitPreviewProps = {
  src: string
  alt: string
  disable?: boolean
  isLoading?: boolean
  onDislikeClick?: () => void
}

export const HomeOutfitPreview = ({
  src,
  alt,
  onDislikeClick,
  isLoading,
  disable,
}: HomeOutfitPreviewProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      {isLoading ? (
        <HomeOutfitPreviewSkeleton />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={153}
          height={440}
          className={`h-110 w-[153px] object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      )}
      <div className="absolute bottom-0 left-1/2 flex w-full max-w-[283px] -translate-x-1/2 items-center justify-between">
        <CircleIconButton
          kind="dislike"
          icon={X}
          onClick={onDislikeClick}
          ariaLabel="不喜歡這套穿搭"
          disabled={disable}
        />
        <CircleIconButton
          kind="like"
          icon={Heart}
          onClick={() => {}}
          ariaLabel="喜歡這套穿搭"
          disabled={disable}
        />
      </div>
    </div>
  )
}
