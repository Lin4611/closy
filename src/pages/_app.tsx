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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
const defaultTitle = 'Closy - 你的穿搭助手'
const defaultDescription =
  '每天出門都在煩惱穿什麼？用 Closy 數位化你最常穿的衣物，無腦管理每日穿搭，終結翻箱倒櫃的決策疲勞，讓出門變得省時又省力。'
const ogImageUrl = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg'

const isGuideRoute = (pathname: string) => pathname === '/guide' || pathname.startsWith('/guide/')
const isWardrobeServerFirstRoute = (pathname: string) => {
  return (
    pathname === '/wardrobe' ||
    pathname === '/wardrobe/[id]' ||
    pathname === '/wardrobe/[id]/edit'
  )
}

const isSettingsServerFirstRoute = (pathname: string) => {
  return (
    pathname === '/settings' ||
    pathname === '/settings/colors' ||
    pathname === '/settings/styles' ||
    pathname === '/settings/occasion'
  )
}

const isCalendarServerFirstRoute = (pathname: string) => {
  return (
    pathname === '/calendar' ||
    pathname === '/calendar/new' ||
    pathname === '/calendar/select-outfit' ||
    pathname === '/calendar/[date]/edit'
  )
}

const isOutfitServerFirstRoute = (pathname: string) => {
  return (
    pathname === '/outfit' ||
    pathname === '/outfit/[outfitId]' ||
    pathname === '/outfit/occasion/[occasionId]'
  )
}

type AppRouteKind = 'server-first-protected' | 'client-first-protected' | 'public'

const getAppRouteKind = (pathname: string): AppRouteKind => {
  if (pathname === '/' || isGuideRoute(pathname)) {
    return 'public'
  }

  if (
    isWardrobeServerFirstRoute(pathname) ||
    isSettingsServerFirstRoute(pathname) ||
    isCalendarServerFirstRoute(pathname) ||
    isOutfitServerFirstRoute(pathname)
  ) {
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
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} key="description" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:site_name" content="Closy" key="og:site_name" />
        <meta property="og:title" content={defaultTitle} key="og:title" />
        <meta property="og:description" content={defaultDescription} key="og:description" />
        <meta property="og:image" content={ogImageUrl} key="og:image" />
        <meta property="og:image:width" content="1200" key="og:image:width" />
        <meta property="og:image:height" content="630" key="og:image:height" />
        {siteUrl && <meta property="og:url" content={siteUrl} key="og:url" />}
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={defaultTitle} key="twitter:title" />
        <meta name="twitter:description" content={defaultDescription} key="twitter:description" />
        <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />
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
