/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  transpilePackages: [
    // Ensure our local libraries are transpiled by Next
    '@ece/shared-ui',
    '@ece/shared-business-logic',
    '@ece/shared-types'
  ],
  experimental: {
    // Allow importing code from outside the app directory (monorepo libs)
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  // Deduplicate critical packages so only a single instance is bundled
  // This prevents runtime errors and warnings such as multiple React/Three imports
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Ensure React resolves to a single package directory
      react: path.dirname(require.resolve('react/package.json')),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      // Ensure ReactDOM resolves including its client entry
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      'react-dom/client': require.resolve('react-dom/client'),
      // Three.js singleton
      three: require.resolve('three')
    }
    return config
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
