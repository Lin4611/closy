import { WardrobeDraftItem, WardrobeItem } from '../types'

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}/${month}/${day}`
}

export const mapDraftToWardrobeItem = (
  draft: WardrobeDraftItem,
  options?: {
    id?: string
    createdAt?: string
  }
): WardrobeItem => {
  const now = formatDate(new Date())

  return {
    id: options?.id ?? `wardrobe-${Date.now()}`,
    createdAt: options?.createdAt ?? now,
    updatedAt: now,
    ...draft,
  }
}
