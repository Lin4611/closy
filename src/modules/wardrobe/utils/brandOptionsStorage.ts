import { WARDROBE_BRAND_OPTIONS_STORAGE_KEY } from '@/modules/wardrobe/constants/storage'
import type { WardrobeBrandOption } from '@/modules/wardrobe/types'

const isClient = () => typeof window !== 'undefined'
const brandOptionListeners = new Set<() => void>()
let cachedBrandOptionsRaw: string | null = null
let cachedBrandOptionsSnapshot: string[] = []

const notifyWardrobeBrandOptionsChanged = () => {
  brandOptionListeners.forEach((listener) => listener())
}

export const sanitizeWardrobeBrandValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

export const normalizeWardrobeBrandOptions = (values: readonly string[]): string[] => {
  const normalizedValues = values
    .map(sanitizeWardrobeBrandValue)
    .filter((value) => value.length > 0)

  return Array.from(new Set(normalizedValues))
}

const safeParseJson = (value: string | null): unknown => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

export const sanitizeWardrobeBrandOptions = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return normalizeWardrobeBrandOptions(value)
}

const readWardrobeBrandOptionsRaw = () => {
  if (!isClient()) {
    return null
  }

  return window.localStorage.getItem(WARDROBE_BRAND_OPTIONS_STORAGE_KEY)
}

const updateCachedWardrobeBrandOptionsSnapshot = (raw: string | null) => {
  if (raw === cachedBrandOptionsRaw) {
    return cachedBrandOptionsSnapshot
  }

  cachedBrandOptionsRaw = raw
  cachedBrandOptionsSnapshot = sanitizeWardrobeBrandOptions(safeParseJson(raw))

  return cachedBrandOptionsSnapshot
}

export const getWardrobeBrandOptions = (): string[] =>
  updateCachedWardrobeBrandOptionsSnapshot(readWardrobeBrandOptionsRaw())

export const saveWardrobeBrandOptions = (options: readonly string[]) => {
  if (!isClient()) {
    return
  }

  const normalizedOptions = normalizeWardrobeBrandOptions(options)
  const nextRaw = JSON.stringify(normalizedOptions)

  window.localStorage.setItem(WARDROBE_BRAND_OPTIONS_STORAGE_KEY, nextRaw)
  updateCachedWardrobeBrandOptionsSnapshot(nextRaw)
  notifyWardrobeBrandOptionsChanged()
}

export const mergeWardrobeBrandOption = (
  options: readonly string[],
  brandValue: string
): string[] => {
  const normalizedBrandValue = sanitizeWardrobeBrandValue(brandValue)

  if (!normalizedBrandValue) {
    return normalizeWardrobeBrandOptions(options)
  }

  return normalizeWardrobeBrandOptions([...options, normalizedBrandValue])
}

export const persistWardrobeBrandOption = (brandValue: string): string[] => {
  const nextOptions = mergeWardrobeBrandOption(getWardrobeBrandOptions(), brandValue)
  saveWardrobeBrandOptions(nextOptions)
  return nextOptions
}

export const subscribeWardrobeBrandOptions = (listener: () => void) => {
  brandOptionListeners.add(listener)

  if (!isClient()) {
    return () => {
      brandOptionListeners.delete(listener)
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== WARDROBE_BRAND_OPTIONS_STORAGE_KEY) {
      return
    }

    updateCachedWardrobeBrandOptionsSnapshot(readWardrobeBrandOptionsRaw())
    listener()
  }

  window.addEventListener('storage', handleStorage)

  return () => {
    brandOptionListeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

export const getWardrobeBrandOptionsSnapshot = () => getWardrobeBrandOptions()

export const getWardrobeBrandOptionsServerSnapshot = () => cachedBrandOptionsSnapshot

export const mapWardrobeBrandValuesToOptions = (
  values: readonly string[]
): WardrobeBrandOption[] =>
  normalizeWardrobeBrandOptions(values).map((value) => ({
    value,
    label: value,
  }))
