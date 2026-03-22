import { Button } from '@/components/ui/button'

type GenderButtonProps = {
  gender: string
  onClick: () => void
  selected: boolean
}

export const GenderButton = ({ gender, onClick, selected }: GenderButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`h-14 w-full bg-white ${selected ? 'border-2 border-neutral-900' : 'border-[0.5px] border-neutral-300'}`}
    >
      <span className="text-paragraph-md text-neutral-800">{gender}</span>
    </Button>
  )
}
