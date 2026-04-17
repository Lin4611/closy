import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { DayRecommendation } from '@/modules/home/types/dayRecommendationTypes'

type DayCache = {
  dayRecommendation: DayRecommendation
  outfitImgUrl: string
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
      state.cacheDate = new Date().toISOString().split('T')[0]
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
    clearDayCache: (state) => {
      state.today = null
      state.tomorrow = null
    },
  },
})

export const { setDayCache, clearDayCache, updateDayImageUrl } = homeSlice.actions
export default homeSlice.reducer
