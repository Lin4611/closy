type GuideCarouselIndicatorProps = {
  currentIndex: number
}
export const GuideCarouselIndicator = ({ currentIndex }: GuideCarouselIndicatorProps) => {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`h-2 w-2 rounded-full ${currentIndex === 0 ? 'bg-primary-900' : 'bg-neutral-300'}`}
      />
      <span
        className={`h-2 w-2 rounded-full ${currentIndex === 1 ? 'bg-primary-900' : 'bg-neutral-300'}`}
      />
      <span
        className={`h-2 w-2 rounded-full ${currentIndex === 2 ? 'bg-primary-900' : 'bg-neutral-300'}`}
      />
    </div>
  )
}
