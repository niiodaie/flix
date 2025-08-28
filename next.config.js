cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { optimizeCss: false } // turn on only if using 'critters'
};
module.exports = nextConfig;
EOF
