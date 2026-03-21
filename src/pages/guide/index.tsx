import { useEffect, useState } from 'react'

import { GuideCarouselIndicator } from '@/modules/guide/components/GuideCarouselIndicator'
import { GuideIntroSlide } from '@/modules/guide/components/GuideIntroSlide'
import { LoginButton } from '@/modules/guide/components/LoginButton'
import { guideIntroSlides } from '@/modules/guide/data/guideIntroSlides'

const Guide = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = guideIntroSlides[currentIndex]
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % guideIntroSlides.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <div className="mb-36 flex w-full max-w-93.75 flex-col items-center justify-center gap-30">
      <section className="mt-20 flex w-full max-w-70.25 flex-col items-center gap-12">
        <GuideIntroSlide
          imageUrl={currentSlide.imageUrl}
          alt={currentSlide.alt}
          titleLine1={currentSlide.titleLine1}
          titleLine2={currentSlide.titleLine2}
        />
        <GuideCarouselIndicator currentIndex={currentIndex} />
      </section>
      <LoginButton />
    </div>
  )
}
export default Guide
