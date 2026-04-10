export const ONBOARDING_ADD_FLOW_STORAGE_KEY = 'closy:onboarding-add-flow'

export type OnboardingAddFlowStep = 'top-required' | 'bottom-required' | 'completed'

const isClient = () => typeof window !== 'undefined'

export const isOnboardingAddFlowStep = (value: unknown): value is OnboardingAddFlowStep => {
  return value === 'top-required' || value === 'bottom-required' || value === 'completed'
}

export const getOnboardingAddFlow = (): OnboardingAddFlowStep | null => {
  if (!isClient()) {
    return null
  }

  const value = window.localStorage.getItem(ONBOARDING_ADD_FLOW_STORAGE_KEY)

  return isOnboardingAddFlowStep(value) ? value : null
}

export const setOnboardingAddFlow = (step: OnboardingAddFlowStep) => {
  if (!isClient()) {
    return
  }

  window.localStorage.setItem(ONBOARDING_ADD_FLOW_STORAGE_KEY, step)
}

export const clearOnboardingAddFlow = () => {
  if (!isClient()) {
    return
  }

  window.localStorage.removeItem(ONBOARDING_ADD_FLOW_STORAGE_KEY)
}
