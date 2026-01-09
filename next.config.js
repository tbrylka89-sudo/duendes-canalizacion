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
}

module.exports = nextConfig
