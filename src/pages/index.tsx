import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAppSelector } from '@/store/hooks'

const SplashPage = () => {
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn)
  const isProfileCompleted = useAppSelector((state) => state.user.user?.isProfileCompleted)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (isProfileCompleted) {
          router.replace('/home')
        } else {
          router.replace('/guide/welcome')
        }
      } else {
        router.replace('/guide')
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [router, isLoggedIn, isProfileCompleted])

  return (
    <main className="flex min-h-screen flex-col items-center gap-20 pt-40 pb-[104px]">
      <section className="flex flex-col items-center gap-5">
        <Image src="/Logo.webp" alt="logo" width={117} height={117} />
        <h1 className="font-display">CLOSY</h1>
      </section>
      <section className="flex flex-col items-center gap-2">
        <p className="font-label-xxl">還在煩惱今天該穿什麼衣服嗎？</p>
        <span className="font-paragraph-md text-neutral-600">不用再靠直覺選擇！</span>
      </section>
      <div className="mt-auto flex flex-col items-center text-center text-neutral-400">
        <p className="font-paragraph-xs">此產品為學生專題作品，僅學習與展示用，</p>
        <p className="font-paragraph-xs">並沒有提供任何服務及商業行為。</p>
      </div>
    </main>
  )
}
export default SplashPage
