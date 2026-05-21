import { useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { connectGoogleCalendar } from '@/modules/calendar/api/googleCalendar'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GuideInfoBlock } from '@/modules/guide/components/GuideInfoBlock'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setGoogleCalendarConnected } from '@/store/slices/userSlice'

const GuideGoogleCalendar = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)

  const handleConnect = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    hint: user?.email,
    onSuccess: async ({ code }) => {
      setLoading(true)
      try {
        await connectGoogleCalendar(code)
        dispatch(setGoogleCalendarConnected(true))
        router.push('/home')
      } catch (error) {
        if (error instanceof ApiError) {
          showToast.error(error.message)
        } else {
          showToast.error('連結失敗，請稍後再試')
        }
      } finally {
        setLoading(false)
      }
    },
    onError: () => showToast.error('連結失敗，請稍後再試'),
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-32 pb-12">
      <div className="flex flex-col items-center justify-center gap-12">
        <Image src="/guide/google-calendar.webp" alt="google-calendar" width={120} height={120} />
        <GuideInfoBlock
          title="Google行事曆"
          description_1="連結你的行程"
          description_2="讓「CLOSY」為每個場合推薦最適合的穿搭。"
          subtext="未授權將無法同步行事曆內容"
        />
      </div>
      <PrimaryButton
        content="連結Google行事曆"
        onClick={() => handleConnect()}
        loading={loading}
        className="mt-auto"
      />
    </main>
  )
}

export default GuideGoogleCalendar
