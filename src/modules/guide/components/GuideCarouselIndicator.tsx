import { cn } from '@/lib/utils'

type GuideCarouselIndicatorProps = {
  currentIndex: number
}

export const GuideCarouselIndicator = ({ currentIndex }: GuideCarouselIndicatorProps) => {
  const totalSlides = 3
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <span
          key={index}
          className={cn(
            'h-2 w-2 rounded-full transition-all duration-500',
            currentIndex === index ? 'bg-primary-900' : 'bg-neutral-300',
          )}
        />
      ))}
    </div>
  )
}
