import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import { mockRecognitionDraft, mockWardrobeItems } from '../data/mockWardrobeItems'
import type { WardrobeDraftItem, WardrobeItem } from '../types'
import { mapDraftToWardrobeItem } from '../utils/mapDraftToWardrobeItem'

const WARDROBE_STORAGE_KEY = 'closy:wardrobe-items'
const RECOGNITION_DRAFT_STORAGE_KEY = 'closy:wardrobe-recognition-draft'
const WARDROBE_ITEMS_UPDATED_EVENT = 'closy:wardrobe-items-updated'

const mockItemMap = new Map(mockWardrobeItems.map((item) => [item.id, item] as const))

let cachedItemsSnapshot: WardrobeItem[] = mockWardrobeItems
let cachedItemsStorageValue: string | null | undefined = undefined
let cachedItemsRevision = 0

const normalizeItem = (item: WardrobeItem): WardrobeItem => {
  const fallbackItem = mockItemMap.get(item.id)

  return {
    ...item,
    imageUrl: item.imageUrl ?? fallbackItem?.imageUrl,
  }
}

const safeParseItems = (value: string | null): WardrobeItem[] => {
  if (!value) return mockWardrobeItems

  try {
    const parsed = JSON.parse(value) as WardrobeItem[]

    if (!Array.isArray(parsed)) {
      return mockWardrobeItems
    }

    return parsed.map(normalizeItem)
  } catch {
    return mockWardrobeItems
  }
}

const safeParseDraft = (value: string | null): WardrobeDraftItem | null => {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as WardrobeDraftItem

    return {
      ...mockRecognitionDraft,
      ...parsed,
      imageUrl: parsed.imageUrl ?? mockRecognitionDraft.imageUrl,
    }
  } catch {
    return null
  }
}

const getWardrobeItemSignature = (item: WardrobeItem | null) => {
  if (!item) {
    return ''
  }

  return `${item.id}:${item.updatedAt}`
}

const getWardrobeItemsSignature = (items: WardrobeItem[]) => {
  return items.map((item) => getWardrobeItemSignature(item)).join('|')
}

const getStoredItemsSnapshot = (): WardrobeItem[] => {
  if (typeof window === 'undefined') {
    return mockWardrobeItems
  }

  const storageValue = window.localStorage.getItem(WARDROBE_STORAGE_KEY)

  if (storageValue === cachedItemsStorageValue) {
    return cachedItemsSnapshot
  }

  cachedItemsStorageValue = storageValue
  cachedItemsSnapshot = safeParseItems(storageValue)

  return cachedItemsSnapshot
}

const notifyWardrobeItemsChanged = () => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(WARDROBE_ITEMS_UPDATED_EVENT))
}

const writeStoredItems = (items: WardrobeItem[]) => {
  if (typeof window === 'undefined') return

  const normalizedItems = items.map(normalizeItem)
  const nextStorageValue = JSON.stringify(normalizedItems)
  const currentStorageValue = window.localStorage.getItem(WARDROBE_STORAGE_KEY)

  if (nextStorageValue === currentStorageValue) {
    cachedItemsStorageValue = currentStorageValue
    cachedItemsSnapshot = normalizedItems
    return
  }

  cachedItemsStorageValue = nextStorageValue
  cachedItemsSnapshot = normalizedItems
  cachedItemsRevision += 1

  window.localStorage.setItem(WARDROBE_STORAGE_KEY, nextStorageValue)
  notifyWardrobeItemsChanged()
}

const subscribeWardrobeItems = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== WARDROBE_STORAGE_KEY) return
    onStoreChange()
  }

  const handleWardrobeItemsUpdated = () => {
    onStoreChange()
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(WARDROBE_ITEMS_UPDATED_EVENT, handleWardrobeItemsUpdated)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(WARDROBE_ITEMS_UPDATED_EVENT, handleWardrobeItemsUpdated)
  }
}

const useWardrobeServerTakeover = (hydrateFromServer: () => void) => {
  const hasHydratedFromServerRef = useRef(false)

  useEffect(() => {
    if (hasHydratedFromServerRef.current) {
      return
    }

    hasHydratedFromServerRef.current = true
    hydrateFromServer()
  }, [hydrateFromServer])
}

