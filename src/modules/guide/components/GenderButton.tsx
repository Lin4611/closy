import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type GenderButtonProps = {
  gender: '男' | '女'
  onClick: () => void
  selected: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const GenderButton = ({
  gender,
  onClick,
  selected = false,
  className,
  type = 'button',
}: GenderButtonProps) => {
  const mergedClassName = cn('w-full', className)
  return (
    <Button
      type={type}
      variant="choice"
      size="xl"
      data-state={selected ? 'checked' : 'unchecked'}
      className={mergedClassName}
      onClick={onClick}
    >
      {gender}
    </Button>
  )
}
