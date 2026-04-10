import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { getOnboardingAddFlow } from '@/modules/guide/utils/onboardingAddFlow'

const GuideComplete = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (getOnboardingAddFlow() !== 'completed') {
      void router.replace('/guide/add-top')
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-50 pb-12">
      <section className="flex w-full flex-col items-center gap-10">
        <Image src="/guide/guide-complete-charater.webp" alt="complete" width={111} height={111} />
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="font-h3">恭喜你成功新增了一套衣服！</h2>
          <p className="font-paragraph-md text-neutral-600">讓我們進到首頁查看穿搭推薦</p>
        </div>
      </section>
      <PrimaryButton content="完成" href="/guide/occasion-preference" className="mt-auto" />
    </main>
  )
}
export default GuideComplete
