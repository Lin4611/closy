import type { NextRouter } from 'next/router'

import { RECOGNITION_ENTRY_KEY } from '@/modules/wardrobe/constants/recognition'
import type { WardrobeCreationEntryScope, WardrobeRecognitionSource } from '@/modules/wardrobe/types'

type PreparePendingRecognitionSourceParams = {
  router: NextRouter
  origin: WardrobeRecognitionSource
  file: File
  entryScope: WardrobeCreationEntryScope
  clearFlow: () => void
  setPendingSource: (params: {
    origin: WardrobeRecognitionSource
    entryScope: WardrobeCreationEntryScope
    file: File | null
    previewUrl: string
    createdAt?: number
  }) => unknown
  previewUrl?: string
  replace?: boolean
}

export const preparePendingRecognitionSource = async ({
  router,
  origin,
  file,
  entryScope,
  clearFlow,
  setPendingSource,
  previewUrl,
  replace = false,
}: PreparePendingRecognitionSourceParams) => {
  const nextPreviewUrl = previewUrl ?? URL.createObjectURL(file)

  clearFlow()
  setPendingSource({
    origin,
    entryScope,
    file,
    previewUrl: nextPreviewUrl,
  })

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(RECOGNITION_ENTRY_KEY, origin)
  }

  if (replace) {
    await router.replace('/wardrobe/new/preview')
    return nextPreviewUrl
  }

  await router.push('/wardrobe/new/preview')
  return nextPreviewUrl
}
