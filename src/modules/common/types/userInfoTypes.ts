export type UserInfo = {
  name: string
  picture: string
  gender: string
  preferences: {
    styles: string[]
    colors: string[]
    occasions: string
  }
  location: { longitude: number; latitude: number }
  hasTodayCalendarEvent: boolean
  hasTomorrowCalendarEvent: boolean
  todayCalendarEventOccasion: string
  tomorrowCalendarEventOccasion: string
  hasOutfitGeneratedToday: boolean
  hasOutfitGeneratedTomorrow: boolean
}
