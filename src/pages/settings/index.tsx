import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/sonner'
import { apiClient } from '@/lib/api/client'
import { getSettingsProtectedServerSideResult } from '@/lib/api/settings/shared'
import { AppShell } from '@/modules/common/components/AppShell'
import { occasionLabelMap } from '@/modules/common/types/occasion'
import { GoogleCalendarSettingCard } from '@/modules/settings/components/GoogleCalendarSettingCard'
import { SettingSection } from '@/modules/settings/components/SettingSection'
import { colorsLabelMap } from '@/modules/settings/types/colorsTypes'
import { stylesLabelMap } from '@/modules/settings/types/stylesTypes'
import { useAppDispatch } from '@/store/hooks'
import { clearDayCache } from '@/store/slices/homeSlice'
import { clearOutfitCache } from '@/store/slices/outfitSlice'
import { clearUser } from '@/store/slices/userSlice'

export const getServerSideProps: GetServerSideProps<{
  initialSummary: {
    occasion: string
    styles: string[]
    colors: string[]
  }
}> = async (context) => {
  return getSettingsProtectedServerSideResult(context, (profile) => ({
    initialSummary: {
      occasion: occasionLabelMap[profile.preferences.occasions],
      styles: profile.preferences.styles.length
        ? profile.preferences.styles.map((style) => stylesLabelMap[style])
        : ['未設定'],
      colors: profile.preferences.colors.length
        ? profile.preferences.colors.map((color) => colorsLabelMap[color])
        : ['未設定'],
    },
  }))
}

const Setting = ({ initialSummary }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const [isSynced, setIsSynced] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (router.query.status === 'unchanged') {
      showToast.info('偏好設定未變更', 1500)
      router.replace('/settings', undefined, { shallow: true })
    }
  }, [router, router.query.status])

  const handleSyncChange = async (checked: boolean) => {
    if (!checked) {
      setIsSynced(false)
      return
    }

    try {
      setIsSyncing(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSynced(true)
    } catch {
      setIsSynced(false)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient({ endpoint: '/api/profile/logout', method: 'POST' })
    } catch {
      showToast.error('登出失敗')
    } finally {
      dispatch(clearUser())
      dispatch(clearDayCache())
      dispatch(clearOutfitCache())
      void router.push('/')
    }
  }

  return (
    <AppShell activeTab="settings">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-4 py-3 shadow-[0_1px_3px_0_rgba(24,24,27,0.05)]">
          <h1 className="font-h1">設定</h1>
        </div>
        <div className="flex flex-1 flex-col gap-5 px-4 py-6">
          <SettingSection
            defaultOccasion={initialSummary.occasion}
            defaultStyle={initialSummary.styles}
            defaultColor={initialSummary.colors}
          />
          <GoogleCalendarSettingCard
            isSynced={isSynced}
            isSyncing={isSyncing}
            onCheckedChange={handleSyncChange}
            text={isSyncing ? '同步中' : isSynced ? '已同步' : '未同步'}
          />
          <Button
            className="h-16.75 w-full justify-start rounded-[20px] bg-white px-4 shadow-[1px_1px_4px_rgba(0,0,0,0.1),inset_0_0_0_0.5px_rgba(50,18,51,0.24)] transition duration-300 ease-out"
            onClick={handleLogout}
          >
            <span className="font-paragraph-md text-danger-300">登出</span>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

export default Setting
