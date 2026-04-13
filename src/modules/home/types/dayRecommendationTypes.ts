export type Day = 'today' | 'tomorrow'

export type Weather = {
  temperature: string
  weather: string
  weatherCode: string
  weatherDescription: string
}
export type ClothingItem = {
  category: string
  cloudImgUrl: string
}

export type DayRecommendation = {
  recommendation: {
    selectedItems: ClothingItem[]
    reasoning: string
  }
  weather: Weather
  city: string
}
