import Image from 'next/image'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'

const GuideComplete = () => {
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
