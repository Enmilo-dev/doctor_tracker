import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error('API_URL is not set. Copy apps/web/.env.example to apps/web/.env.local');
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
