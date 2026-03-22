import Image from 'next/image'
import { useRouter } from 'next/router'

import { PrimaryButton } from '@/modules/guide/components/PrimaryButton'

const Welcome = () => {
  const router = useRouter()
  return (
    <div className="flex w-full max-w-[375px] flex-col items-center justify-center gap-60 bg-neutral-100 px-4 pt-16">
      <section className="flex w-full flex-col items-center gap-14">
        <section className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-h2">Hello,miya</h2>
          <p className="text-paragraph-md text-neutral-800">先新增一套你最常穿的衣服吧！</p>
        </section>
        <Image src="/guide/guide-welcome-character.webp" alt="welcome" width={180} height={180} />
      </section>
      <PrimaryButton content="開始" onClick={() => router.push('/guide/gender')} />
    </div>
  )
}
export default Welcome
