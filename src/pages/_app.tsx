import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import '@/styles/globals.css'
import { MobileLayout } from '@/modules/common/components/MobileLayout'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MobileLayout className={inter.className}>
      <Component {...pageProps} />
    </MobileLayout>
  )
}
