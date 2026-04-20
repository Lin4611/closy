import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useEffect } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { AppShell } from '@/modules/common/components/AppShell'
import { addOutfit } from '@/modules/home/api/addOutfit'
import { getHomeRecommendation } from '@/modules/home/api/home'
import { generateOutfit } from '@/modules/home/api/outfit'
import { HomeFilterBar } from '@/modules/home/components/HomeFilterBar'
import { HomeInsightsSection } from '@/modules/home/components/HomeInsightsSection'
import { HomeOutfitPreview } from '@/modules/home/components/HomeOutfitPreview'
import { HomePreviewTopBar } from '@/modules/home/components/HomePreviewTopBar'
import { OutfitAdjustDrawer } from '@/modules/home/components/outfit-adjust-drawer/OutfitAdjustDrawer'
import type { AdjustStreamResult } from '@/modules/home/types/outfitAdjustChat'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearDayCache, setDayCache, updateDayAdjustResult, updateDayImageUrl } from '@/store/slices/homeSlice'

const HomeOnboardingGate = dynamic(
  () =>
    import('@/modules/home/components/onboarding/HomeOnboardingGate').then((m) => ({
      default: m.HomeOnboardingGate,
    })),
  { ssr: false },
)

const Home = () => {
  const router = useRouter()
  const [isAdjustPromptOpen, setIsAdjustPromptOpen] = useState(false)
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
      const result = await generateOutfit({
        selectedItems: res.recommendation.selectedItems,
        occasion: res.recommendation.occasion,
      })
      dispatch(
        updateDayImageUrl({ day, outfitImgUrl: result.outfitImgUrl, occasion: result.occasion }),
      )
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

  const addLikeOutfit = async () => {
    const recommendation = homeState[activeDay]?.dayRecommendation.recommendation
    if (!recommendation) return

    try {
      await addOutfit({
        outfitImgUrl: homeState[activeDay]?.outfitImgUrl || '/home/model_man.webp',
        selectedItems: recommendation.selectedItems,
        occasion: recommendation.occasion,
      })
      showToast.success('已加入收藏')
    } catch (e) {
      if (e instanceof ApiError) showToast.error(e.message)
    }
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
    const openTimer = setTimeout(() => {
      if (!hideTimerRef.current) {
        setIsAdjustPromptOpen(true)
        setHideTimer(2000)
      }
    }, 2000)

    return () => {
      clearTimeout(openTimer)
      clearHideTimer()
    }
  }, [])

  const handleDislikeClick = () => {
    showAdjustPrompt(3000)
  }

  const currentData = homeState[activeDay]

  const handleConfirmAdjust = async (result: AdjustStreamResult) => {
    const occasion = currentData?.dayRecommendation.recommendation.occasion
    if (!occasion) return

    try {
      await addOutfit({
        outfitImgUrl: result.adjustedImageUrl,
        selectedItems: result.selectedItems,
        occasion,
      })
      dispatch(updateDayAdjustResult({
        day: activeDay,
        outfitImgUrl: result.adjustedImageUrl,
        selectedItems: result.selectedItems,
        reasoning: result.text,
      }))
      showToast.success('已加入收藏')
    } catch (e) {
      if (e instanceof ApiError) showToast.error(e.message)
    }
  }

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
              onLikeClick={addLikeOutfit}
            />
          </div>
        </div>
        <HomeInsightsSection
          content={currentData?.dayRecommendation?.recommendation.reasoning ?? ''}
        />
        <OutfitAdjustDrawer
          open={isOutfitAdjustDrawerOpen}
          onOpenChange={setIsOutfitAdjustDrawerOpen}
          outfitImageUrl={currentData?.outfitImgUrl ?? ''}
          selectedItems={currentData?.dayRecommendation.recommendation.selectedItems ?? []}
          day={activeDay}
          onConfirmAdjust={handleConfirmAdjust}
        />
      </AppShell>
      <HomeOnboardingGate onVisibilityChange={setIsOnboardingVisible} />
    </>
  )
}
export default Home
