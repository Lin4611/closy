import type {
  WardrobeCategoryKey,
  WardrobeColorKey,
  WardrobeOccasionKey,
  WardrobeSeasonKey,
} from '../types'

export type ClothesApiCategory = 'top' | 'bottom' | 'outerwear' | 'shoes' | 'skirt' | 'dress'

export type ClothesApiOccasion =
  | 'socialGathering'
  | 'campusCasual'
  | 'businessCasual'
  | 'professional'

export type ClothesApiSeason = 'spring' | 'summer' | 'autumn' | 'winter'

export type ClothesApiColor =
  | 'white'
  | 'black'
  | 'gray'
  | 'brown'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'green'
  | 'blue'
  | 'purple'

export type RemoveBackgroundRequest = FormData

export type RemoveBackgroundResponseData = {
  message: string
  cloudinaryImageUrl: string
  imageHash: string
}

export type AnalyzeClothesRequest = {
  imageUrl: string
  imageHash: string
}

export type AnalyzeClothesResponseData = {
  cloudImgUrl: string
  category: ClothesApiCategory
  name: string
  seasons: ClothesApiSeason[]
  occasions: ClothesApiOccasion[]
  color: ClothesApiColor
  brand: string
}

export type CreateClothesRequest = {
  category: ClothesApiCategory
  cloudImgUrl: string
  imageHash: string
  name: string
  color: ClothesApiColor
  occasions: ClothesApiOccasion[]
  seasons: ClothesApiSeason[]
  brand: string
}

export type CreateClothesResponseItem = {
  _id: string
  category: ClothesApiCategory
  name: string
  color: ClothesApiColor
  occasions: ClothesApiOccasion[]
  seasons: ClothesApiSeason[]
  brand: string
  imageHash: string
  createdAt: string
  updatedAt: string
  cloudImgUrl?: string
  imgUrl?: string
  ' '?: string
}

export type CreateClothesResponseData = {
  message: string
  list: CreateClothesResponseItem[]
}

export type WardrobeApiMappingSnapshot = {
  category: {
    ui: Exclude<WardrobeCategoryKey, 'all'>
    api: ClothesApiCategory
  }
  occasions: Array<{
    ui: WardrobeOccasionKey
    api: ClothesApiOccasion
  }>
  seasons: Array<{
    ui: WardrobeSeasonKey
    api: ClothesApiSeason
  }>
  color: {
    ui: WardrobeColorKey
    api: ClothesApiColor
  }
}
