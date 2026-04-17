import type { Occasion } from '@/modules/common/types/occasion'

export type Day = 'today' | 'tomorrow'

export type Weather = {
  temperature: string
  weather: string
  weatherCode: string
  weatherDescription: string
}
export type ClothingItem = {
  category: string
  name: string
  brand: string
  cloudImgUrl: string
}

export type DayRecommendation = {
  recommendation: {
    selectedItems: ClothingItem[]
    occasion: Occasion
    reasoning: string
  }
  weather: Weather
  city: string
}
