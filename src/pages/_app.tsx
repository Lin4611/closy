import { GoogleOAuthProvider } from '@react-oauth/google'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import '@/styles/globals.css'
import { Toaster } from '@/components/ui/sonner'
import { inter } from '@/lib/font'
import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { store, persistor } from '@/store'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Closy</title>
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId={googleClientId}>
            <MobileLayout className={inter.className}>
              <Component {...pageProps} />
            </MobileLayout>
            <Toaster />
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </>
  )
}
