/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Ocultar que usamos Next.js
  poweredByHeader: false,

  // SEO: Habilitar compresión para mejor performance
  compress: true,

  // SEO: URLs consistentes sin trailing slash
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'duendesdeluruguay.com',
      },
      {
        protocol: 'https',
        hostname: '**.10web.cloud',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/tienda',
        permanent: true,
      },
      {
        source: '/shop/:path*',
        destination: '/tienda/:path*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
