import Image from 'next/image'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GuideInfoBlock } from '@/modules/guide/components/GuideInfoBlock'

const GuideGoogleCalendar = () => {
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
      <PrimaryButton content="連結Google行事曆" href="/" className="mt-auto" />
    </main>
  )
}

export default GuideGoogleCalendar
