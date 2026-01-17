/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'duendesuy.10web.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.10web.cloud',
      },
    ],
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
