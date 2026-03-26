import { useState } from 'react'

import { BottomNav } from '@/modules/common/components/BottomNav'
import { AddClothingSheet } from '@/modules/common/components/overlay/AddClothingSheet'

type AppShellProps = {
  children: React.ReactNode
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
}

export const AppShell = ({ children, activeTab }: AppShellProps) => {
  const [isAddClothingSheetOpen, setIsAddClothingSheetOpen] = useState(false)

  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav activeTab={activeTab} onAddClick={() => setIsAddClothingSheetOpen(true)} />
      <AddClothingSheet
        open={isAddClothingSheetOpen}
        onClose={() => setIsAddClothingSheetOpen(false)}
      />
    </>
  )
}