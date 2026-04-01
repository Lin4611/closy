import { useEffect, useState } from 'react'

import { HomeOnboardingOverlay } from './HomeOnboardingOverlay'

type HomeOnboardingGateProps = {
  onVisibilityChange?: (visible: boolean) => void
}

export const HomeOnboardingGate = ({ onVisibilityChange }: HomeOnboardingGateProps) => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem('home-onboarding-done') !== 'true',
  )

  useEffect(() => {
    onVisibilityChange?.(showOnboarding)
  }, [onVisibilityChange, showOnboarding])

  const handleFinish = () => {
    localStorage.setItem('home-onboarding-done', 'true')
    setShowOnboarding(false)
  }

  if (!showOnboarding) return null

  return <HomeOnboardingOverlay onFinish={handleFinish} />
}
