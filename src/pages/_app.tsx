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
import { persistor, store } from '@/store'
import { useAppSelector } from '@/store/hooks'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

const isGuideRoute = (pathname: string) => pathname === '/guide' || pathname.startsWith('/guide/')
const isWardrobeServerFirstRoute = (pathname: string) => {
  return pathname === '/wardrobe' || pathname === '/wardrobe/[id]' || pathname === '/wardrobe/[id]/edit'
}

type AppRouteKind = 'server-first-protected' | 'client-first-protected' | 'public'

const getAppRouteKind = (pathname: string): AppRouteKind => {
  if (pathname === '/' || isGuideRoute(pathname)) {
    return 'public'
  }

  if (isWardrobeServerFirstRoute(pathname)) {
    return 'server-first-protected'
  }

  return 'client-first-protected'
}

function SplashRedirectController() {
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn)
  const isProfileCompleted = useAppSelector((state) => state.user.user?.isProfileCompleted)
  const isSplash = router.pathname === '/'

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
  }, [isLoggedIn, isProfileCompleted, isSplash, router])

  return null
}

function ClientProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}

type AppShellRouterProps = Pick<AppProps, 'Component' | 'pageProps'>

function AppShellRouter({ Component, pageProps }: AppShellRouterProps) {
  const router = useRouter()
  const routeKind = getAppRouteKind(router.pathname)

  if (routeKind === 'server-first-protected') {
    return <Component {...pageProps} />
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      {routeKind === 'public' ? (
        <>
          <SplashRedirectController />
          <Component {...pageProps} />
        </>
      ) : (
        <ClientProtectedRoute>
          <Component {...pageProps} />
        </ClientProtectedRoute>
      )}
    </PersistGate>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Closy</title>
      </Head>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <MobileLayout className={inter.className}>
            <AppShellRouter Component={Component} pageProps={pageProps} />
          </MobileLayout>
          <Toaster />
        </GoogleOAuthProvider>
      </Provider>
    </>
  )
}
