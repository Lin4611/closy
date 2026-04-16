import { Html, Head, Main, NextScript } from 'next/document'

import { inter } from '@/lib/font'

export default function Document() {
  return (
    <Html lang="zh-TW" className={inter.className}>
      <Head>
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.cwa.gov.tw" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.cwa.gov.tw" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fafafa" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Closy" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
