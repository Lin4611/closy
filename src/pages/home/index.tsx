import type { GetServerSideProps } from 'next'
import type { InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useEffect } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { apiClient } from '@/lib/api/client'
import type { ApiResponse } from '@/lib/api/types'
import { getTodayStorageDate, getStorageDate } from '@/lib/date'
import { isDaytime } from '@/lib/weather'
import { AppShell } from '@/modules/common/components/AppShell'
import { type Occasion } from '@/modules/common/types/occasion'
import { defaultOccasion } from '@/modules/common/types/occasion'
import type { UserInfo } from '@/modules/common/types/userInfoTypes'
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
import {
  clearDayCache,
  promoteTomorrowToToday,
  setDayCache,
  markDaySaved,
  updateDayAdjustResult,
  updateDayImageUrl,
  setDayOccasion,
} from '@/store/slices/homeSlice'
import { mergeUserProfile } from '@/store/slices/userSlice'
const HomeOnboardingGate = dynamic(
  () =>
    import('@/modules/home/components/onboarding/HomeOnboardingGate').then((m) => ({
      default: m.HomeOnboardingGate,
    })),
  { ssr: false },
)

export const getServerSideProps: GetServerSideProps<{
  profile: UserInfo
}> = async (context) => {
  const accessToken = context.req.cookies.accessToken

  if (!accessToken) {
    return { redirect: { destination: '/', permanent: false } }
  }

  try {
    const res = await apiClient<ApiResponse<UserInfo>>({
      baseUrl: process.env.API_BASE_URL,
      endpoint: '/user/information',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return { props: { profile: res.data } }
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 401) {
      return { redirect: { destination: '/', permanent: false } }
    }
    throw e
  }
}

const IS_FLOW2_DEMO = !!process.env.NEXT_PUBLIC_DEMO_OUTFIT_TODAY_URL

const DEMO_REASONING: Record<string, string> = {
  today_businessCasual:
    '以黑色 T 恤搭配淺藍色牛仔褲，建立起深淺對比的簡約基礎，展現商務休閒中從容且俐落的專業形象。整體搭配能輕鬆應對 24 至 28 度且體感微熱的天氣，在維持透氣舒適的同時，透過修身剪裁中和了牛仔褲的隨性，確保在辦公室或一般商務拜訪中依然保持體面質感。',
  dislike_businessCasual:
    '選用灰藍撞色 Polo 衫搭配深藍色長褲，透過同色系的視覺延伸建立層次感，展現穩重且專業的商務休閒風格。搭配黑色皮鞋能有效提升造型的正式度，在 24 至 28 度且局部多雲的天氣下，既能保持透氣舒適，也能完美應對各種商務社交場合。',
  today_socialGathering:
    '選用黑色印花 Polo 衫搭配黑灰色牛仔褲，以全黑單色系組合營造出適合社交聚會的俐落感與個性。這套穿搭能完美應對 24 至 28 度且多雲微熱的天氣，透過深色調的視覺收縮與皮鞋的質感點綴，在維持穿著舒適度的同時，也能確保在社交場合中展現得體且有神采的形象。',
  tomorrow_campusCasual:
    '以白色華夫格 T 恤與深棕色長褲建立起溫潤且清爽的色彩基調，展現自在的校園休閒風格。這套搭配能輕鬆應對 23 至 27 度晴朗穩定的天氣，透過寬鬆的剪裁確保全天候的通風舒適，搭配黑色皮鞋則在中和休閒感並注入一絲精緻，適合日常上課與課後社交活動。',
}

const Home = ({ profile }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [isAdjustPromptOpen, setIsAdjustPromptOpen] = useState(false)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false)
  const [isOutfitAdjustDrawerOpen, setIsOutfitAdjustDrawerOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const homeState = useAppSelector((state) => state.home)
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today')

  const addLikeRef = useRef(false)
  const dislikeShownRef = useRef(false)
  const user = useAppSelector((state) => state.user.user)

  const getCalendarOccasion = (day: 'today' | 'tomorrow'): Occasion | undefined => {
    if (day === 'today') {
      const hasEvent = profile.hasTodayCalendarEvent || profile.hasTodayCalendarEventWithoutOutfit
      return hasEvent && profile.todayCalendarEventOccasion
        ? (profile.todayCalendarEventOccasion as Occasion)
        : undefined
    }
    const hasEvent =
      profile.hasTomorrowCalendarEvent || profile.hasTomorrowCalendarEventWithoutOutfit
    return hasEvent && profile.tomorrowCalendarEventOccasion
      ? (profile.tomorrowCalendarEventOccasion as Occasion)
      : undefined
  }
  const fallbackOccasion = user?.preferences.occasions ?? defaultOccasion
  const calendarOccasion = getCalendarOccasion(activeDay)
  const currentOccasion = calendarOccasion ?? homeState[activeDay]?.occasion ?? fallbackOccasion

  useEffect(() => {
    setMounted(true)
    dispatch(mergeUserProfile(profile))
    if (homeState.today)
      dispatch(markDaySaved({ day: 'today', isSaved: profile.hasOutfitGeneratedToday }))
    if (homeState.tomorrow)
      dispatch(markDaySaved({ day: 'tomorrow', isSaved: profile.hasOutfitGeneratedTomorrow }))
  }, [])

  const fetchDayOutfit = async (
    day: 'today' | 'tomorrow',
    options?: {
      force?: boolean
      occasion?: Occasion
      demoUrl?: string
      isOccasionSwitch?: boolean
    },
  ) => {
    const force = options?.force ?? false
    const calendarOccasion = getCalendarOccasion(day)
    const targetOccasion = force
      ? (options?.occasion ?? calendarOccasion ?? fallbackOccasion)
      : (options?.occasion ?? calendarOccasion ?? homeState[day]?.occasion ?? fallbackOccasion)

    if (homeState[day] && !force) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await getHomeRecommendation(day, targetOccasion)

      let finalRes = res
      if (IS_FLOW2_DEMO) {
        const isDislike = options?.demoUrl === '/demo/model_pics/outfit-dislike-1.png'
        const reasoningKey = isDislike
          ? 'dislike_businessCasual'
          : day === 'tomorrow'
            ? 'tomorrow_campusCasual'
            : targetOccasion === 'socialGathering'
              ? 'today_socialGathering'
              : 'today_businessCasual'
        const demoReasoning = DEMO_REASONING[reasoningKey]
        if (demoReasoning) {
          finalRes = { ...res, recommendation: { ...res.recommendation, reasoning: demoReasoning } }
        }
      }

      dispatch(
        setDayCache({
          day,
          cache: {
            dayRecommendation: finalRes,
            outfitImgUrl: '',
            occasion: targetOccasion,
            isSaved:
              day === 'today'
                ? profile.hasOutfitGeneratedToday
                : profile.hasOutfitGeneratedTomorrow,
            calendarOccasion: getCalendarOccasion(day) ?? null,
          },
        }),
      )
      setIsLoading(false)

      // demo 圖選擇：options.demoUrl（dislike 指定圖）> Flow2 per-day/occasion > Flow1 fallback
      // getHomeRecommendation 照常打，reasoning 正常更新，只跳過 generateOutfit
      const demoUrl =
        options?.demoUrl ??
        (IS_FLOW2_DEMO
          ? day === 'today'
            ? options?.isOccasionSwitch && targetOccasion === 'socialGathering'
              ? process.env.NEXT_PUBLIC_DEMO_OUTFIT_TODAY_SOCIAL_URL
              : process.env.NEXT_PUBLIC_DEMO_OUTFIT_TODAY_URL
            : process.env.NEXT_PUBLIC_DEMO_OUTFIT_TOMORROW_URL
          : process.env.NEXT_PUBLIC_DEMO_OUTFIT_URL)

      if (demoUrl) {
        dispatch(updateDayImageUrl({ day, outfitImgUrl: demoUrl }))
      } else {
        setIsImageLoading(true)
        const result = await generateOutfit(day, {
          selectedItems: res.recommendation.selectedItems,
          occasion: targetOccasion,
        })
        dispatch(updateDayImageUrl({ day, outfitImgUrl: result.outfitImgUrl }))
      }
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.statusCode === 503) {
          showToast.error('目前 AI 繁忙中，請稍後重試')
        } else {
          showToast.error(e.message)
        }
      }
    } finally {
      setIsLoading(false)
      setIsImageLoading(false)
    }
  }

  useEffect(() => {
    const today = getTodayStorageDate()

    if (homeState.cacheDate === today) {
      const todayCalOccasion = getCalendarOccasion('today')
      const force = (todayCalOccasion ?? null) !== (homeState['today']?.calendarOccasion ?? null)
      fetchDayOutfit('today', { force, occasion: todayCalOccasion })
      return
    }

    const yesterday = getStorageDate(-1)

    if (homeState.cacheDate === yesterday && homeState.tomorrow) {
      dispatch(promoteTomorrowToToday())
      setIsLoading(false)
      return
    }

    dispatch(clearDayCache())
    fetchDayOutfit('today', { force: true, occasion: getCalendarOccasion('today') })
  }, [])

  const handleDayChange = (day: 'today' | 'tomorrow') => {
    setActiveDay(day)
    const calOccasion = getCalendarOccasion(day)
    const force = (calOccasion ?? null) !== (homeState[day]?.calendarOccasion ?? null)
    fetchDayOutfit(day, { force, occasion: calOccasion })
  }

  const isOccasionLocked =
    activeDay === 'today'
      ? profile.hasTodayCalendarEvent || profile.hasTodayCalendarEventWithoutOutfit
      : profile.hasTomorrowCalendarEvent || profile.hasTomorrowCalendarEventWithoutOutfit

  const isBooked =
    activeDay === 'today' ? profile.hasTodayCalendarEvent : profile.hasTomorrowCalendarEvent

  const addLikeOutfit = async () => {
    if (addLikeRef.current) return
    addLikeRef.current = true
    const recommendation = homeState[activeDay]?.dayRecommendation.recommendation
    if (!recommendation) {
      addLikeRef.current = false
      return
    }

    try {
      await addOutfit({
        outfitImgUrl: homeState[activeDay]?.outfitImgUrl || '/home/model_man.webp',
        selectedItems: recommendation.selectedItems,
        occasion: recommendation.occasion,
        outfitDate: activeDay === 'today' ? getStorageDate() : getStorageDate(1),
      })
      dispatch(markDaySaved({ day: activeDay }))
      showToast.info('已新增至我的穿搭！去我的穿搭查看 →', 3000)
      setTimeout(() => void router.push('/outfit'), 3000)
    } catch (e) {
      if (e instanceof ApiError) showToast.error(e.message)
    } finally {
      addLikeRef.current = false
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

  const handleOccasionChange = async (nextOccasion: Occasion) => {
    dispatch(setDayOccasion({ day: activeDay, occasion: nextOccasion }))
    await fetchDayOutfit(activeDay, { force: true, occasion: nextOccasion, isOccasionSwitch: true })
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
    showToast.info('已記錄偏好，重新推薦中', 1500)
    showAdjustPrompt(3000)
    const demoUrl =
      IS_FLOW2_DEMO && !dislikeShownRef.current
        ? '/demo/model_pics/outfit-dislike-1.png'
        : undefined
    dislikeShownRef.current = true
    fetchDayOutfit(activeDay, { force: true, occasion: currentOccasion, demoUrl })
  }

  const currentData = homeState[activeDay]
  const isSaved = currentData?.isSaved ?? false

  const handleConfirmAdjust = async (result: AdjustStreamResult) => {
    const occasion = currentData?.dayRecommendation.recommendation.occasion
    if (!occasion) return

    try {
      await addOutfit({
        outfitImgUrl: result.adjustedImageUrl,
        selectedItems: result.selectedItems,
        occasion,
        outfitDate: activeDay === 'today' ? getStorageDate() : getStorageDate(1),
      })
      dispatch(
        updateDayAdjustResult({
          day: activeDay,
          outfitImgUrl: result.adjustedImageUrl,
          selectedItems: result.selectedItems,
          reasoning: result.text,
        }),
      )
      dispatch(markDaySaved({ day: activeDay }))
      showToast.info('已新增至我的穿搭', 1500)
    } catch (e) {
      if (e instanceof ApiError) showToast.error(e.message)
    }
  }

  return (
    <>
      <AppShell activeTab="home">
        <div className="sticky top-0 z-10">
          <HomeFilterBar
            onDayChange={handleDayChange}
            onOccasionChange={handleOccasionChange}
            selectedOccasion={mounted ? currentOccasion : defaultOccasion}
            isBooked={isOccasionLocked}
          />
        </div>
        <div className="relative">
          <HomePreviewTopBar
            weather={mounted ? currentData?.dayRecommendation.weather : undefined}
            city={mounted ? currentData?.dayRecommendation.city : undefined}
            isDay={mounted ? isDaytime() : true}
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
              isSaved={mounted ? isSaved : false}
              isBooked={isBooked}
            />
          </div>
        </div>
        <HomeInsightsSection
          content={mounted ? (currentData?.dayRecommendation?.recommendation.reasoning ?? '') : ''}
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
