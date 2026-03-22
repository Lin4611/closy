import { Button } from '@/components/ui/button'

type PrimaryButtonProps = {
  content: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const PrimaryButton = ({
  content,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: PrimaryButtonProps) => {
  return (
    <Button
      className={`h-14 w-full rounded-[30px] ${className} ${disabled ? 'bg-neutral-200' : 'bg-neutral-900'}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <span className={`text-paragraph-md ${disabled ? 'text-neutral-400' : 'text-white'}`}>
        {content}
      </span>
    </Button>
  )
}
