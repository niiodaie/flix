// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { optimizeCss: true }, // requires 'critters' (step 2)
};

export default nextConfig;
