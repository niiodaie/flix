/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { optimizeCss: false }, // disable to avoid critters requirement
};
module.exports = nextConfig;
