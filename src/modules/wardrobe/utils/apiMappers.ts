import type {
  AnalyzeClothesResponseData,
  ClothesApiCategory,
  ClothesApiColor,
  ClothesApiOccasion,
  ClothesApiSeason,
  ClothesApiItem,
  CreateClothesRequest,
  UpdateClothesRequest,
  WardrobeApiMappingSnapshot,
} from '@/modules/wardrobe/api/types'
import type {
  WardrobeCategoryKey,
  WardrobeColorKey,
  WardrobeItem,
  WardrobeOccasionKey,
  WardrobeReviewDraft,
  WardrobeSeasonKey,
} from '@/modules/wardrobe/types'

const categoryApiToUiMap: Record<ClothesApiCategory, Exclude<WardrobeCategoryKey, 'all'>> = {
  top: 'top',
  bottom: 'pants',
  outerwear: 'outer',
  skirt: 'skirt',
  dress: 'dress',
  shoes: 'shoes',
}

const categoryUiToApiMap: Record<Exclude<WardrobeCategoryKey, 'all'>, ClothesApiCategory> = {
  top: 'top',
  pants: 'bottom',
  outer: 'outerwear',
  skirt: 'skirt',
  dress: 'dress',
  shoes: 'shoes',
}

const occasionApiToUiMap: Record<ClothesApiOccasion, WardrobeOccasionKey> = {
  socialGathering: 'social',
  campusCasual: 'campus_casual',
  businessCasual: 'business_casual',
  professional: 'professional',
}

const occasionUiToApiMap: Record<WardrobeOccasionKey, ClothesApiOccasion> = {
  social: 'socialGathering',
  campus_casual: 'campusCasual',
  business_casual: 'businessCasual',
  professional: 'professional',
}

const seasonApiToUiMap: Record<ClothesApiSeason, WardrobeSeasonKey> = {
  spring: 'spring',
  summer: 'summer',
  autumn: 'autumn',
  winter: 'winter',
}

const seasonUiToApiMap: Record<WardrobeSeasonKey, ClothesApiSeason> = {
  spring: 'spring',
  summer: 'summer',
  autumn: 'autumn',
  winter: 'winter',
}

const colorApiToUiMap: Record<ClothesApiColor, WardrobeColorKey> = {
  white: 'light_beige',
  black: 'dark_gray_black',
  gray: 'neutral_gray',
  brown: 'earth_brown',
  yellow: 'butter_yellow',
  orange: 'warm_orange_red',
  pink: 'rose_pink',
  green: 'natural_green',
  blue: 'fresh_blue',
  purple: 'elegant_purple',
}

const colorUiToApiMap: Record<WardrobeColorKey, ClothesApiColor> = {
  light_beige: 'white',
  dark_gray_black: 'black',
  neutral_gray: 'gray',
  earth_brown: 'brown',
  butter_yellow: 'yellow',
  warm_orange_red: 'orange',
  rose_pink: 'pink',
  natural_green: 'green',
  fresh_blue: 'blue',
  elegant_purple: 'purple',
}

const formatDisplayDate = (value: string) => {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  const year = parsed.getFullYear()
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0')
  const day = `${parsed.getDate()}`.padStart(2, '0')

  return `${year}/${month}/${day}`
}

export const mapApiCategoryToWardrobeCategory = (
  category: ClothesApiCategory
): Exclude<WardrobeCategoryKey, 'all'> => categoryApiToUiMap[category]

export const mapWardrobeCategoryToApiCategory = (
  category: Exclude<WardrobeCategoryKey, 'all'>
): ClothesApiCategory => categoryUiToApiMap[category]

export const mapApiOccasionToWardrobeOccasion = (
  occasion: ClothesApiOccasion
): WardrobeOccasionKey => occasionApiToUiMap[occasion]

export const mapWardrobeOccasionToApiOccasion = (
  occasion: WardrobeOccasionKey
): ClothesApiOccasion => occasionUiToApiMap[occasion]

export const mapApiSeasonToWardrobeSeason = (season: ClothesApiSeason): WardrobeSeasonKey =>
  seasonApiToUiMap[season]

