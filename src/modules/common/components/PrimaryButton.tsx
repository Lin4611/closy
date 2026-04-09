import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type PrimaryButtonProps = {
  content: string
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  href?: string
}

export const PrimaryButton = ({
  content,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  href,
}: PrimaryButtonProps) => {
  const mergedClassName = cn('w-full flex', className)
  if (href && !disabled) {
    return (
      <Button asChild variant="brand" size="xl" className={mergedClassName}>
        <Link href={href}>{content}</Link>
      </Button>
    )
  }

  return (
    <Button
      variant="brand"
      size="xl"
      className={mergedClassName}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {content}
      {loading && <Spinner className="ml-2" />}
    </Button>
  )
}
