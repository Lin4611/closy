import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { AdjustOutfitButton } from './AdjustOutfitButton'
import { CircleIconButton } from './CircleIconButton'

type HomeOutfitPreviewProps = {
  src: string
  alt: string
}
export const HomeOutfitPreview = ({ src, alt }: HomeOutfitPreviewProps) => {
  const [isAdjustPromptOpen, setIsAdjustPromptOpen] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleDislikeClick = () => {
    setIsAdjustPromptOpen(true)

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }

    hideTimerRef.current = setTimeout(() => {
      setIsAdjustPromptOpen(false)
    }, 3000)
  }
  return (
    <div className="relative flex w-full flex-col items-center justify-center pt-5">
      <Image src={src} alt={alt} width={130} height={484} />
      <div className="absolute right-4 bottom-16">
        <AdjustOutfitButton expanded={isAdjustPromptOpen} onClick={() => {}} disabled={false} />
      </div>
      <div className="absolute bottom-0 left-1/2 flex w-full max-w-[343px] -translate-x-1/2 items-center justify-between">
        <CircleIconButton
          kind="dislike"
          icon={X}
          onClick={handleDislikeClick}
          ariaLabel="不喜歡這套穿搭"
        />
        <CircleIconButton kind="like" icon={Heart} onClick={() => {}} ariaLabel="喜歡這套穿搭" />
      </div>
    </div>
  )
}
