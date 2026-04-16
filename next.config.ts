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
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/_offline',
  },
  workboxOptions: {
    exclude: [/dynamic-css-manifest\.json$/, /chunks\/pages\//],
    additionalManifestEntries: [{ url: '/_offline', revision: '1' }],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https:\/\/www\.cwa\.gov\.tw\/V8\/assets\/img\/weather_icons\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'weather-icons',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      },
    ],
  },
})

export default withPWA(nextConfig)
