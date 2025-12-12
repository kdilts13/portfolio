import type { NextConfig } from 'next';

const API_TARGET = process.env.API_PROXY_TARGET ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      // Proxy all frontend requests for /api/* to Spring Boot on :8080
      { source: '/api/:path*', destination: `${API_TARGET}/api/:path*` },
    ];
  },
};

export default nextConfig;
