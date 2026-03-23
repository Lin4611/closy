type OverlayProps = {
  className?: string
}

export const Overlay = ({ className }: OverlayProps) => {
  return <div className={`absolute inset-0 bg-[#191B23]/50 ${className ?? ''}`} />
}
