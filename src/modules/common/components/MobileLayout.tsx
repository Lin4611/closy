import { cn } from '@/lib/utils'

type MobileLayoutProps = {
  children: React.ReactNode
  className?: string
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div
      data-mobile-layout
      className={cn('relative mx-auto min-h-screen w-full max-w-93.75 bg-neutral-100', className)}
    >
      {children}
    </div>
  )
}
