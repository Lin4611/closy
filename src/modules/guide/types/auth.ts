export type GoogleLoginPayload = {
  idToken: string
}

export type LoginUserPreferences = {
  styles: string[]
  colors: string[]
  occasions: string
}

export type LoginUser = {
  userId: string
  name: string
  email: string
  avatar: string
  preferences: LoginUserPreferences
  isProfileCompleted: boolean
}

export type GoogleLoginData = {
  token: string
  tokenExpiresIn: string
  user: LoginUser
}
