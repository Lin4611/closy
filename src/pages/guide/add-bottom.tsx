import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { AddClothButton } from '@/modules/common/components/AddClothButton'
import { Overlay } from '@/modules/common/components/Overlay'
import { AddClothingDrawer } from '@/modules/common/components/overlay/AddClothingDrawer'
import { GuideBottomNav } from '@/modules/guide/components/GuideBottomNav'
import { GuideToolTip } from '@/modules/guide/components/GuideToolTip'
import { getOnboardingAddFlow, getOnboardingStepRoute } from '@/modules/guide/utils/onboardingAddFlow'
import { HomeFilterBar } from '@/modules/home/components/HomeFilterBar'
import { HomeInsightsSection } from '@/modules/home/components/HomeInsightsSection'
import { HomeOutfitPreview } from '@/modules/home/components/HomeOutfitPreview'
import { HomePreviewTopBar } from '@/modules/home/components/HomePreviewTopBar'

const GuideAddBottomPage = () => {
  const router = useRouter()

  const [isAddClothingDrawerOpen, setIsAddClothingDrawerOpen] = useState(false)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const currentStep = getOnboardingAddFlow()

    if (currentStep !== 'bottom-required') {
      void router.replace(getOnboardingStepRoute(currentStep))
    }
  }, [router])

  const handleOpenDrawer = () => {
    setIsAddClothingDrawerOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsAddClothingDrawerOpen(open)
  }

  const handleCameraClick = () => {
    setIsAddClothingDrawerOpen(false)
    void router.push({ pathname: '/wardrobe/new/camera', query: { entryScope: 'guide-add-bottom' } })
  }

  const handleAlbumClick = () => {
    setIsAddClothingDrawerOpen(false)
    void router.push({ pathname: '/wardrobe/new/album', query: { entryScope: 'guide-add-bottom' } })
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
        <GuideBottomNav onAddClick={handleOpenDrawer} disable />
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
                <span className="pointer-events-none absolute -inset-2 rounded-full" />
                <AddClothButton onClick={handleOpenDrawer} />
              </div>
            </div>
          </div>
        </>
      )}

      <AddClothingDrawer
        open={isAddClothingDrawerOpen}
        onOpenChange={handleOpenChange}
        onCameraClick={handleCameraClick}
        onAlbumClick={handleAlbumClick}
        dismissible={false}
      />
    </>
  )
}
export default GuideAddBottomPage
