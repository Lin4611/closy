import Image from 'next/image'

import { PrimaryButton } from '@/modules/guide/components/PrimaryButtin'

const Welcome = () => {
  return (
    <div className="flex w-full max-w-[375px] flex-col items-center justify-center gap-60 px-4 pt-16">
      <section className="flex w-full flex-col items-center gap-14">
        <section className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-h2">Hello,miya</h2>
          <p className="text-paragraph-md text-neutral-800">先新增一套你最常穿的衣服吧！</p>
        </section>
        <Image src="/guide/guide-welcome-character.webp" alt="welcome" width={180} height={180} />
      </section>
      <PrimaryButton content="開始" />
    </div>
  )
}
export default Welcome
