import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ONBOARDING_STEPS } from '@/modules/home/data/onboardingSteps'
import type {
  BubbleAnchor,
  CardAnchor,
  LineAnchor,
  OnboardingCallout,
  OnboardingStepProps,
} from '@/modules/home/data/onboardingSteps'

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
type Line = {
  d: string
}
function getAnchorPoint(
  rect: { x: number; y: number; width: number; height: number },
  anchor: LineAnchor,
) {
  switch (anchor) {
    case 'top':
      return { x: rect.x + rect.width / 2, y: rect.y }
    case 'right':
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 }
    case 'bottom':
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height }
    case 'left':
      return { x: rect.x, y: rect.y + rect.height / 2 }
    case 'center':
    default:
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  }
}

function buildCurvePath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  from: LineAnchor,
) {
  const dx = end.x - start.x
  const dy = end.y - start.y

  const c1 =
    from === 'left' || from === 'right'
      ? { x: start.x + dx * 0.35, y: start.y }
      : { x: start.x, y: start.y + dy * 0.35 }

  const c2 =
    from === 'left' || from === 'right'
      ? { x: end.x - dx * 0.2, y: end.y }
      : { x: end.x, y: end.y - dy * 0.2 }

  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`
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

function getBubbleStyle(
  callout: OnboardingCallout,
  targets: { id: string; padding?: number }[],
): React.CSSProperties {
  if (!callout.bubbleAnchor) {
    return callout.bubblePlacement ?? {}
  }

  const target = targets[callout.targetIndex ?? 0]
  const targetRect = getTargetRect(target?.id, target?.padding ?? 8)

  if (!targetRect) {
    return callout.bubblePlacement ?? {}
  }

  const offsetX = callout.bubbleOffsetX ?? 0
  const offsetY = callout.bubbleOffsetY ?? 0
  const centerX = targetRect.x + targetRect.width / 2
  const centerY = targetRect.y + targetRect.height / 2

  const anchoredStyles: Record<BubbleAnchor, React.CSSProperties> = {
    top: {
      left: centerX + offsetX,
      top: targetRect.y + offsetY,
      transform: 'translate(-50%, -100%)',
    },
    right: {
      left: targetRect.x + targetRect.width + offsetX,
      top: centerY + offsetY,
      transform: 'translate(0, -50%)',
    },
    bottom: {
      left: centerX + offsetX,
      top: targetRect.y + targetRect.height + offsetY,
      transform: 'translate(-50%, 0)',
    },
    left: {
      left: targetRect.x + offsetX,
      top: centerY + offsetY,
      transform: 'translate(-100%, -50%)',
    },
    center: {
      left: centerX + offsetX,
      top: centerY + offsetY,
      transform: 'translate(-50%, -50%)',
    },
  }

  return anchoredStyles[callout.bubbleAnchor]
}
function getCardStyle(step: OnboardingStepProps): React.CSSProperties {
  if (!step.cardAnchor) {
    return step.cardPlacement ?? {}
  }

  const target = step.targets[step.cardTargetIndex ?? 0]
  const targetRect = getTargetRect(target?.id, target?.padding ?? 8)

  if (!targetRect) {
    return step.cardPlacement ?? {}
  }

  const offsetX = step.cardOffsetX ?? 0
  const offsetY = step.cardOffsetY ?? 0
  const centerX = targetRect.x + targetRect.width / 2
  const centerY = targetRect.y + targetRect.height / 2

  const anchoredStyles: Record<CardAnchor, React.CSSProperties> = {
    top: {
      left: centerX + offsetX,
      top: targetRect.y + offsetY,
      transform: 'translate(-50%, -100%)',
    },
    right: {
      left: targetRect.x + targetRect.width + offsetX,
      top: centerY + offsetY,
      transform: 'translate(0, -50%)',
    },
    bottom: {
      left: centerX + offsetX,
      top: targetRect.y + targetRect.height + offsetY,
      transform: 'translate(-50%, 0)',
    },
    left: {
      left: targetRect.x + offsetX,
      top: centerY + offsetY,
      transform: 'translate(-100%, -50%)',
    },
    center: {
      left: centerX + offsetX,
      top: centerY + offsetY,
      transform: 'translate(-50%, -50%)',
    },
  }

  return anchoredStyles[step.cardAnchor]
}

export const HomeOnboardingOverlay = ({ onFinish }: Props) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [holes, setHoles] = useState<Hole[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  const currentStep = ONBOARDING_STEPS[stepIndex]
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1
  const stepNumber = useMemo(() => stepIndex + 1, [stepIndex])
  useLayoutEffect(() => {
    bubbleRefs.current = []
  }, [stepIndex])
  const updateOverlay = useCallback(() => {
    const nextHoles: Hole[] = []
    const nextLines: Line[] = []

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

    currentStep.callouts?.forEach((callout, index) => {
      const bubbleRect = getRectFromElement(bubbleRefs.current[index], 0, 20)

      if (!bubbleRect) return

      nextHoles.push({
        ...bubbleRect,
        radius: 20,
      })

      if (!callout.lineFrom || !callout.lineTo) return

      const target = currentStep.targets[callout.targetIndex ?? 0]
      const targetRect = getTargetRect(target?.id, target?.padding ?? 8)

      if (!targetRect) return

      const start = getAnchorPoint(bubbleRect, callout.lineFrom)
      const end = getAnchorPoint(targetRect, callout.lineTo)

      nextLines.push({
        d: buildCurvePath(start, end, callout.lineFrom),
      })
    })

    setHoles(nextHoles)
    setLines(nextLines)
  }, [currentStep])
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
    const rafId = requestAnimationFrame(() => {
      updateOverlay()
      requestAnimationFrame(() => {
        updateOverlay()
      })
    })

    window.addEventListener('resize', updateOverlay)
    window.addEventListener('scroll', updateOverlay, true)
    window.addEventListener('load', updateOverlay)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateOverlay)
      window.removeEventListener('scroll', updateOverlay, true)
      window.removeEventListener('load', updateOverlay)
    }
  }, [stepIndex, updateOverlay])

  useEffect(() => {
    if (currentStep.id !== 'calendar' && currentStep.id !== 'day-switch') return

    const targetId = currentStep.id === 'calendar' ? 'calendar-card' : 'day-switch'
    const target = document.getElementById(targetId)
    if (!target) return

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })

    const timer = window.setTimeout(() => {
      updateOverlay()
    }, 350)

    return () => {
      window.clearTimeout(timer)
    }
  }, [currentStep.id, updateOverlay])

  return (
    <div
      className="absolute inset-0 z-50"
      onClick={handleNext}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SpotlightMask holes={holes} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {lines.map((line, index) => (
          <path
            key={`${currentStep.id}-line-${index}`}
            d={line.d}
            stroke="white"
            strokeWidth="3"
            strokeDasharray="1 9"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>
      <div
        ref={cardRef}
        className="absolute w-max"
        style={getCardStyle(currentStep)}
        onClick={(e) => e.stopPropagation()}
      >
        <OnBoardingCard
          title={currentStep.title}
          description={currentStep.description}
          step={stepNumber}
          onClose={onFinish}
          totalSteps={ONBOARDING_STEPS.length}
        />
      </div>

      {currentStep.callouts?.map((callout, index) => (
        <div key={`${currentStep.id}-${index}`}>
          <div
            ref={(el) => {
              bubbleRefs.current[index] = el
            }}
            id={`onboarding-callout-${stepIndex}-${index}`}
            className="absolute"
            style={getBubbleStyle(callout, currentStep.targets)}
            onClick={(e) => e.stopPropagation()}
          >
            <TextBubble text={callout.text} />
          </div>
        </div>
      ))}
    </div>
  )
}
