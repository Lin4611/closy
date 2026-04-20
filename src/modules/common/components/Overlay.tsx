import { cn } from '@/lib/utils'

type OverlayProps = {
  className?: string
}

export const Overlay = ({ className }: OverlayProps) => {
  return <div className={cn('absolute inset-0 bg-[#191B23]/50', className)} />
}
