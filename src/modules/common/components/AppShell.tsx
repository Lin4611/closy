import { BottomNav } from '@/modules/common/components/BottomNav'

type AppShellProps = {
  children: React.ReactNode
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
  onAddClick?: () => void
}

export const AppShell = ({ children, activeTab, onAddClick }: AppShellProps) => {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav activeTab={activeTab} onAddClick={onAddClick} />
    </>
  )
}