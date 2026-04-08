import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export const OutfitAdjustLoadingView = () => {
  const s = 'skeleton-two-tone'

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-10">
        <Skeleton className={`${s} h-[54px] w-30 self-end rounded-[25px] rounded-tr-none`} />
        <Skeleton className={`${s} h-[54px] w-62 self-start rounded-[25px] rounded-bl-none`} />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full gap-2 px-[11.5px]">
          <Skeleton className={`${s} h-9 flex-1 rounded-full`} />
          <Skeleton className={`${s} h-9 w-16 rounded-full`} />
        </div>

        <div className="flex w-full items-center gap-2 px-[11.5px]">
          <div className="relative flex-1">
            <Input
              className="w-full rounded-[32px] border border-neutral-300 bg-white py-2.25"
              disabled
            />
            <Skeleton
              className={`${s} absolute top-1/2 left-4 h-[11px] w-21 -translate-y-1/2 rounded-[4px]`}
            />
          </div>
          <Skeleton className={`${s} h-7.5 w-7.5 shrink-0 rounded-full`} />
        </div>

        <Skeleton className={`${s} h-[11px] w-[107px] rounded-[4px]`} />
      </div>
    </>
  )
}
