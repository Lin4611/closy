import { useGoogleLogin } from '@react-oauth/google'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/sonner'
import { ApiError, apiClient } from '@/lib/api/client'
import {
  buildSettingsSummary,
  getSettingsProtectedBaselineServerSideResult,
  type SettingsProfileBaseline,
} from '@/lib/api/settings/shared'
import { connectGoogleCalendar, disconnectGoogleCalendar } from '@/modules/calendar/api/googleCalendar'
import { AppShell } from '@/modules/common/components/AppShell'
import { GoogleCalendarSettingCard } from '@/modules/settings/components/GoogleCalendarSettingCard'
import { SettingSection } from '@/modules/settings/components/SettingSection'
import { useSettingsProfileHydration } from '@/modules/settings/hooks/useSettingsProfileHydration'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearDayCache } from '@/store/slices/homeSlice'
import { clearOutfitCache } from '@/store/slices/outfitSlice'
import { clearUser, setGoogleCalendarConnected } from '@/store/slices/userSlice'

export const getServerSideProps: GetServerSideProps<{
  profileBaseline: SettingsProfileBaseline
}> = async (context) => {
  return getSettingsProtectedBaselineServerSideResult(context)
}

const Setting = ({ profileBaseline }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const summary = useMemo(() => buildSettingsSummary(profileBaseline), [profileBaseline])

  const [isSyncing, setIsSyncing] = useState(false)
  const dispatch = useAppDispatch()
  const isSynced = useAppSelector((state) => state.user.user?.isGoogleCalendarConnected ?? false)
  const user = useAppSelector((state) => state.user.user)

  useSettingsProfileHydration(profileBaseline)

  useEffect(() => {
    if (router.query.status === 'unchanged') {
      showToast.info('偏好設定未變更', 1500)
      router.replace('/settings', undefined, { shallow: true })
    }
  }, [router, router.query.status])

  const handleConnect = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    hint: user?.email,
    onSuccess: async ({ code }) => {
      setIsSyncing(true)
      try {
        await connectGoogleCalendar(code)
        dispatch(setGoogleCalendarConnected(true))
      } catch (error) {
        if (error instanceof ApiError) {
          showToast.error(error.message)
        } else {
          showToast.error('連結失敗，請稍後再試')
        }
      } finally {
        setIsSyncing(false)
      }
    },
    onError: () => showToast.error('連結失敗，請稍後再試'),
  })

  const handleSyncChange = async (checked: boolean) => {
    if (checked) {
      handleConnect()
      return
    }

    try {
      setIsSyncing(true)
      await disconnectGoogleCalendar()
      dispatch(setGoogleCalendarConnected(false))
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('解除連結失敗，請稍後再試')
      }
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
            defaultOccasion={summary.occasion}
            defaultStyle={summary.styles}
            defaultColor={summary.colors}
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
