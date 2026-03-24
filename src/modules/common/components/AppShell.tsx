import { BottomNav } from '@/modules/common/components/BottomNav'

type AppShellProps = {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav />
    </>
  )
}
