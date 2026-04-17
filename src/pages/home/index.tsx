import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useEffect } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { AppShell } from '@/modules/common/components/AppShell'
import { getHomeRecommendation } from '@/modules/home/api/home'
import { generateOutfit } from '@/modules/home/api/outfit'
import { HomeFilterBar } from '@/modules/home/components/HomeFilterBar'
import { HomeInsightsSection } from '@/modules/home/components/HomeInsightsSection'
import { HomeOutfitPreview } from '@/modules/home/components/HomeOutfitPreview'
import { HomePreviewTopBar } from '@/modules/home/components/HomePreviewTopBar'
import { OutfitAdjustDrawer } from '@/modules/home/components/outfit-adjust-drawer/OutfitAdjustDrawer'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearDayCache, setDayCache, updateDayImageUrl } from '@/store/slices/homeSlice'

const HomeOnboardingGate = dynamic(
  () =>
    import('@/modules/home/components/onboarding/HomeOnboardingGate').then((m) => ({
      default: m.HomeOnboardingGate,
    })),
  { ssr: false },
)

const Home = () => {
  const router = useRouter()
  const [isAdjustPromptOpen, setIsAdjustPromptOpen] = useState(true)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false)
  const [isOutfitAdjustDrawerOpen, setIsOutfitAdjustDrawerOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()
  const homeState = useAppSelector((state) => state.home)
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today')

  const fetchDayOutfit = async (day: 'today' | 'tomorrow', force = false) => {
    if (homeState[day] && !force) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await getHomeRecommendation(day)
      dispatch(setDayCache({ day, cache: { dayRecommendation: res, outfitImgUrl: '' } }))
      setIsLoading(false)
      setIsImageLoading(true)
      const { outfitImgUrl } = await generateOutfit({
        selectedItems: res.recommendation.selectedItems,
      })
      dispatch(updateDayImageUrl({ day, outfitImgUrl }))
    } catch (e) {
      if (e instanceof ApiError) showToast.error(e.message)
    } finally {
      setIsLoading(false)
      setIsImageLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const isStale = homeState.cacheDate !== today
    if (isStale) dispatch(clearDayCache())
    fetchDayOutfit('today', isStale)
  }, [])

  const handleDayChange = (day: 'today' | 'tomorrow') => {
    setActiveDay(day)
    fetchDayOutfit(day)
  }

  useEffect(() => {
    if (!isOnboardingVisible) return

    const originalOverflow = document.body.style.overflow
    const originalTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.touchAction = originalTouchAction
    }
  }, [isOnboardingVisible])

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const handleOccasionChange = () => {
    dispatch(clearDayCache())
    fetchDayOutfit(activeDay, true)
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
  const currentData = homeState[activeDay]

  return (
    <>
      <AppShell activeTab="home">
        <div className="sticky top-0 z-10">
          <HomeFilterBar onDayChange={handleDayChange} onOccasionChange={handleOccasionChange} />
        </div>
        <div className="relative">
          <HomePreviewTopBar
            weather={currentData?.dayRecommendation.weather}
            city={currentData?.dayRecommendation.city}
            expanded={isAdjustPromptOpen}
            onClick={() => setIsOutfitAdjustDrawerOpen(true)}
            onCalendarClick={() => void router.push('/calendar')}
          />
          <div className="flex flex-col items-center justify-center pt-13">
            <HomeOutfitPreview
              src={currentData?.outfitImgUrl || '/home/model_man.webp'}
              alt={`${activeDay}穿搭`}
              isLoading={isLoading || isImageLoading || !currentData}
              onDislikeClick={handleDislikeClick}
            />
          </div>
        </div>
        <HomeInsightsSection
          content={currentData?.dayRecommendation?.recommendation.reasoning ?? ''}
        />
        <OutfitAdjustDrawer
          open={isOutfitAdjustDrawerOpen}
          onOpenChange={setIsOutfitAdjustDrawerOpen}
          outfitImageUrl="/home/model_man.webp"
          outfitId="1"
        />
      </AppShell>
      <HomeOnboardingGate onVisibilityChange={setIsOnboardingVisible} />
    </>
  )
}
export default Home
