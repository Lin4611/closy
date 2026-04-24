import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Occasion } from '@/modules/common/types/occasion'
import type { UserInfo } from '@/modules/common/types/userInfoTypes'
import type { LoginUser } from '@/modules/guide/types/auth'
import type { Colors } from '@/modules/settings/types/colorsTypes'
import type { Styles } from '@/modules/settings/types/stylesTypes'

type UserState = {
  user: LoginUser | null
  isLoggedIn: boolean
}
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginUser>) => {
      state.user = action.payload
      state.isLoggedIn = true
    },
    clearUser: (state) => {
      state.user = null
      state.isLoggedIn = false
    },
    updateUserGender: (state, action: PayloadAction<'male' | 'female'>) => {
      if (!state.user) return
      state.user.gender = action.payload
    },
    updateUserOccasion: (state, action: PayloadAction<Occasion>) => {
      if (!state.user) return
      state.user.preferences.occasions = action.payload
    },
    updateUserStyles: (state, action: PayloadAction<Styles[]>) => {
      if (!state.user) return
      state.user.preferences.styles = action.payload
    },
    updateUserColors: (state, action: PayloadAction<Colors[]>) => {
      if (!state.user) return
      state.user.preferences.colors = action.payload
    },
    setProfileCompleted: (state) => {
      if (!state.user) return
      state.user.isProfileCompleted = true
    },
    mergeUserProfile: (state, action: PayloadAction<UserInfo>) => {
      state.user = {
        userId: state.user?.userId ?? '',
        email: state.user?.email ?? '',
        isProfileCompleted: state.user?.isProfileCompleted ?? false,
        name: action.payload.name,
        avatar: action.payload.picture,
        gender: action.payload.gender,
        preferences: {
          styles: action.payload.preferences.styles as Styles[],
          colors: action.payload.preferences.colors as Colors[],
          occasions: action.payload.preferences.occasions as Occasion,
        },
        location: action.payload.location,
        hasTodayCalendarEvent: action.payload.hasTodayCalendarEvent,
        hasTodayCalendarEventWithoutOutfit: action.payload.hasTodayCalendarEventWithoutOutfit,
        hasTomorrowCalendarEvent: action.payload.hasTomorrowCalendarEvent,
        hasTomorrowCalendarEventWithoutOutfit: action.payload.hasTomorrowCalendarEventWithoutOutfit,
        todayCalendarEventOccasion: action.payload.todayCalendarEventOccasion,
        tomorrowCalendarEventOccasion: action.payload.tomorrowCalendarEventOccasion,
        hasOutfitGeneratedToday: action.payload.hasOutfitGeneratedToday,
        hasOutfitGeneratedTomorrow: action.payload.hasOutfitGeneratedTomorrow,
      }
      state.isLoggedIn = true
    },
  },
})

export const {
  setUser,
  clearUser,
  setProfileCompleted,
  updateUserGender,
  updateUserOccasion,
  updateUserStyles,
  updateUserColors,
  mergeUserProfile,
} = userSlice.actions
export default userSlice.reducer
