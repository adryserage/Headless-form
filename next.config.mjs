/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure server actions work properly with larger payloads
  serverActions: {
    bodySizeLimit: '2mb',
  },
};

export default nextConfig;
