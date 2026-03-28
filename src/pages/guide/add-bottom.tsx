import { useRouter } from 'next/router'
import { useState } from 'react'

import { AddClothButton } from '@/modules/common/components/AddClothButton'
import { BottomNav } from '@/modules/common/components/BottomNav'
import { Overlay } from '@/modules/common/components/Overlay'
import { AddClothingDrawer } from '@/modules/common/components/overlay/AddClothingDrawer'
import { GuideToolTip } from '@/modules/guide/components/GuideToolTip'
import { HomeFilterBar } from '@/modules/home/components/HomeFilterBar'
import { HomeInsightsSection } from '@/modules/home/components/HomeInsightsSection'
import { HomeOutfitPreview } from '@/modules/home/components/HomeOutfitPreview'
import { HomePreviewTopBar } from '@/modules/home/components/HomePreviewTopBar'

const GuideAddBottomPage = () => {
  const router = useRouter()

  const [isAddClothingDrawerOpen, setIsAddClothingDrawerOpen] = useState(false)

  const handleOpenDrawer = () => {
    setIsAddClothingDrawerOpen(true)
  }

  const handleCameraClick = () => {
    setIsAddClothingDrawerOpen(false)
    // TODO: 導向到相機頁面
    void router.push('/guide/complete')
  }

  const handleAlbumClick = () => {
    setIsAddClothingDrawerOpen(false)
    // TODO: 導向到相簿頁面
    void router.push('/guide/complete')
  }
  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="sticky top-0 z-10">
          <HomeFilterBar />
        </div>

        <div className="relative">
          <HomePreviewTopBar expanded={false} disabled />
          <div className="flex flex-col items-center justify-center pt-13">
            <HomeOutfitPreview src="/home/model_man.webp" alt="model" disable />
          </div>
        </div>

        <HomeInsightsSection />
        <BottomNav />
      </div>
      {!isAddClothingDrawerOpen && (
        <>
          <Overlay className="fixed inset-0 z-60 bg-[#191B23]/45" />

          <div className="pointer-events-none fixed right-0 bottom-4.5 left-0 z-70 flex justify-center">
            <div className="relative flex flex-col items-center">
              <div className="pointer-events-auto mb-3">
                <GuideToolTip text="點選+號開始新增下身單品" side="top" />
              </div>

              <div className="pointer-events-auto relative">
                <span className="pointer-events-none absolute inset-[-8px] rounded-full" />
                <AddClothButton onClick={handleOpenDrawer} />
              </div>
            </div>
          </div>
        </>
      )}

      <AddClothingDrawer
        open={isAddClothingDrawerOpen}
        onOpenChange={handleOpenDrawer}
        onCameraClick={handleCameraClick}
        onAlbumClick={handleAlbumClick}
        dismissible={false}
        context="再新增一件褲子或裙子吧！"
      />
    </>
  )
}
export default GuideAddBottomPage
