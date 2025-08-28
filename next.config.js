/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  // Keep false unless using 'critters' plugin explicitly
  experimental: { optimizeCss: false },
  // Optional: silence React strict double-render in dev if needed
  // reactStrictMode: true,
};
module.exports = nextConfig;
