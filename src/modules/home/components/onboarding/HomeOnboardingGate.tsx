import { useEffect, useState } from 'react'

import { GuideToolTip } from '@/modules/guide/components/GuideToolTip'

import { HomeOnboardingOverlay } from './HomeOnboardingOverlay'

type HomeOnboardingGateProps = {
  onVisibilityChange?: (visible: boolean) => void
}

export const HomeOnboardingGate = ({ onVisibilityChange }: HomeOnboardingGateProps) => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem('home-onboarding-done') !== 'true',
  )
  const [showAddMoreHint, setShowAddMoreHint] = useState(
    () =>
      localStorage.getItem('home-onboarding-done') === 'true' &&
      localStorage.getItem('home-add-more-hint-shown') !== 'true',
  )

  useEffect(() => {
    onVisibilityChange?.(showOnboarding)
  }, [onVisibilityChange, showOnboarding])

  const handleFinish = () => {
    localStorage.setItem('home-onboarding-done', 'true')
    setShowOnboarding(false)
    if (localStorage.getItem('home-add-more-hint-shown') !== 'true') {
      setShowAddMoreHint(true)
    }
  }

  const handleCloseHint = () => {
    localStorage.setItem('home-add-more-hint-shown', 'true')
    setShowAddMoreHint(false)
  }

  return (
    <>
      {showOnboarding && <HomeOnboardingOverlay onFinish={handleFinish} />}
      {showAddMoreHint && (
        <div className="fixed right-0 bottom-20 left-0 z-50 mx-auto flex max-w-93.75 justify-center px-4">
          <GuideToolTip
            text="再新增幾件常穿的衣服，讓推薦更豐富！"
            side="top"
            onClose={handleCloseHint}
            className="w-full max-w-none"
          />
        </div>
      )}
    </>
  )
}
