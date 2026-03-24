export type WardrobeCategoryKey =
  | 'all'
  | 'top'
  | 'pants'
  | 'skirt'
  | 'dress'
  | 'outer'
  | 'shoes'

export type WardrobeOccasionKey =
  | 'social'
  | 'campus_casual'
  | 'business_casual'
  | 'professional'

export type WardrobeSeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

export type WardrobeColorKey =
  | 'light_beige'
  | 'dark_gray_black'
  | 'neutral_gray'
  | 'earth_brown'
  | 'butter_yellow'
  | 'warm_orange_red'
  | 'rose_pink'
  | 'natural_green'
  | 'fresh_blue'
  | 'elegant_purple'

export type WardrobeCategoryOption = {
  key: WardrobeCategoryKey
  label: string
}

export type WardrobeOccasionOption = {
  key: WardrobeOccasionKey
  label: string
}

export type WardrobeSeasonOption = {
  key: WardrobeSeasonKey
  label: string
}

export type WardrobeColorOption = {
  key: WardrobeColorKey
  label: string
  hex: string
  textClassName?: string
}

export type WardrobeItem = {
  id: string
  name: string
  brand: string
  category: Exclude<WardrobeCategoryKey, 'all'>
  occasionKeys: WardrobeOccasionKey[]
  seasonKeys: WardrobeSeasonKey[]
  colorKeys: WardrobeColorKey[]
  imageUrl?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export type WardrobeDraftItem = {
  name: string
  brand: string
  category: Exclude<WardrobeCategoryKey, 'all'>
  occasionKeys: WardrobeOccasionKey[]
  seasonKeys: WardrobeSeasonKey[]
  colorKeys: WardrobeColorKey[]
  imageUrl?: string
  note?: string
}
