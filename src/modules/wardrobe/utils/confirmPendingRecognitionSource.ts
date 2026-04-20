import type { NextRouter } from 'next/router'

import { RECOGNITION_ENTRY_KEY } from '@/modules/wardrobe/constants/recognition'
import type { PendingRecognitionSource, WardrobeCreationFlowContext } from '@/modules/wardrobe/types'

type ConfirmPendingRecognitionSourceParams = {
  router: NextRouter
  pendingSource: PendingRecognitionSource | null
  pendingFile: File | null
  confirmPendingSource: (params?: {
    confirmedAt?: number
  }) => WardrobeCreationFlowContext | null
  replace?: boolean
}

export const confirmPendingRecognitionSource = async ({
  router,
  pendingSource,
  pendingFile,
  confirmPendingSource,
  replace = false,
}: ConfirmPendingRecognitionSourceParams) => {
  if (!pendingSource || !pendingFile) {
    return null
  }

  const confirmedContext = confirmPendingSource()

  if (!confirmedContext) {
    return null
  }

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(RECOGNITION_ENTRY_KEY, pendingSource.origin)
  }

  if (replace) {
    await router.replace('/wardrobe/new/processing')
    return confirmedContext
  }

  await router.push('/wardrobe/new/processing')
  return confirmedContext
}
