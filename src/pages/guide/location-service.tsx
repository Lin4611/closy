import Image from 'next/image'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GuideInfoBlock } from '@/modules/guide/components/GuideInfoBlock'

const GuideLocationService = () => {
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
      <PrimaryButton content="了解" href="/guide/google-calendar" className="mt-auto" />
    </main>
  )
}
export default GuideLocationService
