import Image from 'next/image'

import { PrimaryButton } from '@/modules/guide/components/PrimaryButton'

const GuideComplete = () => {
  return (
    <div className="flex w-full max-w-[375px] flex-col items-center justify-center gap-[218px] px-4 pt-50 pb-12">
      <section className="flex w-full flex-col items-center gap-10">
        <Image src="/guide/guide-complete-charater.webp" alt="complete" width={111} height={111} />
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-h3">恭喜你成功新增了一套衣服！</h2>
          <p className="text-paragraph-md text-neutral-600">讓我們進到首頁查看穿搭推薦</p>
        </div>
      </section>
      <PrimaryButton content="完成" onClick={() => {}} />
    </div>
  )
}
export default GuideComplete
