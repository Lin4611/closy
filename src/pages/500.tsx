import Image from 'next/image'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'

const Custom500 = () => {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-8 text-center">
      <Image src="/Logo.webp" alt="logo" width={80} height={80} />
      <section className="flex flex-col items-center gap-3">
        <h2 className="font-label-xl">哎，服務暫時不可用</h2>
        <p className="font-paragraph-md text-neutral-500">
          我們的系統正在恢復中，請稍後再試一次
        </p>
      </section>
      <Button variant="brand" size="xl" className="w-full" onClick={() => router.reload()}>
        重新整理
      </Button>
    </main>
  )
}

export default Custom500
