import { useRouter } from 'next/router'
import { useState } from 'react'


import { BottomNav } from '@/modules/common/components/BottomNav'
import { AddClothingDrawer } from '@/modules/common/components/overlay/AddClothingDrawer'

type AppShellProps = {
  children: React.ReactNode
  activeTab?: 'home' | 'outfit' | 'wardrobe' | 'settings'
}

export const AppShell = ({ children, activeTab }: AppShellProps) => {
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
      <main className="flex min-h-screen flex-col pb-20">{children}</main>
      <BottomNav activeTab={activeTab} onAddClick={() => setIsAddClothingDrawerOpen(true)} />
      <AddClothingDrawer
        open={isAddClothingDrawerOpen}
        onOpenChange={setIsAddClothingDrawerOpen}
        onCameraClick={handleNavigateCamera}
        onAlbumClick={handleNavigateAlbum}
      />
    </>
  )
}
