/** @type {import(\'next\').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { optimizeCss: true }
};
module.exports = nextConfig;
