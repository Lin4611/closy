import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getTodayStorageDate } from '@/lib/date'
import type { Occasion } from '@/modules/common/types/occasion'
import type { ClothingItem, DayRecommendation } from '@/modules/home/types/dayRecommendationTypes'

type DayCache = {
  dayRecommendation: DayRecommendation
  outfitImgUrl: string
  occasion: Occasion
  isSaved?: boolean
  calendarOccasion: Occasion | null
}

type HomeState = {
  cacheDate: string | null
  today: DayCache | null
  tomorrow: DayCache | null
}

const initialState: HomeState = {
  cacheDate: null,
  today: null,
  tomorrow: null,
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setDayCache: (state, action: PayloadAction<{ day: 'today' | 'tomorrow'; cache: DayCache }>) => {
      if (action.payload.day === 'today') {
        state.today = action.payload.cache
      } else {
        state.tomorrow = action.payload.cache
      }
      state.cacheDate = getTodayStorageDate()
    },
    updateDayImageUrl: (
      state,
      action: PayloadAction<{ day: 'today' | 'tomorrow'; outfitImgUrl: string }>,
    ) => {
      const dayState = state[action.payload.day]
      if (dayState) {
        dayState.outfitImgUrl = action.payload.outfitImgUrl
      }
    },
    setDayOccasion: (
      state,
      action: PayloadAction<{ day: 'today' | 'tomorrow'; occasion: Occasion }>,
    ) => {
      const dayState = state[action.payload.day]
      if (!dayState) return
      dayState.occasion = action.payload.occasion
      dayState.dayRecommendation.recommendation.occasion = action.payload.occasion
      dayState.isSaved = false
    },
    updateDayAdjustResult: (
      state,
      action: PayloadAction<{
        day: 'today' | 'tomorrow'
        outfitImgUrl: string
        selectedItems: ClothingItem[]
        reasoning: string
      }>,
    ) => {
      const dayState = state[action.payload.day]
      if (dayState) {
        dayState.outfitImgUrl = action.payload.outfitImgUrl
        dayState.dayRecommendation.recommendation.selectedItems = action.payload.selectedItems
        dayState.dayRecommendation.recommendation.reasoning = action.payload.reasoning
      }
    },
    markDaySaved: (state, action: PayloadAction<{ day: 'today' | 'tomorrow'; isSaved?: boolean }>) => {
      const dayState = state[action.payload.day]
      if (dayState) {
        dayState.isSaved = action.payload.isSaved ?? true
      }
    },
    promoteTomorrowToToday: (state) => {
      state.today = state.tomorrow
      state.tomorrow = null
      state.cacheDate = getTodayStorageDate()
    },
    clearDayCache: (state) => {
      state.today = null
      state.tomorrow = null
    },
  },
})

export const {
  setDayCache,
  promoteTomorrowToToday,
  clearDayCache,
  updateDayImageUrl,
  updateDayAdjustResult,
  markDaySaved,
  setDayOccasion,
} = homeSlice.actions
export default homeSlice.reducer
