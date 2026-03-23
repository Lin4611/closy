import Image from 'next/image'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GuideInfoBlock } from '@/modules/guide/components/GuideInfoBlock'

const GuideGoogleCalendar = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col gap-45 px-4 pt-32">
        <div className="flex flex-col items-center justify-center gap-12">
          <Image src="/guide/google-calendar.webp" alt="google-calendar" width={120} height={120} />
          <GuideInfoBlock
            title="Google行事曆"
            description_1="連結你的行程"
            description_2="讓「CLOSY」為每個場合推薦最適合的穿搭。"
            subtext="未授權將無法同步行事曆內容"
          />
        </div>
        <PrimaryButton content="連結Google行事曆" href="/" />
      </div>
    </MobileLayout>
  )
}

export default GuideGoogleCalendar
