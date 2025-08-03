/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Node.js runtime for all routes to avoid Edge Runtime issues
  experimental: {
    serverComponentsExternalPackages: ['nodemailer', 'pg', '@vercel/postgres', 'stripe', 'json2csv'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Webpack configuration to handle Node.js modules
  webpack: (config, { isServer, nextRuntime }) => {
    // Ensure Node.js modules are only used on server side
    if (isServer && nextRuntime === 'nodejs') {
      // This is the server-side Node.js bundle
      return config;
    }
    
    if (!isServer) {
      // Client-side bundle - provide fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
