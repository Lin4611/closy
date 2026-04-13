import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import {
  getOnboardingAddFlow,
  getOnboardingStepRoute,
} from '@/modules/guide/utils/onboardingAddFlow'

const GuideComplete = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const currentStep = getOnboardingAddFlow()

    if (currentStep !== 'completed') {
      void router.replace(getOnboardingStepRoute(currentStep))
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-40 pb-12">
      <section className="flex w-full flex-col items-center gap-10">
        <Image
          src="/guide/guide-complete-charater.webp"
          alt="complete"
          width={190}
          height={200}
          className="h-[200px] w-[190px] object-cover"
        />
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="font-h3 text-center">成功新增了一套衣服！</h2>
          <p className="font-paragraph-md text-center text-neutral-600">
            接著設定你的日常場合
            <br />
            讓我們為你提供更精準的穿搭建議
          </p>
        </div>
      </section>
      <PrimaryButton content="完成" href="/guide/occasion-preference" className="mt-auto" />
    </main>
  )
}
export default GuideComplete
