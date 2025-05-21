/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pino: false,
        "pino-pretty": false,
      }
    }
    return config
  },
}

module.exports = nextConfig
