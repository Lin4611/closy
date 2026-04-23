import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdjustSuggestionChipProps = {
  label: string
  onClick?: () => void
  btnClassName?: string
  textClassName?: string
}
export const AdjustSuggestionChip = ({
  label,
  onClick,
  btnClassName,
  textClassName,
}: AdjustSuggestionChipProps) => {
  return (
    <Button
      className={cn(
        'h-[46px] w-fit rounded-[14px] bg-neutral-200 px-4 py-3.25 text-center wrap-break-word whitespace-normal',
        btnClassName,
      )}
      onClick={onClick}
    >
      <p className={cn('font-label-md text-neutral-900', textClassName)}>{label}</p>
    </Button>
  )
}