export const useWardrobeLocalStore = () => {
  const items = useSyncExternalStore(subscribeWardrobeItems, getStoredItemsSnapshot, () => mockWardrobeItems)
  const isReady = typeof window !== 'undefined'
  const itemsRevision = cachedItemsRevision

  const syncItemFromServer = useCallback((item: WardrobeItem) => {
    const normalizedItem = normalizeItem(item)
    const nextItems = getStoredItemsSnapshot().filter((storedItem) => storedItem.id !== normalizedItem.id)

    writeStoredItems([normalizedItem, ...nextItems])

    return normalizedItem
  }, [])

  const syncCreatedItemFromServer = useCallback((item: WardrobeItem) => syncItemFromServer(item), [syncItemFromServer])

  const hydrateItemsFromServer = useCallback((serverItems: WardrobeItem[]) => {
    writeStoredItems(serverItems)

    return serverItems.map(normalizeItem)
  }, [])

  const appendItem = useCallback((item: WardrobeItem) => syncCreatedItemFromServer(item), [syncCreatedItemFromServer])
  const replaceItems = useCallback((serverItems: WardrobeItem[]) => hydrateItemsFromServer(serverItems), [hydrateItemsFromServer])

  const addItem = useCallback(
    (draft: WardrobeDraftItem) => {
      const nextItem = mapDraftToWardrobeItem(draft)
      appendItem(nextItem)
      return nextItem
    },
    [appendItem],
  )

  const updateItem = useCallback((id: string, draft: WardrobeDraftItem) => {
    let updatedItem: WardrobeItem | null = null

    const nextItems = getStoredItemsSnapshot().map((item) => {
      if (item.id !== id) return item

      updatedItem = mapDraftToWardrobeItem(draft, {
        id: item.id,
        createdAt: item.createdAt,
      })

      return updatedItem
    })

    writeStoredItems(nextItems)

    return updatedItem
  }, [])

  const deleteItem = useCallback((id: string) => {
    writeStoredItems(getStoredItemsSnapshot().filter((item) => item.id !== id))
  }, [])

  const getItemById = useCallback((id: string) => {
    return items.find((item) => item.id === id) ?? null
  }, [items])

  const saveRecognitionDraft = useCallback((draft: WardrobeDraftItem) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(RECOGNITION_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [])

  const getRecognitionDraft = useCallback(() => {
    if (typeof window === 'undefined') return null
    return safeParseDraft(window.localStorage.getItem(RECOGNITION_DRAFT_STORAGE_KEY))
  }, [])

  const clearRecognitionDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(RECOGNITION_DRAFT_STORAGE_KEY)
  }, [])

  const resetWardrobe = useCallback(() => {
    writeStoredItems(mockWardrobeItems)
  }, [])

  return useMemo(
    () => ({
      isReady,
      items,
      itemsRevision,
      syncItemFromServer,
      syncCreatedItemFromServer,
      hydrateItemsFromServer,
      appendItem,
      replaceItems,
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
      appendItem,
      clearRecognitionDraft,
      deleteItem,
      getItemById,
      getRecognitionDraft,
      hydrateItemsFromServer,
      isReady,
      items,
      itemsRevision,
      replaceItems,
      resetWardrobe,
      saveRecognitionDraft,
      syncCreatedItemFromServer,
      syncItemFromServer,
      updateItem,
    ],
  )
}

export const useWardrobeServerItems = (initialItems: WardrobeItem[]) => {
  const { hydrateItemsFromServer, isReady, items, itemsRevision } = useWardrobeLocalStore()
  const [initialItemsRevision] = useState(itemsRevision)
  const initialItemsSignature = useMemo(() => getWardrobeItemsSignature(initialItems), [initialItems])
  const currentItemsSignature = useMemo(() => getWardrobeItemsSignature(items), [items])

  useWardrobeServerTakeover(
    useCallback(() => {
      if (!isReady) {
        return
      }

      hydrateItemsFromServer(initialItems)
    }, [hydrateItemsFromServer, initialItems, isReady]),
  )

  const hasClientItemsTakenOver =
    itemsRevision !== initialItemsRevision || currentItemsSignature === initialItemsSignature

  return !isReady || !hasClientItemsTakenOver ? initialItems : items
}

export const useWardrobeServerItem = (initialItem: WardrobeItem) => {
  const { getItemById, isReady, itemsRevision, syncItemFromServer } = useWardrobeLocalStore()
  const [initialItemsRevision] = useState(itemsRevision)
  const initialItemSignature = useMemo(() => getWardrobeItemSignature(initialItem), [initialItem])

  useWardrobeServerTakeover(
    useCallback(() => {
      if (!isReady) {
        return
      }

      syncItemFromServer(initialItem)
    }, [initialItem, isReady, syncItemFromServer]),
  )

  const cachedItem = useMemo(() => getItemById(initialItem.id), [getItemById, initialItem.id])
  const cachedItemSignature = useMemo(() => getWardrobeItemSignature(cachedItem), [cachedItem])
  const hasClientItemTakenOver =
    itemsRevision !== initialItemsRevision || cachedItemSignature === initialItemSignature

  return !isReady || !hasClientItemTakenOver ? initialItem : cachedItem ?? initialItem
}
