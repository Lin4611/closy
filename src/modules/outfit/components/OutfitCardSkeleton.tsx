import { Skeleton } from '@/components/ui/skeleton'

export const OutfitCardSkeleton = () => {
  return (
    <div className="relative">
      <Skeleton className="h-[224px] w-[164px] rounded-[24px]" />
      <Skeleton className="absolute bottom-7 left-1/2 h-6 w-16 -translate-x-1/2 rounded-[20px]" />
    </div>
  )
}

export const OutfitGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-2 place-content-center justify-items-center gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <OutfitCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
