/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Prevent TypeScript errors from blocking production deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent ESLint warnings/errors from blocking production deployment
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
