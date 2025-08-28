git rm -f next.config.mjs || true
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { optimizeCss: false } // flip to true only if you add 'critters'
};
module.exports = nextConfig;
EOF
