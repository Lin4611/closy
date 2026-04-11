import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Occasion } from '@/modules/common/types/occasion'
import type { LoginUser } from '@/modules/guide/types/auth'
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
    updateUserOccasion: (state, action: PayloadAction<Occasion>) => {
      if (!state.user) return
      state.user.preferences.occasions = action.payload
    },
    updateUserStyles: (state, action: PayloadAction<Styles[]>) => {
      if (!state.user) return
      state.user.preferences.styles = action.payload
    },
  },
})

export const { setUser, clearUser, updateUserOccasion, updateUserStyles } = userSlice.actions
export default userSlice.reducer
