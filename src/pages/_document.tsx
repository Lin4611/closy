import { Html, Head, Main, NextScript } from 'next/document'

import { inter } from '@/lib/font'

export default function Document() {
  return (
    <Html lang="zh-TW" className={inter.className}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fafafa" />
        <meta name="mobile-web-app-capable" content="yes" />
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
