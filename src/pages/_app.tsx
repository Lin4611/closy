import { GoogleOAuthProvider } from '@react-oauth/google'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import '@/styles/globals.css'
import { Toaster } from '@/components/ui/sonner'
import { inter } from '@/lib/font'
import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { store, persistor } from '@/store'
import { useAppSelector } from '@/store/hooks'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn)
  const isProfileCompleted = useAppSelector((state) => state.user.user?.isProfileCompleted)
  const isSplash = router.pathname === '/'
  const isGuide = router.pathname.startsWith('/guide/')
  const isLoginPage = router.pathname === '/guide'
  const isProtected = !isSplash && !isLoginPage

  useEffect(() => {
    if (isProtected && !isLoggedIn) {
      router.replace(isGuide ? '/guide' : '/')
    }
  }, [isProtected, isLoggedIn, router, isGuide])

  useEffect(() => {
    if (!isSplash) return

    if (isLoggedIn && isProfileCompleted) {
      router.prefetch('/home')
    }
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace(isProfileCompleted ? '/home' : '/guide/welcome')
      } else {
        router.replace('/guide')
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [isSplash, isLoggedIn, isProfileCompleted, router])

  return <>{children}</>
}

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
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            </MobileLayout>
            <Toaster />
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </>
  )
}
