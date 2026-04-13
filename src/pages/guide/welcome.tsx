import Image from 'next/image'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { useAppSelector } from '@/store/hooks'

const Welcome = () => {
  const userName = useAppSelector((state) => state.user.user?.name ?? '')
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 pb-[143px]">
      <section className="flex w-full flex-col items-center gap-10">
        <section className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="font-h2">Hello,{userName}</h2>
          <p className="font-paragraph-md text-neutral-800">先新增一套你最常穿的衣服吧！</p>
        </section>
        <Image src="/guide/guide-welcome-character.webp" alt="welcome" width={180} height={180} />
      </section>
      <PrimaryButton content="開始" href="/guide/gender" className="mt-auto" />
    </main>
  )
}
export default Welcome
