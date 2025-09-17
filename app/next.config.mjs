import { composePlugins, withNx } from '@nx/next';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
import path from 'path';

const nextConfig = {
  transpilePackages: [
    '@ece/shared-ui',
    '@ece/shared-business-logic',
    '@ece/shared-types',
    '@google/model-viewer',
    '@thirdweb-dev/react',
  ],
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config, { isServer }) => {
    // Shim/disable optional modules that cause resolution or version issues in dev
    config.resolve.alias = {
      ...config.resolve.alias,
      // Disable USDZExporter (AR QuickLook) at build time; can be re-enabled later
      'three/examples/jsm/exporters/USDZExporter.js': false,
      'three/examples/jsm/exporters/USDZExporter': false,
      // Disable three-mesh-bvh to avoid BatchedMesh mismatch with current three version
      'three-mesh-bvh': false,
      'three-mesh-bvh/src/utils/ExtensionUtilities.js': false,
    };

    // Client-only fallbacks for Node core modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    
    return config;
  },
  async rewrites() {
    return [
      // Map the platform under /app without moving files
      { source: '/app', destination: '/' },
      { source: '/app/:path*', destination: '/:path*' },
    ]
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
