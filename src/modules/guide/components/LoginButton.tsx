import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LoginButtonProps = {
  className?: string
  onClick?: () => void
}

export const LoginButton = ({ className, onClick }: LoginButtonProps) => {
  return (
    <Button
      type="button"
      variant="oauth"
      size="auth"
      className={cn('w-full max-w-[343px]', className)}
      onClick={onClick}
    >
      <span className="flex items-center gap-[15px]">
        <Image src="/guide/Google Logo.svg" alt="Google Logo" width={24} height={24} />
        <span className="font-label-xxl">Google登入</span>
      </span>
    </Button>
  )
}
