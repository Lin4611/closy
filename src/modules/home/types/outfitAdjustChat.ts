import type { ClothingItem } from '@/modules/home/types/dayRecommendationTypes'

export type OutfitAdjustChatMessage = {
  id: string
  text: string
  role: 'user' | 'assistant'
  status?: 'idle' | 'loading' | 'error'
}

export type AdjustQuota = {
  maxLimit: number
  used: number
  remaining: number
}

export type AdjustStreamPayload = {
  prompt: string
  originalImageUrl: string
  day: string
  selectedItems: ClothingItem[]
}

export type AdjustStreamResult = {
  text: string
  originalImageUrl: string
  adjustedImageUrl: string
  selectedItems: ClothingItem[]
}
