import { composePlugins, withNx } from '@nx/next';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config, { isServer }) => {
    // Fix for ThirdWeb and three.js module resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      // Ignore missing three.js modules that aren't needed for our use case
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples/jsm/exporters/USDZExporter.js': false,
        'three/examples/jsm/loaders/GLTFLoader.js': false,
        'three/examples/jsm/loaders/DRACOLoader.js': false,
      };
    }
    
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
