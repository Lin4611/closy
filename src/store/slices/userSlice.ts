import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { LoginUser } from '@/modules/guide/types/auth'

type UserState = {
  user: LoginUser | null
  isLoogedIn: boolean
}
const initialState: UserState = {
  user: null,
  isLoogedIn: false,
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginUser>) => {
      state.user = action.payload
      state.isLoogedIn = true
    },
    clearUser: (state) => {
      state.user = null
      state.isLoogedIn = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
