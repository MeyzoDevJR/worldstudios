const bot = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  async rewrites() {
    return [{ source: '/ws-api/:path*', destination: `${bot}/:path*` }];
  },
};

export default nextConfig;
