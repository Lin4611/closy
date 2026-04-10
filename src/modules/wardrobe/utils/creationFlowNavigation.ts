import type { NextRouter } from 'next/router'

import type { PendingRecognitionSource, WardrobeCreationEntryScope, WardrobeCreationFlowContext } from '@/modules/wardrobe/types'

export const wardrobeCreationEntryScopes = ['wardrobe', 'guide-add-top', 'guide-add-bottom'] as const

export const isWardrobeCreationEntryScope = (value: unknown): value is WardrobeCreationEntryScope =>
  typeof value === 'string' && wardrobeCreationEntryScopes.includes(value as WardrobeCreationEntryScope)

const queryValueToString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export const getEntryScopeFromQuery = (router: Pick<NextRouter, 'query'>): WardrobeCreationEntryScope | null => {
  const value = queryValueToString(router.query.entryScope)
  return isWardrobeCreationEntryScope(value) ? value : null
}

export const resolveCreationFlowEntryScope = ({
  router,
  context,
  pendingSource,
}: {
  router?: Pick<NextRouter, 'query'>
  context?: WardrobeCreationFlowContext | null
  pendingSource?: PendingRecognitionSource | null
}): WardrobeCreationEntryScope => {
  const scopeFromQuery = router ? getEntryScopeFromQuery(router) : null

  return scopeFromQuery ?? pendingSource?.entryScope ?? context?.entryScope ?? 'wardrobe'
}

export const getCreationFlowReturnRoute = (entryScope: WardrobeCreationEntryScope) => {
  switch (entryScope) {
    case 'guide-add-top':
      return '/guide/add-top'
    case 'guide-add-bottom':
      return '/guide/add-bottom'
    case 'wardrobe':
    default:
      return '/wardrobe'
  }
}

export const getCreationFlowSourceRoute = (
  origin: 'camera' | 'album' | null,
  entryScope: WardrobeCreationEntryScope
) => {
  const pathname = origin === 'album' ? '/wardrobe/new/album' : '/wardrobe/new/camera'
  const query = entryScope === 'wardrobe' ? '' : `?entryScope=${entryScope}`

  return `${pathname}${query}`
}
