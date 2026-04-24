import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { CircleIconButton } from './CircleIconButton'
import { HomeOutfitPreviewSkeleton } from './HomeOutfitPreviewSkeleton'

type HomeOutfitPreviewProps = {
  src?: string
  alt: string
  isSaved?: boolean
  isBooked?: boolean
  isLoading?: boolean
  onDislikeClick?: () => void
  onLikeClick?: () => void
}

export const HomeOutfitPreview = ({
  src,
  alt,
  onDislikeClick,
  onLikeClick,
  isLoading,
  isSaved = false,
  isBooked = false,
}: HomeOutfitPreviewProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const isDisabled = isSaved || isBooked

  return (
    <div className="relative flex h-100 w-full flex-col items-center justify-center">
      {isLoading ? (
        <HomeOutfitPreviewSkeleton />
      ) : (
        src && (
          <div className="relative h-100 w-[139px] shrink-0">
            <Image
              src={src}
              alt={alt}
              width={139}
              height={400}
              className={`h-100 w-[139px] object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        )
      )}
      <div className="absolute bottom-0 left-1/2 flex w-full max-w-[283px] -translate-x-1/2 items-center justify-between">
        <CircleIconButton
          kind="dislike"
          icon={X}
          onClick={onDislikeClick}
          ariaLabel="不喜歡這套穿搭"
          disabled={isDisabled}
        />
        <CircleIconButton
          kind="like"
          icon={Heart}
          onClick={onLikeClick}
          ariaLabel="喜歡這套穿搭"
          disabled={isDisabled}
          isActive={isSaved && !isBooked}
        />
      </div>
    </div>
  )
}
