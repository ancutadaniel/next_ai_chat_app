/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Correct way to enable server actions with default options
    serverActions: {},
  },
};

export default nextConfig;