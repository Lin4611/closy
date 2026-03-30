import { GoogleOAuthProvider } from '@react-oauth/google'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'

import '@/styles/globals.css'
import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { store } from '@/store'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <MobileLayout className={inter.className}>
          <Component {...pageProps} />
        </MobileLayout>
      </GoogleOAuthProvider>
    </Provider>
  )
}
