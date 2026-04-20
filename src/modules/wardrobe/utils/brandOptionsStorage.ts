import { WARDROBE_BRAND_OPTIONS_STORAGE_KEY } from '@/modules/wardrobe/constants/storage'
import type { WardrobeBrandOption } from '@/modules/wardrobe/types'

const isClient = () => typeof window !== 'undefined'

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

export const getWardrobeBrandOptions = (): string[] => {
  if (!isClient()) {
    return []
  }

  const parsed = safeParseJson(window.localStorage.getItem(WARDROBE_BRAND_OPTIONS_STORAGE_KEY))

  return sanitizeWardrobeBrandOptions(parsed)
}

export const saveWardrobeBrandOptions = (options: readonly string[]) => {
  if (!isClient()) {
    return
  }

  window.localStorage.setItem(
    WARDROBE_BRAND_OPTIONS_STORAGE_KEY,
    JSON.stringify(normalizeWardrobeBrandOptions(options))
  )
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

export const mapWardrobeBrandValuesToOptions = (
  values: readonly string[]
): WardrobeBrandOption[] =>
  normalizeWardrobeBrandOptions(values).map((value) => ({
    value,
    label: value,
  }))
