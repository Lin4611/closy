import Link from 'next/link'

import { Button } from '@/components/ui/button'

type PrimaryButtonProps = {
  content: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  href?: string
}

export const PrimaryButton = ({
  content,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  href,
}: PrimaryButtonProps) => {
  const buttonClassName = `h-14 w-full rounded-[30px] ${className} ${disabled ? 'bg-neutral-200' : 'bg-neutral-900'}`
  const textClassName = `text-paragraph-md ${disabled ? 'text-neutral-400' : 'text-white'}`
  if (href && !disabled) {
    return (
      <Link href={href} className={`${buttonClassName} inline-flex items-center justify-center`}>
        <span className={textClassName}>{content}</span>
      </Link>
    )
  }

  return (
    <Button className={buttonClassName} disabled={disabled} onClick={onClick} type={type}>
      <span className={textClassName}>{content}</span>
    </Button>
  )
}