export const mapWardrobeSeasonToApiSeason = (season: WardrobeSeasonKey): ClothesApiSeason =>
  seasonUiToApiMap[season]

export const mapApiColorToWardrobeColor = (color: ClothesApiColor): WardrobeColorKey =>
  colorApiToUiMap[color]

export const mapWardrobeColorToApiColor = (color: WardrobeColorKey): ClothesApiColor =>
  colorUiToApiMap[color]

export const mapAnalyzeResponseToWardrobeReviewDraft = (
  response: AnalyzeClothesResponseData
): WardrobeReviewDraft => ({
  name: typeof response.name === 'string' ? response.name : '',
  brand: typeof response.brand === 'string' ? response.brand : '',
  category: mapApiCategoryToWardrobeCategory(response.category),
  occasionKeys: Array.isArray(response.occasions)
    ? response.occasions.map(mapApiOccasionToWardrobeOccasion)
    : [],
  seasonKeys: Array.isArray(response.seasons)
    ? response.seasons.map(mapApiSeasonToWardrobeSeason)
    : [],
  colorKey: mapApiColorToWardrobeColor(response.color),
  imageUrl: response.cloudImgUrl,
})

export const mapWardrobeReviewDraftToCreateClothesRequest = (
  draft: WardrobeReviewDraft,
  options: {
    cloudImgUrl: string
    imageHash: string
  }
): CreateClothesRequest => {
  if (!draft.colorKey) {
    throw new Error('缺少衣物主色，無法建立新增衣物請求')
  }

  return {
    category: mapWardrobeCategoryToApiCategory(draft.category),
    cloudImgUrl: options.cloudImgUrl,
    imageHash: options.imageHash,
    name: draft.name.trim(),
    color: mapWardrobeColorToApiColor(draft.colorKey),
    occasions: draft.occasionKeys.map(mapWardrobeOccasionToApiOccasion),
    seasons: draft.seasonKeys.map(mapWardrobeSeasonToApiSeason),
    brand: draft.brand.trim(),
  }
}

export const mapWardrobeReviewDraftToUpdateClothesRequest = (
  draft: WardrobeReviewDraft
): UpdateClothesRequest => {
  if (!draft.colorKey) {
    throw new Error('缺少衣物主色，無法建立編輯衣物請求')
  }

  return {
    category: mapWardrobeCategoryToApiCategory(draft.category),
    name: draft.name.trim(),
    color: mapWardrobeColorToApiColor(draft.colorKey),
    occasions: draft.occasionKeys.map(mapWardrobeOccasionToApiOccasion),
    seasons: draft.seasonKeys.map(mapWardrobeSeasonToApiSeason),
    brand: draft.brand.trim(),
  }
}

export const mapClothesApiItemToWardrobeItem = (item: ClothesApiItem): WardrobeItem => ({
  id: item._id,
  name: item.name,
  brand: item.brand,
  category: mapApiCategoryToWardrobeCategory(item.category),
  occasionKeys: item.occasions.map(mapApiOccasionToWardrobeOccasion),
  seasonKeys: item.seasons.map(mapApiSeasonToWardrobeSeason),
  colorKeys: [mapApiColorToWardrobeColor(item.color)],
  imageUrl: item.cloudImgUrl ?? item.imgUrl,
  createdAt: formatDisplayDate(item.createdAt),
  updatedAt: formatDisplayDate(item.updatedAt),
})

export const getWardrobeApiMappingSnapshot = (
  draft: WardrobeReviewDraft
): WardrobeApiMappingSnapshot => {
  if (!draft.colorKey) {
    throw new Error('缺少衣物主色，無法產生 API 映射快照')
  }

  return {
    category: {
      ui: draft.category,
      api: mapWardrobeCategoryToApiCategory(draft.category),
    },
    occasions: draft.occasionKeys.map((occasion) => ({
      ui: occasion,
      api: mapWardrobeOccasionToApiOccasion(occasion),
    })),
    seasons: draft.seasonKeys.map((season) => ({
      ui: season,
      api: mapWardrobeSeasonToApiSeason(season),
    })),
    color: {
      ui: draft.colorKey,
      api: mapWardrobeColorToApiColor(draft.colorKey),
    },
  }
}
