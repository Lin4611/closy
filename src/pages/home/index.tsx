import { useRef, useState } from 'react'
import { useEffect } from 'react'

import { AppShell } from '@/modules/common/components/AppShell'
import { HomeFilterBar } from '@/modules/home/components/HomeFilterBar'
import { HomeInsightsSection } from '@/modules/home/components/HomeInsightsSection'
import { HomeOutfitPreview } from '@/modules/home/components/HomeOutfitPreview'
import { HomePreviewTopBar } from '@/modules/home/components/HomePreviewTopBar'

const Home = () => {
  const [isAdjustPromptOpen, setIsAdjustPromptOpen] = useState(true)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }
  const setHideTimer = (duration: number) => {
    hideTimerRef.current = setTimeout(() => {
      setIsAdjustPromptOpen(false)
      hideTimerRef.current = null
    }, duration)
  }
  const showAdjustPrompt = (duration: number) => {
    setIsAdjustPromptOpen(true)
    clearHideTimer()
    setHideTimer(duration)
  }

  useEffect(() => {
    setHideTimer(2000)

    return () => {
      clearHideTimer()
    }
  }, [])

  const handleDislikeClick = () => {
    showAdjustPrompt(3000)
  }

  return (
    <AppShell>
      <div className="sticky top-0 z-10">
        <HomeFilterBar />
      </div>
      <div className="relative">
        <HomePreviewTopBar expanded={isAdjustPromptOpen} />
        <div className="flex flex-col items-center justify-center pt-13">
          <HomeOutfitPreview
            src="/home/model_man.webp"
            alt="model"
            onDislikeClick={handleDislikeClick}
          />
        </div>
      </div>
      <HomeInsightsSection />
    </AppShell>
  )
}
export default Home
