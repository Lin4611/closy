import { useEffect, useMemo } from 'react'

import { buildSettingsHydrationProfile, type SettingsProfileBaseline } from '@/lib/api/settings/shared'
import { persistor } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { mergeUserProfile } from '@/store/slices/userSlice'

export const useSettingsProfileHydration = (profileBaseline: SettingsProfileBaseline) => {
  const dispatch = useAppDispatch()
  const hydrationProfile = useMemo(() => buildSettingsHydrationProfile(profileBaseline), [profileBaseline])

  useEffect(() => {
    let isCancelled = false

    const hydrate = () => {
      if (isCancelled) return
      dispatch(mergeUserProfile(hydrationProfile))
    }

    if (persistor.getState().bootstrapped) {
      hydrate()
      return
    }

    const unsubscribe = persistor.subscribe(() => {
      if (!persistor.getState().bootstrapped) return

      unsubscribe()
      hydrate()
    })

    return () => {
      isCancelled = true
      unsubscribe()
    }
  }, [dispatch, hydrationProfile])
}
