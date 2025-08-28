@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { optimizeCss: false } // turn true only if you 'npm i critters'
};
export default nextConfig;
"@ | Out-File -Encoding utf8 .\next.config.mjs
