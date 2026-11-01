import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/pizzeria' : '');

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
