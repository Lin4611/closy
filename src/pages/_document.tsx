import { Html, Head, Main, NextScript } from 'next/document'

import { inter } from '@/lib/font'

export default function Document() {
  return (
    <Html lang="zh-TW" className={inter.className}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
