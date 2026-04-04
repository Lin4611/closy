import { Button } from '@/components/ui/button'
type AdjustSuggestionChipProps = {
  label: string
  onClick?: () => void
}
export const AdjustSuggestionChip = ({ label, onClick }: AdjustSuggestionChipProps) => {
  return (
    <Button
      className="h-[46px] w-fit rounded-[14px] bg-neutral-200 px-4 py-3.25 text-center wrap-break-word whitespace-normal"
      onClick={onClick}
    >
      <p className="font-label-md text-neutral-900">{label}</p>
    </Button>
  )
}
