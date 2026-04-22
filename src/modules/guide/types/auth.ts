import type { Occasion } from '@/modules/common/types/occasion'
import type { Colors } from '@/modules/settings/types/colorsTypes'
import type { Styles } from '@/modules/settings/types/stylesTypes'

export type GoogleLoginPayload = {
  idToken: string
}

export type LoginUserPreferences = {
  styles: Styles[]
  colors: Colors[]
  occasions: Occasion
}

export type LoginUser = {
  userId: string
  name: string
  email: string
  avatar: string
  gender: string
  preferences: LoginUserPreferences
  isProfileCompleted: boolean
  location: { longitude: number; latitude: number }
  hasTodayCalendarEvent?: boolean
  hasTomorrowCalendarEvent?: boolean
  todayCalendarEventOccasion?: string
  tomorrowCalendarEventOccasion?: string
}

export type GoogleLoginData = {
  token: string
  tokenExpiresIn: string
  user: LoginUser
}
