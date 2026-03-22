type MobileLayoutProps = {
  children: React.ReactNode
  className?: string
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <main className={`mx-auto min-h-screen w-full max-w-[375px] bg-neutral-100 ${className ?? ''}`}>
      {children}
    </main>
  )
}
