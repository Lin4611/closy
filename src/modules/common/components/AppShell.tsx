import { useRouter } from 'next/router'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { BottomNav } from '@/modules/common/components/BottomNav'
import { AddClothingDrawer } from '@/modules/common/components/overlay/AddClothingDrawer'

type AppShellProps = {
  children: React.ReactNode
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
  showBottomNav?: boolean
}

export const AppShell = ({ children, activeTab, showBottomNav = true }: AppShellProps) => {
  const router = useRouter()

  const [isAddClothingDrawerOpen, setIsAddClothingDrawerOpen] = useState(false)

  const handleNavigateCamera = () => {
    setIsAddClothingDrawerOpen(false)
    void router.push({ pathname: '/wardrobe/new/camera', query: { entryScope: 'wardrobe' } })
  }

  const handleNavigateAlbum = () => {
    setIsAddClothingDrawerOpen(false)
    void router.push({ pathname: '/wardrobe/new/album', query: { entryScope: 'wardrobe' } })
  }

  return (
    <>
      <main className={cn('flex min-h-screen flex-col', showBottomNav && 'pb-20')}>{children}</main>
      {showBottomNav ? (
        <>
          <BottomNav activeTab={activeTab} onAddClick={() => setIsAddClothingDrawerOpen(true)} />
          <AddClothingDrawer
            open={isAddClothingDrawerOpen}
            onOpenChange={setIsAddClothingDrawerOpen}
            onCameraClick={handleNavigateCamera}
            onAlbumClick={handleNavigateAlbum}
            dismissible={true}
          />
        </>
      ) : null}
    </>
  )
}
