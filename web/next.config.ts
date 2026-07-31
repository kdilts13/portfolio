import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const API_TARGET = process.env.API_PROXY_TARGET ?? 'http://localhost:8080';
const appRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(appRoot, "..");

const nextConfig: NextConfig = {
  reactCompiler: true,
   turbopack: {
    root: workspaceRoot,
  },

  async rewrites() {
    return [
      // Proxy all frontend requests for /api/* to Spring Boot on :8080
      { source: '/api/:path*', destination: `${API_TARGET}/api/:path*` },
    ];
  },
};

export default nextConfig;
