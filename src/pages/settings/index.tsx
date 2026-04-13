import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { getUserInfo } from '@/modules/common/api/userInfo'
import { AppShell } from '@/modules/common/components/AppShell'
import { occasionLabelMap } from '@/modules/common/types/occasion'
import { GoogleCalendarSettingCard } from '@/modules/settings/components/GoogleCalendarSettingCard'
import { SettingSection } from '@/modules/settings/components/SettingSection'
import { colorsLabelMap } from '@/modules/settings/types/colorsTypes'
import { stylesLabelMap } from '@/modules/settings/types/stylesTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { mergeUserProfile } from '@/store/slices/userSlice'

const Setting = () => {
  const router = useRouter()

  const [isSynced, setIsSynced] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user.user)
  useEffect(() => {
    if (router.query.status === 'unchanged') {
      showToast.info('偏好設定未變更', 1500)
      router.replace('/settings', undefined, { shallow: true })
    }
  }, [router.query.status])
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserInfo()
        dispatch(mergeUserProfile(data))
      } catch (e) {
        if (e instanceof ApiError && e.statusCode === 401) {
          router.push('/')
        }
      }
    }
    fetchProfile()
  }, [])

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
    console.log('logout')
  }

  return (
    <AppShell activeTab="settings">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-4 py-3 shadow-[0_1px_3px_0_rgba(24,24,27,0.05)]">
          <h1 className="font-h1">設定</h1>
        </div>
        <div className="flex flex-1 flex-col gap-5 px-4 py-6">
          <SettingSection
            defaultOccasion={
              user?.preferences?.occasions ? occasionLabelMap[user.preferences.occasions] : ''
            }
            defaultStyle={
              user?.preferences?.styles
                ? user.preferences.styles.map((style) => stylesLabelMap[style])
                : []
            }
            defaultColor={
              user?.preferences?.colors
                ? user.preferences.colors.map((color) => colorsLabelMap[color])
                : []
            }
          />
          <GoogleCalendarSettingCard
            isSynced={isSynced}
            isSyncing={isSyncing}
            onCheckedChange={handleSyncChange}
            text={isSyncing ? '同步中' : isSynced ? '已同步' : '未同步'}
          />
          <Button
            className="h-[67px] w-full justify-start rounded-[20px] bg-white px-4 shadow-[1px_1px_4px_rgba(0,0,0,0.1),inset_0_0_0_0.5px_rgba(50,18,51,0.24)] transition duration-300 ease-out"
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
