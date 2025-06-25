/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@ece-platform/shared-ui'],
}

module.exports = nextConfig
