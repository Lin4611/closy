import Image from 'next/image'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'

const Custom404 = () => {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-8 text-center">
      <Image src="/Logo.webp" alt="logo" width={80} height={80} />
      <section className="flex flex-col items-center gap-3">
        <h2 className="font-label-xl">找不到這個頁面</h2>
        <p className="font-paragraph-md text-neutral-500">
          你要找的頁面不存在或已被移除
        </p>
      </section>
      <Button variant="brand" size="xl" className="w-full" onClick={() => router.push('/')}>
        回到首頁
      </Button>
    </main>
  )
}

export default Custom404
