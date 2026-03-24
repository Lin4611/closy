import { useCallback, useEffect, useMemo, useState } from 'react'

import { mockRecognitionDraft, mockWardrobeItems } from '../data/mockWardrobeItems'
import { mapDraftToWardrobeItem } from '../utils/mapDraftToWardrobeItem'
import { WardrobeDraftItem, WardrobeItem } from '../types'

const WARDROBE_STORAGE_KEY = 'closy:wardrobe-items'
const RECOGNITION_DRAFT_STORAGE_KEY = 'closy:wardrobe-recognition-draft'

const safeParseItems = (value: string | null) => {
  if (!value) return mockWardrobeItems

  try {
    const parsed = JSON.parse(value) as WardrobeItem[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockWardrobeItems
  } catch {
    return mockWardrobeItems
  }
}

const safeParseDraft = (value: string | null) => {
  if (!value) return mockRecognitionDraft

  try {
    return JSON.parse(value) as WardrobeDraftItem
  } catch {
    return mockRecognitionDraft
  }
}

export const useWardrobeMock = () => {
  const [items, setItems] = useState<WardrobeItem[]>(mockWardrobeItems)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setItems(safeParseItems(window.localStorage.getItem(WARDROBE_STORAGE_KEY)))
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return
    window.localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(items))
  }, [isReady, items])

  const addItem = useCallback((draft: WardrobeDraftItem) => {
    const nextItem = mapDraftToWardrobeItem(draft)
    setItems((prev) => [nextItem, ...prev])
    return nextItem
  }, [])

  const updateItem = useCallback((id: string, draft: WardrobeDraftItem) => {
    let updatedItem: WardrobeItem | null = null

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        updatedItem = mapDraftToWardrobeItem(draft, {
          id: item.id,
          createdAt: item.createdAt,
        })

        return updatedItem
      })
    )

    return updatedItem
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const getItemById = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id) ?? null
    },
    [items]
  )

  const saveRecognitionDraft = useCallback((draft: WardrobeDraftItem) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(RECOGNITION_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [])

  const getRecognitionDraft = useCallback(() => {
    if (typeof window === 'undefined') return mockRecognitionDraft
    return safeParseDraft(window.localStorage.getItem(RECOGNITION_DRAFT_STORAGE_KEY))
  }, [])

  const clearRecognitionDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(RECOGNITION_DRAFT_STORAGE_KEY)
  }, [])

  const resetWardrobe = useCallback(() => {
    setItems(mockWardrobeItems)
    if (typeof window === 'undefined') return
    window.localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(mockWardrobeItems))
  }, [])

  return useMemo(
    () => ({
      isReady,
      items,
      addItem,
      updateItem,
      deleteItem,
      getItemById,
      saveRecognitionDraft,
      getRecognitionDraft,
      clearRecognitionDraft,
      resetWardrobe,
    }),
    [
      addItem,
      clearRecognitionDraft,
      deleteItem,
      getItemById,
      getRecognitionDraft,
      isReady,
      items,
      resetWardrobe,
      saveRecognitionDraft,
      updateItem,
    ]
  )
}
