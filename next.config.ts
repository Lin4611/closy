import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cwa.gov.tw',
        pathname: '/V8/assets/img/weather_icons/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    exclude: [/dynamic-css-manifest\.json$/],
    additionalManifestEntries: [
      { url: '/offline', revision: '1' },
      { url: '/manifest.json', revision: '1' },
      { url: '/favicon.ico', revision: '1' },
    ],
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkOnly',
        options: {
          plugins: [
            {
              handlerDidError: async () =>
                (await caches.match('/offline', { ignoreSearch: true })) ?? Response.error(),
            },
          ],
        },
      },
      {
        urlPattern: /^\/api\//,
        handler: 'NetworkOnly',
      },
    ],
  },
})

export default withPWA(nextConfig)
