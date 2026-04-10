import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { updateOccasion } from '@/modules/common/api/occasion'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { occasionMetaMap, type Occasion } from '@/modules/common/types/occasion'
import { OccasionOptionCard } from '@/modules/guide/components/OccasionOptionCard'
import { clearOnboardingAddFlow } from '@/modules/guide/utils/onboardingAddFlow'

const OccasionPreference = () => {
  const router = useRouter()
  const [occasionPreference, setOccasionPreference] = useState<Occasion>('socialGathering')

  const handleOccasionChange = async (value: string) => {
    try {
      await updateOccasion(value as Occasion)
      clearOnboardingAddFlow()
      await router.push('/guide/location-service')
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新場合失敗，請稍後再試')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-16 pb-12">
      <section className="flex w-full flex-col gap-4">
        <div className="flex flex-1 flex-col justify-center gap-2 p-2">
          <h2 className="font-h2">哪些場合最讓你煩惱？</h2>
          <p className="font-paragraph-sm text-neutral-500">
            選取日常場景，讓Closy為你規劃每日穿搭。
          </p>
        </div>
        <div className="flex flex-col gap-4 px-2 py-3">
          {occasionMetaMap.map((option) => (
            <OccasionOptionCard
              {...option}
              key={option.name}
              onClick={() => setOccasionPreference(option.key)}
              isSelected={option.key === occasionPreference}
            />
          ))}
        </div>
      </section>
      <PrimaryButton
        content="完成"
        onClick={() => handleOccasionChange(occasionPreference)}
        className="mt-auto"
      />
    </main>
  )
}

export default OccasionPreference
