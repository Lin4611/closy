import type { CredentialResponse } from '@react-oauth/google'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { loginWithGoogle } from '@/modules/guide/api/auth'
import { GoogleAuthButton } from '@/modules/guide/components/GoogleAuthButton'
import { GuideCarouselIndicator } from '@/modules/guide/components/GuideCarouselIndicator'
import { GuideIntroSlide } from '@/modules/guide/components/GuideIntroSlide'
import { guideIntroSlides } from '@/modules/guide/data/guideIntroSlides'

const Guide = () => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = guideIntroSlides[currentIndex]
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return
    try {
      const result = await loginWithGoogle(response.credential)
      const isProfileCompleted = result.user.isProfileCompleted
      if (isProfileCompleted) {
        router.push('/home')
        return
      }

      router.push('/guide/welcome')
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % guideIntroSlides.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <main className="mb-36 flex flex-col items-center justify-center gap-30">
      <section className="mt-20 flex w-full flex-col items-center gap-12">
        <GuideIntroSlide
          imageUrl={currentSlide.imageUrl}
          alt={currentSlide.alt}
          titleLine1={currentSlide.titleLine1}
          titleLine2={currentSlide.titleLine2}
        />
        <GuideCarouselIndicator currentIndex={currentIndex} />
      </section>
      <GoogleAuthButton onSuccess={handleGoogleSuccess} />
    </main>
  )
}
export default Guide
