import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ONBOARDING_STEPS } from '@/modules/home/data/onboardingSteps'

import { DottedLine } from './DottedLine'
import { OnBoardingCard } from './OnBoardingCard'
import { SpotlightMask, getTargetRect } from './SpotLightMask'
import { TextBubble } from './TextBubble'

type Props = {
  onFinish: () => void
}

type Hole = {
  x: number
  y: number
  width: number
  height: number
  radius?: number
}

function getRectFromElement(el: HTMLDivElement | null, padding = 0, radius = 16): Hole | null {
  if (!el) return null

  const rect = el.getBoundingClientRect()
  const container = document.querySelector('[data-mobile-layout]')
  const containerRect = container?.getBoundingClientRect() ?? { left: 0, top: 0 }

  return {
    x: rect.left - containerRect.left - padding,
    y: rect.top - containerRect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    radius,
  }
}

export const HomeOnboardingOverlay = ({ onFinish }: Props) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [holes, setHoles] = useState<Hole[]>([])

  const cardRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  const currentStep = ONBOARDING_STEPS[stepIndex]
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1
  const stepNumber = useMemo(() => stepIndex + 1, [stepIndex])

  const handlePrev = () => {
    if (stepIndex === 0) return
    setStepIndex((prev) => prev - 1)
  }

  const handleNext = () => {
    if (isLastStep) {
      onFinish()
      return
    }

    setStepIndex((prev) => prev + 1)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diffX = touchStartX.current - endX

    if (diffX > 50) {
      handleNext()
      return
    }

    if (diffX < -50) {
      handlePrev()
    }
  }

  useLayoutEffect(() => {
    const updateHoles = () => {
      const nextHoles: Hole[] = []

      currentStep.targets.forEach((target) => {
        const rect = getTargetRect(target.id, target.padding ?? 8)

        if (!rect) return

        nextHoles.push({
          ...rect,
          radius: target.radius ?? 16,
        })
      })

      const cardHole = getRectFromElement(cardRef.current, 0, 16)
      if (cardHole) {
        nextHoles.push(cardHole)
      }

      currentStep.callouts?.forEach((_, index) => {
        const rect = getTargetRect(`onboarding-callout-${stepIndex}-${index}`, 0)

        if (!rect) return

        nextHoles.push({
          ...rect,
          radius: 20,
        })
      })

      setHoles(nextHoles)
    }

    updateHoles()

    window.addEventListener('resize', updateHoles)
    window.addEventListener('scroll', updateHoles, true)

    return () => {
      window.removeEventListener('resize', updateHoles)
      window.removeEventListener('scroll', updateHoles, true)
    }
  }, [currentStep, stepIndex])

  return (
    <div
      className="absolute inset-0 z-50"
      onClick={handleNext}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SpotlightMask holes={holes} />

      <div
        ref={cardRef}
        className="absolute"
        style={currentStep.cardPlacement}
        onClick={(e) => e.stopPropagation()}
      >
        <OnBoardingCard
          title={currentStep.title}
          description={currentStep.description}
          step={stepNumber}
          onClose={onFinish}
        />
      </div>

      {currentStep.callouts?.map((callout, index) => (
        <div key={`${currentStep.id}-${index}`}>
          <div
            id={`onboarding-callout-${stepIndex}-${index}`}
            className="absolute"
            style={callout.bubblePlacement}
            onClick={(e) => e.stopPropagation()}
          >
            <TextBubble text={callout.text} />
          </div>

          {callout.linePlacement && callout.linePath && (
            <div className="absolute" style={callout.linePlacement}>
              <DottedLine
                d={callout.linePath.d}
                width={callout.linePath.width}
                height={callout.linePath.height}
                color="white"
                rotate={callout.linePath.rotate}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
