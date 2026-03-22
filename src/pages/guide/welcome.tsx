import Image from 'next/image'
import { useRouter } from 'next/router'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'

const Welcome = () => {
  const router = useRouter()
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center gap-60 px-4 pt-16">
        <section className="flex w-full flex-col items-center gap-14">
          <section className="flex w-full flex-col items-center justify-center gap-4">
            <h2 className="text-h2">Hello,miya</h2>
            <p className="text-paragraph-md text-neutral-800">先新增一套你最常穿的衣服吧！</p>
          </section>
          <Image src="/guide/guide-welcome-character.webp" alt="welcome" width={180} height={180} />
        </section>
        <PrimaryButton content="開始" onClick={() => router.push('/guide/gender')} />
      </div>
    </MobileLayout>
  )
}
export default Welcome
