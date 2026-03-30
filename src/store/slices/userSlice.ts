import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { LoginUser } from '@/modules/guide/types/auth'

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
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
