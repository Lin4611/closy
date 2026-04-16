import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type RecognitionImagePreviewProps = {
  src?: string
  alt?: string
  className?: string
  imageClassName?: string
  fallbackClassName?: string
}

export const RecognitionImagePreview = ({
  src,
  alt = '衣物預覽',
  className,
  imageClassName,
  fallbackClassName,
}: RecognitionImagePreviewProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-hidden rounded-[12px] border border-neutral-200 bg-white',
        className
      )}
    >
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[12px]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className={cn('h-full w-full object-contain', imageClassName)} />
        ) : (
          <Skeleton className={cn('h-full w-full rounded-[12px]', fallbackClassName)} />
        )}
      </div>
    </div>
  )
}
