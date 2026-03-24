import { cn } from '@/lib/utils'

type MobileLayoutProps = {
  children: React.ReactNode
  className?: string
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className={cn('mx-auto min-h-screen w-full max-w-[375px] bg-neutral-100', className)}>
      {children}
    </div>
  )
}
