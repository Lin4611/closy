const buildQueryString = (query: Record<string, string | null | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (!value) return
    searchParams.set(key, value)
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

export const normalizeCalendarReturnTo = (value: string | null | undefined) => {
  if (!value || !value.startsWith('/')) {
    return null
  }

  return value
}

export const getCalendarEditRoute = (date: string) => `/calendar/${date}/edit`

export const parseCalendarEditDateParam = (value: string | string[] | undefined) => {
  if (typeof value !== 'string') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  return value
}

export const buildCalendarSelectOutfitReturnTo = ({
  mode,
  date,
}: {
  mode: 'new' | 'edit'
  date?: string | null
}) => {
  if (mode === 'edit' && date) {
    return getCalendarEditRoute(date)
  }

  return '/calendar/new'
}

export const buildCalendarSelectOutfitRoute = ({
  returnTo,
  date,
}: {
  returnTo: string
  date?: string | null
}) => {
  return `/calendar/select-outfit${buildQueryString({ returnTo, date: date ?? null })}`
}

export const buildOutfitDetailReturnTo = ({
  outfitId,
  returnTo,
  hideBottomNav = true,
}: {
  outfitId: string
  returnTo: string
  hideBottomNav?: boolean
}) => {
  return `/outfit/${outfitId}${buildQueryString({
    returnTo,
    hideBottomNav: hideBottomNav ? '1' : null,
  })}`
}
