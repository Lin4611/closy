import type { CredentialResponse } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'

type GoogleLoginOverlayProps = {
  onSuccess: (response: CredentialResponse) => void
}

export const GoogleLoginOverlay = ({ onSuccess }: GoogleLoginOverlayProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-0 [&_iframe]:h-full! [&_iframe]:w-full! [&>div]:h-full! [&>div]:w-full!">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.error('Google 登入失敗')
        }}
        width="343"
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  )
}
