import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { updateLocation } from '@/modules/common/api/location'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GuideInfoBlock } from '@/modules/guide/components/GuideInfoBlock'

const GuideLocationService = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLocationRequest = () => {
    if (loading) return
    setLoading(true)

    const submit = async (latitude: number | null, longitude: number | null) => {
      try {
        await updateLocation({ latitude, longitude })
        router.push('/home')
      } catch (error) {
        if (error instanceof ApiError) {
          showToast.error(error.message)
        } else {
          showToast.error('更新位置失敗，請稍後再試')
        }
      } finally {
        setLoading(false)
      }
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      submit(null, null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        submit(coords.latitude, coords.longitude)
      },
      () => {
        submit(null, null)
      },
      {
        timeout: 8000,
        enableHighAccuracy: false,
        maximumAge: 0,
      },
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-30 pb-12">
      <section className="flex flex-col items-center justify-center gap-10">
        <Image src="/guide/location-pin.webp" alt="location-service" width={100} height={136} />
        <GuideInfoBlock
          title="位置服務"
          description_1="連結你的位置"
          description_2="讓「CLOSY」根據天氣為你推薦更合適的穿搭"
          subtext="未授權將預設地區為台北市"
        />
      </section>
      <PrimaryButton
        content="了解"
        onClick={handleLocationRequest}
        className="mt-auto"
        loading={loading}
      />
    </main>
  )
}
export default GuideLocationService
