import Image from 'next/image'
import { useRouter } from 'next/router'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'

const GuideComplete = () => {
  const router = useRouter()
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center gap-[225px] px-4 pt-50 pb-12">
        <section className="flex w-full flex-col items-center gap-10">
          <Image
            src="/guide/guide-complete-charater.webp"
            alt="complete"
            width={111}
            height={111}
          />
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <h2 className="text-h3">恭喜你成功新增了一套衣服！</h2>
            <p className="text-paragraph-md text-neutral-600">讓我們進到首頁查看穿搭推薦</p>
          </div>
        </section>
        <PrimaryButton
          content="完成"
          onClick={() => {
            router.push('/guide/location-service')
          }}
        />
      </div>
    </MobileLayout>
  )
}
export default GuideComplete
