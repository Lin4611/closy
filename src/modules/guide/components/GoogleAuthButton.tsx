import type { CredentialResponse } from '@react-oauth/google'

import { LoginButton } from '@/modules/guide/components/LoginButton'

import { GoogleLoginOverlay } from './GoogleLoginOverlay'

type GoogleAuthButtonProps = {
  onSuccess: (response: CredentialResponse) => void
}

export const GoogleAuthButton = ({ onSuccess }: GoogleAuthButtonProps) => {
  return (
    <div className="relative w-full max-w-[343px]">
      <LoginButton className="pointer-events-none" />
      <GoogleLoginOverlay onSuccess={onSuccess} />
    </div>
  )
}
