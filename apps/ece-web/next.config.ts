/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ece-platform/shared-ui'],
  experimental: {
    // Remove deprecated appDir option as it's now the default in Next.js 15
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
