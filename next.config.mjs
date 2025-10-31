/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: false,
  },
  swcMinify: false,
  output: 'standalone',
  images: {
    domains: ['ebonidating.com'],
  },
}

export default nextConfig
